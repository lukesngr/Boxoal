import { useState, useEffect, useRef } from 'react';
import { calculateOverlayHeightForNow } from '../modules/overlayFunctions';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { resetActiveOverlayInterval, setActiveOverlayInterval } from '../redux/activeOverlayInterval';
import dayjs from 'dayjs';

export default function useActiveOverlay() {

    const timeboxRecording = useSelector(state => state.timeboxRecording.value);
    const overlayDimensions = useSelector(state => state.overlayDimensions.value);
    const profile = useSelector(state => state.profile.value);
    const dispatch = useDispatch();

    useEffect(() => {
        if(timeboxRecording.timeboxID == -1) {
            dispatch({type:"activeOverlayHeight/set", payload: calculateOverlayHeightForNow(profile.wakeupTime, profile.boxSizeUnit, profile.boxSizeNumber, overlayDimensions)});
            dispatch(setActiveOverlayInterval());
        }else if(dayjs(timeboxRecording.timeboxDate).isBefore(dayjs(), 'date')){
            dispatch({type:"activeOverlayHeight/set", payload: 0});
            dispatch(resetActiveOverlayInterval());
        }else{
            dispatch(resetActiveOverlayInterval());
        }
        
        return () => { dispatch(resetActiveOverlayInterval()); };
    }, [overlayDimensions, timeboxRecording])
    return;
}