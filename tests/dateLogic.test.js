import { getArrayOfDayDateDayNameAndMonthForHeaders, returnTimesSeperatedForSchedule, calculateMaxNumberOfBoxesAfterTimeIfEmpty,
   calculateMaxNumberOfBoxes, calculateBoxesBetweenTwoDateTimes, addBoxesToTime, calculateSizeOfOverlayBasedOnCurrentTime, calculateSizeOfRecordingOverlay } from '../modules/dateLogic';


//mainly testing most important functions in this code
describe('getArrayOfDayDateDayNameAndMonthForHeaders', () => {
  // Mock the current date to June 21, 2023
  afterAll(() => {
    // Restore the original Date implementation after all tests
    jest.restoreAllMocks();
  });

  test('returns the correct day numbers and month for the current day (e.g., Wednesday)', () => {
    let mockDate = new Date(2023, 5, 21);
    const result = getArrayOfDayDateDayNameAndMonthForHeaders(mockDate);
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

    const result = getArrayOfDayDateDayNameAndMonthForHeaders(mockDate);
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

  test('week of new years not working', () => {
    // Change the mock date to May 25, 2023
    let mockDate = new Date(2024, 0, 1);
    const result = getArrayOfDayDateDayNameAndMonthForHeaders(mockDate);
    expect(result).toEqual([
      { day: 0, name: 'Sun', date: 31, month: 12 },
      { day: 1, name: 'Mon', date: 1, month: 1 },
      { day: 2, name: 'Tue', date: 2, month: 1 },
      { day: 3, name: 'Wed', date: 3, month: 1 },
      { day: 4, name: 'Thur', date: 4, month: 1 },
      { day: 5, name: 'Fri', date: 5, month: 1 },
      { day: 6, name: 'Sat', date: 6, month: 1 },
    ]);
  });
});



