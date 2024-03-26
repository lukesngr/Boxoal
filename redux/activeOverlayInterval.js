import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { useRef } from 'react';


  export const activeOverlayInterval = createSlice({
    name: 'activeOverlayInterval',
    initialState: {
      value: null,
    },
    reducers: {
      set: (state, action) => {
        state.value = action.payload;
      }
    },
  })

  export const setTimer = () => (arg, {dispatch, getState}) => {
    const overlayDimensions = getState().overlayDimensions.value;
    const {wakeupTime, boxSizeUnit, boxSizeNumber} = getState().scheduleEssentials.value;
    const newInterval = useRef(null);
    newInterval.current = setInterval(() => 
        { 
            dispatch({type:"activeOverlayHeight/set", payload: calculateOverlayHeightForNow(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions)});
        }
    , 5000);
    dispatch({type: 'activeOverlayInterval/set', payload: newInterval});
};

export const resetTimer = (arg, {dispatch, getState}) => {
    if(getState().activeOverlayInterval.value.current) {
      clearInterval(getState().activeOverlayInterval.value.current);
    }
};

// Action creators are generated for each case reducer function
export const { set } = activeOverlayInterval.actions

export default activeOverlayInterval.reducer;