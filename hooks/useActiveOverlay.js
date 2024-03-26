import { useState, useEffect, useRef } from 'react';
import { calculateOverlayHeightForNow } from '@/modules/coreLogic';
import { useDispatch } from 'react-redux';

export default function useActiveOverlay(schedule, overlayDimensions) {

    const [activeOverlayHeight, setActiveOverlayHeight] = useState(0);
    const activeOverlayInterval = useRef(null);
    const activeOverlayResetTime = 5000;

    useEffect(() => {
        setActiveOverlayHeight(calculateOverlayHeightForNow(schedule.wakeupTime, schedule.boxSizeUnit, schedule.boxSizeNumber, overlayDimensions));
        activeOverlayInterval.current = setInterval(() => { setActiveOverlayHeight(calculateOverlayHeightForNow(schedule.wakeupTime, schedule.boxSizeUnit, schedule.boxSizeNumber, overlayDimensions))}, activeOverlayResetTime)
        
        return () => { clearInterval(activeOverlayInterval.current); };
    }, [overlayDimensions])

    function pauseActiveOverlay() { clearInterval(activeOverlayInterval.current); }

    function resumeActiveOverlay() { 
        activeOverlayInterval.current = setInterval(() => {setActiveOverlayHeight(calculateOverlayHeightForNow(schedule.wakeupTime, schedule.boxSizeUnit, schedule.boxSizeNumber, overlayDimensions))}, activeOverlayResetTime);
    }

    return [activeOverlayHeight, pauseActiveOverlay, resumeActiveOverlay];
}