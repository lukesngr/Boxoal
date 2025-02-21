import { useState } from "react";
import SignInCard  from "@/components/login/SignInCard";
import CreateAccountCard from "@/components/login/CreateAccountCard";
import ForgotPasswordCard from "@/components/login/ForgotPasswordCard";
import LandingPage from "@/components/LandingPage";
import { Dialog, DialogTitle, DialogContent, DialogContentText } from "@mui/material";

export default function Home() {

    const [componentDisplayed, setComponentDisplayed] = useState("landing");
    const [alert, setAlert] = useState({open: false, title: "", message: ""});

    return (
    <>
        <Dialog open={alert.open} onClose={() => setAlert({open: false, title: "", message: ""})}>
            <DialogTitle>{alert.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                {alert.message}
                </DialogContentText>
            </DialogContent>
        </Dialog>
        {componentDisplayed == "landing" && <LandingPage setAlert={setAlert} setComponentDisplayed={setComponentDisplayed} />}
        {componentDisplayed == "signIn" && <SignInCard setAlert={setAlert} setComponentDisplayed={setComponentDisplayed} />}
        {componentDisplayed == "createAccount" && <CreateAccountCard setAlert={setAlert} setComponentDisplayed={setComponentDisplayed} />}
        {componentDisplayed == "forgotPassword" && <ForgotPasswordCard setAlert={setAlert} setComponentDisplayed={setComponentDisplayed} />}
    </>)
}