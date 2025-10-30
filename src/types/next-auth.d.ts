import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username?: string | null;
      email?: string | null;
      userimage?: string | null;
    };
  }

  interface User {
    id: string;
    username: string;
    email: string;
    userimage?: string | null; // CHANGED
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    email: string;
    userimage?: string | null; // CHANGED
  }
}
