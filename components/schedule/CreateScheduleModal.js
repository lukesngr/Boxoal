import CreateScheduleForm from "./CreateScheduleForm";
import BootstrapModal from "../base/BootstrapModal";
import '../../styles/createmodal.scss';

export default function CreateScheduleModal() {
    return <BootstrapModal id="createScheduleModal" title="New Schedule">
                <CreateScheduleForm></CreateScheduleForm>
            </BootstrapModal>
}