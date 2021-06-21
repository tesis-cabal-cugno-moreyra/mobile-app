import {Point} from "@/domain/Point";

export default class Incident {
    _id;
    _domainName;
    _incidentTypeName;
    _externalAssistance;
    _dataStatus;
    _status;
    _locationAsStringReference;
    _locationPoint;
    _reference;
    _createdAt;
    _updatedAt;
    _cancelledAt;
    _finalizedAt;
    constructor( id, domainName, incidentTypeName, externalAssistance,dataStatus, status, locationAsStringReference,
                 locationPoint, reference, createdAt, updatedAt, cancelledAt, finalizedAt) {
        this._id = id;
        this._domainName = domainName;
        this._incidentTypeName = incidentTypeName;
        this._externalAssistance = externalAssistance;
        this._dataStatus = dataStatus;
        this._status = status;
        this._locationAsStringReference = locationAsStringReference;
        this._locationPoint = locationPoint;
        this._reference = reference;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._cancelledAt = cancelledAt;
        this._finalizedAt = finalizedAt;
    }
    get id() {
        return this._id;
    }
    get domainName() {
        return this._domainName;
    }
    get incidentTypeName() {
        return this._incidentTypeName;
    }
    get externalAssistance() {
        return this._externalAssistance;
    }
    get dataStatus() {
        return this._dataStatus;
    }
    get dataIsComplete() {
        return this._dataStatus === 'Complete'
    }
    get dataIsIncomplete() {
        return this._dataStatus === 'Incomplete'
    }

    get status() {
        return this._status;
    }
    get isStarted() {
        return this._status === 'Started'
    }
    get isCancelled() {
        return this._status === 'Cancelled'
    }
    get isFinalized() {
        return this._status === 'Finalized'
    }

    get locationAsStringReference() {
        return this._locationAsStringReference;
    }
    get locationPoint() {
        return new Point(
            this._locationPoint.coordinates
        )
    }
    get reference() {
        return this._reference;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    get cancelledAt() {
        return this._cancelledAt;
    }
    get finalizedAt() {
        return this._finalizedAt;
    }
}
