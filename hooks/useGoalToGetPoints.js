import { useMemo } from "react";
import { differenceInDates } from '@/modules/dateCode';
import { getHighestDenominatorUpTo } from '@/modules/coreLogic';
import dayjs from 'dayjs';
import { getLinesBetweenPoints } from "@/modules/coreLogic";
export function useGoalToGetPoints(goalData) {
    const {pointsArray, linesArray, xAxisLabels, yAxisLabels, goalRectX, goalRectY} = useMemo(() => {

        const initialLogX = 77;
        const initialLogY = 266;
        const goalX = 600;
        const goalY = 35;
        const endX = 623;
        const endY = goalY;
        let pointsArray = [];
        let linesArray = [];
        let xAxisLabels = [];
        let yAxisLabels = [];
        let goalRectX = goalX;
        let goalRectY = goalY; 
        
        let xDifference = goalX - initialLogX;
        let yDifference = initialLogY - goalY;
        //logic too complicated need commenting
        
        
        if(goalData.metric !== null && goalData.loggingsOfMetric.length != 0) {
            //logic works by dviding vertical and horizontal spaces by difference in relevant metrics
            let dateDifferenceBetweenFirstLogAndGoal = differenceInDates(goalData.targetDate, goalData.loggingsOfMetric[0].date);
            let metricDifferenceBetweenFirstLogAndGoal = goalData.metric - goalData.loggingsOfMetric[0].metric;
            let xPerPoint = xDifference / dateDifferenceBetweenFirstLogAndGoal;
            let yPerPoint = yDifference / metricDifferenceBetweenFirstLogAndGoal;
            //gets smallest divisor of both x and y and then minus by 0.1 to add margin between points
            let overallSizeOfPoint = Math.min(xPerPoint, yPerPoint)*0.9;
            pointsArray = goalData.loggingsOfMetric.map((log, index) => {
                if (index === 0) {
                    return { x: initialLogX, y: initialLogY-overallSizeOfPoint, size: overallSizeOfPoint }; //first point has to be above the 0 point as this is the start of axis
                }else{
                    //calculates based on what division of the axis the point is on
                    let dayDifference = differenceInDates(log.date, goalData.loggingsOfMetric[0].date);
                    let metricDifference = log.metric - goalData.loggingsOfMetric[0].metric;
                    let x = initialLogX + (xPerPoint * dayDifference);
                    let y = initialLogY - (yPerPoint * metricDifference);
                    return { x, y, size: overallSizeOfPoint };
                }
            });

            //just connects points by lines with lines starting in center of points except for goal point where it ends at goal point on side for aesthetic reasons
            linesArray = getLinesBetweenPoints(pointsArray, overallSizeOfPoint, goalX, goalY);

            //divides y axis into increments based on the highest denominator of the metric difference and adds labels
            let highestDenominatorForMetricDifference = getHighestDenominatorUpTo(metricDifferenceBetweenFirstLogAndGoal, 10);
            let yAxisIncrements = metricDifferenceBetweenFirstLogAndGoal / highestDenominatorForMetricDifference;
            let yPerAxisLabel = yDifference / highestDenominatorForMetricDifference; 
            for(let i = 0; i <= highestDenominatorForMetricDifference-1; i += yAxisIncrements) {
                yAxisLabels.push({label: i, y: initialLogY - (yPerAxisLabel * i) - (overallSizeOfPoint*0.75)});
            }

            let highestDenominatorForDayDifference = getHighestDenominatorUpTo(dateDifferenceBetweenFirstLogAndGoal, 20);
            let xAxisIncrements = dateDifferenceBetweenFirstLogAndGoal / highestDenominatorForDayDifference;
            let xPerAxisLabel = xDifference / highestDenominatorForDayDifference; 
            for(let i = 0; i <= highestDenominatorForDayDifference; i += xAxisIncrements) {
                xAxisLabels.push({label: dayjs(goalData.loggingsOfMetric[0].date).add(i, 'day').format('D/M'), x: initialLogX + (xPerAxisLabel * i)});
            }

            return {pointsArray, linesArray, yAxisLabels, xAxisLabels, goalRectX, goalRectY};
        }else if(goalData.timeboxes !== null & goalData.timeboxes.length != 0) {
            xDifference = endX - initialLogX;
            let dateDifferenceBetweenFirstLogAndGoal = differenceInDates(goalData.targetDate, goalData.timeboxes[0].startDate);
            let timeboxesNumberOfBoxes = goalData.timeboxes.reduce((count, item) => item.numberOfBoxes ? count + 1 : count, 0);
            let boxesDifferenceBetweenFirstLogAndGoal = timeboxesNumberOfBoxes;
            let xPerPoint = xDifference / (dateDifferenceBetweenFirstLogAndGoal+1); //include goal point
            let yPerPoint = yDifference / boxesDifferenceBetweenFirstLogAndGoal;
            let overallSizeOfPoint = Math.min(xPerPoint, yPerPoint)*0.9;
            
            pointsArray = goalData.timeboxes.map((timebox, index) => {
                if (index === 0) {
                    if(dateDifferenceBetweenFirstLogAndGoal === 0) {
                        return { x: endX-overallSizeOfPoint, y: goalY+15, size: overallSizeOfPoint };
                    }else{
                        return { x: initialLogX, y: initialLogY-overallSizeOfPoint, size: overallSizeOfPoint };
                    }
                }else{
                    let dayDifference = differenceInDates(timebox.startDate, goalData.timeboxes[0].startDate);
                    let timeboxesDifference = timebox.numberOfBoxes.metric - goalData.timeboxes[0].numberOfBoxes;
                    let x = initialLogX + (xPerPoint * dayDifference);
                    let y = initialLogY - (yPerPoint * timeboxesDifference);
                    return { x, y, size: overallSizeOfPoint };
                }
            });

            linesArray = getLinesBetweenPoints(pointsArray, overallSizeOfPoint, goalX, goalY);

            let highestDenominatorForTimeboxDifference = getHighestDenominatorUpTo(timeboxesNumberOfBoxes, 10);
            let yAxisIncrements = timeboxesNumberOfBoxes / highestDenominatorForTimeboxDifference;
            let yPerAxisLabel = yDifference / highestDenominatorForTimeboxDifference; 
            for(let i = 0; i <= highestDenominatorForTimeboxDifference-1; i += yAxisIncrements) {
                yAxisLabels.push({label: i+1, y: initialLogY - (yPerAxisLabel * i) - (overallSizeOfPoint*0.75)});
            }

            let highestDenominatorForDayDifference = getHighestDenominatorUpTo(dateDifferenceBetweenFirstLogAndGoal, 20);
            let xAxisIncrements = dateDifferenceBetweenFirstLogAndGoal / highestDenominatorForDayDifference;
            let xPerAxisLabel = xDifference / highestDenominatorForDayDifference; 
            for(let i = 0; i <= highestDenominatorForDayDifference; i += xAxisIncrements) {
                xAxisLabels.push({label: dayjs(goalData.timeboxes[0].startDate).add(i, 'day').format('D/M'), x: initialLogX + (xPerAxisLabel * i)});
            }

            goalRectX = endX-(overallSizeOfPoint / 2); //center the rectangle on the goal point
            goalRectY = goalY; //center the rectangle on the goal point
            return {pointsArray, linesArray, yAxisLabels, xAxisLabels, goalRectX, goalRectY};
        }
        // if goalData metric is null only goal is present and axis and points are left empty
        return {pointsArray, linesArray, yAxisLabels, xAxisLabels, goalRectX, goalRectY};
        
    }, [goalData]);
    return {pointsArray, linesArray, yAxisLabels, xAxisLabels, goalRectX, goalRectY};
}