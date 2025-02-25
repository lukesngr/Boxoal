import { useSelector } from "react-redux";

export default function Overlay(props) {
    const overlayDimensions = useSelector(state => state.overlayDimensions.value);
    
    return (<>{!props.active && <div className="overlay" style={{width: overlayDimensions.headerWidth+"px", 
        height: overlayDimensions.overlayHeight+"px"}}></div>}</>);
}