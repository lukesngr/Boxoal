import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export default function useOverlayDimensions(gridContainerRef, headerContainerRef, timeboxColumnRef) {
    const dispatch = useDispatch();
    const expanded = useSelector(state => state.expanded.value);

    function calculateOverlayDimensions() {
        if (gridContainerRef.current && headerContainerRef.current && timeboxColumnRef.current) { //if ref working
            const gridHeight = gridContainerRef.current.offsetHeight; //get height of grid
            const headerHeight = headerContainerRef.current.offsetHeight; //get height of headers

            const headerWidth = headerContainerRef.current.offsetWidth; //get width of headers
            const overlayHeight = gridHeight - headerHeight; //overlay is under headers but goes till end of grid
            const timeboxHeight = timeboxColumnRef.current.getBoundingClientRect().height; //decimal for a bit more accuracy as this for active overlay
            const timeboxColWidth = timeboxColumnRef.current.getBoundingClientRect().width; //decimal for a bit more accuracy as this for active overlay

            dispatch({type: 'overlayDimensions/set', payload: {headerWidth, overlayHeight, timeboxHeight, headerHeight, timeboxColWidth}});
        }
    };

    //when page first loads calculate overlay dimensions
    useEffect(() => {
        calculateOverlayDimensions();
        window.addEventListener('resize', calculateOverlayDimensions); //if resized calculate overlay dimensions
    
        return () => {
            window.removeEventListener('resize', calculateOverlayDimensions);
        };
    }, []);
    //if sidebar changes recalculate overlay dimensions
    useEffect(() => {
        setTimeout(calculateOverlayDimensions, 600);
    }, [expanded]);

    return;
}