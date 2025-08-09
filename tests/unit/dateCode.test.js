import { getArrayOfDayDateDayNameAndMonthForHeaders, filterTimeboxesBasedOnWeekRange, alteredBinarySearchForTimeboxDate, differenceInDates } from '../../modules/dateCode';

//mainly testing most important functions in this code
describe('getArrayOfDayDateDayNameAndMonthForHeaders', () => {

  test('returns the correct day numbers and month for the current day (e.g., Wednesday)', () => {
    // Mock the current date to June 21, 2023
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

  //not gonna test other use cases as I feel dayjs is relatively stable and can handle any input
});

function createTimebox(date) {
  return {
      startTime: new Date(date).toISOString()
  };
}

// Helper function to create array of timeboxes for testing
function createTimeboxArray(dates) {
  return dates.map(date => createTimebox(date));
}

describe('alteredBinarySearchForTimeboxDate', () => {

  test('handles empty array', () => {
      const result = alteredBinarySearchForTimeboxDate([], new Date('2024-03-15'));
      expect(result).toBe(0);
  });

  test('handles single item array - exact match', () => {
      const timeboxes = createTimeboxArray(['2024-03-15T12:00:00Z']);
      const result = alteredBinarySearchForTimeboxDate(
          timeboxes,
          new Date('2024-03-15T12:00:00Z')
      );
      expect(result).toBe(0);
  });

  test('handles single item array - different date', () => {
      const timeboxes = createTimeboxArray(['2024-03-15T12:00:00']);
      const result = alteredBinarySearchForTimeboxDate(
          timeboxes,
          new Date('2024-03-16T12:00:00')
      );
      expect(result).toBe(0);
  });

  test('finds exact match in middle of array', () => {
      const timeboxes = createTimeboxArray([
          '2024-03-14T12:00:00',
          '2024-03-15T12:00:00',
          '2024-03-16T12:00:00'
      ]);
      const result = alteredBinarySearchForTimeboxDate(
          timeboxes,
          new Date('2024-03-15T12:00:00')
      );
      expect(result).toBe(1);
  });

  test('handles date greater than middle', () => {
      const timeboxes = createTimeboxArray([
          '2024-03-14T12:00:00',
          '2024-03-15T12:00:00',
          '2024-03-16T12:00:00'
      ]);
      const result = alteredBinarySearchForTimeboxDate(
          timeboxes,
          new Date('2024-03-16T12:00:00')
      );
      expect(result).toBe(2);
  });

  test('handles date less than middle', () => {
      const timeboxes = createTimeboxArray([
          '2024-03-14T12:00:00',
          '2024-03-15T12:00:00',
          '2024-03-16T12:00:00'
      ]);
      const result = alteredBinarySearchForTimeboxDate(
          timeboxes,
          new Date('2024-03-14T12:00:00')
      );
      expect(result).toBe(0);
  });

  test('handles large array', () => {
      const dates = Array.from({ length: 10 }, (_, i) => 
          `2024-03-${String(i + 1).padStart(2, '0')}T12:00:00`
      );
      const timeboxes = createTimeboxArray(dates);
      const result = alteredBinarySearchForTimeboxDate(
          timeboxes,
          new Date('2024-03-05T12:00:00')
      );
      expect(result).toBe(4);
  });
});

describe('filterTimeboxesBasedOnWeekRange', () => {

  test('handles empty array', () => {
      const result = filterTimeboxesBasedOnWeekRange([], new Date('2024-03-15'));
      expect(result).toEqual([]);
  });

  test('filters timeboxes for a week correctly', () => {
      // Create timeboxes for 10 days spanning a week
      const dates = [
        '2024-03-10T12:00:00Z', // Sunday
        '2024-03-11T12:00:00Z',
        '2024-03-12T12:00:00Z',
        '2024-03-13T12:00:00Z',
        '2024-03-14T12:00:00Z', 
        '2024-03-15T12:00:00Z',
        '2024-03-16T12:00:00Z', // Saturday
        '2024-03-17T12:00:00Z', // Next Sunday
      ];
      const timeboxes = createTimeboxArray(dates);
      const selectedDate = new Date('2024-03-15'); // A Friday

      const result = filterTimeboxesBasedOnWeekRange(timeboxes, selectedDate);
      
      // Should include Sunday (03-10) through Saturday (03-16)
      expect(result.length).toBe(7);
      
      expect(new Date(result[0].startTime)).toEqual(new Date('2024-03-10T12:00:00Z'));
      expect(new Date(result[result.length - 1].startTime)).toEqual(new Date('2024-03-16T12:00:00Z'));
  });

  test('handles timeboxes at different times of day', () => {
      const dates = [
          '2024-03-10T08:00:00',
          '2024-03-10T14:00:00',
          '2024-03-11T09:00:00',
          '2024-03-11T16:00:00'
      ];
      const timeboxes = createTimeboxArray(dates);
      const selectedDate = new Date('2024-03-10');

      const result = filterTimeboxesBasedOnWeekRange(timeboxes, selectedDate);
      expect(result.length).toBe(4);
  });

  test('handles week spanning month boundary', () => {
      const dates = [
          '2024-03-31T12:00:00', // Sunday
          '2024-04-01T12:00:00',
          '2024-04-02T12:00:00',
          '2024-04-03T12:00:00',
          '2024-04-04T12:00:00',
          '2024-04-05T12:00:00',
          '2024-04-06T12:00:00' // Saturday
      ];
      const timeboxes = createTimeboxArray(dates);
      const selectedDate = new Date('2024-04-03'); // Wednesday

      const result = filterTimeboxesBasedOnWeekRange(timeboxes, selectedDate);
      expect(result.length).toBe(7);
      expect(new Date(result[0].startTime)).toEqual(new Date('2024-03-31T12:00:00'));
      expect(new Date(result[result.length - 1].startTime)).toEqual(new Date('2024-04-06T12:00:00'));
  });

  test('handles sparse timeboxes within week', () => {
      const dates = [
          '2024-03-10T12:00:00', // Sunday
          '2024-03-12T12:00:00', // Tuesday
          '2024-03-15T12:00:00', // Friday
      ];
      const timeboxes = createTimeboxArray(dates);
      const selectedDate = new Date('2024-03-12');

      const result = filterTimeboxesBasedOnWeekRange(timeboxes, selectedDate);
      expect(result.length).toBe(3);
  });

  test('handles timeboxes exactly at week boundaries', () => {
      const dates = [
          '2024-03-10T00:00:00', // Sunday start
          '2024-03-16T23:59:59', // Saturday end
      ];
      const timeboxes = createTimeboxArray(dates);
      const selectedDate = new Date('2024-03-13');

      const result = filterTimeboxesBasedOnWeekRange(timeboxes, selectedDate);
      expect(result.length).toBe(2);
  });
});

describe('differenceInDates', () => {
    test('one day difference with second date being at 12:00', () => {
        expect(differenceInDates("2025-08-11T03:00:00.000+10:00", "2025-08-09T11:00:00.000+10:00", '7:00')).toBe(1);
    })

    test('one day difference with first date being at 12:00', () => {
        expect(differenceInDates("2025-08-10T11:00:00.000+10:00", "2025-08-09T03:00:00.000+10:00", '7:00')).toBe(1);
    })
})




