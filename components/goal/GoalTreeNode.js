import { getProgressWithGoal } from "../../modules/coreLogic";
import { getDateWithSuffix } from "../../modules/formatters";
import dayjs from "dayjs";
import Box from '@mui/material/Box';

export default function GoalTreeNode(props) {
    let goalDateInDayJS = dayjs(props.goal.targetDate);
    let dateWithSuffix = getDateWithSuffix(goalDateInDayJS.date());
    let abbrievatedMonth = goalDateInDayJS.format('MMM');
    let progress = getProgressWithGoal(props.goal.timeboxes);
    
    const size = 120;
    let strokeWidth = 5;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (circumference * progress) / 100;
    
    let outsideColor = '#D9D9D9';
    let insideColor = '#875F9A';
    let {title} = props.goal;
    
    if(props.goal.completed) {
        outsideColor = '#875F9A';
        insideColor = '#D9D9D9';
        dateWithSuffix = getDateWithSuffix(dayjs(props.goal.completedOn).date());
    }

    if(title.length > 10) {
        title = title.substring(0, 8) + '..';
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width={size} height={size}>
                <circle
                    stroke={outsideColor}
                    fill={outsideColor}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                />
                <circle
                    stroke={insideColor}
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
                <text
                    x={size / 2}
                    y={(size / 2)-35}
                    textAnchor="middle"
                    dy=".3em"
                    fontSize={15}
                    fill="black"
                    fontFamily="Kameron, serif"
                >{dateWithSuffix}</text>
                <text
                    x={size / 2}
                    y={(size / 2)-20}
                    textAnchor="middle"
                    dy=".3em"
                    fontSize={15}
                    fill="black"
                    fontFamily="Kameron, serif"
                >{abbrievatedMonth}</text>
                <text 
                    x={size / 2} 
                    y={(size / 2)+1} 
                    textAnchor="middle" 
                    dy=".3em" 
                    fontSize={22} 
                    fill="black" 
                    fontFamily="Kameron, serif"
                    style={{ maxWidth: "50px", overflow: "hidden" }}
                >{title}</text>
            </svg>
            <svg width={110} height={45} viewBox="0 0 24 30">
                <path 
                    d="M12 0 L12 24 M5 17 L12 24 L19 17" 
                    stroke="black" 
                    strokeWidth={2}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </Box>
    );
}