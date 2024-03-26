import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const setActiveOverlayInterval = createAsyncThunk(
  'activeOverlayInterval/set',
  async (_, { dispatch, getState }) => {
    const overlayDimensions = getState().overlayDimensions.value;
    const { wakeupTime, boxSizeUnit, boxSizeNumber } = getState().scheduleEssentials.value;
    const intervalId = setInterval(() => {
      dispatch({ type: 'activeOverlayHeight/set', payload: calculateOverlayHeightForNow(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions) });
    }, 5000);
    return intervalId;
  }
);

export const clearActiveOverlayInterval = createAsyncThunk(
  'activeOverlayInterval/clear',
  async (_, { getState }) => {
    const intervalId = getState().activeOverlayInterval.value;
    clearInterval(intervalId);
    return intervalId;
  }
);

export const activeOverlayIntervalSlice = createSlice({
  name: 'activeOverlayInterval',
  initialState: {
    value: null, // No need to use useRef here
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setActiveOverlayInterval.fulfilled, (state, action) => {
        state.value = action.payload;
      })
      .addCase(clearActiveOverlayInterval.fulfilled, (state, action) => {
        state.value = null;
      });
  },
});

// Action creators are generated for each case reducer function
export const activeOverlayIntervalActions = activeOverlayIntervalSlice.actions;

export default activeOverlayIntervalSlice.reducer;