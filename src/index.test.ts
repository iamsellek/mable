import { makePersonFixture, Person } from './fixtures/person';
import MableObject from './index';

// Start of helper function tests.

describe('MableObject base tests', () => {
  test('constructor', () => {
    const person = makePersonFixture();

    const m = new MableObject({ [person.id]: person });

    expect(m.theObject[person.id]).toEqual(person);
  });
});

describe('every', () => {
  let han: Person;
  let george: Person;
  let doug: Person;

  beforeEach(() => {
    han = makePersonFixture();
    george = makePersonFixture({
      id: '1138',
      firstName: 'George',
      lastName: 'Lucas',
      age: 77,
      occupation: 'Movie director',
    });
    doug = makePersonFixture({
      id: '42',
      firstName: 'Douglas',
      lastName: 'Adams',
      age: 49,
      occupation: 'Author',
    });
  });

  test('returns true when ALL values match the conditional', () => {
    const m = new MableObject({
      [han.id]: han,
      [george.id]: george,
      [doug.id]: doug,
    });

    expect(m.every((item) => item.firstName.length > 1)).toBe(true);
  });

  test('returns false when NONE of the values match the conditional', () => {
    const m = new MableObject({
      [han.id]: han,
      [george.id]: george,
      [doug.id]: doug,
    });

    expect(m.every((item) => item.firstName.length === 1000)).toBe(false);
  });

  test('return false when ANY ONE of the values does not match the conditional', () => {
    han = makePersonFixture({ firstName: george.firstName });

    const m = new MableObject({
      [han.id]: han,
      [george.id]: george,
      [doug.id]: doug,
    });

    expect(m.every((item) => item.firstName === george.firstName)).toBe(false);
  });
});

describe('filter', () => {
  let han: Person;
  let george: Person;
  let doug: Person;

  beforeEach(() => {
    han = makePersonFixture();
    george = makePersonFixture({
      id: '1138',
      firstName: 'George',
      lastName: 'Lucas',
      age: 77,
      occupation: 'Movie director',
    });
    doug = makePersonFixture({
      id: '42',
      firstName: 'Douglas',
      lastName: 'Adams',
      age: 49,
      occupation: 'Author',
    });
  });

  test('filters according to conditional and returns new object while leaving original untouched', () => {
    const m = new MableObject({
      [han.id]: han,
      [george.id]: george,
      [doug.id]: doug,
    });
    const m2 = m.filter(
      (item) =>
        item.firstName === han.firstName || item.firstName === george.firstName
    );

    expect(m.theObject).not.toEqual(m2.theObject);
    expect(m2.theObject).toEqual({ [han.id]: han, [george.id]: george });
  });
});

describe('find', () => {
  let han: Person;
  let george: Person;
  let doug: Person;

  beforeEach(() => {
    han = makePersonFixture();
    george = makePersonFixture({
      id: '1138',
      firstName: 'George',
      lastName: 'Lucas',
      age: 77,
      occupation: 'Movie director',
    });
    doug = makePersonFixture({
      id: '42',
      firstName: 'Douglas',
      lastName: 'Adams',
      age: 49,
      occupation: 'Author',
    });
  });

  test('successfully finds a value based on the callback', () => {
    const m = new MableObject({
      [han.id]: han,
      [george.id]: george,
      [doug.id]: doug,
    });

    expect(m.find((item) => item.id === han.id)).toEqual(han);
  });

  test('only finds the first matching value', () => {
    doug = makePersonFixture({ firstName: han.firstName });

    const m = new MableObject({
      [han.id]: han,
      [doug.id]: doug,
      [george.id]: george,
    });
    const found = m.find((item) => item.firstName === han.firstName);

    expect(found).toBe(doug);
  });

  test('stops the loop once it finds a match', () => {
    doug = makePersonFixture({ firstName: han.firstName });
    george = makePersonFixture({ firstName: han.firstName });

    const m = new MableObject({
      [han.id]: han,
      [doug.id]: doug,
      [george.id]: george,
    });

    const callback = jest.fn();
    callback.mockReturnValueOnce(true);

    m.find(callback);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('returns undefined if no matches are found', () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });

    expect(m.find((item) => item.id === 'not-real')).toBe(undefined);
  });
});

describe('findAll', () => {
  let han: Person;
  let george: Person;
  let doug: Person;

  beforeEach(() => {
    han = makePersonFixture();
    george = makePersonFixture({
      id: '1138',
      firstName: 'George',
      lastName: 'Lucas',
      age: 77,
      occupation: 'Movie director',
    });
    doug = makePersonFixture({
      id: '42',
      firstName: 'Douglas',
      lastName: 'Adams',
      age: 49,
      occupation: 'Author',
    });
  });

  test('successfully finds only one matching value and returns it in a new MableObject', () => {
    const m = new MableObject({
      [han.id]: han,
      [george.id]: george,
      [doug.id]: doug,
    });

    expect(m.findAll((item) => item.id === han.id)).toEqual(
      new MableObject({ [han.id]: han })
    );
  });

  test('successfully finds multiple matching values and returns them in a new MableObject', () => {
    han = makePersonFixture({ firstName: george.firstName });

    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });

    expect(m.findAll((item) => item.firstName === george.firstName)).toEqual(
      new MableObject({ [han.id]: han, [george.id]: george })
    );
  });

  test('returns undefined if there are no matches', () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });

    expect(m.find((item) => item.id === 'not-real')).toBe(undefined);
  });
});

describe('forEach', () => {
  let han: Person;
  let george: Person;
  let doug: Person;

  beforeEach(() => {
    han = makePersonFixture();
    george = makePersonFixture({
      id: '1138',
      firstName: 'George',
      lastName: 'Lucas',
      age: 77,
      occupation: 'Movie director',
    });
    doug = makePersonFixture({
      id: '42',
      firstName: 'Douglas',
      lastName: 'Adams',
      age: 49,
      occupation: 'Author',
    });
  });

  test('forEach runs a callback against each object in The Object', () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });
    const ages: number[] = [];

    m.forEach((item) => ages.push(item.age));

    // The order isn't guaranteed, so let's check for each individually.
    expect(ages.includes(29) && ages.includes(77) && ages.includes(49)).toBe(
      true
    );
    expect(ages.length).toBe(3);
  });
});

describe('includes', () => {
  let han: Person;
  let george: Person;
  let doug: Person;

  beforeEach(() => {
    han = makePersonFixture();
    george = makePersonFixture({
      id: '1138',
      firstName: 'George',
      lastName: 'Lucas',
      age: 77,
      occupation: 'Movie director',
    });
    doug = makePersonFixture({
      id: '42',
      firstName: 'Douglas',
      lastName: 'Adams',
      age: 49,
      occupation: 'Author',
    });
  });

  test('returns true when TheObject contains a matching item', () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });

    expect(m.includes((item) => item.firstName === han.firstName)).toBe(true);
  });

  test('stops the loop once an item is found', () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });
    const callback = jest.fn();
    callback.mockReturnValueOnce(true);

    m.includes(callback);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('returns false when TheObject does not contain a matching item', () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });

    expect(m.includes((item) => item.firstName === 'NotARealName')).toBe(false);
  });
});

describe('map', () => {
  let han: Person;
  let george: Person;
  let doug: Person;

  beforeEach(() => {
    han = makePersonFixture();
    george = makePersonFixture({
      id: '1138',
      firstName: 'George',
      lastName: 'Lucas',
      age: 77,
      occupation: 'Movie director',
    });
    doug = makePersonFixture({
      id: '42',
      firstName: 'Douglas',
      lastName: 'Adams',
      age: 49,
      occupation: 'Author',
    });
  });

  test('returns a new MableObject with changed data', () => {
    const notHan: Person = { ...han, firstName: `Not-${han.firstName}` };
    const notGeorge: Person = {
      ...george,
      firstName: `Not-${george.firstName}`,
    };
    const notDoug: Person = { ...doug, firstName: `Not-${doug.firstName}` };

    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });
    const m2 = new MableObject({
      [notGeorge.id]: notGeorge,
      [notHan.id]: notHan,
      [notDoug.id]: notDoug,
    });
    const result = m.map((item) => ({
      ...item,
      firstName: `Not-${item.firstName}`,
    }));

    expect(m).toEqual(
      new MableObject({ [george.id]: george, [han.id]: han, [doug.id]: doug })
    );
    expect(result).not.toEqual(m);
    expect(result).toEqual(m2);
  });
});

describe('some', () => {
  let han: Person;
  let george: Person;
  let doug: Person;

  beforeEach(() => {
    han = makePersonFixture();
    george = makePersonFixture({
      id: '1138',
      firstName: 'George',
      lastName: 'Lucas',
      age: 77,
      occupation: 'Movie director',
    });
    doug = makePersonFixture({
      id: '42',
      firstName: 'Douglas',
      lastName: 'Adams',
      age: 49,
      occupation: 'Author',
    });
  });

  test('returns true when just one value matches the conditional', () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });

    expect(m.some((item) => item.firstName === han.firstName));
  });

  test('stops the loop once a true value is found', () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });
    const callback = jest.fn();
    callback.mockReturnValueOnce(true);
    m.some(callback);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('returns false when no values match the conditional', () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });

    expect(m.some((item) => item.firstName === 'Not Real Name'));
  });
});

// End of helper function tests.

// Start of setters, getters, updaters, and get-infoers tests.

describe('delete', () => {
  let han: Person;
  let george: Person;
  let doug: Person;

  beforeEach(() => {
    han = makePersonFixture();
    george = makePersonFixture({
      id: '1138',
      firstName: 'George',
      lastName: 'Lucas',
      age: 77,
      occupation: 'Movie director',
    });
    doug = makePersonFixture({
      id: '42',
      firstName: 'Douglas',
      lastName: 'Adams',
      age: 49,
      occupation: 'Author',
    });
  });

  test('correctly deletes an item from The Object', () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });

    m.delete(han.id);

    expect(m).toEqual(
      new MableObject({ [george.id]: george, [doug.id]: doug })
    );
  });
});

describe('get', () => {
  let han: Person;
  let george: Person;
  let doug: Person;

  beforeEach(() => {
    han = makePersonFixture();
    george = makePersonFixture({
      id: '1138',
      firstName: 'George',
      lastName: 'Lucas',
      age: 77,
      occupation: 'Movie director',
    });
    doug = makePersonFixture({
      id: '42',
      firstName: 'Douglas',
      lastName: 'Adams',
      age: 49,
      occupation: 'Author',
    });
  });

  test('successfully retrieves item by id', () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });

    expect(m.get(han.id)).toEqual(han);
  });

  test('returns undefined if item at id does not exist', () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });

    expect(m.get('non-existant')).toBe(undefined);
  });
});

describe('getAsArray', () => {
  let han: Person;
  let george: Person;
  let doug: Person;

  beforeEach(() => {
    han = makePersonFixture();
    george = makePersonFixture({
      id: '1138',
      firstName: 'George',
      lastName: 'Lucas',
      age: 77,
      occupation: 'Movie director',
    });
    doug = makePersonFixture({
      id: '42',
      firstName: 'Douglas',
      lastName: 'Adams',
      age: 49,
      occupation: 'Author',
    });
  });

  test('successfully retrieves item by id', () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });
    const array = m.getAsArray();

    // The order isn't guaranteed, so let's check for each individually.
    expect(
      array.includes(han) && array.includes(george) && array.includes(doug)
    ).toBe(true);
    expect(array.length).toBe(3);
  });
});

describe('getLength', () => {
  let han: Person;
  let george: Person;
  let doug: Person;

  beforeEach(() => {
    han = makePersonFixture();
    george = makePersonFixture({
      id: '1138',
      firstName: 'George',
      lastName: 'Lucas',
      age: 77,
      occupation: 'Movie director',
    });
    doug = makePersonFixture({
      id: '42',
      firstName: 'Douglas',
      lastName: 'Adams',
      age: 49,
      occupation: 'Author',
    });
  });

  test('successfully retrieves item by id', () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });

    expect(m.getLength()).toBe(3);
  });
});

describe('set', () => {
  let han: Person;
  let george: Person;
  let doug: Person;

  beforeEach(() => {
    han = makePersonFixture();
    george = makePersonFixture({
      id: '1138',
      firstName: 'George',
      lastName: 'Lucas',
      age: 77,
      occupation: 'Movie director',
    });
    doug = makePersonFixture({
      id: '42',
      firstName: 'Douglas',
      lastName: 'Adams',
      age: 49,
      occupation: 'Author',
    });
  });

  test('successfully sets a new object at a new id', () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });
    const p = makePersonFixture({
      id: '1',
      firstName: 'Alisayr',
      lastName: 'N/A',
      age: 999,
      occupation: 'God of Eliya',
    });

    m.set(p.id, p);

    expect(m).toEqual(
      new MableObject({
        [george.id]: george,
        [han.id]: han,
        [doug.id]: doug,
        [p.id]: p,
      })
    );
  });

  test('successfully overwrites an object at a previously-existing id', () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });
    const p = makePersonFixture({
      id: han.id,
      firstName: 'Alisayr',
      lastName: 'N/A',
      age: 999,
      occupation: 'God of Eliya',
    });

    m.set(p.id, p);

    expect(m).toEqual(
      new MableObject({
        [george.id]: george,
        [doug.id]: doug,
        [p.id]: p,
      })
    );
  });
});

describe('update', () => {
  let han: Person;
  let george: Person;
  let doug: Person;

  beforeEach(() => {
    han = makePersonFixture();
    george = makePersonFixture({
      id: '1138',
      firstName: 'George',
      lastName: 'Lucas',
      age: 77,
      occupation: 'Movie director',
    });
    doug = makePersonFixture({
      id: '42',
      firstName: 'Douglas',
      lastName: 'Adams',
      age: 49,
      occupation: 'Author',
    });
  });

  test('successfully updates an object at a previously-existing id', () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });
    const han2: Partial<Person> = {
      occupation: 'def something legal lol',
    };

    m.update(han.id, han2);

    expect(m).toEqual(
      new MableObject({
        [george.id]: george,
        [han.id]: { ...han, occupation: 'def something legal lol' },
        [doug.id]: doug,
      })
    );
  });

  test('does nothing if the id passed in does not exist', () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });
    const han2: Partial<Person> = {
      occupation: 'def something legal lol',
    };

    m.update('does-not-exist', han2);

    expect(m).toEqual(
      new MableObject({
        [george.id]: george,
        [han.id]: han,
        [doug.id]: doug,
      })
    );
  });
});

// End of setters, getters, updaters, and get-infoers tests.
