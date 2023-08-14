import { useRouter } from "next/router";

export default function RedirWhenNotAuth(props) {
    const router = useRouter();

    if(!props.session) {
        router.push(props.redirectSrc);
    }else{
        return props.children
    }
}