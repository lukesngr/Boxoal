export default function Overlay(props) {
    return (<>{!props.active && <div className="overlay" style={{height: props.dimensions[0]+"px", width: props.dimensions[1]+"px"}}></div>}</>);
}