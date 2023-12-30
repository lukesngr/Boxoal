import UpdateScheduleForm from "../form/UpdateScheduleForm";
import BootstrapModal from "./BootstrapModal";
import '../../styles/createmodal.scss';

export default function UpdateScheduleModal(props) {
    return <BootstrapModal render={props.render} id={"updateScheduleModal"+props.schedule.id} title="Update Schedule">
                <UpdateScheduleForm schedule={props.schedule}></UpdateScheduleForm>
            </BootstrapModal>
}