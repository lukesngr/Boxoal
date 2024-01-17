import {  calculateMaxNumberOfBoxesAfterTimeIfEmpty,
   calculateMaxNumberOfBoxes, calculateBoxesBetweenTwoDateTimes, addBoxesToTime, calculateSizeOfOverlayBasedOnCurrentTime, calculateSizeOfRecordingOverlay } from '../modules/coreLogic';


describe('Testing max number of boxes after time is empty', () => {
  test('should calculate the max number of boxes when schedule is empty for minutes when wakeup time before', () => {
    const boxSizeUnit = 'min';
    const boxSizeNumber = 15;

    const wakeUpTimeSeparated = [8, 30]; 
    const timeSeparated = [12, 45];

    const result = calculateMaxNumberOfBoxesAfterTimeIfEmpty(boxSizeUnit, boxSizeNumber,  timeSeparated, wakeUpTimeSeparated);

    expect(result).toBe(79); 
  });

  test('should calculate the max number of boxes when schedule is empty for minutes when wakeup time after', () => {
    const boxSizeUnit = 'min';
    const boxSizeNumber = 15;

    const wakeUpTimeSeparated = [10, 30]; 
    const timeSeparated = [10, 0];

    const result = calculateMaxNumberOfBoxesAfterTimeIfEmpty(boxSizeUnit, boxSizeNumber, timeSeparated, wakeUpTimeSeparated);

    expect(result).toBe(2);
  });

  test('should calculate the max number of boxes when schedule is empty for hours when wakeup time before', () => {
    const boxSizeUnit = 'hr';
    const boxSizeNumber = 1;

    const wakeUpTimeSeparated = [8, 30]; 
    const timeSeparated = [16, 30];

    const result = calculateMaxNumberOfBoxesAfterTimeIfEmpty(boxSizeUnit, boxSizeNumber, timeSeparated, wakeUpTimeSeparated);

    expect(result).toBe(16);
  });

  test('should calculate the max number of boxes when schedule is empty for hours when wakeup time after', () => {
    const boxSizeUnit = 'hr';
    const boxSizeNumber = 1;

    const wakeUpTimeSeparated = [10, 0]; 
    const timeSeparated = [8, 0];

    const result = calculateMaxNumberOfBoxesAfterTimeIfEmpty(boxSizeUnit, boxSizeNumber, timeSeparated, wakeUpTimeSeparated);

    expect(result).toBe(2);
  });

});

describe('Testing max number of boxes after time is empty errors', () => {
  test('if minutes are not divisble by box size number', () => {
    const boxSizeUnit = 'min';
    const boxSizeNumber = 15;

    const wakeUpTimeSeparated = [8, 30]; 
    const timeSeparated = [12, 48];

    const consoleSpy = jest.spyOn(global.console, 'log');

    const result = calculateMaxNumberOfBoxesAfterTimeIfEmpty(boxSizeUnit, boxSizeNumber,  timeSeparated, wakeUpTimeSeparated);

    expect(consoleSpy).toHaveBeenCalledWith("Minutes aren't divisible by boxSizeNumber, just gonna ignore");
    consoleSpy.mockRestore();

    expect(result).toBe(79); 
  });

  //taking too long to test any possible error just gonna test the main ones

});

describe('Testing calculate boxes between two date times', () => {

  test('should calculate the number of boxes between two date times in minutes', () => {
    const dateTime1 = new Date('2023-01-01T08:30:00');
    const dateTime2 = new Date('2023-01-01T10:45:00');
    const boxSizeUnit = 'min';
    const boxSizeNumber = 15;

    const result = calculateBoxesBetweenTwoDateTimes(dateTime1, dateTime2, boxSizeUnit, boxSizeNumber);

    expect(result).toBe(9);
  });

  test('should calculate the number of boxes between two date times in hours', () => {
    const dateTime1 = new Date('2023-01-01T08:30:00');
    const dateTime2 = new Date('2023-01-01T10:30:00');
    const boxSizeUnit = 'hr';
    const boxSizeNumber = 1;

    const result = calculateBoxesBetweenTwoDateTimes(dateTime1, dateTime2, boxSizeUnit, boxSizeNumber);

    expect(result).toBe(2);
  });

  test('should calculate the number of boxes between two date times in hours reverse', () => {
    const dateTime1 = new Date('2023-01-01T10:30:00');
    const dateTime2 = new Date('2023-01-01T08:30:00');
    const boxSizeUnit = 'hr';
    const boxSizeNumber = 1;

    const result = calculateBoxesBetweenTwoDateTimes(dateTime1, dateTime2, boxSizeUnit, boxSizeNumber);

    expect(result).toBe(2);
  });

  test('should calculate the number of boxes between two date times in hours if extra minutes', () => {
    const dateTime1 = new Date('2023-01-01T08:30:00');
    const dateTime2 = new Date('2023-01-01T10:33:00');
    const boxSizeUnit = 'hr';
    const boxSizeNumber = 1;

    const result = calculateBoxesBetweenTwoDateTimes(dateTime1, dateTime2, boxSizeUnit, boxSizeNumber);

    expect(result).toBe(2);
  });
});

describe('Testing calculate boxes between two date times', () => {
  
  it('should calculate the max number of boxes based on the schedule, time, and date', () => {
    const schedule = {
      wakeupTime: '08:30',
      timeboxes: [
        { startTime: '2024-01-01T13:00:00', numberOfBoxes: 1 },
        { startTime: '2024-01-01T15:30:00', numberOfBoxes: 1 },
      ],
      boxSizeUnit: 'min',
      boxSizeNumber: 15,
    };
    const time = '12:45';
    const date = '1/1';

    const result = calculateMaxNumberOfBoxes(schedule, time, date);

    expect(result).toBe(1);
  });

  it('should add boxes to the given time and return the updated time in minutes', () => {
    const boxSizeUnit = 'min';
    const boxSizeNumber = 15;
    const time = '08:30'; // replace with your actual time
    const numberOfBoxes = 3; // replace with your actual number of boxes

    const result = addBoxesToTime(boxSizeUnit, boxSizeNumber, time, numberOfBoxes);

    // Adjust the expected value based on your specific calculation
    expect(result).toBe('9:15');
  });

  it('should add boxes to the given time and return the updated time in hours', () => {
    const boxSizeUnit = 'hr';
    const boxSizeNumber = 1;
    const time = '08:30'; // replace with your actual time
    const numberOfBoxes = 3; // replace with your actual number of boxes

    const result = addBoxesToTime(boxSizeUnit, boxSizeNumber, time, numberOfBoxes);

    // Adjust the expected value based on your specific calculation
    expect(result).toBe('11:30');
  });

  it('testing if 24 hour time works in minutes', () => {
    const boxSizeUnit = 'min';
    const boxSizeNumber = 15;
    const time = '23:30'; // replace with your actual time
    const numberOfBoxes = 3; // replace with your actual number of boxes

    const result = addBoxesToTime(boxSizeUnit, boxSizeNumber, time, numberOfBoxes);

    // Adjust the expected value based on your specific calculation
    expect(result).toBe('0:15');
  });

  it('testing if 24 hour time works in in hours', () => {
    const boxSizeUnit = 'hr';
    const boxSizeNumber = 1;
    const time = '22:00'; // replace with your actual time
    const numberOfBoxes = 3; // replace with your actual number of boxes

    const result = addBoxesToTime(boxSizeUnit, boxSizeNumber, time, numberOfBoxes);

    // Adjust the expected value based on your specific calculation
    expect(result).toBe('1:00');
  });
});

describe('Testing overlay height calculation functions', () => {
  it('calculating overlay height', () => {
    const boxSizeUnit = 'min';
    const boxSizeNumber = 30;
    const wakeupTime = '7:30';

    const overlayDimensions = [96, 1718, 35.796875];

    let mockDate = new Date();
    mockDate.setHours(21);
    mockDate.setMinutes(20);

    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);

    let result = calculateSizeOfOverlayBasedOnCurrentTime(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions);

    expect(result).toBe(990.3802083333334);
  });

  it('calculating recording overlay height', () => {
    const boxSizeUnit = 'min';
    const boxSizeNumber = 30;
    const wakeupTime = '7:30';

    const overlayDimensions = [96, 1718, 35.796875];

    let overlayHeight = 966.515625;

    let mockDate = new Date();
    mockDate.setHours(21);
    mockDate.setMinutes(20);

    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);

    let result = calculateSizeOfRecordingOverlay(wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions, overlayHeight);

    expect(result).toBe(23.86458333333337);
  });
})