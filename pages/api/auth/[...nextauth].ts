import NextAuth, { Account, Profile, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
    ],
    callbacks: {
        async jwt({ token }: { token: any }) {
            token.role = "member";
            return token;
        },
        async signIn({ user, profile }: {
            user: User | AdapterUser
            account: Account | null
            profile?: Profile
        }) {
            const allowedEmails: string[] = [
                "a.daniel.manea@gmail.com",
                "vados1789@gmail.com"
            ]
            if (allowedEmails.includes(user?.email as string)) {
                return true
            } else {
                return '/login?error=permissionDenied'
            }
        },
        async session({ session, token }: { session: any, token: any }) {
            session.user.id = token?.sub;
            return session;
        }
    },
    pages: {
        signIn: '/login'
    },
    session: {
        maxAge: 3600,
    },
    cookies: {
        // sessionToken: {
        //   name: `__Secure-next-auth.session-token`,
        //   options: {
        //     httpOnly: true,
        //     path: '/',
        //     secure: true
        //   }
        // },
        // callbackUrl: {
        //   name: `__Secure-next-auth.callback-url`,
        //   options: {
        //     path: '/',
        //     secure: true
        //   }
        // },
        // csrfToken: {
        //   name: `__Host-next-auth.csrf-token`,
        //   options: {
        //     httpOnly: true,
        //     path: '/',
        //     secure: true
        //   }
        // },
        // pkceCodeVerifier: {
        //   name: `H4_next-auth.pkce.code_verifier`,
        //   options: {
        //     httpOnly: true,
        //     path: '/',
        //     secure: true
        // }
        // }
    }
};

export default NextAuth(authOptions);