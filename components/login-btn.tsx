import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/router"

export const LoginButton = () => {
    const router = useRouter()
    const { data: session } = useSession()
    if (session) {
        return (
            <>
                Signed in as {session?.user?.email} <br />
                <button onClick={() => signOut()}>Sign out</button>
            </>
        )
    }
    return (
        <>
            Not signed in <br />
            <button onClick={() => {
                signIn('github', { callbackUrl: router.query.callbackUrl as string || "/" });
            }}>Sign in</button>
        </>
    )
}