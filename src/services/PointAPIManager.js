import storageServices from "@/services/storageServices";
import webSocketServices from "@/services/webSocketServices";
export default class PointAPIManager {
    constructor(vueContext) {
        this._vueContext = vueContext
    }
    _validateVueContext() {
        if (!this._vueContext) {
            throw Error("VueContext not defined!")
        }
    }
    _validateHandlePointsRequiredParameters() {
        if (!this._vueContext.$store) {
            throw Error("Store not defined in vueContext!")
        }
        if (!this._vueContext.$store.getters) {
            throw Error("Store getters not defined in vueContext!")
        }
    }

    async _savePointToStorage(pointData) {
        await storageServices.setPoint(pointData, this);
    }

    async handlePoint(point) {
        this._validateVueContext()
        this._validateHandlePointsRequiredParameters()
        console.log(this._vueContext)
        console.log(this._vueContext.$store.getters["mobileEventsStatus/networkStatus"])

        const currentNetworkStatus = this._vueContext.$store.getters["mobileEventsStatus/networkStatus"]

        if (currentNetworkStatus === 'wifi' || currentNetworkStatus === 'cellular') {
            console.log(`PointAPIManager: Connected network status: ${currentNetworkStatus}`)
            // Try to send with API (current and stored items)
            webSocketServices.sendPoint(point);
        } else if (currentNetworkStatus === 'unknown' || currentNetworkStatus === 'none') {
            console.log(`PointAPIManager: Not Connected network status: ${currentNetworkStatus}`)
            // Save to storage
            await this._savePointToStorage(point)
        } else {
            throw Error(`PointAPIManager: Unsupported network status: ${currentNetworkStatus}`)
        }
    }

}