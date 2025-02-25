import CreateTimeboxForm from "../form/CreateTimeboxForm2";

export default function TimeboxInCreation({date, time}) {
    const [createTimeboxFormVisible, setCreateTimeboxFormVisible] = useState(false);
    const [numberOfBoxes, setNumberOfBoxes] = useState('1');
    function getHeightForBoxes (numberOfBoxes) { 
        if (numberOfBoxes === '') {
            return '0%';
        }else {
            return `calc(${(parseInt(numberOfBoxes) * 100)}% + ${(parseInt(numberOfBoxes) - 1) * 2}px)` 
        }
    }

    return <>
        <CreateTimeboxForm 
            visible={createTimeboxFormVisible} 
            close={() => setCreateTimeboxFormVisible(false)} 
            time={time} 
            date={date} 
            numberOfBoxes={numberOfBoxes} 
            setNumberOfBoxes={setNumberOfBoxes}>
        </CreateTimeboxForm>
        <div onClick={() => setCreateTimeboxFormVisible(true)}>
            <div className="timeboxInCreation" style={{height: getHeightForBoxes(numberOfBoxes), backgroundColor: 'blue', width: '100%', marginTop: '0px'}}></div>
        </div>
    </>
}