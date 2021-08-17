import { makeFixture } from 'make-fixture';

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  occupation: string;
}

export const makePersonFixture = (overrides?: Partial<Person>): Person => {
  const defaults: Person = {
    id: 'less-than-12-parsecs',
    firstName: 'Han',
    lastName: 'Solo',
    age: 29,
    occupation: 'Smuggler',
  };

  return makeFixture(defaults, overrides);
};
