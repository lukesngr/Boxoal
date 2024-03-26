import { useState, useEffect, useRef } from 'react';
import { calculateOverlayHeightForNow } from '@/modules/coreLogic';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

export default function useActiveOverlay(schedule) {

    const overlayDimensions = useSelector(state => state.overlayDimensions.value);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({type:"activeOverlayHeight/set", payload: calculateOverlayHeightForNow(schedule.wakeupTime, schedule.boxSizeUnit, schedule.boxSizeNumber, overlayDimensions)});
        dispatch({type:"activeOverlayInterval/set"});
        
        return () => { dispatch({type:"activeOverlayInterval/clear"}); };
    }, [overlayDimensions])

    return;
}