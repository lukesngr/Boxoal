import React from 'react';
import { render, fireEvent, act, screen } from '@testing-library/react';
import axios from 'axios';
import TimeBox from '@/components/timebox/Timebox';
import { TimeboxContextProvider } from '@/components/timebox/TimeboxContext';
import '@testing-library/jest-dom'

jest.mock('axios', () => ({
    post: jest.fn(() => Promise.resolve({ data: {}})),
}));
  
beforeEach(() => {
    jest.clearAllMocks();
});

describe('TimeBox component', () => {

  //there's three different states of a timebox, gonna test them all now

  test('transitions to opening timebox form when add timebox clicked', () => {
    const mockProps = {
      schedule: { id: 1, wakeupTime: '07:00', boxSizeNumber: 1, boxSizeUnit: 'hour', goals: [], timeboxes: [], recordedTimeboxes: []},
      time: '12:00', date: '2024-01-23', active: true, dayName: 'Monday',
      data: undefined,
      overlayFuncs: [jest.fn(), jest.fn()],
    };
    
    render(<TimeboxContextProvider><div id="portalRoot"></div><TimeBox {...mockProps} /></TimeboxContextProvider>);

    act(() => {fireEvent.click(screen.getByTestId('addTimeBoxButton'));});

    expect(screen.getByTestId('createTimeboxForm')).toBeInTheDocument();
    
  });

  test('when timebox has data, timebox pops up', () => {
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
    
  });
});