function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function normalizeLocationTree(source) {
  if (!isPlainObject(source)) {
    return {};
  }

  return source;
}

export function getProvinceOptions(tree) {
  return Object.keys(normalizeLocationTree(tree));
}

export function getDistrictOptions(tree, province) {
  return Object.keys(normalizeLocationTree(tree)[province] || {});
}

export function getCityOptions(tree, province, district) {
  return Object.keys(normalizeLocationTree(tree)[province]?.[district] || {});
}

export function getAreaOptions(tree, province, district, city) {
  return normalizeLocationTree(tree)[province]?.[district]?.[city] || [];
}

export function getLocationTreeStats(tree) {
  const normalizedTree = normalizeLocationTree(tree);
  let districtCount = 0;
  let cityCount = 0;
  let areaCount = 0;

  Object.values(normalizedTree).forEach((districts) => {
    districtCount += Object.keys(districts || {}).length;

    Object.values(districts || {}).forEach((cities) => {
      cityCount += Object.keys(cities || {}).length;

      Object.values(cities || {}).forEach((areas) => {
        areaCount += Array.isArray(areas) ? areas.length : 0;
      });
    });
  });

  return {
    provinceCount: Object.keys(normalizedTree).length,
    districtCount,
    cityCount,
    areaCount
  };
}
