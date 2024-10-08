import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Heatmap as HeatmapLayer } from 'ol/layer';
import Overlay from 'ol/Overlay';

// import { Card, CardContent } from '@/components/ui/card';
// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';

import axios from 'axios';
import * as d3 from 'd3';

import { Button, Modal, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import SaveButton from '../../visualisations/SaveButton';
import EditButton from '../../visualisations/EditButton';
import DeleteButton from '../../visualisations/DeleteButton';


const useStyles = () => ({
    iconsContainer: {
      position: 'relative',
      top: '0px',
      left: '10px',
      width: '100%'
    },
  });

  
export const NoiseContourMap = forwardRef((props, ref) => {
  const mapRef = useRef();
  const [map, setMap] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [categories, setCategories] = useState({});
  const [heatmapLayers, setHeatmapLayers] = useState({});

  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [selectedNodePath, setSelectedNodePath] = useState([]);
  const [childNodes, setChildNodes] = useState([]);
  const [csvData, setCsvData] = useState([]);
  
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleOpen  = () => {
    setOpen(true);
  };

  const handleClose  = () => {
    setOpen(false);
  };


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:5000/upload', formData);
      setNodes(response.data.nodes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNodeSelect = async (selectedNode) => {
    const path = [...selectedNodePath, selectedNode];
    setSelectedNodePath(path);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('node_path', JSON.stringify(path));

    try {
      const response = await axios.post('http://127.0.0.1:5000/get_children', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setChildNodes(response.data.nodes);
    } catch (err) {
      console.error(err);
    }
  };

  const createDataFrame = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('node_path', JSON.stringify(selectedNodePath));

    try {
      const response = await axios.post('http://127.0.0.1:5000/create_dataframe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Parse the CSV data
      const csvString = response.data;
      const parsedData = d3.csvParse(csvString);
      console.log('Parsed Data :', parsedData);

      // Update state with the parsed data
      setCsvData(parsedData);
        // // Handle the response, e.g., download the CSV file
        // const csvBlob = new Blob([response.data], { type: 'text/csv' });
        // const url = window.URL.createObjectURL(csvBlob);
        // const link = document.createElement('a');
        // link.href = url;
        // link.setAttribute('download', 'dataframe.csv');
        // document.body.appendChild(link);
        // link.click();

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
        console.log('CSV Data after setting:', csvData);
        setData(csvData);
    }, [csvData]);


  useEffect(() => {
    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    setMap(initialMap);

    return () => initialMap.setTarget(undefined);
  }, []);

  useEffect(() => {
    if (!map) return;

    // Extract unique categories and assign default colors
    const uniqueCategories = [...new Set(data.map(item => item.typeValue))];
    const defaultCategories = Object.fromEntries(
      uniqueCategories.map((category, index) => [
        category,
        `hsl(${index * (360 / uniqueCategories.length)}, 100%, 50%)`
      ])
    );
    setCategories(defaultCategories);

    // Create heatmap layers for each category
    const layers = {};
    Object.entries(defaultCategories).forEach(([category, color]) => {
      const vectorSource = new VectorSource({
        features: data
          .filter(item => item.typeValue === category)
          .map(item => new Feature({
            geometry: new Point(fromLonLat([item.contour_longitude, item.contour_latitude])),
            category: item.typeValue,
          }))
      });

      const heatmapLayer = new HeatmapLayer({
        source: vectorSource,
        blur: 1,
        radius: 1,
        weight: feature => 0.5,
        gradient: ['#ffffff', color],
      });

      map.addLayer(heatmapLayer);
      layers[category] = heatmapLayer;
    });
    setHeatmapLayers(layers);

    // Create tooltip overlay
    const tooltipElement = document.createElement('div');
    tooltipElement.className = 'ol-tooltip';
    const tooltipOverlay = new Overlay({
      element: tooltipElement,
      offset: [10, 0],
      positioning: 'bottom-left',
    });
    map.addOverlay(tooltipOverlay);
    setTooltip(tooltipOverlay);

    // Add hover interaction
    map.on('pointermove', (evt) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (feature) => feature);
      
      if (feature) {
        const coordinates = feature.getGeometry().getCoordinates();
        tooltipOverlay.setPosition(coordinates);
        tooltipElement.innerHTML = `Category: ${feature.get('category')}`;
        tooltipElement.style.display = 'block';
        
        // Highlight the hovered contour
        const category = feature.get('category');
        if (layers[category]) { // Ensure layer exists before trying to setBlur/setRadius
            layers[category].setBlur(20);
            layers[category].setRadius(15);
          }
      } else {
        tooltipElement.style.display = 'none';
        
        // Reset highlight
        Object.values(layers).forEach(layer => {
            if (layer) { // Ensure layer exists before resetting
                layer.setBlur(15);
                layer.setRadius(10);
              }
        });
      }
    });

    return () => {
      Object.values(layers).forEach(layer => map.removeLayer(layer));
      map.removeOverlay(tooltipOverlay);
    };
  }, [map, data]);

  const handleColorChange = (category, color) => {
    setCategories(prev => ({ ...prev, [category]: color }));
    heatmapLayers[category].setGradient(['#ffffff', color]);
  };

  return (
    <div>
    <div className='main-container'>
        <div className='graph-controller-container'>
            <div style={classes.iconsContainer}>
                <SaveButton variant="contained" onClick={handleClose} />
                <EditButton onClick={handleOpen} />
                <DeleteButton onClick={handleClose} />
            </div>

            <div className='modal-div'>
                <Modal
                    open={open} // Pass the state variable as the open prop
                    onClose={handleClose} // Function to close the modal
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                    >
                    <div className='modal-inner-div' style={{ maxHeight: '80%', width: '25%', overflowY: 'scroll' , position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px' }}>
                        <h2 id="modal-title">Edit Plot</h2>
                        <p id="modal-description">Please change the parameters to see realtime effects. </p>
                        <p id="modal-description">Click outsdide the window to close it.</p>
                        
                        <div className="App">
                            <h1>Upload CPACS File</h1>
                            <input type="file" onChange={handleFileChange} />
                            <button onClick={handleFileUpload}>Upload File</button>

                            {nodes.length > 0 && (
                                <div>
                                <h2>Select a Node</h2>
                                <select onChange={(e) => handleNodeSelect(e.target.value)}>
                                    <option value="">Select Node</option>
                                    {nodes.map((node) => (
                                    <option key={node} value={node}>
                                        {node}
                                    </option>
                                    ))}
                                </select>
                                </div>
                            )}

                            {childNodes.length > 0 && (
                                <div>
                                <h2>Select Child Node</h2>
                                <select onChange={(e) => handleNodeSelect(e.target.value)}>
                                    <option value="">Select Child Node</option>
                                    {childNodes.map((node) => (
                                    <option key={node} value={node}>
                                        {node}
                                    </option>
                                    ))}
                                </select>
                                </div>
                            )}

                            {selectedNodePath.length > 0 && (
                                <div>
                                <button onClick={createDataFrame}>Create DataFrame</button>
                                </div>
                            )}
                        </div>


                        <div className="card mt-4" style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
                            <h3 className="text-lg font-semibold mb-2">Category Colors</h3>
                            {Object.entries(categories).map(([category, color]) => (
                            <div key={category} className="flex items-center mb-2">
                                <label htmlFor={`color-${category}`} className="w-24">{category}</label>
                                <input
                                id={`color-${category}`}
                                type="color"
                                value={color}
                                onChange={(e) => handleColorChange(category, e.target.value)}
                                style={{ width: '50px', height: '30px', padding: '0', border: 'none', marginLeft: '10px' }}
                                />
                            </div>
                            ))}
                        </div>



                    </div>
                </Modal>
            </div> 


            
        </div>

    </div>

        <div className='mapDiv'>
                <div ref={mapRef} style={{ width: '100%', height: '500px' }} />

                <style jsx>{`
                    .ol-tooltip {
                    position: absolute;
                    background-color: white;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
                    padding: 15px;
                    border-radius: 10px;
                    border: 1px solid #cccccc;
                    bottom: 12px;
                    left: -50px;
                    min-width: 100px;
                    }
                `}</style>
            </div>

    </div>
  );
}
);

// export default ContourMap;