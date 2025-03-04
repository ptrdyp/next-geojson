'use client'
import bbox from '@turf/bbox';
import React, { useRef, useState } from 'react';
import Map, { Layer, MapRef, Source, MapMouseEvent } from 'react-map-gl/mapbox';
import { FeatureCollection, Geometry } from 'geojson';
import { provinces } from "@/src/provinces";
import { island } from '@/src/island';

export default function Home() {
  const [geoJsonData, setGeoJsonData] = useState<FeatureCollection<Geometry>>(island);
  const [selectedIsland, setSelectedIsland] = useState<string | null>(null);
  const [hoveredPolygon, setHoveredPolygon] = useState<any>(null)
  const mapRef = useRef<MapRef | null>(null);

  // zoom to bounds
  const handleClick = (event: MapMouseEvent) => {
    const feature = event.features?.[0];

    if (feature) {
      const [minLng, minLat, maxLng, maxLat] = bbox(feature);

      setSelectedIsland(feature?.properties?.id);
      setGeoJsonData(null as any)

      mapRef.current?.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat]
        ],
        { padding: 40, duration: 1000 }
      );
    }
  }

  const filteredProvinces: FeatureCollection<Geometry> = {
    type: "FeatureCollection",
    features: provinces.features.filter(province =>
      province?.properties?.island_id === selectedIsland
    )
  };

  // hover polygon
  const handleMouseMove = (event: MapMouseEvent) => {
    const feature = event.features?.[0];
    console.log(feature?.id)

    if (feature?.id !== undefined) {
      setHoveredPolygon(feature.id);
    } else {
      setHoveredPolygon(null)
    }
  }

  const handleMouseLeave = () => {
    setHoveredPolygon(null)
  }

  return (
    <div className='flex flex-col'>
      <Map
        ref={mapRef}
        mapboxAccessToken="pk.eyJ1IjoicHRyZHlwIiwiYSI6ImNtN3NpN2hkaDByM2cya29pdXUydzAwbmQifQ.72ScIGq_viZAk6sKiF_OxA"
        initialViewState={{
          longitude: 117.3591791339498,
          latitude: -2.3078566449132154,
          zoom: 3.8
        }}
        style={{ width: 900, height: 600 }}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        interactiveLayerIds={['island-layer', 'provinces-layer']}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        scrollZoom={false}
        doubleClickZoom={false}
        touchZoomRotate={false}
        dragRotate={false}
        dragPan={false}
      >
        {geoJsonData && (
          <Source type='geojson' data={geoJsonData}>
            <Layer
              id="island-layer"
              type="fill"
              paint={{
                "fill-color": [
                  "case",
                  ["==", ["id"], hoveredPolygon ?? null], "#ffa200", "#0080ff"
                ],
                "fill-opacity": 0.2
              }}
            />
            <Layer
              id="island_line"
              type="line"
              paint={{
                "line-color": "#a83232",
                "line-width": 1,
                "line-opacity": 1
              }}
              layout={{ visibility: 'visible' }}
            />
          </Source>
        )}

        {/* Jika salah satu pulau dipilih */}
        {selectedIsland && (
          <Source type='geojson' data={filteredProvinces}>
            <Layer
              id="provinces-layer"
              type="fill"
              paint={{
                "fill-color": [
                  "case",
                  ["==", ["id"], hoveredPolygon ?? null], "#ffa200", "#00ff00"
                ],
                "fill-opacity": 0.2
              }}
            />
            <Layer
              id="provinces-border"
              type="line"
              paint={{
                "line-color": "#ffffff",
                "line-width": 1
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
}