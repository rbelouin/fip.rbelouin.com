import _ from "lodash";

export function getAutoplayRadio(Storage) {
  return Storage.get("autoplay");
}

export function setAutoplayRadio(Storage, radio) {
  return Storage.set("autoplay", radio);
}

export default Storage => ({
  getAutoplayRadio: _.partial(getAutoplayRadio, Storage),
  setAutoplayRadio: _.partial(setAutoplayRadio, Storage)
});
