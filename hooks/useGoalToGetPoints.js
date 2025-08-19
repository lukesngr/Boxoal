import { useMemo } from "react";
import { differenceInDates } from '@/modules/dateCode';
import { getHighestDenominatorUpTo } from '@/modules/coreLogic';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

import { getLinesBetweenPoints, getOverallSizeOfPoint } from "@/modules/coreLogic";
export function useGoalToGetPoints(goalData) {
    const {wakeupTime} = useSelector(state => state.profile.value);
    const {pointsArray, linesArray, xAxisLabels, yAxisLabels} = useMemo(() => {

        const initialLogX = 77;
        const initialLogY = 266;
        const goalX = 600;
        const goalY = 35; //35
        const endY = 59;
        let pointsArray = [];
        let linesArray = [];
        let xAxisLabels = [];
        let yAxisLabels = []; 
        
        let xDifference = goalX - initialLogX;
        let yDifference = initialLogY - endY;
        //logic too complicated need commenting
        
        
        if(goalData.metric !== null && goalData.loggingsOfMetric.length != 0) {
            //logic works by dviding vertical and horizontal spaces by difference in relevant metrics
            //thiry minutes before as target date set to wakeup time next day
            let dateDifferenceBetweenFirstLogAndGoal = differenceInDates(goalData.targetDate, goalData.loggingsOfMetric[0].date, wakeupTime);
            let metricDifferenceBetweenFirstLogAndGoal = goalData.metric - goalData.loggingsOfMetric[0].metric;
            
            let xPerPoint, yPerPoint, xAxisIncrements, yAxisIncrements, highestDenominatorForMetricDifference, highestDenominatorForDayDifference;

            if(dateDifferenceBetweenFirstLogAndGoal > 0) {
                xPerPoint = xDifference / dateDifferenceBetweenFirstLogAndGoal;
                highestDenominatorForDayDifference = getHighestDenominatorUpTo(dateDifferenceBetweenFirstLogAndGoal, 20)
                xAxisIncrements = dateDifferenceBetweenFirstLogAndGoal / highestDenominatorForDayDifference;
            }else{
                xPerPoint = xDifference / 1;
                highestDenominatorForDayDifference = 1;
                xAxisIncrements = 1 / highestDenominatorForDayDifference;
            }

            

            //divides y axis into increments based on the highest denominator of the metric difference and adds labels
            yPerPoint = yDifference / metricDifferenceBetweenFirstLogAndGoal;
            highestDenominatorForMetricDifference = getHighestDenominatorUpTo(metricDifferenceBetweenFirstLogAndGoal, 10)
            yAxisIncrements = metricDifferenceBetweenFirstLogAndGoal / highestDenominatorForMetricDifference;
            
            let yPerAxisLabel = yDifference / highestDenominatorForMetricDifference; 
            let xPerAxisLabel = xDifference / highestDenominatorForDayDifference; 

            //gets smallest divisor of both x and y and then minus by 0.1 to add margin between points
            let overallSizeOfPoint = Math.min(xPerPoint, yPerPoint)*0.9;

            pointsArray = goalData.loggingsOfMetric.map((log, index) => {
                let dayDifference = differenceInDates(log.date, goalData.loggingsOfMetric[0].date, wakeupTime);
                let metricDifference = log.metric - goalData.loggingsOfMetric[0].metric;
                let x = initialLogX + (xPerPoint * dayDifference);
                let y = initialLogY - (yPerPoint * metricDifference);
                return { x, y, size: overallSizeOfPoint };
            });

            if(pointsArray.length > 0) {
                linesArray = getLinesBetweenPoints(pointsArray, overallSizeOfPoint);
            }
            
            //just connects points by lines with lines starting in center of points except for goal point where it ends at goal point on side previous point came from
            for(let i = 0; i <= highestDenominatorForMetricDifference; i++) {
                yAxisLabels.push({label: i*yAxisIncrements, y: initialLogY - (yPerAxisLabel * i)});
            }

            for(let i = 0; i < highestDenominatorForDayDifference+1; i++) {
                //if end denominator goes over what expected remove
                if(dayjs(goalData.loggingsOfMetric[0].date).add(i*xAxisIncrements, 'day').date() <= dayjs(goalData.targetDate).date()) {
                    xAxisLabels.push({label: dayjs(goalData.loggingsOfMetric[0].date).add(i*xAxisIncrements, 'day').format('D/M'), x: initialLogX + (xPerAxisLabel * i)});
                }
            }

            return {pointsArray, linesArray, yAxisLabels, xAxisLabels};
        }else if(goalData.timeboxes !== null & goalData.timeboxes.length != 0) {
            let dateDifferenceBetweenFirstLogAndGoal = differenceInDates(goalData.targetDate, goalData.timeboxes[0].startTime, wakeupTime);
            let totalTime = 0;
            goalData.timeboxes.forEach(function (element) {
                totalTime += ((new Date(element.endTime) - new Date(element.startTime)) / 60000)
            })

            let xPerPoint, yPerPoint, xAxisIncrements, yAxisIncrements, highestDenominatorForTimeboxDifference, highestDenominatorForDayDifference;

            if(dateDifferenceBetweenFirstLogAndGoal > 0) {
                xPerPoint = xDifference / dateDifferenceBetweenFirstLogAndGoal;
                highestDenominatorForDayDifference = getHighestDenominatorUpTo(dateDifferenceBetweenFirstLogAndGoal, 20)
                xAxisIncrements = dateDifferenceBetweenFirstLogAndGoal / highestDenominatorForDayDifference;
            }else{
                xPerPoint = xDifference / 1;
                highestDenominatorForDayDifference = 1;
                xAxisIncrements = 1 / highestDenominatorForDayDifference;
            }

            yPerPoint = yDifference / totalTime;
            highestDenominatorForTimeboxDifference = getHighestDenominatorUpTo(totalTime, 10)
            yAxisIncrements = totalTime / highestDenominatorForTimeboxDifference;

            let yPerAxisLabel = yDifference / highestDenominatorForTimeboxDifference; 
            let xPerAxisLabel = xDifference / highestDenominatorForDayDifference; 

            let overallSizeOfPoint = getOverallSizeOfPoint(xPerPoint, yPerPoint);
            let sumOfTime = 0;
            
            pointsArray = goalData.timeboxes.reduce((arrayOfPoints, timebox) => {
                let dayDifference = differenceInDates(timebox.startTime, goalData.timeboxes[0].startTime, wakeupTime);
                if(timebox.recordedTimeBoxes.length != 0) {
                    sumOfTime += ((new Date(timebox.endTime) - new Date(timebox.startTime)) / 60000);
                    let x = initialLogX + (xPerPoint * dayDifference);
                    let y = initialLogY - (yPerPoint * sumOfTime);
                    arrayOfPoints.push({ x, y, size: overallSizeOfPoint });
                }
                return arrayOfPoints;
            }, []);
            
            if(pointsArray.length > 0) {
                linesArray = getLinesBetweenPoints(pointsArray, overallSizeOfPoint);
            }
            
            for(let i = 0; i <= highestDenominatorForTimeboxDifference; i++) {
                yAxisLabels.push({label: i*yAxisIncrements, y: initialLogY - (yPerAxisLabel * i)});
            }
            
            for(let i = 0; i < highestDenominatorForDayDifference+1; i++) {
                if(dayjs(goalData.timeboxes[0].startTime).add(i*xAxisIncrements, 'day').date() <= dayjs(goalData.targetDate).date()) {
                    xAxisLabels.push({label: dayjs(goalData.timeboxes[0].startTime).add(i*xAxisIncrements, 'day').format('D/M'), x: initialLogX + (xPerAxisLabel * i)});
                }
            }

            return {pointsArray, linesArray, yAxisLabels, xAxisLabels};
        }
        // if goalData metric is null only goal is present and axis and points are left empty
        return {pointsArray, linesArray, yAxisLabels, xAxisLabels};
        
    }, [goalData]);
    return {pointsArray, linesArray, yAxisLabels, xAxisLabels};
}