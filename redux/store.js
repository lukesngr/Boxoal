import { configureStore } from '@reduxjs/toolkit'
import profileReducer from './profile'
import overlayDimensionsReducer from './overlayDimensions'
import activeOverlayHeightReducer from './activeOverlayHeight'
import activeOverlayIntervalReducer from './activeOverlayInterval'
import scheduleDataReducer from './scheduleData'
import timeboxGridReducer from './timeboxGrid'
import timeboxRecordingReducer from './timeboxRecording'
import timeboxDialogReducer from './timeboxDialog'
import selectedDateReducer from './selectedDate'
import { combineReducers } from '@reduxjs/toolkit'
import onDayViewReducer from './onDayView'
import daySelectedReducer from './daySelected'
import modalVisibleReducer from './modalVisible'


const rootReducer = combineReducers({
  profile: profileReducer,
  overlayDimensions: overlayDimensionsReducer,
  activeOverlayHeight: activeOverlayHeightReducer,
  activeOverlayInterval: activeOverlayIntervalReducer,
  scheduleData: scheduleDataReducer,
  timeboxGrid: timeboxGridReducer,
  timeboxRecording: timeboxRecordingReducer,
  timeboxDialog: timeboxDialogReducer,
  selectedDate: selectedDateReducer,
  onDayView: onDayViewReducer,
  daySelected: daySelectedReducer,
  modalVisible: modalVisibleReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(),
});
