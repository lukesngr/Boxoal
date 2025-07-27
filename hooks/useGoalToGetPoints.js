import { useMemo } from "react";
import { differenceInDates } from '@/modules/dateCode';
import { getHighestDenominatorUpTo } from '@/modules/coreLogic';
import dayjs from 'dayjs';
export function useGoalToGetPoints(goalData) {
    const {pointsArray, linesArray, xAxisLabels, yAxisLabels} = useMemo(() => {

        const initialLogX = 77;
        const initialLogY = 266;
        const goalX = 600;
        const goalY = 35;
        let pointsArray = [];
        let linesArray = [];
        let xAxisLabels = [];
        let yAxisLabels = [];
        
        let xDifference = goalX - initialLogX;
        let yDifference = initialLogY - goalY;
        
        if(goalData.loggingsOfMetric.length != 0) {
            let dateDifferenceBetweenFirstLogAndGoal = differenceInDates(goalData.targetDate, goalData.loggingsOfMetric[0].date);
            let metricDifferenceBetweenFirstLogAndGoal = goalData.metric - goalData.loggingsOfMetric[0].metric;
            let xPerPoint = xDifference / dateDifferenceBetweenFirstLogAndGoal;
            let yPerPoint = yDifference / metricDifferenceBetweenFirstLogAndGoal;
            let overallSizeOfPoint = Math.min(xPerPoint, yPerPoint)*0.9;
            pointsArray = goalData.loggingsOfMetric.map((log, index) => {
                if (index === 0) {
                    return { x: initialLogX, y: initialLogY, size: overallSizeOfPoint };
                }else{
                    let dayDifference = differenceInDates(log.date, goalData.loggingsOfMetric[0].date);
                    let metricDifference = log.metric - goalData.loggingsOfMetric[0].metric;
                    let x = initialLogX + (xPerPoint * dayDifference);
                    let y = initialLogY - (yPerPoint * metricDifference);
                    return { x, y, size: overallSizeOfPoint };
                }
            });

            for (let i = 0; i < pointsArray.length; i++) {
                if(i+1 > (pointsArray.length - 1)) {
                    linesArray.push({
                        x1: pointsArray[i].x + (overallSizeOfPoint / 2),
                        y1: pointsArray[i].y + (overallSizeOfPoint / 2),
                        x2: goalX,
                        y2: goalY + (12 / 2)
                    });
                }else{
                    linesArray.push({
                        x1: pointsArray[i].x + (overallSizeOfPoint / 2),
                        y1: pointsArray[i].y + (overallSizeOfPoint / 2),
                        x2: pointsArray[i + 1].x + (overallSizeOfPoint / 2),
                        y2: pointsArray[i + 1].y + (overallSizeOfPoint / 2)
                    });
                }
            }

            let highestDenominatorForMetricDifference = getHighestDenominatorUpTo(metricDifferenceBetweenFirstLogAndGoal, 10);
            let yAxisIncrements = metricDifferenceBetweenFirstLogAndGoal / highestDenominatorForMetricDifference;
            let yPerAxisLabel = yDifference / highestDenominatorForMetricDifference; 
            for(let i = 0; i <= highestDenominatorForMetricDifference-1; i += yAxisIncrements) {
                yAxisLabels.push({label: i, y: initialLogY - (yPerAxisLabel * i)});
            }

            let highestDenominatorForDayDifference = getHighestDenominatorUpTo(dateDifferenceBetweenFirstLogAndGoal, 20);
            let xAxisIncrements = dateDifferenceBetweenFirstLogAndGoal / highestDenominatorForDayDifference;
            let xPerAxisLabel = xDifference / highestDenominatorForDayDifference; 
            for(let i = 0; i <= highestDenominatorForDayDifference; i += xAxisIncrements) {
                xAxisLabels.push({label: dayjs(goalData.loggingsOfMetric[0].date).add(i, 'day').format('D/M'), x: initialLogX + (xPerAxisLabel * i)});
            }
        }
        return {pointsArray, linesArray, yAxisLabels, xAxisLabels};
    }, [goalData]);
    return {pointsArray, linesArray, yAxisLabels, xAxisLabels};
}