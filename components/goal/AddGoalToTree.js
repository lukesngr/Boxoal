import React, { useState } from "react";
import { useSelector } from "react-redux";
import Box from '@mui/material/Box';
import CreateGoalForm from "../form/CreateGoalForm";
import { QueryClientProvider } from "react-query";
import { queryClient } from "@/modules/queryClient";

export default function AddGoalToTree(props) {
    const size = 70; 
    const color = 'black'; 
    const strokeWidth = 2; 
    const backgroundColor = '#D9D9D9';
    const plusSize = 0.4;
    const center = size / 2;
    const radius = (size - strokeWidth) / 2.2; 
    const plusLength = size * plusSize;
    const halfPlusLength = plusLength / 2;
    const [createGoalVisible, setCreateGoalVisible] = useState(false);
    const { scheduleID } = useSelector((state) => state.profile.value);
    
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box 
                    component="div" 
                    className="addGoalToTree"
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
            
            <QueryClientProvider client={queryClient}>
                <CreateGoalForm 
                    visible={createGoalVisible} 
                    active={props.addNonActiveGoal} 
                    line={props.line} 
                    close={() => setCreateGoalVisible(false)} 
                    id={scheduleID}  
                    goals={props.goals}
                />
            </QueryClientProvider>
        </>
    );
}