import { useState, useEffect, useRef } from 'react';
import { calculateOverlayHeightForNow } from '@/modules/coreLogic';
import { useDispatch } from 'react-redux';

export default function useActiveOverlay(schedule, overlayDimensions) {

    const [activeOverlayHeight, setActiveOverlayHeight] = useState(0);
    const activeOverlayInterval = useRef(null);
    const dispatch = useDispatch();
    const activeOverlayResetTime = 5000;

    useEffect(() => {
        dispatch({type: "activeOverlay/set", payload: {
            activeOverlayHeight: calculateOverlayHeightForNow(schedule.wakeupTime, schedule.boxSizeUnit, schedule.boxSizeNumber, overlayDimensions),
            activeOverlayInterval: setInterval(() => { setActiveOverlayHeight(calculateOverlayHeightForNow(schedule.wakeupTime, schedule.boxSizeUnit, schedule.boxSizeNumber, overlayDimensions))}, activeOverlayResetTime)
        }});
        
        return () => { dispatch({type: "activeOverlay/reset"})};
    }, [overlayDimensions])

    function pauseActiveOverlay() { clearInterval(activeOverlayInterval.current); }

    function resumeActiveOverlay() { 
        activeOverlayInterval.current = setInterval(() => {setActiveOverlayHeight(calculateOverlayHeightForNow(schedule.wakeupTime, schedule.boxSizeUnit, schedule.boxSizeNumber, overlayDimensions))}, activeOverlayResetTime);
    }

    return [activeOverlayHeight, pauseActiveOverlay, resumeActiveOverlay];
}