import { useSelector } from "react-redux";
export default function ActiveOverlay(props) {
    const overlayDimensions = useSelector(state => state.overlayDimensions.value);
    return <div className="overlay" style={{width: overlayDimensions[0]+"px", height: props.overlayHeight+"px"}}></div>
}