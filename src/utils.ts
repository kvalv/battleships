export class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  equals(other: Position) {
    return this.x == other.x && this.y == other.y;
  }
  index(cols: number) {
    return this.y * cols + this.x;
  }
}

export function positionFromIndex(index: number, cols: number) {
  const x = Math.floor(index / cols);
  const y = index - x * cols;
  return new Position(x, y);
}

export let range = (a: number, b: number) => [...Array(b).keys()].slice(a);

export function choice(arr: any[]) {
  return arr[Math.floor(arr.length * Math.random())];
}

export const shuffle = (arr) => {
  const newArr = arr.slice();
  for (let i = newArr.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }
  return newArr;
};

export class Counter {
  values: any;

  constructor() {
    this.values = {};
  }

  add(arr: any[]) {
    arr.forEach((v) => {
      this.values[v] = (this.values[v] || 0) + 1;
    });
  }
  maxCount() {
    return Math.max(...Object.values(this.values));
  }
}
