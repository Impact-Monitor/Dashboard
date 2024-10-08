import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";



import { Cesium, Cartesian3, createOsmBuildingsAsync, Ion, Math as CesiumMath, Terrain, Viewer } from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

window.CESIUM_BASE_URL = '/cesium/Build/Cesium';

export const CesiumMap = forwardRef((props, ref) => {
  useEffect(() => {

    // Set the Cesium Ion access token
    Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YWIwMzY0MC00NmYzLTQ3ZTQtYjZmNy0xNmZhNzg3YWVkNWIiLCJpZCI6MjAwNTk0LCJpYXQiOjE3MDk5MjY0ODN9.TWgNEWzqUORBfYy-DfeUrAVC4XEFUbF_wsKUNK0_H-s';

    // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
    const viewer = new Viewer('cesiumContainer', {
        terrain: Terrain.fromWorldTerrain(),
    });    
    
    // Fly the camera to San Francisco at the given longitude, latitude, and height.
    viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(-122.4175, 37.655, 400),
        orientation: {
        heading: CesiumMath.toRadians(0.0),
        pitch: CesiumMath.toRadians(-15.0),
        }
    });
    
    // // Add Cesium OSM Buildings, a global 3D buildings layer.
    // const buildingTileset = createOsmBuildingsAsync();
    // viewer.scene.primitives.add(buildingTileset);

  }, []);

  return (
    <div id="cesiumContainer" style={{ width: '100%', height: '100vh' }} />
  )
}
)
