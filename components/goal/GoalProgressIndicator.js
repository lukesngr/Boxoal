import React from "react";
import { getProgressWithGoal } from "@/modules/coreLogic";
import { getDateWithSuffix } from "@/modules/formatters";
import dayjs from "dayjs";

export default function GoalProgressIndicator(props) {
    let goalDateInDayJS = dayjs(props.goal.targetDate);
    let dateWithSuffix = getDateWithSuffix(goalDateInDayJS.date())
    let abbrievatedMonth = goalDateInDayJS.format('MMM')
    let progress = getProgressWithGoal(props.goal.timeboxes);
    const size = 50;
    let strokeWidth = 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (circumference * progress) / 100;
    console.log(strokeDashoffset)


    return (
    <div style={{marginLeft: 10, marginRight: 10}}>
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                stroke="#C5C27C"
                fill="#d9d9d9"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth+"px"}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                rotation="-90"
            />
            <text x={size / 2} y={(size /2) - 8} textAnchor="middle" stroke="black" fontSize="15px" dy=".3em">{dateWithSuffix}</text>
            <text x={size / 2} y={(size /2) + 8} textAnchor="middle" stroke="black" fontSize="15px" dy=".3em">{abbrievatedMonth}</text>
        </svg>
    </div>)
}