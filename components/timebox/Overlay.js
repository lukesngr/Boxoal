export default function Overlay(props) {
    return (<>{!props.active && <div className="overlay" style={{width: props.dimensions[0]+"px", height: props.dimensions[1]+"px"}}></div>}</>);
}