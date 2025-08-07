import { useMemo } from "react";
import { differenceInDates } from '@/modules/dateCode';
import { getHighestDenominatorUpTo } from '@/modules/coreLogic';
import dayjs from 'dayjs';
import { getLinesBetweenPoints, getOverallSizeOfPoint } from "@/modules/coreLogic";
export function useGoalToGetPoints(goalData) {
    const {pointsArray, linesArray, xAxisLabels, yAxisLabels, goalRectX, goalRectY} = useMemo(() => {

        const initialLogX = 77;
        const initialLogY = 266;
        const goalX = 600;
        const goalY = 35; //35
        const endY = 59;
        let pointsArray = [];
        let linesArray = [];
        let xAxisLabels = [];
        let yAxisLabels = [];
        let goalRectX = goalX;
        let goalRectY = goalY; 
        
        let xDifference = goalX - initialLogX;
        let yDifference = initialLogY - endY;
        //logic too complicated need commenting
        
        
        if(goalData.metric !== null && goalData.loggingsOfMetric.length != 0) {
            //logic works by dviding vertical and horizontal spaces by difference in relevant metrics
            let dateDifferenceBetweenFirstLogAndGoal = differenceInDates(goalData.targetDate, goalData.loggingsOfMetric[0].date)+1;
            let metricDifferenceBetweenFirstLogAndGoal = goalData.metric - goalData.loggingsOfMetric[0].metric;
            let xPerPoint = xDifference / dateDifferenceBetweenFirstLogAndGoal;
            let yPerPoint = yDifference / metricDifferenceBetweenFirstLogAndGoal;
            //gets smallest divisor of both x and y and then minus by 0.1 to add margin between points
            let overallSizeOfPoint = Math.min(xPerPoint, yPerPoint)*0.9;
            pointsArray = goalData.loggingsOfMetric.map((log, index) => {
                let dayDifference = differenceInDates(log.date, goalData.loggingsOfMetric[0].date);
                let metricDifference = log.metric - goalData.loggingsOfMetric[0].metric;
                let x = initialLogX + (xPerPoint * dayDifference);
                let y = initialLogY - (yPerPoint * metricDifference);
                return { x, y, size: overallSizeOfPoint };
            });

            //just connects points by lines with lines starting in center of points except for goal point where it ends at goal point on side for aesthetic reasons
            linesArray = getLinesBetweenPoints(pointsArray, overallSizeOfPoint, goalX, goalY);

            //divides y axis into increments based on the highest denominator of the metric difference and adds labels
            let highestDenominatorForMetricDifference = getHighestDenominatorUpTo(metricDifferenceBetweenFirstLogAndGoal, 10);
            console.log(highestDenominatorForMetricDifference, goalData.metric, goalData.loggingsOfMetric[0].metric);
            let yAxisIncrements = metricDifferenceBetweenFirstLogAndGoal / highestDenominatorForMetricDifference;
            let yPerAxisLabel = yDifference / highestDenominatorForMetricDifference; 
            for(let i = 0; i <= highestDenominatorForMetricDifference-1; i += yAxisIncrements) {
                yAxisLabels.push({label: i+goalData.loggingsOfMetric[0].metric, y: initialLogY - (yPerAxisLabel * i) - (overallSizeOfPoint*0.5)});
            }

            let highestDenominatorForDayDifference = getHighestDenominatorUpTo(dateDifferenceBetweenFirstLogAndGoal, 20);
            let xAxisIncrements = dateDifferenceBetweenFirstLogAndGoal / highestDenominatorForDayDifference;
            let xPerAxisLabel = xDifference / highestDenominatorForDayDifference; 
            for(let i = 0; i < highestDenominatorForDayDifference; i += xAxisIncrements) {
                xAxisLabels.push({label: dayjs(goalData.loggingsOfMetric[0].date).add(i, 'day').format('D/M'), x: initialLogX + (xPerAxisLabel * i)});
            }

            return {pointsArray, linesArray, yAxisLabels, xAxisLabels, goalRectX, goalRectY};
        }else if(goalData.timeboxes !== null & goalData.timeboxes.length != 0) {
            let dateDifferenceBetweenFirstLogAndGoal = differenceInDates(goalData.targetDate, goalData.timeboxes[0].startTime);
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
            console.log(highestDenominatorForTimeboxDifference, totalTime, yAxisIncrements)

            let yPerAxisLabel = yDifference / highestDenominatorForTimeboxDifference; 
            let xPerAxisLabel = xDifference / highestDenominatorForDayDifference; 

            let overallSizeOfPoint = getOverallSizeOfPoint(xPerPoint, yPerPoint);
            let sumOfTime = 0;
            
            pointsArray = goalData.timeboxes.map((timebox, index) => {
                let dayDifference = differenceInDates(timebox.startTime, goalData.timeboxes[0].startTime);
                sumOfTime += ((new Date(timebox.endTime) - new Date(timebox.startTime)) / 60000);
                let x = initialLogX + (xPerPoint * dayDifference);
                let y = initialLogY - (yPerPoint * sumOfTime);
                return { x, y, size: overallSizeOfPoint };
            });

            linesArray = getLinesBetweenPoints(pointsArray, overallSizeOfPoint);
            for(let i = 0; i <= highestDenominatorForTimeboxDifference; i++) {
                yAxisLabels.push({label: i*yAxisIncrements, y: initialLogY - (yPerAxisLabel * i)});
            }

            console.log(xAxisIncrements, highestDenominatorForDayDifference);
            
            for(let i = 0; i < highestDenominatorForDayDifference+1; i += xAxisIncrements) { //last denominator for x is not to be included as it is end
                if(dayjs(goalData.timeboxes[0].startTime).add(i, 'day').date() <= dayjs(goalData.targetDate).date()) {
                    xAxisLabels.push({label: dayjs(goalData.timeboxes[0].startTime).add(i, 'day').format('D/M'), x: initialLogX + (xPerAxisLabel * i)});
                }
            }

            return {pointsArray, linesArray, yAxisLabels, xAxisLabels, goalRectX, goalRectY};
        }
        // if goalData metric is null only goal is present and axis and points are left empty
        return {pointsArray, linesArray, yAxisLabels, xAxisLabels, goalRectX, goalRectY};
        
    }, [goalData]);
    return {pointsArray, linesArray, yAxisLabels, xAxisLabels, goalRectX, goalRectY};
}