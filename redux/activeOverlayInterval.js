import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { useRef } from 'react';

export const activeOverlayInterval = createSlice({
  name: 'activeOverlayInterval',
  initialState: {
    value: useRef(null),
  },
  reducers: {},
})

function set() {
  return createAsyncThunk('activeOverlayInterval/set', 
  async function(arg, {dispatch, getState}) {
    const overlayDimensions = getState().overlayDimensions.value;
    const {wakeupTime, boxSizeUnit, boxSizeNumber} = getState().scheduleEssentials.value;
    getState().activeOverlayInterval.value.current = setInterval(() => 
        { 
            dispatch({type:"activeOverlayHeight/set", payload: calculateOverlayHeightForNow(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions)});
        }
    , 5000);
  
  })
}

function clear() {
  return createAsyncThunk('activeOverlayInterval/clear', 
  async function(arg, {dispatch, getState}) {
    clearInterval(getState().activeOverlayInterval.value.current);
  })
}

// Action creators are generated for each case reducer function
export const { set, clear } = activeOverlayInterval.actions

export default activeOverlayInterval.reducer