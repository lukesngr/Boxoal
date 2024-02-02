import { useEffect } from 'react';

export function OverlayLogic(props) {
    
    const { gridContainerRef, headerContainerRef, timeboxColumnRef, setOverlayDimensions, selectedSchedule, expanded } = props;

    function calculateOverlayDimensions() {
        if (gridContainerRef.current && headerContainerRef.current && timeboxColumnRef.current) { //if ref working
            const gridHeight = gridContainerRef.current.offsetHeight; //get height of grid
            const headerHeight = headerContainerRef.current.offsetHeight; //get height of headers

            const headerWidth = headerContainerRef.current.offsetWidth; //get width of headers
            const overlayHeight = gridHeight - headerHeight; //overlay is under headers but goes till end of grid
            const timeboxHeight = timeboxColumnRef.current.getBoundingClientRect().height; //decimal for a bit more accuracy as this for active overlay

            setOverlayDimensions([headerWidth, overlayHeight, timeboxHeight]);
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

    //if schedule changes recalculate overlay dimensions
    useEffect(() => {
        calculateOverlayDimensions();
    }, [selectedSchedule]);
    //if sidebar changes recalculate overlay dimensions
    useEffect(() => {
        setOverlayDimensions([0, 0, 0]);
        setTimeout(calculateOverlayDimensions, 600);
    }, [expanded]);
    
    return <></>
}