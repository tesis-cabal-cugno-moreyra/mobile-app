export class Point {
  constructor(coordinates) {
    this.coordinates = coordinates; // Se almacena el objeto coords obtenido al obtener la ubicación.
    this.type = "Point";
  }
  getCoordinates() {
    return this.coordinates;
  }
  getLng() {
    if(this.coordinates !== null) {
      return this.coordinates.longitude;
    } else {
      return 0;
    }
  }
  getLat() {
    if(this.coordinates !== null) {
      return this.coordinates.latitude;
    } else {
      return 0;
    }
  }
}
