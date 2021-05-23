import storageServices from "@/services/storageServices";
import webSocketServices from "@/services/webSocketServices";

export default class ReconnectionPointManager {
    async _sendStoredPoints() {
        let keys = await storageServices.getKeys()
        console.log(`ReconnectionPointManager: Points stored to be sent: ${keys.length}`);
        for (const key of keys) {
            let point = await storageServices.getPoint(key);
            webSocketServices.sendPoint(point);
            console.log(`ReconnectionPointManager: Sent stored point ${JSON.stringify(point)} with key ${key}`)
            // FIXME: What do we do if the point is not received by the server?
            await storageServices.removePoint(key, this);
        }
    }
    async handleReconnection(currentNetworkStatus) {
        if (currentNetworkStatus === 'wifi' || currentNetworkStatus === 'cellular') {
            console.log(`ReconnectionPointManager: Connected network status: ${currentNetworkStatus}`)
            // Try to send with API (current and stored items)
            await this._sendStoredPoints()
        } else if (currentNetworkStatus === 'unknown' || currentNetworkStatus === 'none') {
            console.log(`ReconnectionPointManager: Not Connected network status: ${currentNetworkStatus}.  N`)
        } else {
            throw Error(`ReconnectionPointManager: Unsupported network status: ${currentNetworkStatus}`)
        }
    }
}