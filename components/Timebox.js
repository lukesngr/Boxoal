import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/timebox.scss';

export default function TimeBox(props) {

    function addTimeBox() {
        console.log(props.time, props.day);
    }

    return (
    <div className={props.active ? 'col-1 timeBox' : 'col-1 inactiveTimebox'}>
        {props.active && <button data-testid="addTimeBoxButton" onClick={addTimeBox} className="btn btn-dark addBoxButton"><FontAwesomeIcon height={25} width={25} icon={faCirclePlus}/></button>}
    </div>)
}