import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "@/lib/supabase";

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
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (user.email && account) {
        const ownerEmails = (process.env.OWNER_EMAILS ?? "")
          .split(",")
          .map((e) => e.trim().toLowerCase())
          .filter(Boolean);

        const isOwner = ownerEmails.includes(user.email.toLowerCase());

        await supabase.from("users").upsert(
          {
            email: user.email,
            name: user.name ?? "",
            image: user.image ?? null,
            google_sub: account.providerAccountId,
            ...(isOwner ? { paid: true, subscription_status: "active" } : {}),
          },
          { onConflict: "email" }
        );
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
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
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};
