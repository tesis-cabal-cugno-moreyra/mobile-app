import { Point } from "@/domain/Point"

export class MapPoint {
  constructor(coordinates, resourceId, comment) {
    this.point = new Point(coordinates);
    this.collectedAt = new Date();
    this.internalType = "MapPoint"
    this.resourceId = resourceId
    this.comment = comment
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
  getComment(){
    return this.comment;
  }
}
