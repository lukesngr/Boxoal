import { useRouter } from "next/router";
import { useEffect } from "react";
import Loading from "./base/Loading";

export default function RedirWhenNotAuth(props) {
    const router = useRouter();

    if(props.status === "unauthenticated") {
        useEffect(() => router.push(props.redirectSrc), []);
    }else if(props.status === "authenticated") {
        return props.children
    }else {
        return <Loading />
    }
}