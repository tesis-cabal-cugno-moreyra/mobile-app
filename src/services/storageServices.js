import { v4 as uuidv4 } from 'uuid';
import { Plugins } from '@capacitor/core';
import {MapPoint} from "@/domain/MapPoint";
import {TrackPoint} from "@/domain/TrackPoint";
const { Storage } = Plugins;

export default {
  async getKeys() {
    const { keys } = await Storage.keys()
    return keys;
  },
  async setMapPoint(mapPoint, vueContext) {
    await Storage.set({
      key: uuidv4(),
      value: JSON.stringify(mapPoint)
    })
    await vueContext.$store.dispatch("mobileEventsStatus/increaseByOneStoredPointsCounter");
  },
  async getMapPoint(mapPointKey) {
    const mapPoint = await Storage.get({ key: mapPointKey});
    return Object.assign(new MapPoint, JSON.parse(mapPoint.value));
    //return JSON.parse(mapPoint.value);
  },
  async removeMapPoint(mapPointKey, vueContext) {
    await Storage.remove({ key: mapPointKey});
    await vueContext.$store.dispatch("mobileEventsStatus/decreaseByOneStoredPointsCounter");
  },
  async setTrackPoint(trackPoint, vueContext) {
    await Storage.set({
      key: uuidv4(),
      value: JSON.stringify(trackPoint)
    });
    await vueContext.$store.dispatch("mobileEventsStatus/increaseByOneStoredPointsCounter");
  },
  async getTrackPoint(trackPointKey) {
    const trackPoint = await Storage.get({ key: trackPointKey});
    return Object.assign(new TrackPoint, JSON.parse(trackPoint.value));
    //return JSON.parse(trackPoint.value);
  },
  async removeTrackPoint(trackPointKey, vueContext) {
    await Storage.remove({ key: trackPointKey})
    await vueContext.$store.dispatch("mobileEventsStatus/decreaseByOneStoredPointsCounter");
  },
  async clear() {
    await Storage.clear();
  }
};
