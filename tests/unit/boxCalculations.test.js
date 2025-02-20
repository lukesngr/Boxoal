
import dayjs from 'dayjs';
import { getStatistics, findSmallestTimeBoxLengthInSpace, getPercentageOfBoxSizeFilled, calculateMaxNumberOfBoxesAfterTimeIfEmpty, calculateMaxNumberOfBoxes, calculateBoxesBetweenTwoTimes, calculateRemainderTimeBetweenTwoTimes, addBoxesToTime } from '../../modules/boxCalculations';


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
      const result = calculateMaxNumberOfBoxes('08:30', 'min', 15, [], '12:45', '1/1');
      expect(result).toBe(79);
    });

    test('handles schedule with one future timebox', () => {
      const timeboxes = [{
        startTime: '2025-01-01T14:00:00'
      }];
      const result = calculateMaxNumberOfBoxes('08:30', 'min', 15, timeboxes, '12:45', '1/1');
      expect(result).toBe(5);
    });

    test('handles schedule with multiple timeboxes', () => {
      const timeboxes = [
        { startTime: '2025-01-01T14:00:00' },
        { startTime: '2025-01-01T16:00:00' }
      ];
      const result = calculateMaxNumberOfBoxes('08:30', 'min', 15, timeboxes, '12:45', '1/1');
      expect(result).toBe(5);
    });

    test('handles inbetween case with multiple timeboxes', () => {
      const timeboxes = [
        { startTime: '2025-01-01T14:00:00' },
        { startTime: '2025-01-01T16:00:00' }
      ];
      const result = calculateMaxNumberOfBoxes('08:30', 'min', 15, timeboxes, '14:45', '1/1');
      expect(result).toBe(5);
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

  describe('calculateRemainderBoxesBetweenTwoTimes', () => {
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
      expect(addBoxesToTime('min', 15, "8:30", 1)).toBe("8:45");
    });

    test('trying hours', () => {
      expect(addBoxesToTime('hr', 1, "8:30", 1)).toBe("9:30");
    });

    test('making sure 24 hour time works in min', () => {
      expect(addBoxesToTime('min', 30, "23:30", 1)).toBe("0:00");
    });

    test('making sure 24 hour time works in hour', () => {
      expect(addBoxesToTime('hr', 1, "23:30", 1)).toBe("0:30");
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
  describe('getStatistics basic case', () => {
    test('returns correct rescheduleRate', () => {
      const recordedTimeboxes = [{"id": 59, "recordedEndTime": "2024-11-28T05:00:00.000Z", "recordedStartTime": "2024-11-28T04:00:00.000Z", 
        "timeBox": {"description": "P's test", "id": 16, "title": "P's test", 'startTime': '2024-11-29T04:30:00.000Z', 'endTime': '2024-11-29T05:30:00.000Z'}}];
      const result = getStatistics(recordedTimeboxes);
      expect(result).toEqual({averageTimeOverBy: 0, averageTimeStartedOffBy: 30, percentagePredictedStart: 0, percentageCorrectTime: 1, percentageRescheduled: 1});
      });
    });
})