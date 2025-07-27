import { useMemo } from "react";
import { differenceInDates } from '@/modules/dateCode';
export function useGoalToGetPoints(goalData) {
    const [pointsArray, linesArray] = useMemo(() => {

        const initialLogX = 77;
        const initialLogY = 266;
        const goalX = 600;
        const goalY = 35;
        let pointsArray = [];
        let linesArray = [];
        
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
                        x1: pointsArray[i].x,
                        y1: pointsArray[i].y + (overallSizeOfPoint / 2),
                        x2: goalX + (12 / 2),
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
        }
        return [pointsArray, linesArray];
    }, [goalData]);
    return [pointsArray, linesArray];
}