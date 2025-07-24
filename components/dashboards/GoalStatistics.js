import { useState, useRef, useEffect } from 'react';
import { Paper } from '@mui/material';
import '../../styles/statistics.scss';

export function GoalStatistics({goalData}) {
    const statisticsRef = useRef(null);
    const [widthAtOneHundredPercent, setWidthAtOneHundredPercent] = useState(0);

    useEffect(() => {
        if(statisticsRef.current) {
        setWidthAtOneHundredPercent(statisticsRef.current.getBoundingClientRect().width);
        console.log("Width at 100%: ", widthAtOneHundredPercent);
    }
    }, [statisticsRef]);
    
    let height = 0.599*widthAtOneHundredPercent;
    return (
     <Paper sx={{backgroundColor: '#875F9A', marginTop: 2, paddingLeft: '2%', paddingRight: '5.46%', paddingTop: '13.36%', paddingBottom : '4.67%' }} className="statPaper" elevation={4} square>
        <div className="goal-statistics" style={{width: '100%'}} ref={statisticsRef}>
            <svg width={widthAtOneHundredPercent} height={height} style={{ overflow: 'visible' }}>
                <text x="0" y="40" class="yAxisLabel">M</text>
                <text x="0" y="70" class="yAxisLabel">E</text>
                <text x="0" y="100" class="yAxisLabel">T</text>
                <text x="0" y="130" class="yAxisLabel">R</text>
                <text x="0" y="160" class="yAxisLabel">I</text>
                <text x="0" y="190" class="yAxisLabel">C</text>
                <line x1={widthAtOneHundredPercent*0.063} y1="0" x2={widthAtOneHundredPercent*0.063} y2={0.88*height} stroke="white" strokeWidth="5"/>
            </svg>
        </div>
     </Paper>)
};