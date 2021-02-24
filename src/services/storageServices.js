import { v4 as uuidv4 } from 'uuid';
import { Plugins } from '@capacitor/core';
import {MapPoint} from "@/domain/MapPoint";
const { Storage } = Plugins;

export default {
  async getKeys() {
    const { keys } = await Storage.keys()
    return keys;
  },
  async setMapPoint(mapPoint) {
    await Storage.set({
      key: uuidv4(),
      value: JSON.stringify(mapPoint)
    })
  },
  async getMapPoint(mapPointKey) {
    const mapPoint = await Storage.get({ key: mapPointKey});
    return Object.assign(new MapPoint, JSON.parse(mapPoint.value));
    //return JSON.parse(mapPoint.value);
  },
  async removeMapPoint(mapPointKey) {
    await Storage.remove({ key: mapPointKey})
  },
  async setTrackPoint(trackPoint) {
    await Storage.set({
      key: uuidv4(),
      value: JSON.stringify(trackPoint)
    })
  },
  async getTrackPoint(trackPointKey) {
    const trackPoint = await Storage.get({ key: trackPointKey});
    return JSON.parse(trackPoint.value);
  },
  async removeTrackPoint(trackPointKey) {
    await Storage.remove({ key: trackPointKey})
  },
  async clear() {
    await Storage.clear();
  }
};
