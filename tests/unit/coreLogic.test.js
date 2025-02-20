import { 
  calculateMaxNumberOfBoxesAfterTimeIfEmpty,
  calculateBoxesBetweenTwoTimes,
  calculateMaxNumberOfBoxes,
  addBoxesToTime,
  calculateOverlayHeightForNow,
  calculateSizeOfRecordingOverlay,
  calculatePixelsFromTopOfGridBasedOnTime,
  thereIsNoRecording,
  generateTimeBoxGrid,
  getHeightForBoxes,
  getProgressWithGoal,
  getDateWithSuffix,
  goToDay,
  filterRecordingBasedOnDay,
  calculateXPPoints,
  getProgressAndLevel,
  convertToDayjs,
  convertToTimeAndDate
} from '../../modules/coreLogic';
import dayjs from 'dayjs';

describe('Recording and Progress Functions', () => {
  describe('thereIsNoRecording', () => {
    test('handles empty recorded boxes', () => {
      expect(thereIsNoRecording([], null, '1/1', '08:00')).toBe(true);
    });

    test('handles daily reoccurring with match', () => {
      const recordedBoxes = [{
        recordedStartTime: new Date('2024-01-15T08:00:00')
      }];
      const reoccuring = { reoccurFrequency: 'daily' };
      expect(thereIsNoRecording(recordedBoxes, reoccuring, '15/1', '08:00')).toBe(false);
    });

    test('handles daily reoccurring without match', () => {
      const recordedBoxes = [{
        recordedStartTime: new Date('2024-01-15T08:00:00')
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
      expect(getProgressWithGoal(timeboxes)).toBe(1);
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

    //testing this isnt that iedge cases
    test('makes sure not 0', () => {
      const recordedStartTime = new Date('2024-01-15T01:00:00');
      const recordedEndTime = new Date('2024-05-21T21:00:00');
      const result = calculateXPPoints(timeboxData, recordedStartTime, recordedEndTime);
      expect(result).toBeGreaterThan(0);
    });
  });

  describe('getProgressAndLevel', () => {
    test('handles low XP points', () => {
      const result = getProgressAndLevel(5);
      expect(result).toEqual({ progress: 0, level: 1 });
    });

    test('handles medium XP points', () => {
      const result = getProgressAndLevel(50);
      expect(result.level).toBeGreaterThan(1);
      expect(result.progress).toBeGreaterThanOrEqual(0);
      expect(result.progress).toBeLessThanOrEqual(1);
    });

    test('handles high XP points', () => {
      const result = getProgressAndLevel(1000);
      expect(result.level).toBeGreaterThan(10);
      expect(result.progress).toBeGreaterThanOrEqual(0);
      expect(result.progress).toBeLessThanOrEqual(1);
    });
  });
});