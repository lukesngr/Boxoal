import dayjs from "dayjs";
import { calculateOverlayHeightForNow, calculatePixelsFromTopOfGridBasedOnTime, calculateSizeOfRecordingOverlay } from "../../modules/overlayFunctions";

describe('calculatePixelsFromTopOfGridBasedOnTime', () => {
  // Setup common test variables
  const overlayDimensions = {
    headerWidth: 100,
    timeboxHeight: 50,
    headerHeight: 20,
    overlayHeight: 1000
  };

  describe('when dimensions not initialized', () => {
    test('should return 0 when headerWidth is 0', () => {
      const unsetDimensions = { ...overlayDimensions, headerWidth: 0 };
      const time = dayjs('2024-01-15T10:00:00');
      
      const result = calculatePixelsFromTopOfGridBasedOnTime(
        '08:30',
        'min',
        15,
        unsetDimensions,
        time
      );
      
      expect(result).toBe(0);
    });
  });

  describe('minute-based calculations', () => {
    test('should calculate correct pixels when time is after wakeup time', () => {
      const time = dayjs('2024-01-15T10:30:00'); // 2 hours after wakeup
      
      const result = calculatePixelsFromTopOfGridBasedOnTime(
        '08:30',
        'min',
        15,
        overlayDimensions,
        time
      );
      
      // 8 boxes (2 hours = 8 15-min boxes) * 50 pixels per box
      expect(result).toBe(400);
    });

    test('should calculate correct pixels when time includes partial box', () => {
      const time = dayjs('2024-01-15T08:37:00'); // 7 minutes after wakeup
      
      const result = calculatePixelsFromTopOfGridBasedOnTime(
        '08:30',
        'min',
        15,
        overlayDimensions,
        time
      );
      
      // 7 minutes = (7/15) * 50 pixels
      expect(result).toBe(23.333333333333336);
    });

    test('should handle time before wakeup time on same day', () => {
      const time = dayjs('2024-01-15T07:30:00'); // 1 hour before wakeup
      
      const result = calculatePixelsFromTopOfGridBasedOnTime(
        '08:30',
        'min',
        15,
        overlayDimensions,
        time
      );
      
      // Should calculate from previous day's wakeup time
      expect(result).toBe(4600); // (23 hours + 0 minutes) worth of pixels
    });

    
  });

  describe('hour-based calculations', () => {
    test('should calculate correct pixels for full hours after wakeup', () => {
      const time = dayjs('2024-01-15T11:30:00'); // 3 hours after wakeup
      
      const result = calculatePixelsFromTopOfGridBasedOnTime(
        '08:30',
        'hr',
        1,
        overlayDimensions,
        time
      );
      
      // 3 boxes * 50 pixels per box
      expect(result).toBe(150);
    });

    test('should handle partial hours correctly', () => {
      const time = dayjs('2024-01-15T09:45:00'); // 1.25 hours after wakeup
      
      const result = calculatePixelsFromTopOfGridBasedOnTime(
        '08:30',
        'hr',
        1,
        overlayDimensions,
        time
      );
      
      // 1.25 boxes * 50 pixels per box
      expect(result).toBe(62.5);
    });
  });

  describe('edge cases', () => {
    test('should handle midnight crossover correctly', () => {
      const time = dayjs('2024-01-16T00:30:00'); // 30 minutes after midnight
      
      const result = calculatePixelsFromTopOfGridBasedOnTime(
        '08:30',
        'min',
        15,
        overlayDimensions,
        time
      );
      
      // Should calculate from previous day's wakeup time
      expect(result).toBe(3200); // (16 hours worth of pixels)
    });

    test('should handle exact wakeup time', () => {
      const time = dayjs('2024-01-15T08:30:00'); // Exactly at wakeup time
      
      const result = calculatePixelsFromTopOfGridBasedOnTime(
        '08:30',
        'min',
        15,
        overlayDimensions,
        time
      );
      
      expect(result).toBe(0);
    });

    test('should handle time far before wakeup time', () => {
      const time = dayjs('2024-01-15T01:30:00'); // Early morning
      
      const result = calculatePixelsFromTopOfGridBasedOnTime(
        '08:30',
        'min',
        15,
        overlayDimensions,
        time
      );
      
      // Should calculate from previous day's wakeup time
      expect(result).toBe(3400); // (17 hours worth of pixels)
    });

    test('should handle negative remainder time', () => {
      const time = dayjs('2024-01-15T08:20:00'); // 10 minutes before wakeup
      
      const result = calculatePixelsFromTopOfGridBasedOnTime(
        '08:30',
        'min',
        15,
        overlayDimensions,
        time
      );
      
      // Should handle the negative remainder correctly
      expect(result).toBe(4766.666666666667); // (23 hours + 50 minutes worth of pixels)
    });
  });

  describe('different box sizes', () => {
    test('should handle 30-minute boxes', () => {
      const time = dayjs('2024-01-15T09:30:00'); // 1 hour after wakeup
      
      const result = calculatePixelsFromTopOfGridBasedOnTime(
        '08:30',
        'min',
        30,
        overlayDimensions,
        time
      );
      
      // 2 boxes * 50 pixels per box
      expect(result).toBe(100);
    });

    test('should handle 2-hour boxes', () => {
      const time = dayjs('2024-01-15T12:30:00'); // 4 hours after wakeup
      
      const result = calculatePixelsFromTopOfGridBasedOnTime(
        '08:30',
        'hr',
        2,
        overlayDimensions,
        time
      );
      
      // 2 boxes * 50 pixels per box
      expect(result).toBe(100);
    });
  });
});

describe('calculateOverlayHeightForNow', () => {
  test('handles standard case', () => {
    const overlayDimensions = { timeboxHeight: 50, headerWidth: 100 };
    const result = calculateOverlayHeightForNow('08:30', 'min', 15, overlayDimensions);
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThanOrEqual(0);
  });

  test('handles uninitialized dimensions', () => {
    const overlayDimensions = { headerWidth: 0 };
    const result = calculateOverlayHeightForNow('08:30', 'min', 15, overlayDimensions);
    expect(result).toBe(0);
  });
});

describe('calculateSizeOfRecordingOverlay', () => {
  const overlayDimensions = {
    overlayHeight: 1000,
    headerHeight: 50,
    timeboxHeight: 50
  };

  test('handles past recording', () => {
    const day = { date: dayjs().subtract(1, 'day').date() };
    const recordedStartTime = dayjs().subtract(1, 'day').toISOString();
    const result = calculateSizeOfRecordingOverlay(
      '08:30',
      'min',
      15,
      overlayDimensions,
      500,
      day,
      recordedStartTime
    );
    expect(result).toEqual([1000, 50]);
  });

  test('handles current day recording', () => {
    const day = { date: dayjs().date() };
    const recordedStartTime = dayjs().toISOString();
    const result = calculateSizeOfRecordingOverlay(
      '08:30',
      'min',
      15,
      overlayDimensions,
      500,
      day,
      recordedStartTime
    );
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
  });
});
