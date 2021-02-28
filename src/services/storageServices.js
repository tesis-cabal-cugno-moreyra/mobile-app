import { v4 as uuidv4 } from 'uuid';
import { Plugins } from '@capacitor/core';
import {MapPoint} from "@/domain/MapPoint";
import {TrackPoint} from "@/domain/TrackPoint";
const { Storage } = Plugins;

export default {
  async setAccessToken(accessToken) {
    await Storage.set({
      key: "access-token",
      value: JSON.stringify(accessToken)
    })
  },
  async setRefreshToken(refreshToken) {
    await Storage.set({
      key: "refresh-token",
      value: JSON.stringify(refreshToken)
    })
  },
  async getAccessToken() {
    let accessToken = await Storage.get({ key: 'access-token'});
    return JSON.parse(accessToken.value);
  },
  async getRefreshToken() {
    let refreshToken = await Storage.get({ key: 'refresh-token'});
    return JSON.parse(refreshToken.value);
  },
  async removeAccessToken() {
    await Storage.remove({ key: 'access-token'})
  },
  async removeRefreshToken() {
    await Storage.remove({ key: 'refresh-token'})
  },
  async getKeys() {
    const { keys } = await Storage.keys()
    return keys;
  },
  async setPoint(point, vueContext) {
    await Storage.set({
      key: uuidv4(),
      value: JSON.stringify(point)
    })
    await vueContext.$store.dispatch("mobileEventsStatus/increaseByOneStoredPointsCounter");
  },
  async getPoint(pointKey) {
    const point = await Storage.get({ key: pointKey});
    console.log(point);
    let parsedPoint = JSON.parse(point.value)
    console.log(parsedPoint.internalType);
    if (parsedPoint.internalType === "MapPoint") {
      return Object.assign(new MapPoint, parsedPoint);
    } else if (parsedPoint.internalType === "TrackPoint") {
      return Object.assign(new TrackPoint, parsedPoint);
    } else {
      console.error("Point with key" + pointKey + " doesn't exist on local Storage.")
      return null;
    }
  },
  async removePoint(pointKey, vueContext) {
    await Storage.remove({ key: pointKey});
    await vueContext.$store.dispatch("mobileEventsStatus/decreaseByOneStoredPointsCounter");
  },
  async clear(vueContext) {
    await Storage.clear();
    await vueContext.$store.dispatch("mobileEventsStatus/resetStoredPointsCounter");
  }
};
