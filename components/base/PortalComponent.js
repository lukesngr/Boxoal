import {  useEffect } from "react";
import { createPortal } from "react-dom";

export default function PortalComponent(props) {
    const portalRoot = document.getElementById('portalRoot');
      
    return createPortal(props.children, portalRoot);
}