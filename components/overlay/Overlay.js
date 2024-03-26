import { useSelector } from "react-redux";

export default function Overlay(props) {
    const overlayDimensions = useSelector(state => state.overlayDimensions.value);
    
    return (<>{!props.active && <div className="overlay" style={{width: overlayDimensions[0]+"px", height: overlayDimensions[1]+"px"}}></div>}</>);
}