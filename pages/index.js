import UnSignedNav from "../components/nav/SignedOutNav"
import SignedInNav from "@/components/nav/SignedInNav";
import Image from "next/image"
import "../styles/homecard.scss";
import { useSession } from "next-auth/react";

export default function Home() {

    const {data: session, status} = useSession();

    if(status === "loading") {
        return <p>Loading</p>
    }

    return (
    <>
        {!session && <UnSignedNav /> }
        {status === "authenticated" && <SignedInNav session={session}/>}
        <div className="card mx-auto w-25 mt-3" id="homeCard">
            <Image className="card-image-top mx-auto" src="/icon.png" width={300} height={290}></Image>
            <div className="card-body">
                <h3 className="card-title">Welcome</h3>
                <p className="card-text">BoxAlc is simple timeboxing software that allows you to organize your day around activities that progress areas of your life. You can record these activites as they are being committed and this improves your ovverall level in the application, allowing you to finetune your estimation of your days</p>
            </div>
        </div>
    </>)
}