import type { NextAuthOptions } from "next-auth";
import { timingSafeEqual } from "crypto";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabase";
import { ensureAppUser } from "@/lib/ensureAppUser";
import {
  AUTH_PROVIDER_GOOGLE,
  AUTH_PROVIDER_GOOGLE_GMAIL,
  AUTH_PROVIDER_SUPABASE_EMAIL,
} from "@/lib/authSignIn";

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

function buildSupabaseEmailProvider() {
  return CredentialsProvider({
    id: AUTH_PROVIDER_SUPABASE_EMAIL,
    name: "Email",
    credentials: {
      access_token: { label: "Access token", type: "text" },
    },
    async authorize(credentials) {
      const accessToken = credentials?.access_token?.trim();
      if (!accessToken) return null;

      const { data, error } = await supabase.auth.getUser(accessToken);
      if (error || !data.user?.email) {
        console.error("[auth] supabase getUser:", error?.message ?? "no user");
        return null;
      }

      const email = data.user.email.trim().toLowerCase();
      const row = await ensureAppUser({
        email,
        name: data.user.user_metadata?.full_name ?? data.user.email,
        image: data.user.user_metadata?.avatar_url ?? null,
        supabaseAuthId: data.user.id,
        authProvider: "email",
      });

      if (!row) return null;

      return {
        id: row.id,
        email,
        name: data.user.user_metadata?.full_name ?? data.user.email,
      };
    },
  });
}

const googleClientId = process.env.GOOGLE_CLIENT_ID!;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET!;

const credentialsProvider = buildCredentialsProvider();

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      id: AUTH_PROVIDER_GOOGLE,
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      authorization: {
        params: {
          scope: "openid email profile",
          prompt: "select_account",
        },
      },
    }),
    GoogleProvider({
      id: AUTH_PROVIDER_GOOGLE_GMAIL,
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      authorization: {
        params: {
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/gmail.readonly",
          ].join(" "),
          access_type: "offline",
          prompt: "consent",
          include_granted_scopes: "true",
        },
      },
    }),
    buildSupabaseEmailProvider(),
    ...(credentialsProvider ? [credentialsProvider] : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === ADMIN_CREDENTIALS_PROVIDER_ID) {
        return true;
      }

      if (account?.provider === AUTH_PROVIDER_SUPABASE_EMAIL) {
        return true;
      }

      if (user.email && (account?.provider === AUTH_PROVIDER_GOOGLE || account?.provider === AUTH_PROVIDER_GOOGLE_GMAIL)) {
        try {
          await ensureAppUser({
            email: user.email,
            name: user.name ?? "",
            image: user.image ?? null,
            googleSub: account.providerAccountId,
            authProvider:
              account.provider === AUTH_PROVIDER_GOOGLE_GMAIL ? "google-gmail" : "google",
          });
        } catch (e) {
          console.error(
            "[auth] signIn google / supabase:",
            e instanceof Error ? e.message : e
          );
        }
      }
      return true;
    },
    async jwt({ token, account, user }) {
      if (account?.provider === ADMIN_CREDENTIALS_PROVIDER_ID) {
        token.adminCredential = true;
        return token;
      }

      if (token.adminCredential) {
        return token;
      }

      if (account?.provider === AUTH_PROVIDER_SUPABASE_EMAIL) {
        token.authProvider = "email";
        token.gmailConnected = false;
        delete token.accessToken;
        delete token.refreshToken;
        delete token.expiresAt;
        delete token.error;
        if (user?.id) token.appUserId = user.id;
        return token;
      }

      if (
        account?.provider === AUTH_PROVIDER_GOOGLE ||
        account?.provider === AUTH_PROVIDER_GOOGLE_GMAIL
      ) {
        token.authProvider = account.provider === AUTH_PROVIDER_GOOGLE_GMAIL ? "google-gmail" : "google";

        if (account.provider === AUTH_PROVIDER_GOOGLE_GMAIL) {
          token.accessToken = account.access_token;
          token.refreshToken = account.refresh_token;
          token.expiresAt = account.expires_at;
          token.gmailConnected = true;
        } else {
          // Basic Google sign-in (no Gmail scopes) — do not keep mail tokens.
          delete token.accessToken;
          delete token.refreshToken;
          delete token.expiresAt;
          delete token.error;
          token.gmailConnected = false;
        }

        if (user?.email) {
          const email = user.email.trim().toLowerCase();
          const { data: u } = await supabase
            .from("users")
            .select("login_count")
            .eq("email", email)
            .maybeSingle();
          if (u?.login_count === 1) {
            token.adsSignUpConversion = true;
          }
        }
        return token;
      }

      if (!token.gmailConnected || !token.refreshToken) {
        return token;
      }

      if (
        typeof token.expiresAt === "number" &&
        Date.now() < token.expiresAt * 1000 - 60_000
      ) {
        return token;
      }

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

      if (token.refreshToken && !token.adminCredential) {
        token.gmailConnected = true;
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      const hasMailToken =
        !token.adminCredential &&
        (!!token.refreshToken || token.gmailConnected === true);
      session.gmailConnected = hasMailToken && !token.error;
      session.authProvider = token.authProvider as string | undefined;
      if (token.adminCredential) {
        session.adminCredential = true;
      }
      if (token.adsSignUpConversion) {
        session.adsSignUpConversion = true;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
