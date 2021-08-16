import {
  BooleanCallback,
  GenericObject,
  ReturnGenericCallback,
  VoidCallback,
} from './types';

class MableObject<T> {
  public theObject: GenericObject<T>; // <- "The Object"

  constructor(generic: GenericObject<T>) {
    this.theObject = generic;
  }

  // Start of helper functions.

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

  /**
   * Returns a new MableObject containing only the items that pass the
   * conditional provided by the callback.
   */
  filter(callback: BooleanCallback<T>): MableObject<T> {
    const newValues: GenericObject<T> = {};

    Object.keys(this.theObject).forEach((key, index) => {
      const item = this.theObject[key];

      if (callback(item, index)) {
        newValues[key] = item;
      }
    });

    return new MableObject(newValues);
  }

  /**
   * Returns the FIRST value in The Object that matches the conditional
   * provided by the callback or undefined if no matches are found.
   */
  find(callback: BooleanCallback<T>): T | undefined {
    this.forEach((item, index) => {
      if (callback(item, index)) {
        return item;
      }
    });

    return undefined;
  }

  /**
   * Returns ALL values in The Object that match the conditional provided
   * by the callback or undefined if no matches are found.
   */
  findAll(callback: BooleanCallback<T>): MableObject<T> | undefined {
    const foundValues: GenericObject<T> = {};

    Object.keys(this.theObject).forEach((key, index) => {
      const item = this.theObject[key];

      if (callback(item, index)) {
        foundValues[key] = item;
      }
    });

    if (Object.keys(foundValues).length === 0) {
      return undefined;
    } else {
      return new MableObject(foundValues);
    }
  }

  /**
   * Loops through each value on The Object and performs the logic
   * in the callback function on each one.
   *
   * Syntactical sugar for Object.values(TheObject).forEach(callback);
   */
  forEach(callback: VoidCallback<T>): void {
    Object.values(this.theObject).forEach(callback);
  }

  /**
   * Returns true if The Object contains a value that matches the conditional
   * provided by the callback. Returns false otherwise.
   */
  includes(callback: BooleanCallback<T>): boolean {
    this.forEach((item, index) => {
      if (callback(item, index)) {
        return true;
      }
    });

    return false;
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
    const newValues: GenericObject<T> = {};

    Object.keys(this.theObject).forEach((key, index) => {
      newValues[key] = callback(this.theObject[key], index);
    });

    return new MableObject(newValues);
  }

  /**
   * Returns true if at least ONE value in The Object returns true
   * for the callback, returns false otherwise.
   */
  some(callback: BooleanCallback<T>): boolean {
    this.forEach((item, index) => {
      if (callback(item, index)) {
        return true;
      }
    });

    return false;
  }

  // End of helper functions.

  // Start of setters, getters, updaters, and get-infoers.

  /**
   * Deletes the item at key "key" in The Object.
   */
  delete(key: string | number): void {
    delete this.theObject[key];
  }

  /**
   * Gets the item at key "key" in The Object.
   */
  get(key: string | number): T {
    return this.theObject[key];
  }

  /**
   * Returns the values stored in The Object as an array.
   */
  getAsArray(): T[] {
    return Object.values(this.theObject);
  }

  /**
   * Get the number of items stored in the MableObject.
   */
  getLength(): number {
    return Object.keys(this.theObject).length;
  }

  /**
   * Updates the item at "key" in The Object with only the
   * changes passsed in as "updates."
   */
  update(key: string | number, updates: Partial<T>): void {
    const item = this.get(key);

    this.set(key, { ...item, ...updates });
  }

  /**
   * Sets the item at key "key" in The Object. Overwrites any
   * previously-existing item at that key.
   */
  set(key: string | number, value: T): void {
    this.theObject[key] = value;
  }
}

export default MableObject;
