import MableObject from '.';
import { makePersonFixture, Person } from './fixtures/person';

const promisifyItem = async <T>(returnItem: T): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(returnItem);
    }, 0);
  });

describe('MableObject base tests', () => {
  test('constructor', () => {
    const person = makePersonFixture();

    const m = new MableObject({ [person.id]: person });

    expect(m.getTheObject()[person.id]).toEqual(person);
  });

  test('allows the creation of a MableObject without an initial value', () => {
    const m = new MableObject();

    expect(m.getTheObject()).toEqual({});
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
    han = makePersonFixture({ id: han.id, firstName: george.firstName });

    const m = new MableObject({
      [han.id]: han,
      [george.id]: george,
      [doug.id]: doug,
    });

    expect(m.every((item) => item.firstName === george.firstName)).toBe(false);
  });
});

describe('every async', () => {
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

  test('returns true when ALL values match the conditional', async () => {
    const m = new MableObject({
      [han.id]: han,
      [george.id]: george,
      [doug.id]: doug,
    });

    expect(
      await m.everyAsyncEach((item) => promisifyItem(item.firstName.length > 1))
    ).toBe(true);
    expect(
      await m.everyAsyncAll((item) => promisifyItem(item.firstName.length > 1))
    ).toBe(true);
  });

  test('returns false when NONE of the values match the conditional', async () => {
    const m = new MableObject({
      [han.id]: han,
      [george.id]: george,
      [doug.id]: doug,
    });

    expect(
      await m.everyAsyncEach((item) =>
        promisifyItem(item.firstName.length === 1000)
      )
    ).toBe(false);
    expect(
      await m.everyAsyncAll((item) =>
        promisifyItem(item.firstName.length === 1000)
      )
    ).toBe(false);
  });

  test('return false when ANY ONE of the values does not match the conditional', async () => {
    han = makePersonFixture({ id: han.id, firstName: george.firstName });

    const m = new MableObject({
      [han.id]: han,
      [george.id]: george,
      [doug.id]: doug,
    });

    expect(
      await m.everyAsyncEach((item) =>
        promisifyItem(item.firstName === george.firstName)
      )
    ).toBe(false);
    expect(
      await m.everyAsyncAll((item) =>
        promisifyItem(item.firstName === george.firstName)
      )
    ).toBe(false);
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

    expect(m.getTheObject()).not.toEqual(m2.getTheObject());
    expect(m2.getTheObject()).toEqual({ [han.id]: han, [george.id]: george });
  });
});

describe('filter async', () => {
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

  test('filters according to conditional and returns new object while leaving original untouched', async () => {
    const m = new MableObject({
      [han.id]: han,
      [george.id]: george,
      [doug.id]: doug,
    });
    const m2Each = await m.filterAsyncEach((item) =>
      promisifyItem(
        item.firstName === han.firstName || item.firstName === george.firstName
      )
    );
    const m2All = await m.filterAsyncEach((item) =>
      promisifyItem(
        item.firstName === han.firstName || item.firstName === george.firstName
      )
    );

    expect(m.getTheObject()).not.toEqual(m2Each.getTheObject());
    expect(m2Each.getTheObject()).toEqual({
      [han.id]: han,
      [george.id]: george,
    });
    expect(m.getTheObject()).not.toEqual(m2All.getTheObject());
    expect(m2All.getTheObject()).toEqual({
      [han.id]: han,
      [george.id]: george,
    });
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
    doug = makePersonFixture({ id: doug.id, firstName: han.firstName });

    const m = new MableObject({
      [han.id]: han,
      [doug.id]: doug,
      [george.id]: george,
    });
    const found = m.find((item) => item.firstName === han.firstName);

    expect(found).toBe(doug);
  });

  test('stops the loop once it finds a match', () => {
    doug = makePersonFixture({ id: doug.id, firstName: han.firstName });
    george = makePersonFixture({ id: george.id, firstName: han.firstName });

    const m = new MableObject({
      [han.id]: han,
      [doug.id]: doug,
      [george.id]: george,
    });

    const callback = jest.fn();
    callback.mockReturnValueOnce(true);

    const result = m.find(callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(result).toEqual(Object.values(m.getTheObject())[0]);
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

describe('find async', () => {
  let han: Person;
  let george: Person;
  let doug: Person;
  let objectValuesSpy = jest.spyOn(Object, 'values');

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
    objectValuesSpy.mockClear();
  });

  test('successfully finds a value based on the callback', async () => {
    const m = new MableObject({
      [han.id]: han,
      [george.id]: george,
      [doug.id]: doug,
    });

    expect(
      await m.findAsyncEach((item) => promisifyItem(item.id === han.id))
    ).toEqual(han);
    expect(
      await m.findAsyncAll((item) => promisifyItem(item.id === han.id))
    ).toEqual(han);
  });

  test('only finds the first matching value', async () => {
    doug = makePersonFixture({ id: doug.id, firstName: han.firstName });

    const m = new MableObject({
      [han.id]: han,
      [doug.id]: doug,
      [george.id]: george,
    });

    const foundEach = await m.findAsyncEach((item) =>
      promisifyItem(item.firstName === han.firstName)
    );
    const foundAll = await m.findAsyncAll((item) =>
      promisifyItem(item.firstName === han.firstName)
    );

    expect(foundEach).toBe(doug);
    expect(foundAll).toBe(doug);
  });

  test('(asyncEach) stops the loop once it finds a match', async () => {
    doug = makePersonFixture({ id: doug.id, firstName: han.firstName });
    george = makePersonFixture({ id: george.id, firstName: han.firstName });

    const m = new MableObject({
      [han.id]: han,
      [doug.id]: doug,
      [george.id]: george,
    });

    const callback = jest.fn();
    callback.mockResolvedValueOnce(true);

    const result = await m.findAsyncEach(callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(result).toEqual(Object.values(m.getTheObject())[0]);
  });

  test('(asyncAll) stops the (second) loop once it finds a match', async () => {
    doug = makePersonFixture({ id: doug.id, firstName: han.firstName });
    george = makePersonFixture({ id: george.id, firstName: han.firstName });

    const m = new MableObject({
      [han.id]: han,
      [doug.id]: doug,
      [george.id]: george,
    });

    const callback = jest.fn();
    callback.mockResolvedValueOnce(true);
    callback.mockResolvedValueOnce(false);
    callback.mockResolvedValueOnce(false);

    const result = await m.findAsyncAll(callback);

    expect(callback).toHaveBeenCalledTimes(3);
    expect(objectValuesSpy).toHaveBeenCalledTimes(2);
    expect(result).toEqual(Object.values(m.getTheObject())[0]);
  });

  test('returns undefined if no matches are found', async () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });

    expect(
      await m.findAsyncEach((item) => promisifyItem(item.id === 'not-real'))
    ).toBe(undefined);
    expect(
      await m.findAsyncAll((item) => promisifyItem(item.id === 'not-real'))
    ).toBe(undefined);
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
    han = makePersonFixture({ id: han.id, firstName: george.firstName });

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

    expect(m.findAll((item) => item.id === 'not-real')).toBe(undefined);
  });
});

describe('findAll async', () => {
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

  test('successfully finds only one matching value and returns it in a new MableObject', async () => {
    const m = new MableObject({
      [han.id]: han,
      [george.id]: george,
      [doug.id]: doug,
    });

    expect(
      await m.findAllAsyncEach((item) => promisifyItem(item.id === han.id))
    ).toEqual(new MableObject({ [han.id]: han }));
    expect(
      await m.findAllAsyncAll((item) => promisifyItem(item.id === han.id))
    ).toEqual(new MableObject({ [han.id]: han }));
  });

  test('successfully finds multiple matching values and returns them in a new MableObject', async () => {
    han = makePersonFixture({ id: han.id, firstName: george.firstName });

    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });

    expect(
      await m.findAllAsyncEach((item) =>
        promisifyItem(item.firstName === george.firstName)
      )
    ).toEqual(new MableObject({ [han.id]: han, [george.id]: george }));
    expect(
      await m.findAllAsyncAll((item) =>
        promisifyItem(item.firstName === george.firstName)
      )
    ).toEqual(new MableObject({ [han.id]: han, [george.id]: george }));
  });

  test('returns undefined if there are no matches', async () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });

    expect(
      await m.findAllAsyncEach((item) => promisifyItem(item.id === 'not-real'))
    ).toBe(undefined);
    expect(
      await m.findAllAsyncAll((item) => promisifyItem(item.id === 'not-real'))
    ).toBe(undefined);
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

describe('forEach async', () => {
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

  test('(asyncEach) forEach runs a callback against each object in The Object', async () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });
    const ages: number[] = [];

    await m.forEachAsyncEach(async (item) => {
      await promisifyItem(ages.push(item.age));
    });

    // The order isn't guaranteed, so let's check for each individually.
    expect(ages.includes(29) && ages.includes(77) && ages.includes(49)).toBe(
      true
    );
    expect(ages.length).toBe(3);
  });

  test('(asyncAll) forEach runs a callback against each object in The Object', async () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });
    const ages: number[] = [];

    await m.forEachAsyncAll(async (item) => {
      await promisifyItem(ages.push(item.age));
    });

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

    const result = m.includes(callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
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

describe('includes async', () => {
  let han: Person;
  let george: Person;
  let doug: Person;
  let objectValuesSpy = jest.spyOn(Object, 'values');

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
    objectValuesSpy.mockClear();
  });

  test('returns true when TheObject contains a matching item', async () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });

    expect(
      await m.includesAsyncEach((item) =>
        promisifyItem(item.firstName === han.firstName)
      )
    ).toBe(true);
    expect(
      await m.includesAsyncAll((item) =>
        promisifyItem(item.firstName === han.firstName)
      )
    ).toBe(true);
  });

  test('(asyncEach) stops the loop once an item is found', async () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });
    const callback = jest.fn();
    callback.mockResolvedValueOnce(true);

    const result = await m.includesAsyncEach(callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
  });

  test('(asyncAll) stops the (second) loop once an item is found', async () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });
    const callback = jest.fn();
    callback.mockResolvedValueOnce(true);
    callback.mockResolvedValueOnce(false);
    callback.mockResolvedValueOnce(false);

    const result = await m.includesAsyncAll(callback);

    expect(callback).toHaveBeenCalledTimes(3);
    expect(objectValuesSpy).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
  });

  test('returns false when TheObject does not contain a matching item', async () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });

    expect(
      await m.includesAsyncEach((item) =>
        promisifyItem(item.firstName === 'NotARealName')
      )
    ).toBe(false);
    expect(
      await m.includesAsyncAll((item) =>
        promisifyItem(item.firstName === 'NotARealName')
      )
    ).toBe(false);
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

describe('map async', () => {
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

  test('(asyncEach) returns a new MableObject with changed data', async () => {
    const notHan: Person = makePersonFixture({
      ...han,
      firstName: `Not-${han.firstName}`,
    });
    const notGeorge: Person = makePersonFixture({
      ...george,
      firstName: `Not-${george.firstName}`,
    });
    const notDoug: Person = makePersonFixture({
      ...doug,
      firstName: `Not-${doug.firstName}`,
    });

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
    const result = await m.mapAsyncEach((item) =>
      promisifyItem({
        ...item,
        firstName: `Not-${item.firstName}`,
      })
    );

    expect(m).toEqual(
      new MableObject({ [george.id]: george, [han.id]: han, [doug.id]: doug })
    );
    expect(result).not.toEqual(m);
    expect(result).toEqual(m2);
  });

  test('(asyncAll) returns a new MableObject with changed data', async () => {
    const notHan: Person = makePersonFixture({
      ...han,
      firstName: `Not-${han.firstName}`,
    });
    const notGeorge: Person = makePersonFixture({
      ...george,
      firstName: `Not-${george.firstName}`,
    });
    const notDoug: Person = makePersonFixture({
      ...doug,
      firstName: `Not-${doug.firstName}`,
    });

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
    const result = await m.mapAsyncAll((item) =>
      promisifyItem({
        ...item,
        firstName: `Not-${item.firstName}`,
      })
    );

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
    const result = m.some(callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
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

describe('some async', () => {
  let han: Person;
  let george: Person;
  let doug: Person;
  let objectValuesSpy = jest.spyOn(Object, 'values');

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
    objectValuesSpy.mockClear();
  });

  test('returns true when just one value matches the conditional', async () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });

    expect(
      await m.someAsyncEach((item) =>
        promisifyItem(item.firstName === han.firstName)
      )
    );
    expect(
      await m.someAsyncAll((item) =>
        promisifyItem(item.firstName === han.firstName)
      )
    );
  });

  test('(asyncEach) stops the loop once a true value is found', async () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });
    const callback = jest.fn();
    callback.mockResolvedValueOnce(true);
    const result = await m.someAsyncEach(callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(objectValuesSpy).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
  });

  test('(asyncAll) stops the (second) loop once a true value is found', async () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });
    const callback = jest.fn();
    callback.mockResolvedValueOnce(true);
    callback.mockResolvedValueOnce(false);
    callback.mockResolvedValueOnce(false);
    const result = await m.someAsyncAll(callback);

    expect(callback).toHaveBeenCalledTimes(3);
    expect(objectValuesSpy).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
  });

  test('returns false when no values match the conditional', async () => {
    const m = new MableObject({
      [george.id]: george,
      [han.id]: han,
      [doug.id]: doug,
    });

    expect(
      await m.someAsyncEach((item) =>
        promisifyItem(item.firstName === 'Not Real Name')
      )
    );
    expect(
      await m.someAsyncAll((item) =>
        promisifyItem(item.firstName === 'Not Real Name')
      )
    );
  });
});
