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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit'
import onDayViewReducer from './onDayView'
import daySelectedReducer from './daySelected'
import modalVisibleReducer from './modalVisible'
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'

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

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['timeboxRecording', 'activeOverlayInterval', 'activeOverlayHeight', 'overlayDimensions', 'daySelected', 'profile']
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);