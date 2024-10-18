import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: any; 
    idToken?: any; 
  }

  interface JWT {
    accessToken?: string; 
  }
}
