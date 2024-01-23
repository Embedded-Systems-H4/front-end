import NextAuth, { Account, Profile, User } from "next-auth"
import { AdapterUser } from "next-auth/adapters";
import GithubProvider from "next-auth/providers/github"

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
            console.log(profile)
            if (user.email === "danimane4info@gmail.com") {
                return true;
            } else {
                return 'https://disney.com'
            }
        },
        async session({ session, token }: { session: any, token: any }) {
            session.user.id = token?.sub;
            return session;
        },
    },
    pages: {
        signIn: '/login'
    },
    session: {
        maxAge: 3600,
    },
    cookies: {
        state: {
            name: `web_next-auth.state`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: true,
                maxAge: 3600
            },
        },
    }
};

export default NextAuth(authOptions);