import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { OSM } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Fill, Stroke, Style } from 'ol/style';
import Overlay from 'ol/Overlay';
import * as d3 from 'd3';

const colorOptions = {
  noiseLevels: ['#f1eef6', '#bdc9e1', '#74a9cf', '#0570b0', '#023858'], // For noise intensity
};

export const NoiseContourMap = forwardRef((props, ref) => {
  const [selectedColorRange, setSelectedColorRange] = useState('noiseLevels');
  const [data, setData] = useState([]);
  const mapRef = useRef(null);
  const mapObj = useRef(null);
  const overlayRef = useRef(null);
  const overlayObj = useRef(null);

  useEffect(() => {
    // Load CSV data
    d3.csv('/noise_contours.csv').then((csvData) => {
      console.log('CSV Data:', csvData);
      setData(csvData);
    });

    // Initialize map if not created
    if (!mapObj.current) {
      mapObj.current = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: [0, 0],
          zoom: 2,
          projection: 'EPSG:3857',
        }),
      });

      // Create the overlay for hover info
      overlayObj.current = new Overlay({
        element: overlayRef.current,
        positioning: 'bottom-center',
        stopEvent: false,
        offset: [0, -10],
      });

      // Add overlay to the map
      mapObj.current.addOverlay(overlayObj.current);
    }
  }, []);

  const updateMap = () => {
    if (mapObj.current) {
      fetch('/noise_contours.geojson')
        .then((response) => response.json())
        .then((geojsonData) => {
          console.log('GeoJSON Data:', geojsonData);

          const contourData = {};
          data.forEach((d) => {
            contourData[d.contour_id] = +d.noise_level; // Use noise level as intensity
          });

          // Create color scale based on noise levels
          const colorScale = d3
            .scaleThreshold()
            .domain([55, 65, 75, 85]) // Adjust based on noise level range
            .range(colorOptions[selectedColorRange]);

          const contoursLayer = new VectorLayer({
            source: new VectorSource({
              features: new GeoJSON().readFeatures(geojsonData, {
                featureProjection: 'EPSG:3857',
              }),
            }),
            style: (feature) => {
              const contourId = feature.get('contour_id');
              const noiseLevel = contourData[contourId];
              const fillColor = noiseLevel ? colorScale(noiseLevel) : '#ccc';

              return new Style({
                fill: new Fill({
                  color: fillColor,
                }),
                stroke: new Stroke({
                  color: '#000',
                  width: 1,
                }),
              });
            },
          });

          // Remove existing layers except base layer
          mapObj.current.getLayers().forEach((layer, index) => {
            if (index > 0) mapObj.current.removeLayer(layer);
          });

          // Add the updated contour layer
          mapObj.current.addLayer(contoursLayer);

          // Hover functionality
          mapObj.current.on('pointermove', (evt) => {
            const feature = mapObj.current.forEachFeatureAtPixel(
              evt.pixel,
              (feat) => feat
            );

            if (feature) {
              const contourId = feature.get('contour_id');
              const noiseLevel = contourData[contourId];

              // Update the overlay content
              overlayRef.current.innerHTML = `
                <strong>Contour ID: ${contourId}</strong><br/>
                Noise Level: ${noiseLevel || 'N/A'} dB`;
              overlayRef.current.style.display = 'block';

              // Set the position of the overlay
              overlayObj.current.setPosition(evt.coordinate);

              // Highlight the hovered contour
              feature.setStyle(
                new Style({
                  fill: new Fill({
                    color: 'rgba(255, 165, 0, 0.8)', // Orange highlight color
                  }),
                  stroke: new Stroke({
                    color: '#000',
                    width: 2,
                  }),
                })
              );
            } else {
              // Hide the overlay and reset contour styles
              overlayRef.current.style.display = 'none';
              mapObj.current.getLayers().forEach((layer) => {
                if (layer instanceof VectorLayer) {
                  layer.getSource().getFeatures().forEach((f) => f.setStyle(null));
                }
              });
            }
          });
        });
    }
  };

  // Call updateMap whenever data or settings change
  useEffect(() => {
    if (data.length > 0) {
      updateMap();
    }
  }, [selectedColorRange, data]);

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ padding: '10px', backgroundColor: '#f9f9f9', zIndex: 1000 }}>
        <h3>Edit Contour Map Settings</h3>

        {/* Select Color Range */}
        <label style={{ marginLeft: '20px' }}>
          Select Color Range:
          <select
            value={selectedColorRange}
            onChange={(e) => setSelectedColorRange(e.target.value)}
          >
            {Object.keys(colorOptions).map((colorRange) => (
              <option key={colorRange} value={colorRange}>
                {colorRange}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Map Container */}
      <div ref={mapRef} style={{ width: '100%', height: '90vh' }}></div>

      {/* Overlay for displaying contour data */}
      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          backgroundColor: 'white',
          padding: '5px',
          borderRadius: '3px',
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
          display: 'none',
        }}
      ></div>
    </div>
  );
}
);

// export default NoiseContourMap;
