import {
  BooleanCallback,
  BooleanCallbackAsync,
  GenericObject,
  ReturnGenericCallback,
  ReturnGenericCallbackAsync,
  VoidCallback,
  VoidCallbackAsync,
} from './types';

class MableObject<T> {
  public theObject: GenericObject<T>; // <- "The Object"

  constructor(generic?: GenericObject<T>) {
    this.theObject = generic ?? {};
  }

  // Start of helper functions.

  /**
   * Ensures that every value on The Object matches some conditional
   * provided in the callback.
   */
  every(callback: BooleanCallback<T>): boolean {
    let i = 0;

    for (let item of Object.values(this.theObject)) {
      if (!callback(item, i)) {
        return false;
      }

      i += 1;
    }

    return true;
  }

  /**
   * Same as every, but asynchronous. Awaits each promise one at a time. Best
   * for when you need each promise to resolve before moving on to the next one.
   */
  async everyAsyncEach(callback: BooleanCallbackAsync<T>): Promise<boolean> {
    let i = 0;

    for (let item of Object.values(this.theObject)) {
      if (!(await callback(item, i))) {
        return false;
      }

      i += 1;
    }

    return true;
  }

  /**
   * Same as every, but asynchronous. Fires off all promises and then
   * awaits them all with a Promise.all(). Best when individual promises
   * don't have to wait on each other to resolve.
   */
  async everyAsyncAll(callback: BooleanCallbackAsync<T>): Promise<boolean> {
    let i = 0;
    const promises: Promise<boolean>[] = [];

    for (let item of Object.values(this.theObject)) {
      promises.push(callback(item, i));

      i += 1;
    }

    const resolvedPromises = await Promise.all(promises);

    for (let promise of resolvedPromises) {
      if (!promise) {
        return false;
      }
    }

    return true;
  }

  /**
   * Returns a new MableObject containing only the items that pass the
   * conditional provided by the callback.
   */
  filter(callback: BooleanCallback<T>): MableObject<T> {
    const newValues: GenericObject<T> = {};
    let i = 0;

    for (let key of Object.keys(this.theObject)) {
      const item = this.theObject[key];

      if (callback(item, i)) {
        newValues[key] = item;
      }
    }

    return new MableObject(newValues);
  }

  /**
   * Same as filter, but asynchronous. Awaits each promise one at a time. Best
   * for when you need each promise to resolve before moving on to the next one.
   */
  async filterAsyncEach(
    callback: BooleanCallbackAsync<T>
  ): Promise<MableObject<T>> {
    let i = 0;
    const newValues: GenericObject<T> = {};

    for (let key of Object.keys(this.theObject)) {
      const item = this.theObject[key];

      if (await callback(item, i)) {
        newValues[key] = item;
      }

      i += 1;
    }

    return new MableObject(newValues);
  }

  /**
   * Same as filter, but asynchronous. Fires off all promises and then
   * awaits them all with a Promise.all(). Best when individual promises
   * don't have to wait on each other to resolve.
   */
  async filterAsyncAll(
    callback: BooleanCallbackAsync<T>
  ): Promise<MableObject<T>> {
    let i = 0;
    const newValues: GenericObject<T> = {};
    const promises: Promise<boolean>[] = [];

    for (let key of Object.keys(this.theObject)) {
      const item = this.theObject[key];

      promises.push(callback(item, i));

      i += 1;
    }

    const resolvedPromises = await Promise.all(promises);
    i = 0;

    for (let key of Object.keys(this.theObject)) {
      const item = this.theObject[key];

      if (resolvedPromises[i]) {
        newValues[key] = item;
      }

      i += 1;
    }

    return new MableObject(newValues);
  }

  /**
   * Returns the FIRST value in The Object that matches the conditional
   * provided by the callback or undefined if no matches are found.
   *
   * Also, "first" might be a misnomer here. I'm not sure how JS sorts
   * Objects' key-value pairs, so I can't tell you for sure WHICH of
   * your values will be found with this function, but if you're using
   * logic that says "just give me the first one you find," you likely
   * don't care which that is as long as one is returned or one isn't.
   * If this ends up not being the case, I can try to rework this
   * function.
   */
  find(callback: BooleanCallback<T>): T | undefined {
    let i = 0;

    for (let item of Object.values(this.theObject)) {
      if (callback(item, i)) {
        return item;
      }

      i += 1;
    }

    return undefined;
  }

  /**
   * Same as find, but asynchronous. Awaits each promise one at a time. Best
   * for when you need each promise to resolve before moving on to the next one.
   */
  async findAsyncEach(
    callback: BooleanCallbackAsync<T>
  ): Promise<T | undefined> {
    let i = 0;

    for (let item of Object.values(this.theObject)) {
      if (await callback(item, i)) {
        return item;
      }

      i += 1;
    }

    return undefined;
  }

  /**
   * Same as find, but asynchronous. Fires off all promises and then
   * awaits them all with a Promise.all(). Best when individual promises
   * don't have to wait on each other to resolve.
   */
  async findAsyncAll(
    callback: BooleanCallbackAsync<T>
  ): Promise<T | undefined> {
    let i = 0;
    const promises: Promise<boolean>[] = [];

    for (let item of Object.values(this.theObject)) {
      promises.push(callback(item, i));

      i += 1;
    }

    i = 0;

    const resolvedPromises = await Promise.all(promises);

    for (let item of Object.values(this.theObject)) {
      if (resolvedPromises[i]) {
        return item;
      }

      i += 1;
    }

    return undefined;
  }

  /**
   * Returns ALL values in The Object that match the conditional provided
   * by the callback or undefined if no matches are found.
   */
  findAll(callback: BooleanCallback<T>): MableObject<T> | undefined {
    const foundValues: GenericObject<T> = {};
    let i = 0;

    for (let key of Object.keys(this.theObject)) {
      const item = this.theObject[key];

      if (callback(item, i)) {
        foundValues[key] = item;
      }

      i += 1;
    }

    if (Object.keys(foundValues).length === 0) {
      return undefined;
    } else {
      return new MableObject(foundValues);
    }
  }

  /**
   * Same as findAll, but asynchronous. Awaits each promise one at a time. Best
   * for when you need each promise to resolve before moving on to the next one.
   */
  async findAllAsyncEach(
    callback: BooleanCallbackAsync<T>
  ): Promise<MableObject<T> | undefined> {
    const foundValues: GenericObject<T> = {};
    let i = 0;

    for (let key of Object.keys(this.theObject)) {
      const item = this.theObject[key];

      if (await callback(item, i)) {
        foundValues[key] = item;
      }

      i += 1;
    }

    if (Object.keys(foundValues).length === 0) {
      return undefined;
    } else {
      return new MableObject(foundValues);
    }
  }

  /**
   * Same as findAll, but asynchronous. Fires off all promises and then
   * awaits them all with a Promise.all(). Best when individual promises
   * don't have to wait on each other to resolve.
   */
  async findAllAsyncAll(
    callback: BooleanCallbackAsync<T>
  ): Promise<MableObject<T> | undefined> {
    const foundValues: GenericObject<T> = {};
    let i = 0;
    const promises: Promise<boolean>[] = [];

    for (let key of Object.keys(this.theObject)) {
      const item = this.theObject[key];

      promises.push(callback(item, i));

      i += 1;
    }

    const resolvedPromises = await Promise.all(promises);
    i = 0;

    for (let key of Object.keys(this.theObject)) {
      const item = this.theObject[key];

      if (resolvedPromises[i]) {
        foundValues[key] = item;
      }

      i += 1;
    }

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
   * Syntactical sugar for `for (let item of Object.values(TheObject)) { callback() }`
   */
  forEach(callback: VoidCallback<T>): void {
    let i = 0;

    for (let item of Object.values(this.theObject)) {
      callback(item, i);

      i += 1;
    }
  }

  /**
   * Same as forEach, but asynchronous. Awaits each promise one at a time. Best
   * for when you need each promise to resolve before moving on to the next one.
   */
  async forEachAsyncEach(callback: VoidCallbackAsync<T>): Promise<void> {
    let i = 0;

    for (let item of Object.values(this.theObject)) {
      await callback(item, i);

      i += 1;
    }
  }

  /**
   * Same as forEach, but asynchronous. Fires off all promises and then
   * awaits them all with a Promise.all(). Best when individual promises
   * don't have to wait on each other to resolve.
   */
  async forEachAsyncAll(callback: VoidCallbackAsync<T>): Promise<void> {
    let i = 0;
    const promises: Promise<void>[] = [];

    for (let item of Object.values(this.theObject)) {
      promises.push(callback(item, i));

      i += 1;
    }

    await Promise.all(promises);
  }

  /**
   * Returns true if The Object contains a value that matches the conditional
   * provided by the callback. Returns false otherwise.
   */
  includes(callback: BooleanCallback<T>): boolean {
    let i = 0;

    for (let item of Object.values(this.theObject)) {
      if (callback(item, i)) {
        return true;
      }

      i += 1;
    }

    return false;
  }

  /**
   * Same as includes, but asynchronous. Awaits each promise one at a time. Best
   * for when you need each promise to resolve before moving on to the next one.
   */
  async includesAsyncEach(callback: BooleanCallbackAsync<T>): Promise<boolean> {
    let i = 0;

    for (let item of Object.values(this.theObject)) {
      if (await callback(item, i)) {
        return true;
      }

      i += 1;
    }

    return false;
  }

  /**
   * Same as includes, but asynchronous. Fires off all promises and then
   * awaits them all with a Promise.all(). Best when individual promises
   * don't have to wait on each other to resolve.
   */
  async includesAsyncAll(callback: BooleanCallbackAsync<T>): Promise<boolean> {
    let i = 0;
    const promises: Promise<boolean>[] = [];

    for (let item of Object.values(this.theObject)) {
      promises.push(callback(item, i));

      i += 1;
    }

    const resolvedPromises = await Promise.all(promises);

    for (let resolvedPromise of resolvedPromises) {
      if (resolvedPromise) {
        return true;
      }
    }

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
    let i = 0;
    const newValues: GenericObject<T> = {};

    for (let key of Object.keys(this.theObject)) {
      newValues[key] = callback(this.theObject[key], i);
    }

    return new MableObject(newValues);
  }

  /**
   * Same as map, but asynchronous. Awaits each promise one at a time. Best
   * for when you need each promise to resolve before moving on to the next one.
   */
  async mapAsyncEach(
    callback: ReturnGenericCallbackAsync<T>
  ): Promise<MableObject<T>> {
    let i = 0;
    const newValues: GenericObject<T> = {};

    for (let key of Object.keys(this.theObject)) {
      newValues[key] = await callback(this.theObject[key], i);
      i += 1;
    }

    return new MableObject(newValues);
  }

  /**
   * Same as map, but asynchronous. Fires off all promises and then
   * awaits them all with a Promise.all(). Best when individual promises
   * don't have to wait on each other to resolve.
   */
  async mapAsyncAll(
    callback: ReturnGenericCallbackAsync<T>
  ): Promise<MableObject<T>> {
    let i = 0;
    const newValues: GenericObject<T> = {};
    const promises: Promise<T>[] = [];

    for (let key of Object.keys(this.theObject)) {
      promises.push(callback(this.theObject[key], i));
      i += 1;
    }

    const resolvedPromises = await Promise.all(promises);
    i = 0;

    for (let key of Object.keys(this.theObject)) {
      newValues[key] = resolvedPromises[i];
      i += 1;
    }

    return new MableObject(newValues);
  }

  /**
   * Returns true if at least ONE value in The Object returns true
   * for the callback, returns false otherwise.
   */
  some(callback: BooleanCallback<T>): boolean {
    let i = 0;

    for (let item of Object.values(this.theObject)) {
      if (callback(item, i)) {
        return true;
      }

      i += 1;
    }

    return false;
  }

  /**
   * Same as some, but asynchronous. Awaits each promise one at a time. Best
   * for when you need each promise to resolve before moving on to the next one.
   */
  async someAsyncEach(callback: BooleanCallbackAsync<T>): Promise<boolean> {
    let i = 0;

    for (let item of Object.values(this.theObject)) {
      if (await callback(item, i)) {
        return true;
      }

      i += 1;
    }

    return false;
  }

  /**
   * Same as some, but asynchronous. Fires off all promises and then
   * awaits them all with a Promise.all(). Best when individual promises
   * don't have to wait on each other to resolve.
   */
  async someAsyncAll(callback: BooleanCallbackAsync<T>): Promise<boolean> {
    let i = 0;
    const promises: Promise<boolean>[] = [];

    for (let item of Object.values(this.theObject)) {
      promises.push(callback(item, i));
      i += 1;
    }

    const resolvedPromises = await Promise.all(promises);

    for (let resolvedPromise of resolvedPromises) {
      if (resolvedPromise) {
        return true;
      }
    }

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
  get(key: string | number): T | undefined {
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
   * Returns true if a key-value pair exists for a given key.
   * Returns false otherwise.
   */
  has(key: string): boolean {
    return !!this.theObject[key];
  }

  /**
   * Sets the item at key "key" in The Object. Overwrites any
   * previously-existing item at that key.
   */
  set(key: string | number, value: T): void {
    this.theObject[key] = value;
  }

  /**
   * Updates the item at "key" in The Object with only the
   * changes passsed in as "updates." Does NOTHING if item at
   * "key" does not already exist.
   */
  update(key: string | number, updates: Partial<T>): void {
    const item = this.get(key);

    if (!item) {
      return;
    }

    this.set(key, { ...item, ...updates });
  }
}

export default MableObject;
