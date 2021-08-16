import { makeFixture } from 'make-fixture';
import { GenericObject } from '../types';

export const makeGenericObjectStringFixture = (
  overrides?: GenericObject<string>
) => {
  const defaults: GenericObject<string> = {};

  return makeFixture(defaults, overrides);
};
