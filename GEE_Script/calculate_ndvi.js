function addNDVI(image) {
  var ndvi = image.normalizedDifference(["SR_B5", "SR_B4"]).rename("NDVI");
  return ndvi.copyProperties(image, ["system:time_start"]);
}
