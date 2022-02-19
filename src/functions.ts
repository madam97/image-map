/**
 * Map thats has only number keys starting with 0
 */
export class MapArray<V> extends Map<number,V> {
  /**
   * Returns the next key
   * @returns 
   */
  keyNext(): number {
    const lastKey = Array.from(this.keys()).pop();
    return lastKey !== undefined ? lastKey+1 : 0;
  }

  /**
   * Sets the next value
   * @param value 
   */
  setNext(value: V): void {
    this.set(this.keyNext(), value);
  }

  /**
   * Clears the map then fills it with the given array's values
   * @param values
   */
  fill(values: V[]): void {
    this.clear();
    values.map(value => this.setNext(value));
  }

  /**
   * Returns the value of the index. key
   * @param index 
   */
  getIndex(index: number): V | undefined {
    const key = Array.from(this.keys())[index]; 
    return key !== undefined ? this.get(key) : undefined;
  }

  /**
   * Calls a defined callback function on each element of the map, and returns an array that contains the results.
   * @param callbackfn 
   * @returns 
   */
  map(callbackfn: (value: V, key: number) => any): any[] {
    const data: any[] = [];
    this.forEach((value,key) => {
      data.push( callbackfn(value,key) );
    });
    return data;
  }
}