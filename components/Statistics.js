import { getStatistics } from "@/modules/boxCalculations";
import { Paper, Stack } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import '../styles/statistics.scss'
import { useMemo } from "react";
import { useSelector } from "react-redux";

export default function Statistics({recordedTimeboxes, timeboxes}) {
    const {wakeupTime} = useSelector((state) => state.profile.value);
    const {goalsCompleted} = useSelector((state) => state.goalStatistics.value);
    const {averageTimeOverBy, 
        percentagePredictedStart, 
        percentageCorrectTime, 
        percentageRescheduled, 
        hoursLeftThisWeek} = useMemo(() => getStatistics(recordedTimeboxes, timeboxes, wakeupTime), [recordedTimeboxes, timeboxes, wakeupTime]);
    return (
        <div class="container" style={{paddingLeft: 0, paddingRight: 0}}>
                <div class="row">
                    <div class="col">
                    <Paper sx={{backgroundColor: '#875F9A', marginTop: 2 }} className="statPaper" elevation={4} square>
                        <p className="statisticsHeading">Average Recordings Are {averageTimeOverBy > 0 ? "Over" : "Under"} By</p>
                        <div className="statisticsBackground">
                            <h1>{averageTimeOverBy > 0 ? averageTimeOverBy.toFixed(2) : -averageTimeOverBy.toFixed(2)}</h1>
                            
                        </div>
                        <p className="statisticsUnit">minutes</p>
                    </Paper>
                    </div>
                    <div class="col">
                    <Paper sx={{backgroundColor: '#875F9A', marginTop: 2 }} className="statPaper" elevation={4} square>
                        <p className="statisticsHeading">Completed</p>
                        <div className="statisticsBackground">
                            <h1>{goalsCompleted}</h1>
                        </div>
                        <p className="statisticsUnit">goals</p>
                    </Paper>
                    </div>
                    <div class="col">
                    <Paper sx={{backgroundColor: '#875F9A', marginTop: 2 }} className="statPaper" elevation={4} square>
                        <p className="statisticsHeading">Hours Free To Focus</p>
                        <div className="statisticsBackground">
                            <h1>{hoursLeftThisWeek}</h1>
                        </div>
                        <p className="statisticsUnit">hours</p>
                    </Paper>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <Paper sx={{backgroundColor: '#875F9A', marginTop: 2, width: '100%' }} elevation={4} square>
                            <Stack direction="column" flexGrow={1} display="flex" justifyContent="center" alignItems="center">
                            <p className="statisticsHeading">% of Timeboxes Matching Scheduled Start</p>
                            <PieChart
                                colors={['black', '#495057']}
                                margin={{ top: 0, bottom: 75, left: 10, right: 10 }}
                                series={[
                                    {
                                    data: [
                                        { id: 0, value: percentagePredictedStart*100, label: 'Scheduled Start' },
                                        { id: 1, value: (1-percentagePredictedStart)*100, label: 'Not Scheduled Start' },
                                    ],
                                    },
                                ]}
                                width={250}
                                height={300}
                                slotProps={{
                                    legend: {
                                    direction: 'row',
                                    position: { vertical: 'bottom', horizontal: 'middle' },
                                    
                                    }
                                }}
                                />
                                </Stack>
                        </Paper>
                    </div>
                    <div class="col">
                        <Paper sx={{backgroundColor: '#875F9A', marginTop: 2, width: '100%'}} elevation={4} square>
                            <Stack direction="column" flexGrow={1} display="flex" justifyContent="center" alignItems="center">
                                <p className="statisticsHeading">% of Timeboxes Matching Scheduled Time</p>
                                <PieChart
                                    colors={['black', '#495057']}
                                    margin={{ top: 0, bottom: 75, left: 10, right: 10 }}
                                    series={[
                                        {
                                        data: [
                                            { id: 0, value: percentageCorrectTime*100, label: 'Scheduled Time' },
                                            { id: 1, value: (1-percentageCorrectTime)*100, label: 'Not Scheduled Time' },
                                        ],
                                        },
                                    ]}
                                    width={250}
                                    height={300}
                                    slotProps={{
                                        legend: {
                                        direction: 'row',
                                        position: { vertical: 'bottom', horizontal: 'middle' },
                                        
                                        }
                                    }}
                                    />
                            </Stack>
                        </Paper>
                    </div>
                    <div class="col">
                        <Paper sx={{backgroundColor: '#875F9A', marginTop: 2, width: '100%'}} elevation={4} square>
                            <Stack direction="column" flexGrow={1} display="flex" justifyContent="center" alignItems="center">
                                <p className="statisticsHeading">% of Timeboxes Rescheduled</p>
                                <PieChart
                                    title="Percentage "
                                    margin={{ top: 0, bottom: 75, left: 10, right: 10 }}
                                    colors={['black', '#495057']}
                                    series={[
                                        {
                                        data: [
                                            { id: 0, value: percentageRescheduled*100, label: 'Rescheduled' },
                                            { id: 1, value: (1-percentageRescheduled)*100, label: 'Not Rescheduled' },
                                        ],
                                        },
                                    ]}
                                    width={250}
                                    height={300}
                                    slotProps={{
                                        legend: {
                                        direction: 'row',
                                        position: { vertical: 'bottom', horizontal: 'middle' },
                                        
                                        }
                                    }}
                                    />
                            </Stack>
                        </Paper>
                    </div>
                </div>
            </div>
    )
}
