import {  useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function PortalComponent(props) {

    const [portal, setPortal] = useState(props.children);

    useEffect(() => {
        const portalRoot = document.getElementById('portalRoot');
        setPortal(createPortal(props.children, portalRoot));
    }, [props.children])

    return portal;
}