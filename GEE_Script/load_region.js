var kanha = ee.Geometry.Rectangle([80.53, 22.05, 81.2, 22.45]);
Map.centerObject(kanha, 8);
Map.addLayer(kanha, { color: "red" }, "Kanha AOI");

var year = 2015;
var months = ee.List.sequence(1, 12);

months.evaluate(function (monthList) {
  monthList.forEach(function (month) {
    // Wider window → ±15 days (much safer)
    var start = ee.Date.fromYMD(year, month, 15).advance(-15, "day");
    var end = ee.Date.fromYMD(year, month, 15).advance(15, "day");

    var collection = ee
      .ImageCollection("LANDSAT/LC08/C02/T1_L2")
      .filterBounds(kanha)
      .filterDate(start, end)
      .map(maskL8sr)
      .map(addNDVI);

    var count = collection.size();

    // 🔐 SAFETY CHECK
    count.evaluate(function (n) {
      if (n > 0) {
        var ndviMonthly = collection.median().clip(kanha);

        Export.image.toDrive({
          image: ndviMonthly,
          description: "NDVI_Kanha_2015_Month_" + month,
          folder: "GEE_NDVI_Kanha_2015",
          fileNamePrefix: "NDVI_2015_" + month,
          region: kanha,
          scale: 30,
          crs: "EPSG:4326",
          maxPixels: 1e13,
        });
      } else {
        print("⚠️ No images for month:", month);
      }
    });
  });
});
