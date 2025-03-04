"use client";

import HomeOverlay from "@/components/fragments/HomeOverlay";
import { island } from "@/src/island";
import bbox from "@turf/bbox";
import React, { useEffect, useRef, useState } from "react";
import Map, { Layer, MapRef, Source, MapMouseEvent } from "react-map-gl/mapbox";
import { FeatureCollection, Geometry } from "geojson";
import { provinces } from "@/src/provinces";

export default function Home() {
  const [geoJsonData, setGeoJsonData] =
    useState<FeatureCollection<Geometry>>(island);
  const [mapLoaded, setMapLoaded] = useState(false);
  const boundsPadding = 0.5;
  const minZoom = 3.5;
  const maxZoom = 7.5;
  const localImageRef = useRef<HTMLImageElement | null>(null);
  const mapRef = useRef<MapRef | null>(null);
  const [hoveredPolygon, setHoveredPolygon] = useState<any>(null);
  const imageBounds = [
    [93.0, 13.0],
    [142.65, -14.0],
  ];
  const [mapBounds, setMapBounds] = useState<any>([
    [imageBounds[0][0] + boundsPadding, imageBounds[1][1] + boundsPadding],
    [imageBounds[1][0] - boundsPadding, imageBounds[0][1] - boundsPadding],
  ]);
  const [selectedIsland, setSelectedIsland] = useState<string | null>(null);

  const filteredProvinces: FeatureCollection<Geometry> = {
    type: "FeatureCollection",
    features: provinces.features.filter(
      (province: any) => province?.properties?.island_id === selectedIsland
    ),
  };

  // fetch data and image
  useEffect(() => {
    // Preload background image
    const img = new window.Image();
    img.onload = () => {
      localImageRef.current = img;
    };
    img.src = "/image/bg.jpg";
  }, []);

  // on click map
  const handleClick = (event: MapMouseEvent) => {
    const feature = event.features?.[0];

    if (feature) {
      const [minLng, minLat, maxLng, maxLat] = bbox(feature);

      setSelectedIsland(feature?.properties?.id);
      setGeoJsonData(null as any);

      // Batasi zoom dalam area bounds gambar
      const boundedMinLng = Math.max(minLng, mapBounds[0][0]);
      const boundedMinLat = Math.max(minLat, mapBounds[0][1]);
      const boundedMaxLng = Math.min(maxLng, mapBounds[1][0]);
      const boundedMaxLat = Math.min(maxLat, mapBounds[1][1]);

      mapRef.current?.fitBounds(
        [
          [boundedMinLng, boundedMinLat],
          [boundedMaxLng, boundedMaxLat],
        ],
        { padding: 40, duration: 1000 }
      );

      // set map bounds
      // setTimeout(() => {
      //   setMapBounds([
      //     [boundedMinLng, boundedMinLat],
      //     [boundedMaxLng, boundedMaxLat],
      //   ]);
      // }, 1000);
    }
  };

  // on mouse move
  const handleMouseMove = (event: MapMouseEvent) => {
    const feature = event.features?.[0];
    console.log(feature?.id);

    if (feature?.id !== undefined) {
      setHoveredPolygon(feature.id);
    } else {
      setHoveredPolygon(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPolygon(null);
  };

  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  return (
    <div className="flex flex-col w-screen h-[100dvh] overflow-x-hidden relative">
      <Map
        ref={mapRef}
        mapboxAccessToken="pk.eyJ1IjoicHRyZHlwIiwiYSI6ImNtN3NpN2hkaDByM2cya29pdXUydzAwbmQifQ.72ScIGq_viZAk6sKiF_OxA"
        initialViewState={{
          longitude: 117.3591791339498,
          latitude: -2.3078566449132154,
          zoom: 3.5,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/empty-v9"
        interactiveLayerIds={["island-layer", "provinces-layer"]}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onLoad={handleMapLoad}
        scrollZoom={false}
        doubleClickZoom={false}
        touchZoomRotate={false}
        dragRotate={false}
        dragPan={true}
        attributionControl={false}
        maxBounds={mapBounds}
        minZoom={minZoom}
        maxZoom={maxZoom}
      >
        {/* Background layer */}
        {mapLoaded && localImageRef.current && (
          <Source
            id="custom-map-image"
            type="image"
            url={localImageRef.current.src}
            coordinates={[
              [imageBounds[0][0], imageBounds[0][1]],
              [imageBounds[1][0], imageBounds[0][1]],
              [imageBounds[1][0], imageBounds[1][1]],
              [imageBounds[0][0], imageBounds[1][1]],
            ]}
          >
            <Layer
              id="custom-image-layer"
              source="custom-map-image"
              type="raster"
              paint={{
                "raster-opacity": 1,
                "raster-fade-duration": 0,
              }}
              layout={{
                visibility: "visible",
              }}
            />
          </Source>
        )}

        {/* GeoJSON layer */}
        {mapLoaded && localImageRef.current && geoJsonData && (
          <Source type="geojson" data={geoJsonData}>
            <Layer
              id="island-layer"
              type="fill"
              paint={{
                "fill-opacity": [
                  "case",
                  ["==", ["id"], hoveredPolygon ?? null],
                  0.5,
                  0,
                ],
                "fill-color": "#ffffff",
              }}
            />
            <Layer
              id="island_line"
              type="line"
              paint={{
                "line-color": "#ffffff",
                "line-width": 1,
                "line-opacity": 0.5,
              }}
              layout={{ visibility: "visible" }}
            />
          </Source>
        )}
      </Map>

      <HomeOverlay />
    </div>
  );
}
