import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    /** True when signed in via google-gmail with mail scope. */
    gmailConnected?: boolean;
    authProvider?: string;
    /** Set when signed in via admin username/password (no Gmail). */
    adminCredential?: boolean;
    /** First successful Google sign-in for this account; used for Google Ads conversion once. */
    adsSignUpConversion?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    gmailConnected?: boolean;
    authProvider?: string;
    appUserId?: string;
    adminCredential?: boolean;
    adsSignUpConversion?: boolean;
  }
}
