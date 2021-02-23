export class Point {
  constructor(coordinates) {
    this.coordinates = coordinates; // This must be an array.
    this.type = "Point";
  }
  getCoordinates() {
    return this.coordinates;
  }
  getLng() {
    if(this.coordinates !== null) {
      return this.coordinates[0];
    } else {
      return 0;
    }
  }
  getLat() {
    if(this.coordinates !== null) {
      return this.coordinates[1];
    } else {
      return 0;
    }
  }
}
