import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { styles } from "../styles/styles";

export default function useOverlayDimensions(headerHeight, headerWidth, onDayView) {
    const dispatch = useDispatch();
    const {boxSizeUnit, boxSizeNumber, wakeupTime} = useSelector(state => state.profile.value);
    let timeboxHeight = styles.normalTimeboxHeight;
    
    if(onDayView) {
        timeboxHeight = styles.enlargedTimeboxHeight;
    }

    function calculateOverlayDimensions() {
        if (headerHeight != 0 && headerWidth != 0) {
            
            let overlayHeight = 0;
            if(boxSizeUnit == 'min') {
                overlayHeight = Math.floor(24*60 / boxSizeNumber) * timeboxHeight;
            }else if(boxSizeUnit == 'hr') {
                overlayHeight = Math.floor(24 / boxSizeNumber) * timeboxHeight;
            }

            dispatch({type: 'overlayDimensions/set', payload: {headerWidth: headerWidth, overlayHeight: overlayHeight, timeboxHeight: timeboxHeight, headerHeight: headerHeight}});
        }
        
    };

    //when page first loads calculate overlay dimensions
    useEffect(() => {
        calculateOverlayDimensions();
    }, []);

    useEffect(() => {
        calculateOverlayDimensions();
    }, [headerHeight, headerWidth]);

    return;
}