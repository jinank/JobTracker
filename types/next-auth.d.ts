import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    /** Set when signed in via admin username/password (no Gmail). */
    adminCredential?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    adminCredential?: boolean;
  }
}
