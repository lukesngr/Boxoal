import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { useRef } from 'react';
import { calculateOverlayHeightForNow } from '../modules/overlayFunctions';


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

  export function setActiveOverlayInterval() { 
    return function (dispatch, getState) {
      const overlayDimensions = getState().overlayDimensions.value;
      const {wakeupTime, boxSizeUnit, boxSizeNumber} = getState().profile.value;
      const newInterval = setInterval(() => 
          { 
              dispatch({type:"activeOverlayHeight/set", payload: calculateOverlayHeightForNow(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions)});
          }
      , 35000);
      dispatch({type: 'activeOverlayInterval/set', payload: newInterval});
  }
};

export function resetActiveOverlayInterval() {
   return function(dispatch, getState) {
    if(getState().activeOverlayInterval.value) {
      clearInterval(getState().activeOverlayInterval.value);
    }
   }
};

// Action creators are generated for each case reducer function
export const { set } = activeOverlayInterval.actions

export default activeOverlayInterval.reducer;