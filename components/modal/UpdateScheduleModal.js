import UpdateScheduleForm from "../schedule/UpdateScheduleForm";
import BootstrapModal from "./BootstrapModal";
import '../../styles/createmodal.scss';

export default function UpdateScheduleModal(props) {
    return <BootstrapModal id="updateScheduleModal" title="Update Schedule">
                <UpdateScheduleForm schedule={props.schedule}></UpdateScheduleForm>
            </BootstrapModal>
}