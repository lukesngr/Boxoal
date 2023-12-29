import CreateScheduleForm from "../form/CreateScheduleForm";
import BootstrapModal from "./BootstrapModal";
import '../../styles/createmodal.scss';

export default function CreateScheduleModal(props) {
    return <BootstrapModal render={props.render} id="createScheduleModal" title="New Schedule">
                <CreateScheduleForm></CreateScheduleForm>
            </BootstrapModal>
}