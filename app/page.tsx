'use client'
import bbox from '@turf/bbox';
import React, { useEffect, useRef, useState } from 'react';
import Map, { Layer, MapRef, Source, MapMouseEvent } from 'react-map-gl/mapbox';

export default function Home() {
  const [geoJsonData, setGeoJsonData] = useState(null);

  const requestGeoJSON = async () => {
    try {
      const response = await fetch('/data/provinces.geojson');
      if (!response.ok) {
          throw new Error('Gagal mengambil data GeoJSON');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching GeoJSON:', error);
      return null;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
        const data = await requestGeoJSON();
        setGeoJsonData(data);
    };
    fetchData();
  }, []);

  // zoom to bounds
  const mapRef = useRef<MapRef | null>(null);
  
  const handleClick = (event: MapMouseEvent) => {
    const feature = event.features?.[0];
    
    if(feature) {
      const [minLng, minLat, maxLng, maxLat] = bbox(feature);

    mapRef.current?.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat]
      ],
      {padding: 40, duration: 1000}
    );
    }
  }

  // hover polygon
  const [hoveredPolygon, setHoveredPolygon] = useState<any>(null)

  const handleMouseMove = (event: MapMouseEvent) => {
    const feature = event.features?.[0];
    console.log(feature?.id)
    
    if(feature?.id !== undefined) {
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
        style={{width: 900, height: 400}}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        interactiveLayerIds={['provinces-layer']}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {geoJsonData && (
          <Source type='geojson' data={geoJsonData}>
            <Layer
              id="provinces-layer"
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
              id="provinces_line"
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
      </Map>
    </div>
  );
}
