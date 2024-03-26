import { useState, useEffect, useRef } from 'react';
import { calculateOverlayHeightForNow } from '@/modules/coreLogic';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

export default function useActiveOverlay(schedule) {

    const activeOverlayInterval = useRef(null);
    const activeOverlayResetTime = 5000;
    const overlayDimensions = useSelector(state => state.overlayDimensions.value);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({type:"activeOverlayHeight/set", payload: calculateOverlayHeightForNow(schedule.wakeupTime, schedule.boxSizeUnit, schedule.boxSizeNumber, overlayDimensions)});
        dispatch({type:"activeOverlayInterval/set"});
        
        return () => { dispatch({type:"activeOverlayInterval/clear"}); };
    }, [overlayDimensions])

    function pauseActiveOverlay() { clearInterval(activeOverlayInterval.current); }

    function resumeActiveOverlay() { 
        activeOverlayInterval.current = setInterval(() => 
        { 
            dispatch({type:"activeOverlayHeight/set", payload: calculateOverlayHeightForNow(schedule.wakeupTime, schedule.boxSizeUnit, schedule.boxSizeNumber, overlayDimensions)});
        }, activeOverlayResetTime);
    }

    return [pauseActiveOverlay, resumeActiveOverlay];
}