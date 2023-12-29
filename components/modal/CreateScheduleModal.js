import CreateScheduleForm from "../form/CreateScheduleForm";
import BootstrapModal from "./BootstrapModal";
import '../../styles/createmodal.scss';

export default function CreateScheduleModal() {
    return <BootstrapModal id="createScheduleModal" title="New Schedule">
                <CreateScheduleForm></CreateScheduleForm>
            </BootstrapModal>
}