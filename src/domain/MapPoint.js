import { Point } from "@/domain/Point"

export class MapPoint extends Point {
  constructor(coordinates, resourceId, incidentId, comment) {
    super(coordinates);
    this.timeCreated = new Date().toISOString();
    this.internalType = "MapPoint";
    this.resourceId = resourceId;
    this.incidentId = incidentId;
    this.comment = comment;
  }
  getTimeCreated() {
    return this.timeCreated;
  }
  getInternalType() {
    return this.internalType;
  }
  getResourceId() {
    return this.resourceId;
  }
  getIncidentId() {
    return this.incidentId;
  }
  getComment() {
    return this.comment;
  }
}
