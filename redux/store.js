import { configureStore } from '@reduxjs/toolkit'
import profileReducer from './profile'
import overlayDimensionsReducer from './overlayDimensions'
import activeOverlayHeightReducer from './activeOverlayHeight'
import activeOverlayIntervalReducer from './activeOverlayInterval'
import scheduleDataReducer from './scheduleData'
import timeboxGridReducer from './timeboxGrid'
import timeboxRecordingReducer from './timeboxRecording'
import selectedDateReducer from './selectedDate'
import { combineReducers } from '@reduxjs/toolkit'
import daySelectedReducer from './daySelected'
import expandedReducer from './expanded'
import alertReducer from './alert'
import goalStatisticsReducer from './goalStatistics'
import settingsDialogOpenReducer from './settingsDialogOpen'

const rootReducer = combineReducers({
  profile: profileReducer,
  overlayDimensions: overlayDimensionsReducer,
  activeOverlayHeight: activeOverlayHeightReducer,
  activeOverlayInterval: activeOverlayIntervalReducer,
  scheduleData: scheduleDataReducer,
  timeboxGrid: timeboxGridReducer,
  timeboxRecording: timeboxRecordingReducer,
  selectedDate: selectedDateReducer,
  daySelected: daySelectedReducer,
  expanded: expandedReducer,
  alert: alertReducer,
  goalStatistics: goalStatisticsReducer,
  settingsDialogOpen: settingsDialogOpenReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(),
});
