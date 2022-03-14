import { Position, range } from "./utils";

export class Ship {
  name: string;
  size: number;
  orientation: "col" | "row" = "row";
  pos?: Position;
  placed: boolean;
  hit: boolean[];
  destroyed: boolean = false;

  constructor(name: string, size: number) {
    this.name = name;
    this.size = size;
    this.placed = false;
    this.hit = range(0, size).map((_) => false);
  }

  swapOrientation() {
    this.orientation = this.orientation == "col" ? "row" : "col";
  }

  registerHit(pos: Position) {
    for (const [index, p] of this.coordinates().entries()) {
      if (p.equals(pos)) {
        this.hit[index] = true;
        break;
      }
    }
    if (this.health() == 0) {
      this.destroyed = true;
    }
  }

  health() {
    return this.hit.reduce((v, b) => v + (b ? 0 : 1), 0) / this.size;
  }

  coordinates(): Position[] | null {
    if (this.pos == undefined) return null;
    return coordinatesForShip(this.pos, this.size, this.orientation);
  }
}

/** returns a list of coordinates if the ship was to be placed there. It does not care about bounds (e.g.
 * going outside of the board), so you should check that. **/
export function coordinatesForShip(
  origin: Position,
  size: number,
  orientation: "row" | "col"
): Position[] {
  let out = [];
  for (let d = 0; d < size; d++) {
    if (orientation == "row") {
      out.push(new Position(origin.x + d, origin.y));
    } else {
      out.push(new Position(origin.x, origin.y + d));
    }
  }
  return out;
}

export const createShips = () => {
  const ships: Ship[] = [
    new Ship("carrier", 5),
    new Ship("battleship", 4),
    new Ship("cruiser", 3),
    new Ship("submarine", 3),
    new Ship("destroyer", 2),
  ];
  return ships;
};
