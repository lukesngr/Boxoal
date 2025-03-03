import React, { useState } from "react";
import { useSelector } from "react-redux";
import Box from '@mui/material/Box';
import CreateGoalForm from "../form/CreateGoalForm";

export default function AddGoalToTree(props) {
    let size = 70; 
    let color = 'black'; 
    let strokeWidth = 2; 
    let backgroundColor = '#D9D9D9';
    let plusSize = 0.4;
    const center = size / 2;
    const radius = (size - strokeWidth) / 2.2; 
    const plusLength = size * plusSize;
    const halfPlusLength = plusLength / 2;
    const [createGoalVisible, setCreateGoalVisible] = useState(false);
    let { scheduleID } = useSelector((state) => state.profile.value);
    
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box 
                    component="div" 
                    onClick={() => setCreateGoalVisible(true)}
                    sx={{ 
                        cursor: 'pointer',
                        '&:hover': {
                            opacity: 0.8
                        }
                    }}
                >
                    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                        <circle 
                            cx={center} 
                            cy={center} 
                            r={radius} 
                            fill={backgroundColor}
                        />
                        <line
                            x1={center - halfPlusLength}
                            y1={center}
                            x2={center + halfPlusLength}
                            y2={center}
                            stroke={color}
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                        />
                        <line
                            x1={center}
                            y1={center - halfPlusLength}
                            x2={center}
                            y2={center + halfPlusLength}
                            stroke={color}
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                        />
                    </svg>
                </Box>
            </Box>
            
            <CreateGoalForm 
                visible={createGoalVisible} 
                active={props.addNonActiveGoal} 
                line={props.line} 
                close={() => setCreateGoalVisible(false)} 
                id={scheduleID}  
                goals={props.goals}
            />
        </>
    );
}