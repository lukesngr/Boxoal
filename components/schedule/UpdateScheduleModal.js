import UpdateScheduleForm from "./UpdateScheduleForm";
import BootstrapModal from "../base/BootstrapModal";
import '../../styles/createmodal.scss';

export default function UpdateScheduleModal(props) {
    return <BootstrapModal id="updateScheduleModal" title="Update Schedule">
                <UpdateScheduleForm schedule={props.schedule}></UpdateScheduleForm>
            </BootstrapModal>
}