import { 
  thereIsNoRecording,
  generateTimeBoxGrid,
  getProgressWithGoal,
  goToDay,
  calculateXPPoints,
  getMaxNumberOfGoals
} from '../../modules/coreLogic';
import dayjs from 'dayjs';

describe('Recording and Progress Functions', () => {
  describe('thereIsNoRecording', () => {
    test('handles empty recorded boxes', () => {
      expect(thereIsNoRecording([], null, '1/1', '08:00')).toBe(true);
    });

    test('handles daily reoccurring with match', () => {
      const recordedBoxes = [{
        recordedStartTime: new Date('2025-01-15T08:00:00')
      }];
      const reoccuring = { reoccurFrequency: 'daily' };
      expect(thereIsNoRecording(recordedBoxes, reoccuring, '15/1', '08:00')).toBe(false);
    });

    test('handles daily reoccurring without match', () => {
      const recordedBoxes = [{
        recordedStartTime: new Date('2025-01-15T08:00:00')
      }];
      const reoccuring = { reoccurFrequency: 'daily' };
      expect(thereIsNoRecording(recordedBoxes, reoccuring, '16/1', '08:00')).toBe(true);
    });
  });

  describe('getProgressWithGoal', () => {
    test('handles empty timeboxes', () => {
      expect(getProgressWithGoal([])).toBe(100);
    });

    test('handles timeboxes with recordings', () => {
      const timeboxes = [
        { recordedTimeBoxes: [{}], goalPercentage: 0.5 },
        { recordedTimeBoxes: [{}], goalPercentage: 0.3 }
      ];
      expect(getProgressWithGoal(timeboxes)).toBe(100);
    });

    test('handles timeboxes without recordings', () => {
      const timeboxes = [
        { recordedTimeBoxes: [], goalPercentage: 0.5 },
        { recordedTimeBoxes: [], goalPercentage: 0.5 }
      ];
      expect(getProgressWithGoal(timeboxes)).toBe(0);
    });
  });
});

  describe('generateTimeBoxGrid', () => {
    test('handles empty schedule', () => {
      const schedule = { timeboxes: [] };
      const selectedDate = '2025-01-15';
      const result = generateTimeBoxGrid(schedule, selectedDate);
      expect(result).toEqual({});
    });

    test('handles single non-recurring timebox', () => {
      const schedule = {
        timeboxes: [{
          id: 1,
          startTime: '2025-01-15T10:30:00',
          endTime: '2025-01-15T11:30:00',
          title: 'Meeting',
          reoccuring: null
        }]
      };
      const selectedDate = '2025-01-15';
      const result = generateTimeBoxGrid(schedule, selectedDate);
      expect(result).toEqual({
        '15/1': {
          '10:30': schedule.timeboxes[0]
        }
      });
    });

    test('handles multiple timeboxes on same day', () => {
      const schedule = {
        timeboxes: [
          {
            id: 1,
            startTime: '2025-01-15T10:30:00',
            endTime: '2025-01-15T11:30:00',
            title: 'Meeting',
            reoccuring: null
          },
          {
            id: 2,
            startTime: '2025-01-15T14:00:00',
            endTime: '2025-01-15T15:00:00',
            title: 'Lunch',
            reoccuring: null
          }
        ]
      };
      const selectedDate = '2025-01-15';
      const result = generateTimeBoxGrid(schedule, selectedDate);
      expect(result).toEqual({
        '15/1': {
          '10:30': schedule.timeboxes[0],
          '14:00': schedule.timeboxes[1]
        }
      });
    });

    test('handles daily recurring timebox', () => {
      const schedule = {
        timeboxes: [{
          id: 1,
          startTime: '2025-01-15T10:30:00',
          endTime: '2025-01-15T11:30:00',
          title: 'Daily Meeting',
          reoccuring: {
            reoccurFrequency: 'daily',
            startOfDayRange: 1, // Monday
            endOfDayRange: 5    // Friday
          }
        }]
      };
      const selectedDate = '2025-01-15'; // This should be a Wednesday
      const result = generateTimeBoxGrid(schedule, selectedDate);
      
      // Should have entries for Monday through Friday
      expect(Object.keys(result)).toHaveLength(5);
      expect(result).toHaveProperty('13/1'); // Monday
      expect(result).toHaveProperty('14/1'); // Tuesday
      expect(result).toHaveProperty('15/1'); // Wednesday
      expect(result).toHaveProperty('16/1'); // Thursday
      expect(result).toHaveProperty('17/1'); // Friday
      
      // Each day should have the same timebox
      Object.keys(result).forEach(date => {
        expect(result[date]['10:30']).toBe(schedule.timeboxes[0]);
      });
    });

    test('handles recurring timebox with reversed day range', () => {
      const schedule = {
        timeboxes: [{
          id: 1,
          startTime: '2025-01-15T10:30:00',
          endTime: '2025-01-15T11:30:00',
          title: 'Daily Meeting',
          reoccuring: {
            reoccurFrequency: 'daily',
            startOfDayRange: 5, // Friday
            endOfDayRange: 1    // Monday (reversed)
          }
        }]
      };
      const selectedDate = '2025-01-15';
      const result = generateTimeBoxGrid(schedule, selectedDate);
      
      // Should still have entries for Monday through Friday
      expect(Object.keys(result)).toHaveLength(5);
    });

    test('handles timeboxes on different days', () => {
      const schedule = {
        timeboxes: [
          {
            id: 1,
            startTime: '2025-01-15T10:30:00',
            endTime: '2025-01-15T11:30:00',
            title: 'Wednesday Meeting',
            reoccuring: null
          },
          {
            id: 2,
            startTime: '2025-01-16T14:00:00',
            endTime: '2025-01-16T15:00:00',
            title: 'Thursday Lunch',
            reoccuring: null
          }
        ]
      };
      const selectedDate = '2025-01-15';
      const result = generateTimeBoxGrid(schedule, selectedDate);
      expect(result).toEqual({
        '15/1': {
          '10:30': schedule.timeboxes[0]
        },
        '16/1': {
          '14:00': schedule.timeboxes[1]
        }
      });
    });
  });

  describe('goToDay', () => {
    let mockDispatch;

    beforeEach(() => {
      mockDispatch = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('moves left from day 3 to day 2', () => {
      goToDay(mockDispatch, 3, 'left');
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'daySelected/set',
        payload: 2
      });
    });

    test('moves right from day 3 to day 4', () => {
      goToDay(mockDispatch, 3, 'right');
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'daySelected/set',
        payload: 4
      });
    });

    test('wraps from day 0 to day 6 when moving left', () => {
      goToDay(mockDispatch, 0, 'left');
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'daySelected/set',
        payload: 6
      });
    });

    test('wraps from day 6 to day 0 when moving right', () => {
      goToDay(mockDispatch, 6, 'right');
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'daySelected/set',
        payload: 0
      });
    });

    test('handles edge case: moving left from day 1', () => {
      goToDay(mockDispatch, 1, 'left');
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'daySelected/set',
        payload: 0
      });
    });

    test('handles edge case: moving right from day 5', () => {
      goToDay(mockDispatch, 5, 'right');
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'daySelected/set',
        payload: 6
      });
    });

    test('does not dispatch for invalid direction', () => {
      goToDay(mockDispatch, 3, 'invalid');
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  describe('getMaxNumberOfGoals', () => {
    test('returns 1 for 0 goals completed', () => {
      expect(getMaxNumberOfGoals(0)).toBe(1);
    });

    test('returns 2 for 1-5 goals completed', () => {
      expect(getMaxNumberOfGoals(1)).toBe(2);
      expect(getMaxNumberOfGoals(3)).toBe(2);
      expect(getMaxNumberOfGoals(5)).toBe(2);
    });

    test('returns 3 for 6-11 goals completed', () => {
      expect(getMaxNumberOfGoals(6)).toBe(3);
      expect(getMaxNumberOfGoals(9)).toBe(3);
      expect(getMaxNumberOfGoals(11)).toBe(3);
    });

    test('returns 4 for 12-23 goals completed', () => {
      expect(getMaxNumberOfGoals(12)).toBe(4);
      expect(getMaxNumberOfGoals(18)).toBe(4);
      expect(getMaxNumberOfGoals(23)).toBe(4);
    });

    test('returns large number for 24+ goals completed', () => {
      expect(getMaxNumberOfGoals(24)).toBe(100000000000);
      expect(getMaxNumberOfGoals(50)).toBe(100000000000);
      expect(getMaxNumberOfGoals(100)).toBe(100000000000);
    });

    test('handles boundary conditions', () => {
      expect(getMaxNumberOfGoals(5)).toBe(2);  // Upper bound of range 1-5
      expect(getMaxNumberOfGoals(6)).toBe(3);  // Lower bound of range 6-11
      expect(getMaxNumberOfGoals(11)).toBe(3); // Upper bound of range 6-11
      expect(getMaxNumberOfGoals(12)).toBe(4); // Lower bound of range 12-23
      expect(getMaxNumberOfGoals(23)).toBe(4); // Upper bound of range 12-23
      expect(getMaxNumberOfGoals(24)).toBe(100000000000); // Lower bound of 24+
    });
  });

describe('XP and Level Functions', () => {
  describe('calculateXPPoints', () => {
    const timeboxData = {
      startTime: '2024-01-15T08:00:00',
      endTime: '2024-01-15T09:00:00'
    };

    test('handles perfect timing', () => {
      const recordedStartTime = new Date('2024-01-15T08:00:00');
      const recordedEndTime = new Date('2024-01-15T09:00:00');
      const result = calculateXPPoints(timeboxData, recordedStartTime, recordedEndTime);
      expect(result).toBe(2);
    });

    test('makes sure not 0', () => {
      const recordedStartTime = new Date('2024-01-15T01:00:00');
      const recordedEndTime = new Date('2024-05-21T21:00:00');
      const result = calculateXPPoints(timeboxData, recordedStartTime, recordedEndTime);
      expect(result).toBeGreaterThan(0);
    });
  });
});