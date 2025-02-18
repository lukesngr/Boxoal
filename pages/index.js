import UnSignedNav from "../components/nav/SignedOutNav"
import SignedInNav from "@/components/nav/SignedInNav";
import Image from "next/image"
import "../styles/homecard.scss";
import { useSession } from "next-auth/react";
import localFont from 'next/font/local'
import Loading from "@/components/base/Loading";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { SignInCard } from "@/components/login/SignInCard";
const glitchFont = localFont({src: '../public/BlueScreen.ttf'});

export default function Home() {

    const [displayLogin, setDisplayLogin] = useState(false);

    return (
    <>
        {displayLogin ? (<SignInCard></SignInCard>) : (
        <div className="text-center animatedText">
            <h1 className={glitchFont.className}>Timeboxing For The Everyman</h1>
            <button className="signInButton" onClick={() => setDisplayLogin(true)}>Join Us</button>
        </div>)}
    </>)
}