import React from 'react';
import { render, fireEvent, act, screen } from '@testing-library/react';
import axios from 'axios';
import NormalTimeBox from '@/components/timebox/NormalTimeBox';
import '@testing-library/jest-dom'

jest.mock('axios', () => ({
    post: jest.fn(() => Promise.resolve({ data: {}})),
}));
  
beforeEach(() => {
    jest.clearAllMocks();
});

describe('NormalTimeBox component', () => {

  //there's three different states of a timebox, gonna test them all now

  test('render with no buttons', () => {
    const mockProps = {
      schedule: { id: 1, wakeupTime: '07:00', boxSizeNumber: 1, boxSizeUnit: 'hour', goals: [], timeboxes: [], recordedTimeboxes: []},
      time: '12:00', date: '2024-01-23', active: true, dayName: 'Monday',
      data: undefined,
      overlayFuncs: [function pauseActiveOverlay() {}, function resumeActiveOverlay() {}],
    };
    
    render(<NormalTimeBox {...mockProps}></NormalTimeBox>);

    expect(screen.getByTestId('startRecording')).not.toBeInTheDocument();
    expect(screen.getByTestId('stopRecording')).not.toBeInTheDocument();
    
  });

  /*test('when timebox has data, timebox pops up', () => {
    const mockProps = {
      schedule: { id: 1, wakeupTime: '07:00', boxSizeNumber: 1, boxSizeUnit: 'hour', goals: [], timeboxes: [], recordedTimeboxes: []},
      time: '12:00', date: '2024-01-23', active: true, dayName: 'Monday',
      data: {
        id: 1,
        numberOfBoxes: 1,
        color: '#123456',
        title: 'Test Time Box',
        recordedTimeBoxes: [],
        reoccuring: false,
      },
      overlayFuncs: [jest.fn(), jest.fn()],
    };

    render(<TimeboxContextProvider><div id="portalRoot"></div><TimeBox {...mockProps} /></TimeboxContextProvider>);

    expect(screen.getByTestId('normalTimeBox')).toBeInTheDocument();
    
  });*/
});