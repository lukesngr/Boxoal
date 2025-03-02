import React from "react";
import { getProgressWithGoal } from "@/modules/coreLogic";
import { getDateWithSuffix } from "@/modules/formatters";
import dayjs from "dayjs";

export default function GoalProgressIndicator(props) {
    let goalDateInDayJS = dayjs(props.goal.targetDate);
    let dateWithSuffix = getDateWithSuffix(goalDateInDayJS.date())
    let abbrievatedMonth = goalDateInDayJS.format('MMM')
    let progress = getProgressWithGoal(props.goal.timeboxes);
    const size = 40;
    let strokeWidth = 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = (circumference * progress) / 100;


    return (
    <div style={{marginLeft: 10, marginRight: 10, display: 'inline'}}>
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                stroke="white"
                fill="black"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth+"px"}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                rotation="-90"
            />
            <text x={size / 2} y={(size /2) - 8} textAnchor="middle" stroke="white" fontSize="13px" dy=".3em">{dateWithSuffix}</text>
            <text x={size / 2} y={(size /2) + 8} textAnchor="middle" stroke="white" fontSize="13px" dy=".3em">{abbrievatedMonth}</text>
        </svg>
    </div>)
}