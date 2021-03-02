import { Point } from "@/domain/Point"

export class TrackPoint extends Point {
  constructor(coordinates, resourceId) {
    super(coordinates);
    this.collectedAt = new Date();
    this.internalType = "TrackPoint";
    this.resourceId = resourceId;
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
