import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                    scope: "openid email profile https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/webmasters https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/analytics"
                }
            }
        }),
    ],
    pages: {
        signIn: '/google-console',
    },
    callbacks: {
        async jwt({ token, account }) {
            console.log("JWT Callback - Token:", token)
            console.log("JWT Callback - Account:", account)
            if (account) {
                token.accessToken = account.access_token
                token.idToken = account.id_token
            }
            return token
        },
        async session({ session, token }: { session: any; token: any }) {
            console.log("Session Callback - Session:", session)
            console.log("Session Callback - Token:", token)
            session.accessToken = token.accessToken
            session.idToken = token.idToken
            return session
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith("/")) return `${baseUrl}${url}`
            else if (new URL(url).origin === baseUrl) return url
            else if (url.startsWith(`${baseUrl}/api/auth/callback/google`)) {
                const intendedUrl = new URL(url).searchParams.get('callbackUrl') || '/dashboard'
                return `${baseUrl}${intendedUrl}`
            }
            return baseUrl
        }
    },
    debug: true,
    logger: {
        error(code, metadata) {
            console.error("NextAuth Error:", code, metadata)
        },
        warn(code) {
            console.warn("NextAuth Warning:", code)
        },
        debug(code, metadata) {
            console.log("NextAuth Debug:", code, metadata)
        }
    }
}