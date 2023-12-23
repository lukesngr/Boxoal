import {  useEffect } from "react";
import { createPortal } from "react-dom";

export default function PortalComponent(props) {
    const portalRoot = document.getElementById('portalRoot');
     const portalContainer = document.createElement('div');
      
    useEffect(() => {
        portalRoot.appendChild(portalContainer);
      
        return () => {
        portalRoot.removeChild(portalContainer);
        };
    }, [portalContainer, portalRoot]);
      
    return createPortal(props.children, portalContainer);
}