import { useState, useRef, useEffect } from 'react';
import { Paper } from '@mui/material';
import '../../styles/statistics.scss';
import dayjs from 'dayjs';

export function GoalStatistics({goalData}) {
    
    console.log("Goal Data: ", goalData);
    let initialLogX = 77;
    let initialLogY = 266;
    let goalX = 600;
    let goalY = 35;
    let pointsArray = [];
    if(goalData.loggingsOfMetric.length != 0) {
        let dayDifferenceBetweenFirstLogAndGoal = dayjs(goalData.targetDate).diff(dayjs(goalData.loggingsOfMetric[0].date), 'day');
        let metricDifferenceBetweenFirstLogAndGoal = goalData.metric - goalData.loggingsOfMetric[0].metric;
        let xDifference = goalX - initialLogX;
        let yDifference = initialLogY - goalY;
        let xPerPoint = xDifference / dayDifferenceBetweenFirstLogAndGoal;
        let yPerPoint = yDifference / metricDifferenceBetweenFirstLogAndGoal;
        console.log("xPerPoint: ", xPerPoint, "yPerPoint: ", yPerPoint, dayDifferenceBetweenFirstLogAndGoal, metricDifferenceBetweenFirstLogAndGoal);
        let overallSizeOfPoint = Math.min(xPerPoint, yPerPoint);
        pointsArray = goalData.loggingsOfMetric.map((log, index) => {
            if (index === 0) {
                return { x: initialLogX, y: initialLogY, size: overallSizeOfPoint };
            }else{
                let dayDifference = dayjs(log.date).diff(dayjs(goalData.loggingsOfMetric[0].date), 'day');
                let metricDifference = goalData.loggingsOfMetric[0].metric - log.metric;
                let x = initialLogX + (xPerPoint * dayDifference);
                let y = initialLogY - (yPerPoint * metricDifference);
                return { x, y, size: overallSizeOfPoint };
            }
        });
    }

    console.log("Points Array: ", pointsArray);
    let goalTitle = `${goalData.title} by ${dayjs(goalData.targetDate).format('D/M')}`;
    return (
     <Paper sx={{backgroundColor: '#875F9A', marginTop: 2, paddingLeft: '2%', paddingRight: '5.46%', paddingTop: '13.36%', paddingBottom : '4.67%' }} className="statPaper" elevation={4} square>
        <div className="goal-statistics" style={{width: '100%'}}>
            <svg viewBox='0 0 622 372' style={{ overflow: 'visible' }}>
                <text x="0" y="71" class="yAxisLabel">M</text>
                <text x="0" y="91" class="yAxisLabel">E</text>
                <text x="0" y="111" class="yAxisLabel">T</text>
                <text x="0" y="131" class="yAxisLabel">R</text>
                <text x="0" y="151" class="yAxisLabel">I</text>
                <text x="0" y="171" class="yAxisLabel">C</text>
                <text x="307" y="355" class="yAxisLabel">DATE</text>
                
                <rect width="572" height="303" x="51" y="0" fill="#000000d9" />
                <text x="226" y="30" class="graphGoalTitle">{goalTitle}</text>
                <line x1="51" y1="42" x2="622" y2="42" stroke-dasharray="5,5" stroke="#FF0000" strokeWidth="5"/>
                <line x1="48" y1="0" x2="48" y2="306" stroke="white" strokeWidth="5"/>
                <rect width="12" height="12" x={goalX} y={goalY} className='finishedGoalRectangle'></rect>
                {pointsArray.map((point, index) => (
                    <rect key={index} width={point.size} fill="#6FA9B3" height={point.size} x={point.x} y={point.y} className='goalPointRectangle'></rect>
                ))}
                <line x1="50" y1="303" x2="622" y2="303" stroke="white" strokeWidth="5"/>
            </svg>
        </div>
     </Paper>)
};