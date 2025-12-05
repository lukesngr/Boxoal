import { Paper } from '@mui/material';
import '../../styles/statistics.scss';
import dayjs from 'dayjs';
import { useGoalToGetPoints } from '@/hooks/useGoalToGetPoints';

export function GoalLineGraph({goalData}) {
    
    const {pointsArray, linesArray, yAxisLabels, xAxisLabels} = useGoalToGetPoints(goalData);
    const goalTitle = `${goalData.title} by ${dayjs(goalData.targetDate).format('D/M')}`;

    if(goalData.state != 'active') {
        return <></>
    }
    console.log(yAxisLabels)
    
    return (
     <Paper sx={{backgroundColor: '#875F9A', marginTop: 2, paddingLeft: '2%', paddingRight: '5.46%', paddingTop: '13.36%', paddingBottom : '4.67%' }} className="statPaper" elevation={4} square>
        <div className="goal-statistics" style={{width: '100%'}}>
            <svg viewBox='0 0 622 372' style={{ overflow: 'visible' }}>
                {goalData.metric === null ? (<>
                    <text x="1" y="71" className="yAxisLabel">T</text>
                    <text x="3" y="91" className="yAxisLabel">I</text>
                    <text x="0" y="111" className="yAxisLabel">M</text>
                    <text x="1" y="131" className="yAxisLabel">E</text>
                </>) : (<>
                <text x="0" y="71" className="yAxisLabel">M</text>
                <text x="0" y="91" className="yAxisLabel">E</text>
                <text x="0" y="111" className="yAxisLabel">T</text>
                <text x="0" y="131" className="yAxisLabel">R</text>
                <text x="0" y="151" className="yAxisLabel">I</text>
                <text x="0" y="171" className="yAxisLabel">C</text>
                </>)}
                <text x="307" y="355" className="yAxisLabel">DATE</text>
                
                <rect width="572" height="303" x="51" y="0" fill="#000000d9" />
                <text x="226" y="30" className="graphGoalTitle">{goalTitle}</text>
                <line x1="51" y1="42" x2="622" y2="42" stroke-dasharray="5,5" stroke="#FF0000" strokeWidth="5"/>
                <line x1="48" y1="0" x2="48" y2="306" stroke="white" strokeWidth="5"/>
                <line x1="50" y1="303" x2="622" y2="303" stroke="white" strokeWidth="5"/>
                <rect width="12" height="12" x="600" y="35" className='finishedGoalRectangle'></rect>
                {pointsArray.map((point, index) => (
                    <rect key={"point"+index} width={point.size} fill="#6FA9B3" height={point.size} x={point.x} y={point.y} className='goalPointRectangle'></rect>
                ))}
                {linesArray.map((line, index) => (
                    <line key={"line"+index} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="#6FA9B3" strokeWidth="2" />
                ))}
                {yAxisLabels.map((label, index) => (<>
                    <text key={"text"+index} x="25" y={label.y+20} className="yAxisLabels">{label.label}</text>
                    <rect key={"axisPoint"+index} x="48" y={label.y+10} width="8" height="5" fill="white"></rect>
                </>))}
                {xAxisLabels.map((label, index) => (<>
                    <rect key={"axisPoint"+index} x={label.x+9} y="295" width="5" height="8" fill="white"></rect>
                    <text key={"axisText"+index} x={label.x-6} y="320" className="yAxisLabels">{label.label}</text>
                </>))}
                
            </svg>
        </div>
     </Paper>)
};
