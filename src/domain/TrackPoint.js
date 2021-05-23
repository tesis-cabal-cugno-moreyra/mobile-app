import { Point } from "@/domain/Point"

export class TrackPoint extends Point {
  constructor(coordinates, resourceId, incidentId) {
    super(coordinates);
    this.timeCreated = new Date().toISOString();
    this.internalType = "TrackPoint";
    this.resourceId = resourceId;
    this.incidentId = incidentId;
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
}
