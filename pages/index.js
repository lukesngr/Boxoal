import { useEffect, useState } from "react";
import SignInCard  from "@/components/login/SignInCard";
import CreateAccountCard from "@/components/login/CreateAccountCard";
import ForgotPasswordCard from "@/components/login/ForgotPasswordCard";
import LandingPage from "@/components/LandingPage";
import Alert from "@/components/base/Alert";
import Dashboard from "@/components/Dashboard";
import { getCurrentUser } from "@aws-amplify/auth";
import * as Sentry from "@sentry/nextjs";
import { TimeboxingBackground } from "@/components/base/TimeboxingBackground";

export default function Home() {

    const [componentDisplayed, setComponentDisplayed] = useState("landing");
    const [user, setUser] = useState(-1);
    async function getLoginInfo() { 
        try {
            const userDetails = await getCurrentUser();
            setUser(userDetails);
        } catch(error) {
            Sentry.captureException(error)
        }
    }
    
    useEffect(()=> {
        getLoginInfo();
    }, []);

    if(user != -1) {
        return <Dashboard user={user} />
    }else {
        return (
            <>
                
                <TimeboxingBackground>
                {componentDisplayed == "landing" && <LandingPage setComponentDisplayed={setComponentDisplayed} />}
                {componentDisplayed == "signIn" && <SignInCard setComponentDisplayed={setComponentDisplayed} />}
                {componentDisplayed == "createAccount" && <CreateAccountCard setComponentDisplayed={setComponentDisplayed} />}
                {componentDisplayed == "forgotPassword" && <ForgotPasswordCard setComponentDisplayed={setComponentDisplayed} />}
                </TimeboxingBackground>
                <Alert />
        </>)
    }
}