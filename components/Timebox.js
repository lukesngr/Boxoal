import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/timebox.css';

export default function TimeBox(props) {

    function addTimeBox() {
        console.log(props.time, props.day);
    }

    return (
    <div className="col-1 timeBox">
        <button onClick={addTimeBox} className="btn btn-dark addBoxButton"><FontAwesomeIcon height={25} width={25} icon={faCirclePlus}/></button>
    </div>)
}