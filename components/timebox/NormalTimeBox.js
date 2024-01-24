export default function NormalTimeBox(props) {
    const [data, height, tags, timeboxRecording] = props;
    const canRecordButtonBePresent = isRecordingButtonPresent(data.recordedTimeBoxes, data.reoccuring, date, time);
    const timeboxIsntRecording = timeboxRecording[0] == -1;
    const timeboxIsRecording = timeboxRecording[0] == data.id && timeboxRecording[1] == date;
    const iconSize = 20
    return (
        <div style={{height: height, backgroundColor: data.color}} id="timeBox" date-test>    
            <span {...tags} style={{height: height}} className="timeboxText">{data.title}</span>

            {canRecordButtonBePresent && timeboxIsntRecording && 
            <button className="recordTimeButton" onClick={startRecording} >
                <FontAwesomeIcon height={iconSize} width={iconSize} icon={faCircleDot} />
            </button>}

            {canRecordButtonBePresent && timeboxIsRecording && 
            <button className="stopRecordTimeButton" onClick={stopRecording} >
                <FontAwesomeIcon height={iconSize} width={iconSize} icon={faCircleStop} />
            </button>}
        </div>
    )
}