import { getStatistics } from "@/modules/boxCalculations";
import { Paper } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { Koulen } from "next/font/google";
import { useMemo } from "react";
import '../styles/statistics.scss'

export default function Statistics({recordedTimeboxes, timeboxes}) {
    let {averageTimeOverBy, 
        averageTimeStartedOffBy, 
        percentagePredictedStart, 
        percentageCorrectTime, 
        percentageRescheduled, 
        hoursLeftToday} = getStatistics(recordedTimeboxes, timeboxes);
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
                        <p className="statisticsHeading">Average Recordings Are {averageTimeStartedOffBy > 0 ? "Late" : "Early"} By</p>
                        <div className="statisticsBackground">
                            <h1>{averageTimeStartedOffBy > 0 ? averageTimeStartedOffBy.toFixed(2) : -averageTimeStartedOffBy.toFixed(2)}</h1>
                        </div>
                        <p className="statisticsUnit">minutes</p>
                    </Paper>
                    </div>
                    <div class="col">
                    <Paper sx={{backgroundColor: '#875F9A', marginTop: 2 }} className="statPaper" elevation={4} square>
                        <p className="statisticsHeading">Hours Available Today</p>
                        <div className="statisticsBackground">
                            <h1>{hoursLeftToday}</h1>
                        </div>
                        <p className="statisticsUnit">hours</p>
                    </Paper>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <Paper sx={{backgroundColor: '#875F9A', marginTop: 2, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} elevation={4}>
                            <PieChart
                                colors={['black', '#4fd1cf']}
                                margin={{ top: 0, bottom: 25, left: 10, right: 10 }}
                                series={[
                                    {
                                    data: [
                                        { id: 0, value: percentagePredictedStart*100, label: 'Predicted Start' },
                                        { id: 1, value: (1-percentagePredictedStart)*100, label: 'Not Predicted Start' },
                                    ],
                                    },
                                ]}
                                width={250}
                                height={500}
                                slotProps={{
                                    legend: {
                                    direction: 'row',
                                    position: { vertical: 'bottom', horizontal: 'middle' },
                                    
                                    }
                                }}
                                />
                        </Paper>
                    </div>
                    <div class="col">
                        <Paper sx={{backgroundColor: '#875F9A', marginTop: 2, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} elevation={4}>
                            <PieChart
                                colors={['black', '#4fd1cf']}
                                margin={{ top: 0, bottom: 25, left: 10, right: 10 }}
                                series={[
                                    {
                                    data: [
                                        { id: 0, value: percentageCorrectTime*100, label: 'Predicted Time' },
                                        { id: 1, value: (1-percentageCorrectTime)*100, label: 'Not Predicted Time' },
                                    ],
                                    },
                                ]}
                                width={250}
                                height={500}
                                slotProps={{
                                    legend: {
                                    direction: 'row',
                                    position: { vertical: 'bottom', horizontal: 'middle' },
                                    
                                    }
                                }}
                                />
                        </Paper>
                    </div>
                    <div class="col">
                        <Paper sx={{backgroundColor: '#875F9A', marginTop: 2, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'  }} elevation={4}>
                            <PieChart
                                margin={{ top: 0, bottom: 25, left: 10, right: 10 }}
                                colors={['black', '#4fd1cf']}
                                series={[
                                    {
                                    data: [
                                        { id: 0, value: percentageRescheduled*100, label: 'Rescheduled' },
                                        { id: 1, value: (1-percentageRescheduled)*100, label: 'Not Rescheduled' },
                                    ],
                                    },
                                ]}
                                width={250}
                                height={500}
                                slotProps={{
                                    legend: {
                                    direction: 'row',
                                    position: { vertical: 'bottom', horizontal: 'middle' },
                                    
                                    }
                                }}
                                />
                        </Paper>
                    </div>
                </div>
            </div>
    )
}