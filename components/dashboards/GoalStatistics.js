import { useState, useRef, useEffect } from 'react';
import { Paper } from '@mui/material';
import '../../styles/statistics.scss';
import dayjs from 'dayjs';
import { differenceInDates } from '@/modules/dateCode';
import { useGoalToGetPoints } from '@/hooks/useGoalToGetPoints';

export function GoalStatistics({goalData}) {
    
    const {pointsArray, linesArray, yAxisLabels, xAxisLabels} = useGoalToGetPoints(goalData);
    console.log(goalData);
    let goalTitle = `${goalData.title} by ${dayjs(goalData.targetDate).format('D/M')}`;
    return (
     <Paper sx={{backgroundColor: '#875F9A', marginTop: 2, paddingLeft: '2%', paddingRight: '5.46%', paddingTop: '13.36%', paddingBottom : '4.67%' }} className="statPaper" elevation={4} square>
        <div className="goal-statistics" style={{width: '100%'}}>
            <svg viewBox='0 0 622 372' style={{ overflow: 'visible' }}>
                {goalData.metric === null ? (<>
                    <text x="0" y="71" class="yAxisLabel">T</text>
                    <text x="0" y="91" class="yAxisLabel">I</text>
                    <text x="0" y="111" class="yAxisLabel">M</text>
                    <text x="0" y="131" class="yAxisLabel">E</text>
                    <text x="0" y="151" class="yAxisLabel">B</text>
                    <text x="0" y="171" class="yAxisLabel">O</text>
                    <text x="0" y="191" class="yAxisLabel">X</text>
                    <text x="0" y="211" class="yAxisLabel">E</text>
                    <text x="0" y="231" class="yAxisLabel">S</text>
                </>) : (<>
                <text x="0" y="71" class="yAxisLabel">M</text>
                <text x="0" y="91" class="yAxisLabel">E</text>
                <text x="0" y="111" class="yAxisLabel">T</text>
                <text x="0" y="131" class="yAxisLabel">R</text>
                <text x="0" y="151" class="yAxisLabel">I</text>
                <text x="0" y="171" class="yAxisLabel">C</text>
                </>)}
                <text x="307" y="355" class="yAxisLabel">DATE</text>
                
                <rect width="572" height="303" x="51" y="0" fill="#000000d9" />
                <text x="226" y="30" class="graphGoalTitle">{goalTitle}</text>
                <line x1="51" y1="42" x2="622" y2="42" stroke-dasharray="5,5" stroke="#FF0000" strokeWidth="5"/>
                <line x1="48" y1="0" x2="48" y2="306" stroke="white" strokeWidth="5"/>
                <line x1="50" y1="303" x2="622" y2="303" stroke="white" strokeWidth="5"/>
                <rect width="12" height="12" x="600" y="35" className='finishedGoalRectangle'></rect>
                {pointsArray.map((point, index) => (
                    <rect key={index} width={point.size} fill="#6FA9B3" height={point.size} x={point.x} y={point.y} className='goalPointRectangle'></rect>
                ))}
                {linesArray.map((line, index) => (
                    <line key={index} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="#6FA9B3" strokeWidth="2" />
                ))}
                {yAxisLabels.map((label, index) => (<>
                    <text key={index} x="25" y={label.y+20} className="yAxisLabels">{label.label}</text>
                    <rect key={index} x="48" y={label.y+10} width="8" height="5" fill="white"></rect>
                </>))}
                {xAxisLabels.map((label, index) => (<>
                    <rect key={index} x={label.x+9} y="295" width="5" height="8" fill="white"></rect>
                    <text key={index} x={label.x-6} y="320" className="yAxisLabels">{label.label}</text>
                </>))}
                
            </svg>
        </div>
     </Paper>)
};