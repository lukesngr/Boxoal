
import dayjs from 'dayjs';
import { getStatistics, findSmallestTimeBoxLengthInSpace, getPercentageOfBoxSizeFilled, calculateMaxNumberOfBoxesAfterTimeIfEmpty, calculateMaxNumberOfBoxes, calculateBoxesBetweenTwoTimes, calculateRemainderTimeBetweenTwoTimes, addBoxesToTime, getHeightForBoxes, getBoxesInsideTimeboxSpace, getMarginFromTopOfTimebox } from '../../modules/boxCalculations';

// Mock useSelector for getStatistics tests
jest.mock('react-redux', () => ({
  useSelector: jest.fn()
}));

const mockUseSelector = require('react-redux').useSelector;


describe('Box Calculation Functions', () => {
  describe('calculateMaxNumberOfBoxesAfterTimeIfEmpty', () => {
    test('handles minutes with time ahead of wakeup', () => {
      const result = calculateMaxNumberOfBoxesAfterTimeIfEmpty('min', 15, [12, 45], [8, 30]);
      expect(result).toBe(79);
    });

    test('handles minutes with time behind wakeup', () => {
      const result = calculateMaxNumberOfBoxesAfterTimeIfEmpty('min', 15, [7, 45], [8, 30]);
      expect(result).toBe(3);
    });

    test('handles hours with time ahead of wakeup', () => {
      const result = calculateMaxNumberOfBoxesAfterTimeIfEmpty('hr', 1, [12, 0], [8, 0]);
      expect(result).toBe(20);
    });

    test('handles hours with time behind wakeup', () => {
      const result = calculateMaxNumberOfBoxesAfterTimeIfEmpty('hr', 1, [7, 0], [8, 0]);
      expect(result).toBe(1);
    });

    test('handles edge case with non-divisible minutes', () => {
      const result = calculateMaxNumberOfBoxesAfterTimeIfEmpty('min', 15, [12, 47], [8, 30]);
      expect(result).toBe(79);
    });
  });

  describe('calculateMaxNumberOfBoxes', () => {
    test('handles empty schedule', () => {
      const result = calculateMaxNumberOfBoxes('08:30', 'min', 15, {}, '12:45', '1/1');
      expect(result).toBe(79);
    });

    test('handles schedule with one future timebox', () => {
      const timeboxGrid = {
        '1/1': {
          '14:00': { startTime: '2025-01-01T14:00:00' }
        }
      };
      const result = calculateMaxNumberOfBoxes('08:30', 'min', 15, timeboxGrid, '12:45', '1/1');
      expect(result).toBe(5);
    });

    test('handles schedule with multiple timeboxes', () => {
      const timeboxGrid = {
        '1/1': {
          '14:00': { startTime: '2025-01-01T14:00:00' },
          '16:00': { startTime: '2025-01-01T16:00:00' }
        }
      };
      const result = calculateMaxNumberOfBoxes('08:30', 'min', 15, timeboxGrid, '12:45', '1/1');
      expect(result).toBe(5);
    });

    test('handles inbetween case with multiple timeboxes', () => {
      const timeboxGrid = {
        '1/1': {
          '14:00': { startTime: '2025-01-01T14:00:00' },
          '16:00': { startTime: '2025-01-01T16:00:00' }
        }
      };
      const result = calculateMaxNumberOfBoxes('08:30', 'min', 15, timeboxGrid, '14:45', '1/1');
      expect(result).toBe(5); // Should return boxes until next timebox at 16:00
    });
  });

  describe('calculateBoxesBetweenTwoTimes', () => {
    describe('minute-based calculations', () => {
      const boxSizeUnit = 'min';

      test('calculates boxes for same hour different minutes', () => {
        const time1 = dayjs('2024-01-15T10:00:00');
        const time2 = dayjs('2024-01-15T10:30:00');
        expect(calculateBoxesBetweenTwoTimes(time1, time2, boxSizeUnit, 15)).toBe(2);
      });

      test('calculates boxes across hour boundary', () => {
        const time1 = dayjs('2024-01-15T10:45:00');
        const time2 = dayjs('2024-01-15T11:15:00');
        expect(calculateBoxesBetweenTwoTimes(time1, time2, boxSizeUnit, 15)).toBe(2);
      });

      test('handles non-aligned start time', () => {
        const time1 = dayjs('2024-01-15T10:05:00');
        const time2 = dayjs('2024-01-15T10:30:00');
        // Should floor the result - partial boxes at start aren't counted
        expect(calculateBoxesBetweenTwoTimes(time1, time2, boxSizeUnit, 15)).toBe(1);
      });

      test('handles non-aligned end time', () => {
        const time1 = dayjs('2024-01-15T10:00:00');
        const time2 = dayjs('2024-01-15T10:37:00');
        // Should floor the result - partial boxes at end aren't counted
        expect(calculateBoxesBetweenTwoTimes(time1, time2, boxSizeUnit, 15)).toBe(2);
      });

      test('handles multiple hours difference', () => {
        const time1 = dayjs('2024-01-15T10:00:00');
        const time2 = dayjs('2024-01-15T12:00:00');
        expect(calculateBoxesBetweenTwoTimes(time1, time2, boxSizeUnit, 15)).toBe(8);
      });

      test('handles reversed times', () => {
        const time1 = dayjs('2024-01-15T12:00:00');
        const time2 = dayjs('2024-01-15T10:00:00');
        expect(calculateBoxesBetweenTwoTimes(time1, time2, boxSizeUnit, 15)).toBe(8);
      });

      test('handles different box sizes', () => {
        const time1 = dayjs('2024-01-15T10:00:00');
        const time2 = dayjs('2024-01-15T11:00:00');
        expect(calculateBoxesBetweenTwoTimes(time1, time2, boxSizeUnit, 30)).toBe(2);
      });

      test('handles exact box size alignments', () => {
        const time1 = dayjs('2024-01-15T10:00:00');
        const time2 = dayjs('2024-01-15T10:45:00');
        expect(calculateBoxesBetweenTwoTimes(time1, time2, boxSizeUnit, 15)).toBe(3);
      });
    });

    describe('hour-based calculations', () => {
      const boxSizeUnit = 'hr';

      test('calculates full hours', () => {
        const time1 = dayjs('2024-01-15T10:00:00');
        const time2 = dayjs('2024-01-15T12:00:00');
        expect(calculateBoxesBetweenTwoTimes(time1, time2, boxSizeUnit, 1)).toBe(2);
      });

      test('handles partial hours', () => {
        const time1 = dayjs('2024-01-15T10:30:00');
        const time2 = dayjs('2024-01-15T12:45:00');
        // Should only count complete hours
        expect(calculateBoxesBetweenTwoTimes(time1, time2, boxSizeUnit, 1)).toBe(2);
      });

      test('handles 2-hour box sizes', () => {
        const time1 = dayjs('2024-01-15T10:00:00');
        const time2 = dayjs('2024-01-15T14:00:00');
        expect(calculateBoxesBetweenTwoTimes(time1, time2, boxSizeUnit, 2)).toBe(2);
      });

      test('handles reversed times with hours', () => {
        const time1 = dayjs('2024-01-15T14:00:00');
        const time2 = dayjs('2024-01-15T10:00:00');
        expect(calculateBoxesBetweenTwoTimes(time1, time2, boxSizeUnit, 1)).toBe(4);
      });

      test('handles non-divisible hour ranges', () => {
        const time1 = dayjs('2024-01-15T10:00:00');
        const time2 = dayjs('2024-01-15T13:00:00');
        expect(calculateBoxesBetweenTwoTimes(time1, time2, boxSizeUnit, 2)).toBe(1);
      });
    });

    describe('edge cases', () => {
      test('handles same time', () => {
        const time = dayjs('2024-01-15T10:00:00');
        expect(calculateBoxesBetweenTwoTimes(time, time, 'min', 15)).toBe(0);
        expect(calculateBoxesBetweenTwoTimes(time, time, 'hr', 1)).toBe(0);
      });

      test('handles minute difference but not enough for a box', () => {
        const time1 = dayjs('2024-01-15T10:00:00');
        const time2 = dayjs('2024-01-15T10:14:00');
        expect(calculateBoxesBetweenTwoTimes(time1, time2, 'min', 15)).toBe(0);
      });

      test('handles exactly one box size difference', () => {
        const time1 = dayjs('2024-01-15T10:00:00');
        const time2 = dayjs('2024-01-15T10:15:00');
        expect(calculateBoxesBetweenTwoTimes(time1, time2, 'min', 15)).toBe(1);
      });

      test('handles midnight boundary', () => {
        const time1 = dayjs('2024-01-15T23:45:00');
        const time2 = dayjs('2024-01-16T00:15:00');
        // Note: This might need adjustment based on how you want to handle day boundaries
        expect(calculateBoxesBetweenTwoTimes(time1, time2, 'min', 15)).toBe(2);
      });

      test('handles very large time differences', () => {
        const time1 = dayjs('2024-01-15T00:00:00');
        const time2 = dayjs('2024-01-15T23:59:00');
        expect(calculateBoxesBetweenTwoTimes(time1, time2, 'hr', 1)).toBe(23);
      });
    });

  });

  describe('calculateRemainderTimeBetweenTwoTimes', () => {
    describe('minute-based calculations', () => {
      const boxSizeUnit = 'min';

      test('calculates boxes for same hour different minutes', () => {
        const time1 = dayjs('2024-01-15T10:00:00');
        const time2 = dayjs('2024-01-15T10:10:00');
        expect(calculateRemainderTimeBetweenTwoTimes(time1, time2, boxSizeUnit, 15)).toBe(10);
      });

      test('calculates boxes across hour boundary', () => {
        const time1 = dayjs('2024-01-15T10:45:00');
        const time2 = dayjs('2024-01-15T11:20:00');
        expect(calculateRemainderTimeBetweenTwoTimes(time1, time2, boxSizeUnit, 15)).toBe(5);
      });

      test('handles multiple hours difference', () => {
        const time1 = dayjs('2024-01-15T10:00:00');
        const time2 = dayjs('2024-01-15T10:37:00');
        expect(calculateRemainderTimeBetweenTwoTimes(time1, time2, boxSizeUnit, 30)).toBe(7);
      });

      test('handles reversed times', () => {
        const time1 = dayjs('2024-01-15T12:19:00');
        const time2 = dayjs('2024-01-15T10:00:00');
        expect(calculateRemainderTimeBetweenTwoTimes(time1, time2, boxSizeUnit, 15)).toBe(-4);
      });

      test('handles different box sizes', () => {
        const time1 = dayjs('2024-01-15T10:00:00');
        const time2 = dayjs('2024-01-15T11:00:30');
        expect(calculateRemainderTimeBetweenTwoTimes(time1, time2, boxSizeUnit, 30)).toBe(1);
      });
    });

    describe('hour-based calculations', () => {
      const boxSizeUnit = 'hr';

      test('calculates full hours', () => {
        const time1 = dayjs('2024-01-15T10:00:00');
        const time2 = dayjs('2024-01-15T12:30:00');
        expect(calculateRemainderTimeBetweenTwoTimes(time1, time2, boxSizeUnit, 1)).toBe(0.5);
      });

      test('handles partial hours', () => {
        const time1 = dayjs('2024-01-15T10:30:00');
        const time2 = dayjs('2024-01-15T12:45:00');
        // Should only count complete hours
        expect(calculateRemainderTimeBetweenTwoTimes(time1, time2, boxSizeUnit, 1)).toBe(0.25);
      });

      test('handles 2-hour box sizes', () => {
        const time1 = dayjs('2024-01-15T10:00:00');
        const time2 = dayjs('2024-01-15T15:00:00');
        expect(calculateRemainderTimeBetweenTwoTimes(time1, time2, boxSizeUnit, 2)).toBe(1);
      });

      test('handles reversed times with hours', () => {
        const time1 = dayjs('2024-01-15T14:50:00');
        const time2 = dayjs('2024-01-15T10:00:00');
        expect(calculateRemainderTimeBetweenTwoTimes(time1, time2, boxSizeUnit, 1)).toBe(-0.833333333333333);
      });

      test('handles non-divisible hour ranges', () => {
        const time1 = dayjs('2024-01-15T10:00:00');
        const time2 = dayjs('2024-01-15T13:30:00');
        expect(calculateRemainderTimeBetweenTwoTimes(time1, time2, boxSizeUnit, 2)).toBe(1.5);
      });
    });

  });

  describe('addBoxesToTime', () => {
    test('trying minutes', () => {
      const [time, date] = addBoxesToTime('min', 15, "8:30", 1, "1/1");
      expect(time).toBe("8:45");
      expect(date).toBe("1/1");
    });

    test('trying hours', () => {
      const [time, date] = addBoxesToTime('hr', 1, "8:30", 1, "1/1");
      expect(time).toBe("9:30");
      expect(date).toBe("1/1");
    });

    test('making sure 24 hour time works in min', () => {
      const [time, date] = addBoxesToTime('min', 30, "23:30", 1, "1/1");
      expect(time).toBe("0:00");
      expect(date).toBe("2/1");
    });

    test('making sure 24 hour time works in hour', () => {
      const [time, date] = addBoxesToTime('hr', 1, "23:30", 1, "1/1");
      expect(time).toBe("0:30");
      expect(date).toBe("2/1");
    });

    test('returns next date when crossing midnight', () => {
      const [time, date] = addBoxesToTime('hr', 2, "23:00", 1, "1/1");
      expect(time).toBe("1:00");
      expect(date).toBe("2/1");
    });

    test('returns same date when not crossing midnight', () => {
      const [time, date] = addBoxesToTime('hr', 1, "10:00", 1, "1/1");
      expect(time).toBe("11:00");
      expect(date).toBe("1/1");
    });
  });

});

describe('getPercentageOfBoxSizeFilled', () => {
  // Helper function to create dates with a specific minute difference
  const createDatePair = (minutesDifference) => {
    const startTime = new Date('2024-01-01T10:00:00Z');
    const endTime = new Date(startTime.getTime() + (minutesDifference * 60000));
    return { startTime, endTime };
  };

  // Test cases for minutes
  describe('when boxSizeUnit is "min"', () => {
    test('returns 1 when timespan exactly matches box size', () => {
      const { startTime, endTime } = createDatePair(30);
      const result = getPercentageOfBoxSizeFilled('min', 30, startTime, endTime);
      expect(result).toBe(1);
    });

    test('returns 0.5 when timespan is half of box size', () => {
      const { startTime, endTime } = createDatePair(15);
      const result = getPercentageOfBoxSizeFilled('min', 30, startTime, endTime);
      expect(result).toBe(0.5);
    });

    test('returns 2 when timespan is double box size', () => {
      const { startTime, endTime } = createDatePair(60);
      const result = getPercentageOfBoxSizeFilled('min', 30, startTime, endTime);
      expect(result).toBe(2);
    });

    test('handles zero minute difference', () => {
      const startTime = new Date('2024-01-01T10:00:00Z');
      const endTime = new Date('2024-01-01T10:00:00Z');
      const result = getPercentageOfBoxSizeFilled('min', 30, startTime, endTime);
      expect(result).toBe(0);
    });
  });

  // Test cases for hours
  describe('when boxSizeUnit is "hr"', () => {
    test('returns 1 when timespan exactly matches box size', () => {
      const { startTime, endTime } = createDatePair(60);
      const result = getPercentageOfBoxSizeFilled('hr', 1, startTime, endTime);
      expect(result).toBe(1);
    });

    test('returns 0.5 when timespan is half of box size', () => {
      const { startTime, endTime } = createDatePair(30);
      const result = getPercentageOfBoxSizeFilled('hr', 1, startTime, endTime);
      expect(result).toBe(0.5);
    });

    test('returns 2 when timespan is double box size', () => {
      const { startTime, endTime } = createDatePair(120);
      const result = getPercentageOfBoxSizeFilled('hr', 1, startTime, endTime);
      expect(result).toBe(2);
    });

    test('handles fractional hours', () => {
      const { startTime, endTime } = createDatePair(90);
      const result = getPercentageOfBoxSizeFilled('hr', 1.5, startTime, endTime);
      expect(result).toBe(1);
    });
  });
});

describe('findSmallestTimeBoxInSpace', () => {
  describe('when timeboxesInSpace is empty', () => {
    test('returns -1', () => {
      const timeboxGrid = {};
      const timeboxesInSpace = [];
      expect(findSmallestTimeBoxLengthInSpace(timeboxGrid, timeboxesInSpace)).toBe(1000000);
    });
  });

  describe('when timeboxesInSpace has two items', () => {
    test('returns index of smallest timebox if in minutes', () => {
      const timeboxGridFilteredByDate = {'10:00': { startTime: '2024-01-01T10:00:00', endTime: '2024-01-01T10:10:00' }, '10:30': { startTime: '2024-01-01T10:30:00', endTime: '2024-01-01T11:00:00' }};
      const timeboxesInSpace = ['10:00', '10:30'];
      expect(findSmallestTimeBoxLengthInSpace(timeboxGridFilteredByDate, timeboxesInSpace)).toBe(10);
    });
  });
});

describe('getStatistics', () => {
  beforeEach(() => {
    // Mock the useSelector hook to return a wakeupTime
    mockUseSelector.mockReturnValue({ wakeupTime: '8:30' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getStatistics basic case', () => {
    test('returns correct rescheduleRate', () => {
      const recordedTimeboxes = [{"id": 59, "recordedEndTime": "2024-11-28T05:00:00.000Z", "recordedStartTime": "2024-11-28T04:00:00.000Z", 
        "timeBox": {"description": "P's test", "id": 16, "title": "P's test", 'startTime': '2024-11-29T04:30:00.000Z', 'endTime': '2024-11-29T05:30:00.000Z'}}];
      const timeboxes = [{"description": "P's test", "id": 16, "title": "P's test", 'startTime': '2024-11-29T04:30:00.000Z', 'endTime': '2024-11-29T05:30:00.000Z'}];
      const result = getStatistics(recordedTimeboxes, timeboxes);
      
      // Calculate expected hoursLeftToday dynamically
      const today = dayjs();
      const nextDayWakeup = dayjs().add(1, 'day').hour(8).minute(30).second(0).millisecond(0);
      const expectedHoursLeftToday = Math.round((nextDayWakeup.toDate() - today.toDate()) / 3600000);
      
      expect(result).toEqual({
        averageTimeOverBy: 0, 
        averageTimeStartedOffBy: 30, 
        percentagePredictedStart: 0, 
        percentageCorrectTime: 1, 
        percentageRescheduled: 1, 
        hoursLeftToday: expectedHoursLeftToday
      });
      });
    });
})

describe('getHeightForBoxes', () => {
  test('calculates height for 1 box', () => {
    const result = getHeightForBoxes(1);
    expect(result).toBe('calc(100% + 0px)');
  });

  test('calculates height for 2 boxes', () => {
    const result = getHeightForBoxes(2);
    expect(result).toBe('calc(200% + 2px)');
  });

  test('calculates height for 4 boxes', () => {
    const result = getHeightForBoxes(4);
    expect(result).toBe('calc(400% + 6px)');
  });

  test('calculates height for 0 boxes', () => {
    const result = getHeightForBoxes(0);
    expect(result).toBe('calc(0% + -2px)');
  });
});

describe('getBoxesInsideTimeboxSpace', () => {
  test('filters times within the specified time range - minute based', () => {
    const timeGrid = {
      '10:00': { id: 1, title: 'Meeting 1' },
      '10:15': { id: 2, title: 'Meeting 2' },
      '10:30': { id: 3, title: 'Meeting 3' },
      '10:45': { id: 4, title: 'Meeting 4' },
      '11:00': { id: 5, title: 'Meeting 5' }
    };
    
    const result = getBoxesInsideTimeboxSpace(timeGrid, 'min', 30, '10:15');
    expect(result).toEqual(['10:15', '10:30']);
  });

  test('filters times within the specified time range - hour based', () => {
    const timeGrid = {
      '08:00': { id: 1, title: 'Meeting 1' },
      '09:00': { id: 2, title: 'Meeting 2' },
      '10:00': { id: 3, title: 'Meeting 3' },
      '11:00': { id: 4, title: 'Meeting 4' },
      '12:00': { id: 5, title: 'Meeting 5' }
    };
    
    const result = getBoxesInsideTimeboxSpace(timeGrid, 'hr', 2, '09:00');
    expect(result).toEqual(['09:00', '10:00']);
  });

  test('handles empty timeGrid', () => {
    const result = getBoxesInsideTimeboxSpace({}, 'min', 15, '10:00');
    expect(result).toEqual([]);
  });

  test('handles no matches in time range', () => {
    const timeGrid = {
      '08:00': { id: 1, title: 'Meeting 1' },
      '12:00': { id: 2, title: 'Meeting 2' }
    };
    
    const result = getBoxesInsideTimeboxSpace(timeGrid, 'min', 30, '10:00');
    expect(result).toEqual([]);
  });

  test('handles time at exact boundary', () => {
    const timeGrid = {
      '10:00': { id: 1, title: 'Meeting 1' },
      '10:15': { id: 2, title: 'Meeting 2' },
      '10:30': { id: 3, title: 'Meeting 3' }
    };
    
    const result = getBoxesInsideTimeboxSpace(timeGrid, 'min', 15, '10:00');
    expect(result).toEqual(['10:00']);
  });

  test('handles single time slot', () => {
    const timeGrid = {
      '10:15': { id: 1, title: 'Meeting 1' }
    };
    
    const result = getBoxesInsideTimeboxSpace(timeGrid, 'min', 30, '10:00');
    expect(result).toEqual(['10:15']);
  });
});

describe('getMarginFromTopOfTimebox', () => {
  test('calculates margin for minute-based timebox', () => {
    const result = getMarginFromTopOfTimebox('min', 15, '10:00', '10:05', 60);
    expect(result).toBe(20); // 5 minutes difference, 5/15 * 60 = 20, positive because start is after timebox
  });

  test('calculates margin for hour-based timebox', () => {
    const result = getMarginFromTopOfTimebox('hr', 1, '10:00', '10:30', 60);
    expect(result).toBe(30); // 30 minutes difference, 30/60 * 60 = 30, positive because start is after timebox
  });

  test('calculates negative margin when start is before timebox', () => {
    const result = getMarginFromTopOfTimebox('min', 15, '10:15', '10:00', 60);
    expect(result).toBe(-60); // 15 minutes difference, 15/15 * 60 = 60, negative because start is before timebox
  });

  test('calculates zero margin when times are equal', () => {
    const result = getMarginFromTopOfTimebox('min', 15, '10:00', '10:00', 60);
    expect(result).toBe(0);
  });

  test('handles different timebox heights', () => {
    const result = getMarginFromTopOfTimebox('min', 30, '10:00', '10:15', 120);
    expect(result).toBe(60); // 15 minutes difference, 15/30 * 120 = 60, positive
  });

  test('handles hour-based with partial hours', () => {
    const result = getMarginFromTopOfTimebox('hr', 2, '10:00', '11:00', 100);
    expect(result).toBe(50); // 1 hour difference, 1/2 * 100 = 50, positive
  });

  test('handles minute crossover to next hour', () => {
    const result = getMarginFromTopOfTimebox('min', 15, '10:45', '11:00', 60);
    expect(result).toBe(60); // 15 minutes difference, 15/15 * 60 = 60, positive
  });
});