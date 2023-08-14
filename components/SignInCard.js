import { useSession, signIn, signOut } from "next-auth/react";
import '../styles/signin.css'

export default function SignInCard() {
    return (
        <>
            <div className="text-center mt-3" id="signInCard">
                <h1>Sign In</h1>
                <div className="text-align">
                    <button className="btn btn-dark" onClick={() => signIn()}>Sign in</button>
                </div>
            </div>
        </>
    )
}