import React from 'react';
import '../../styles/timelines.scss';

export default function TimelineRecording({timeboxStart, timeboxEnd, recordingStart, recordingEnd}) {
  // Convert dates to timestamps for easier calculation
  const timeboxStartTime = new Date(timeboxStart);
  const timeboxEndTime = new Date(timeboxEnd);
  const recordingStartTime = new Date(recordingStart);
  const recordingEndTime = new Date(recordingEnd);
  const hoursConversionDivisor = 3600000;
  const minuteConversionDivisor = 60000;
  let totalDurationInEpoch = Math.max(recordingEndTime, timeboxEndTime) - Math.min(recordingStartTime, timeboxStartTime);
  let totalDuration = '0'; 

  if((totalDurationInEpoch / minuteConversionDivisor) >= 60) {
    totalDuration = `${Math.round(totalDurationInEpoch / hoursConversionDivisor)}hr`;
  }else{
    totalDuration = `${Math.round(totalDurationInEpoch / minuteConversionDivisor)}min`;
  }
  
  let recordingBlockWidth = Math.round(((recordingEndTime - recordingStartTime) / totalDurationInEpoch)*100);
  let timeboxBlockWidth = Math.round(((timeboxEndTime - timeboxStartTime) / totalDurationInEpoch)*100);
  console.log(recordingBlockWidth, timeboxBlockWidth);

  return (
    <div className="timeline-container">
      <div className="timelineBar">
          <div 
            className="timelineRecordingBar"
            style={{ width: `${recordingBlockWidth}%` }}
          />
        
          <div 
            className="timelineTimeboxBar"
            style={{ width: `${timeboxBlockWidth}%` }}
          />
      </div>
      
      {/* Duration label */}
      <div className="duration-label">
        {totalDuration}
      </div>
    </div>
  )
}
