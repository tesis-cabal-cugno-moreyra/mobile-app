import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

export default {
  async setMapPoint(mapPoint) {
    await Storage.set({
      key: 0, // TODO: solve key management, maybe uuid?
      type: 'MapPoint',
      value: JSON.stringify(mapPoint)
    })
  },
  async getMapPoint(mapPointKey) {
    const mapPoint = await Storage.get({ key: mapPointKey});
    return JSON.parse(mapPoint.value);
  },
  async getKeys(){
    const { keys } = await Storage.keys()
    return keys;
  }

};
