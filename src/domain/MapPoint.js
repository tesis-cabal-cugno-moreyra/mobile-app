import { Point } from "@/domain/Point"

export class MapPoint extends Point {
  constructor(coordinates, resourceId, comment) {
    super(coordinates);
    this.collectedAt = new Date();
    this.internalType = "MapPoint"
    this.resourceId = resourceId
    this.comment = comment
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
