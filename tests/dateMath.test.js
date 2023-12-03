import { getDayNumbers } from '../modules/dateLogic';

describe('getDayNumbers', () => {
  // Mock the current date to June 21, 2023
  const mockDate = new Date('2023-06-21');
  beforeAll(() => {
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
  });

  afterAll(() => {
    // Restore the original Date implementation after all tests
    jest.restoreAllMocks();
  });

  test('returns the correct day numbers and month for the current day (e.g., Wednesday)', () => {
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
    mockDate.setFullYear(2023, 4, 28);

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