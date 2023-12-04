import { getDayNumbers, returnTimesSeperatedForSchedule } from '../modules/dateLogic';

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
  it('should return an array of times based on the given schedule', () => {
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
      '23:30', '23:45', '00:00', '00:15', '00:30', '00:45',
      '01:00', '01:15', '01:30', '01:45', '02:00', '02:15', 
      '02:30', '02:45', '03:00', '03:15', '03:30', '03:45',
      '04:00', '04:15', '04:30', '04:45', '05:00', '05:15', 
      '05:30', '05:45', '06:00', '06:15', '06:30', '06:45',
      '07:00', '07:15', '07:30', '07:45', '08:00', '08:15'
    ];

    const result = returnTimesSeperatedForSchedule(schedule);

    expect(result).toEqual(expectedTimes);
  });

  // Add more test cases for different scenarios if needed
});