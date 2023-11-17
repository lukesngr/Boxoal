import CreateScheduleForm from "./CreateScheduleForm";
import BootstrapModal from "../base/BootstrapModal";

export default function CreateScheduleModal() {
    return <BootstrapModal id="createFirstScheduleModal" title="New Schedule">
                <CreateScheduleForm></CreateScheduleForm>
            </BootstrapModal>
}