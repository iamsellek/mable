import { makeGenericObjectStringFixture } from './fixtures/strings';
import MableObject from './index';

describe('MableObject base tests', () => {
  test('constructor', () => {
    const theObject = makeGenericObjectStringFixture({ one: '1' });

    const m = new MableObject(theObject);

    expect(m.theObject).toEqual(theObject);
  });
});

describe('every', () => {
  test('returns true when ALL values match the conditional', () => {
    const theObject = makeGenericObjectStringFixture({
      one: '1',
      two: '2',
      three: '3',
      four: '4',
      five: '5',
    });
    const m = new MableObject(theObject);

    expect(m.every((item) => item.length === 1)).toBe(true);
  });

  test('returns false when NONE of the values match the conditional', () => {
    const theObject = makeGenericObjectStringFixture({
      one: '1',
      two: '2',
      three: '3',
      four: '4',
      five: '5',
    });
    const m = new MableObject(theObject);

    expect(m.every((item) => item.length === 1138)).toBe(false);
  });

  test('return false when ANY ONE of the values does not match the conditional', () => {
    const mFirst = new MableObject(
      makeGenericObjectStringFixture({
        one: 'one',
        two: '2',
        three: '3',
        four: '4',
        five: '5',
      })
    );
    const mSecond = new MableObject(
      makeGenericObjectStringFixture({
        one: '1',
        two: 'two',
        three: '3',
        four: '4',
        five: '5',
      })
    );
    const mThird = new MableObject(
      makeGenericObjectStringFixture({
        one: '1',
        two: '2',
        three: 'three',
        four: '4',
        five: '5',
      })
    );
    const mFourth = new MableObject(
      makeGenericObjectStringFixture({
        one: '1',
        two: '2',
        three: '3',
        four: 'four',
        five: '5',
      })
    );
    const mFifth = new MableObject(
      makeGenericObjectStringFixture({
        one: '1',
        two: '2',
        three: '3',
        four: '4',
        five: 'five',
      })
    );

    expect(mFirst.every((item) => item.length === 1)).toBe(false);
    expect(mSecond.every((item) => item.length === 1)).toBe(false);
    expect(mThird.every((item) => item.length === 1)).toBe(false);
    expect(mFourth.every((item) => item.length === 1)).toBe(false);
    expect(mFifth.every((item) => item.length === 1)).toBe(false);
  });
});
