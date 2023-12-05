import { getDayNumbers, returnTimesSeperatedForSchedule, calculateMaxNumberOfBoxesAfterTimeIfEmpty,
   calculateMaxNumberOfBoxes, calculateBoxesBetweenTwoDateTimes, addBoxesToTime, calculateSizeOfOverlayBasedOnCurrentTime, calculateSizeOfRecordingOverlay } from '../modules/dateLogic';


//mainly testing most important functions in this code
describe('getDayNumbers', () => {
  // Mock the current date to June 21, 2023
  afterAll(() => {
    // Restore the original Date implementation after all tests
    jest.restoreAllMocks();
  });

  test('returns the correct day numbers and month for the current day (e.g., Wednesday)', () => {
    let mockDate = new Date('2023-06-21')
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);
    const result = getDayNumbers();
    expect(result).toEqual([
      { day: 0, name: 'Sun', date: 18, month: 6 },
      { day: 1, name: 'Mon', date: 19, month: 6 },
      { day: 2, name: 'Tue', date: 20, month: 6 },
      { day: 3, name: 'Wed', date: 21, month: 6 },
      { day: 4, name: 'Thur', date: 22, month: 6 },
      { day: 5, name: 'Fri', date: 23, month: 6 },
      { day: 6, name: 'Sat', date: 24, month: 6 },
    ]);
  });

  test('returns the correct day numbers and month for the current day where month changes', () => {
    // Change the mock date to May 25, 2023
    let mockDate = new Date(2023, 4, 28);
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);

    const result = getDayNumbers();
    expect(result).toEqual([
      { day: 0, name: 'Sun', date: 28, month: 5 },
      { day: 1, name: 'Mon', date: 29, month: 5 },
      { day: 2, name: 'Tue', date: 30, month: 5 },
      { day: 3, name: 'Wed', date: 31, month: 5 },
      { day: 4, name: 'Thur', date: 1, month: 6 },
      { day: 5, name: 'Fri', date: 2, month: 6 },
      { day: 6, name: 'Sat', date: 3, month: 6 },
    ]);
  });
});

describe('returnTimesSeperatedForSchedule', () => {
  it('should return an array of times based on the given schedule in minutes', () => {
    const schedule = {
      wakeupTime: '08:30',
      boxSizeUnit: 'min',
      boxSizeNumber: 15,
    };

    const expectedTimes = [
      '8:30', '8:45', '9:00', '9:15', '9:30', '9:45',
      '10:00', '10:15', '10:30', '10:45', '11:00', '11:15',
      '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', 
      '13:00', '13:15', '13:30', '13:45', '14:00', '14:15',
      '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', 
      '16:00',  '16:15', '16:30', '16:45', '17:00', '17:15', 
      '17:30', '17:45', '18:00', '18:15', '18:30', '18:45',
      '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', 
      '20:30', '20:45', '21:00', '21:15', '21:30', '21:45',
      '22:00', '22:15', '22:30', '22:45', '23:00', '23:15', 
      '23:30', '23:45', '0:00', '0:15', '0:30', '0:45',
      '1:00', '1:15', '1:30', '1:45', '2:00', '2:15', 
      '2:30', '2:45', '3:00', '3:15', '3:30', '3:45',
      '4:00', '4:15', '4:30', '4:45', '5:00', '5:15', 
      '5:30', '5:45', '6:00', '6:15', '6:30', '6:45',
      '7:00', '7:15', '7:30', '7:45', '8:00', '8:15'
    ];

    const result = returnTimesSeperatedForSchedule(schedule);

    expect(result).toEqual(expectedTimes);
  });

  it('should return an array of times based on the given schedule in hours', () => {
    const schedule = {
      wakeupTime: '08:30',
      boxSizeUnit: 'hr',
      boxSizeNumber: 1,
    };

    const expectedTimes = [
      '8:30', '9:30', '10:30', '11:30', '12:30', '13:30',
      '14:30', '15:30', '16:30', '17:30', '18:30', '19:30',
      '20:30', '21:30', '22:30', '23:30', '0:30', '1:30', 
      '2:30', '3:30', '4:30', '5:30', '6:30', '7:30'
    ];

    const result = returnTimesSeperatedForSchedule(schedule);

    expect(result).toEqual(expectedTimes);
  });
});

describe('Testing box calculation functions', () => {
  it('should calculate the max number of boxes when schedule is empty for minutes when wakeup time before', () => {
    const schedule = {
      boxSizeUnit: 'min',
      boxSizeNumber: 15,
    };

    const wakeUpTimeSeparated = [8, 30]; 
    const timeSeparated = [12, 45];

    const result = calculateMaxNumberOfBoxesAfterTimeIfEmpty(schedule, timeSeparated, wakeUpTimeSeparated);

    expect(result).toBe(79);
  });

  it('should calculate the max number of boxes when schedule is empty for minutes when wakeup time after', () => {
    const schedule = {
      boxSizeUnit: 'min',
      boxSizeNumber: 15,
    };

    const wakeUpTimeSeparated = [10, 30]; 
    const timeSeparated = [10, 0];

    const result = calculateMaxNumberOfBoxesAfterTimeIfEmpty(schedule, timeSeparated, wakeUpTimeSeparated);

    expect(result).toBe(2);
  });

  it('should calculate the max number of boxes when schedule is empty for hours when wakeup time before', () => {
    const schedule = {
      boxSizeUnit: 'hr',
      boxSizeNumber: 1,
    };

    const wakeUpTimeSeparated = [8, 30]; 
    const timeSeparated = [16, 30];

    const result = calculateMaxNumberOfBoxesAfterTimeIfEmpty(schedule, timeSeparated, wakeUpTimeSeparated);

    expect(result).toBe(16);
  });

  it('should calculate the max number of boxes when schedule is empty for hours when wakeup time after', () => {
    const schedule = {
      boxSizeUnit: 'hr',
      boxSizeNumber: 1,
    };

    const wakeUpTimeSeparated = [10, 0]; 
    const timeSeparated = [8, 0];

    const result = calculateMaxNumberOfBoxesAfterTimeIfEmpty(schedule, timeSeparated, wakeUpTimeSeparated);

    expect(result).toBe(2);
  });

  it('should calculate the number of boxes between two date times in minutes', () => {
    const dateTime1 = new Date('2023-01-01T08:30:00');
    const dateTime2 = new Date('2023-01-01T10:45:00');
    const schedule = {
      boxSizeUnit: 'min',
      boxSizeNumber: 15,
    };

    const result = calculateBoxesBetweenTwoDateTimes(dateTime1, dateTime2, schedule);

    expect(result).toBe(9);
  });

  it('should calculate the number of boxes between two date times in hours', () => {
    const dateTime1 = new Date('2023-01-01T08:30:00');
    const dateTime2 = new Date('2023-01-01T10:30:00');
    const schedule = {
      boxSizeUnit: 'hr',
      boxSizeNumber: 1,
    };

    const result = calculateBoxesBetweenTwoDateTimes(dateTime1, dateTime2, schedule);

    expect(result).toBe(2);
  });
  
  it('should calculate the max number of boxes based on the schedule, time, and date', () => {
    const schedule = {
      wakeupTime: '08:30',
      timeboxes: [
        { startTime: '2023-01-01T13:00:00', numberOfBoxes: 1 },
        { startTime: '2023-01-01T15:30:00', numberOfBoxes: 1 },
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
    const schedule = {
      boxSizeUnit: 'min',
      boxSizeNumber: 15,
    };
    const time = '08:30'; // replace with your actual time
    const numberOfBoxes = 3; // replace with your actual number of boxes

    const result = addBoxesToTime(schedule, time, numberOfBoxes);

    // Adjust the expected value based on your specific calculation
    expect(result).toBe('9:15');
  });

  it('should add boxes to the given time and return the updated time in hours', () => {
    const schedule = {
      boxSizeUnit: 'hr',
      boxSizeNumber: 1,
    };
    const time = '08:30'; // replace with your actual time
    const numberOfBoxes = 3; // replace with your actual number of boxes

    const result = addBoxesToTime(schedule, time, numberOfBoxes);

    // Adjust the expected value based on your specific calculation
    expect(result).toBe('11:30');
  });

  it('testing if 24 hour time works in minutes', () => {
    const schedule = {
      boxSizeUnit: 'min',
      boxSizeNumber: 15,
    };
    const time = '23:30'; // replace with your actual time
    const numberOfBoxes = 3; // replace with your actual number of boxes

    const result = addBoxesToTime(schedule, time, numberOfBoxes);

    // Adjust the expected value based on your specific calculation
    expect(result).toBe('0:15');
  });

  it('testing if 24 hour time works in in hours', () => {
    const schedule = {
      boxSizeUnit: 'hr',
      boxSizeNumber: 1,
    };
    const time = '22:00'; // replace with your actual time
    const numberOfBoxes = 3; // replace with your actual number of boxes

    const result = addBoxesToTime(schedule, time, numberOfBoxes);

    // Adjust the expected value based on your specific calculation
    expect(result).toBe('1:00');
  });
});

describe('Testing overlay height calculation functions', () => {
  it('calculating overlay height', () => {
    const schedule = {
      boxSizeUnit: 'min',
      boxSizeNumber: 30,
      wakeupTime: '7:30'
    };

    const overlayDimensions = [96, 1718, 35.796875];

    let mockDate = new Date();
    mockDate.setHours(21);
    mockDate.setMinutes(20);

    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);

    let result = calculateSizeOfOverlayBasedOnCurrentTime(schedule, overlayDimensions);

    expect(result).toBe(990.3802083333334);
  });

  it('calculating recording overlay height', () => {
    const schedule = {
      boxSizeUnit: 'min',
      boxSizeNumber: 30,
      wakeupTime: '7:30'
    };

    const overlayDimensions = [96, 1718, 35.796875];

    let recordingStartTime = new Date();
    recordingStartTime.setHours(21);
    recordingStartTime.setMinutes(0);

    let mockDate = new Date();
    mockDate.setHours(21);
    mockDate.setMinutes(20);

    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);

    let result = calculateSizeOfRecordingOverlay(schedule, overlayDimensions, recordingStartTime);

    expect(result).toBe(23.8645833333);
  });
})