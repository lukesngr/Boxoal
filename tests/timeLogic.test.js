import { calculateRemainderTimeBetweenTwoDateTimes, returnTimesSeperatedForSchedule } from '../modules/timeLogic';


describe('returnTimesSeperatedForSchedule normal testing', () => {
  test('should return an array of times based on the given schedule in minutes', () => {
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

  test('should return an array of times based on the given schedule in hours', () => {
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
})

describe('returnTimesSeperatedForSchedule error testing', () => {

  test('graceful exiting if wakeup time is not string', () => {
    const schedule = {
      wakeupTime: 5,
      boxSizeUnit: 'hr',
      boxSizeNumber: 1,
    };

    const consoleSpy = jest.spyOn(global.console, 'log');
    
    const result = returnTimesSeperatedForSchedule(schedule);

    expect(console.log).toHaveBeenCalledWith("Wakeup time provided to function is not a string");
    consoleSpy.mockRestore();
  });

  test('graceful exiting if wakeup time is not in correct format', () => {
    const schedule = {
      wakeupTime: "8",
      boxSizeUnit: 'hr',
      boxSizeNumber: 1,
    };

    const consoleSpy = jest.spyOn(global.console, 'log');
    
    const result = returnTimesSeperatedForSchedule(schedule);

    expect(consoleSpy).toHaveBeenCalledWith("Wakeup time provided to function is not in correct format");
    consoleSpy.mockRestore();
  });

  test('graceful exiting if wakeup time is in impossible bounds', () => {
    const schedule = {
      wakeupTime: "24:30",
      boxSizeUnit: 'hr',
      boxSizeNumber: 1,
    };

    const consoleSpy = jest.spyOn(global.console, 'log');
    
    const result = returnTimesSeperatedForSchedule(schedule);

    expect(consoleSpy).toHaveBeenCalledWith("Wakeup time must be between 0:00 and 24:00");
    consoleSpy.mockRestore();
  });

  test('make sure decimals just get rounded', () => {
    const schedule = {
      wakeupTime: "08:30",
      boxSizeUnit: 'hr',
      boxSizeNumber: 1.5,
    };

    const consoleSpy = jest.spyOn(global.console, 'log');
    
    const result = returnTimesSeperatedForSchedule(schedule);

    expect(consoleSpy).toHaveBeenCalledWith("Beware decimal passed as box size number, was ignored");
    consoleSpy.mockRestore();
  });
});

describe('calculateRemainderTimeBetweenTwoDateTimes normal testing', () => {
  test('for minutes', () => {
    let dateTime1 = new Date(2023, 10, 1, 10, 30);
    let dateTime2 = new Date(2023, 10, 1, 10, 45);

    const result = calculateRemainderTimeBetweenTwoDateTimes(dateTime1, dateTime2, "min", 30);

    expect(result).toEqual(15);
  })

  test('for hours', () => {
    let dateTime1 = new Date(2023, 10, 1, 10, 30);
    let dateTime2 = new Date(2023, 10, 1, 10, 45);

    //needs to be decimal for hours

    const result = calculateRemainderTimeBetweenTwoDateTimes(dateTime1, dateTime2, "hr", 1);

    expect(result).toEqual(0.25);
  })

  test('for hours where box size number bigger than 1', () => {
    let dateTime1 = new Date(2023, 10, 1, 10, 0);
    let dateTime2 = new Date(2023, 10, 1, 11, 0);

    //needs to be decimal for hours

    const result = calculateRemainderTimeBetweenTwoDateTimes(dateTime1, dateTime2, "hr", 2);

    expect(result).toEqual(0.5);
  })
});