import { makePersonFixture, Person } from './fixtures/person';
import MableObject from './index';

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

describe('has', () => {
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

  test('returns true if a key-value pair exists for the given key', () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });

    expect(m.has(han.id)).toBe(true);
  });

  test('returns false if a key-value pair does not exist for the given key', () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });

    expect(m.has('not-an-id')).toBe(false);
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
