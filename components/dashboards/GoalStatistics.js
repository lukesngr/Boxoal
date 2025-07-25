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
            <svg viewBox='0 0 622 372' style={{ overflow: 'visible' }}>
                <text x="0" y="71" class="yAxisLabel">M</text>
                <text x="0" y="91" class="yAxisLabel">E</text>
                <text x="0" y="111" class="yAxisLabel">T</text>
                <text x="0" y="131" class="yAxisLabel">R</text>
                <text x="0" y="151" class="yAxisLabel">I</text>
                <text x="0" y="171" class="yAxisLabel">C</text>
                <text x="307" y="355" class="yAxisLabel">DATE</text>
                <rect width="572" height="303" x="51" y="0" fill="#000000d9" />
                <line x1="48" y1="0" x2="48" y2="306" stroke="white" strokeWidth="5"/>
                <line x1="50" y1="303" x2="622" y2="303" stroke="white" strokeWidth="5"/>
            </svg>
        </div>
     </Paper>)
};