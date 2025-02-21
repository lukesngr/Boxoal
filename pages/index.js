import { useState } from "react";
import SignInCard  from "@/components/login/SignInCard";
import CreateAccountCard from "@/components/login/CreateAccountCard";
import ForgotPasswordCard from "@/components/login/ForgotPasswordCard";
import LandingPage from "@/components/LandingPage";

export default function Home() {

    const [componentDisplayed, setComponentDisplayed] = useState("landing");

    return (
    <>
        {componentDisplayed == "landing" && <LandingPage setComponentDisplayed={setComponentDisplayed} />}
        {componentDisplayed == "signIn" && <SignInCard setComponentDisplayed={setComponentDisplayed} />}
        {componentDisplayed == "createAccount" && <CreateAccountCard setComponentDisplayed={setComponentDisplayed} />}
        {componentDisplayed == "forgotPassword" && <ForgotPasswordCard setComponentDisplayed={setComponentDisplayed} />}
    </>)
}