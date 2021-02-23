import Point from "./"

export class TrackPoint {
  constructor(coordinates, resourceId) {
    this.point = new Point(coordinates);
    this.collectedAt = new Date();
    this.internalType = "TrackPoint";
    this.resourceId = resourceId;
  }
  getPoint(){
    return this.point;
  }
  getCollectedAt(){
    return this.collectedAt;
  }
  getInternalType(){
    return this.internalType;
  }
  getResourceId(){
    return this.resourceId;
  }
}
