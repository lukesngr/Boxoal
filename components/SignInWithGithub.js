import { useSession, signIn, signOut } from "next-auth/react";

export default function SignInWithGithub() {
    return (
        <div className="text-align">
            <button onClick={() => signIn()}>Sign in</button>
        </div>
    )
}