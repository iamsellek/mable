import { BooleanCallback, ReturnGenericCallback, VoidCallback } from './types';

class MableObject<T> {
  generic: Record<string, T>; // <- The Object

  constructor(generic: Record<string, T>) {
    this.generic = generic;
  }

  /**
   * Loops through each value on The Object and performs the logic
   * in the callback function on each one.
   *
   * Syntactical sugar for Object.values(TheObject).forEach(callback);
   */
  forEach(callback: VoidCallback<T>): void {
    Object.values(this.generic).forEach(callback);
  }

  /**
   * Loops through each value on The Object. Makes a change to each value
   * based on the logic in the callback.
   *
   * @param callback A callback that will take an item of type T, change
   * it in some way, and return the changed value, which is also of type
   * T.
   *
   * @returns a brand new MableObject with the changed values.
   */

  map(callback: ReturnGenericCallback<T>): MableObject<T> {
    const newValues: Record<string, T> = {};

    Object.keys(this.generic).forEach((key, index) => {
      newValues[key] = callback(this.generic[key], index);
    });

    return new MableObject(newValues);
  }

  /**
   * Ensures that every value on The Object matches some conditional
   * provided in the callback.
   */
  every(callback: BooleanCallback<T>): boolean {
    let result = false;

    this.forEach((item, index) => {
      result = callback(item, index);

      if (!result) {
        return false;
      }
    });

    return true;
  }
}

export default MableObject;
