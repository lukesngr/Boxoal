import { useSelector } from "react-redux";
export default function ActiveOverlay() {
    const overlayDimensions = useSelector(state => state.overlayDimensions.value);
    const activeOverlayHeight = useSelector(state => state.activeOverlayHeight.value);
    return <div className="overlay" style={{width: overlayDimensions.headerWidth+"px", height: activeOverlayHeight+"px"}}></div>
}