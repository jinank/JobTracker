import type { NextAuthOptions } from "next-auth";
import { timingSafeEqual } from "crypto";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabase";
import { recordUserSignIn } from "@/lib/userTelemetry";

const ADMIN_CREDENTIALS_PROVIDER_ID = "admin-credentials";

function timingSafeEqualStrings(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

function buildCredentialsProvider() {
  const password = process.env.ADMIN_CREDENTIALS_PASSWORD?.trim();
  if (!password) return null;

  return CredentialsProvider({
    id: ADMIN_CREDENTIALS_PROVIDER_ID,
    name: "Admin",
    credentials: {
      username: { label: "Username", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const expectedUser = (process.env.ADMIN_CREDENTIALS_USER ?? "admin").trim();
      const u = credentials?.username?.trim();
      const p = credentials?.password ?? "";
      if (u !== expectedUser) return null;
      if (!timingSafeEqualStrings(p, password)) return null;

      const email = (
        process.env.ADMIN_SESSION_EMAIL ?? "jinank.thakker@gmail.com"
      ).trim().toLowerCase();

      return {
        id: "admin-credentials",
        email,
        name: "Admin",
      };
    },
  });
}

const credentialsProvider = buildCredentialsProvider();

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/gmail.readonly",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
    ...(credentialsProvider ? [credentialsProvider] : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === ADMIN_CREDENTIALS_PROVIDER_ID) {
        return true;
      }

      if (user.email && account?.provider === "google") {
        const ownerEmails = (process.env.OWNER_EMAILS ?? "")
          .split(",")
          .map((e) => e.trim().toLowerCase())
          .filter(Boolean);

        const isOwner = ownerEmails.includes(user.email.toLowerCase());

        const { data: row, error } = await supabase
          .from("users")
          .upsert(
            {
              email: user.email,
              name: user.name ?? "",
              image: user.image ?? null,
              google_sub: account.providerAccountId,
              ...(isOwner ? { paid: true, subscription_status: "active" } : {}),
            },
            { onConflict: "email" }
          )
          .select("id")
          .single();

        if (!error && row?.id) {
          void recordUserSignIn({
            userId: row.id,
            email: user.email,
            provider: "google",
          });
        }
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account?.provider === ADMIN_CREDENTIALS_PROVIDER_ID) {
        token.adminCredential = true;
        return token;
      }

      if (token.adminCredential) {
        return token;
      }

      if (account?.provider === "google") {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        return token;
      }

      if (
        typeof token.expiresAt === "number" &&
        Date.now() < token.expiresAt * 1000 - 60_000
      ) {
        return token;
      }

      if (!token.refreshToken) return { ...token, error: "NoRefreshToken" };

      try {
        const params = new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          grant_type: "refresh_token",
          refresh_token: token.refreshToken as string,
        });

        const res = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString(),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error ?? "refresh failed");

        token.accessToken = data.access_token;
        token.expiresAt = Math.floor(Date.now() / 1000) + data.expires_in;
        if (data.refresh_token) {
          token.refreshToken = data.refresh_token;
        }
      } catch {
        token.error = "RefreshTokenError";
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      if (token.adminCredential) {
        session.adminCredential = true;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};
