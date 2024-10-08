/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.115
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

import{a as d}from"./chunk-TQBVVLQA.js";import{a as w}from"./chunk-R7GRRUJS.js";import"./chunk-Q3ITDG7Y.js";import"./chunk-NNNHC2WA.js";import"./chunk-FZIR7YHL.js";import"./chunk-FHUOX7Q3.js";import"./chunk-EQAHH27B.js";import"./chunk-LWO5EUNN.js";import"./chunk-SPMRTIBU.js";import"./chunk-U6MIZ4IC.js";import"./chunk-3G4OCZJT.js";import"./chunk-LYPPBP4Q.js";import"./chunk-PCFGFNNQ.js";import"./chunk-V2SDNSQR.js";import"./chunk-S7TTFAYA.js";import"./chunk-TLYHKSDJ.js";import"./chunk-PYVDHCDQ.js";import"./chunk-JMWWNZHX.js";import"./chunk-DNO4OWAM.js";import"./chunk-XDVDNOI4.js";import{a as k}from"./chunk-Z3SYNMQT.js";import{a as y}from"./chunk-4KGDZUZQ.js";import{a,b as p,e as r}from"./chunk-F3TINEFX.js";var b=p({"./combineGeometry.js":()=>import("./combineGeometry.js"),"./createBoxGeometry.js":()=>import("./createBoxGeometry.js"),"./createBoxOutlineGeometry.js":()=>import("./createBoxOutlineGeometry.js"),"./createCircleGeometry.js":()=>import("./createCircleGeometry.js"),"./createCircleOutlineGeometry.js":()=>import("./createCircleOutlineGeometry.js"),"./createCoplanarPolygonGeometry.js":()=>import("./createCoplanarPolygonGeometry.js"),"./createCoplanarPolygonOutlineGeometry.js":()=>import("./createCoplanarPolygonOutlineGeometry.js"),"./createCorridorGeometry.js":()=>import("./createCorridorGeometry.js"),"./createCorridorOutlineGeometry.js":()=>import("./createCorridorOutlineGeometry.js"),"./createCylinderGeometry.js":()=>import("./createCylinderGeometry.js"),"./createCylinderOutlineGeometry.js":()=>import("./createCylinderOutlineGeometry.js"),"./createEllipseGeometry.js":()=>import("./createEllipseGeometry.js"),"./createEllipseOutlineGeometry.js":()=>import("./createEllipseOutlineGeometry.js"),"./createEllipsoidGeometry.js":()=>import("./createEllipsoidGeometry.js"),"./createEllipsoidOutlineGeometry.js":()=>import("./createEllipsoidOutlineGeometry.js"),"./createFrustumGeometry.js":()=>import("./createFrustumGeometry.js"),"./createFrustumOutlineGeometry.js":()=>import("./createFrustumOutlineGeometry.js"),"./createGeometry.js":()=>import("./createGeometry.js"),"./createGroundPolylineGeometry.js":()=>import("./createGroundPolylineGeometry.js"),"./createPlaneGeometry.js":()=>import("./createPlaneGeometry.js"),"./createPlaneOutlineGeometry.js":()=>import("./createPlaneOutlineGeometry.js"),"./createPolygonGeometry.js":()=>import("./createPolygonGeometry.js"),"./createPolygonOutlineGeometry.js":()=>import("./createPolygonOutlineGeometry.js"),"./createPolylineGeometry.js":()=>import("./createPolylineGeometry.js"),"./createPolylineVolumeGeometry.js":()=>import("./createPolylineVolumeGeometry.js"),"./createPolylineVolumeOutlineGeometry.js":()=>import("./createPolylineVolumeOutlineGeometry.js"),"./createRectangleGeometry.js":()=>import("./createRectangleGeometry.js"),"./createRectangleOutlineGeometry.js":()=>import("./createRectangleOutlineGeometry.js"),"./createSimplePolylineGeometry.js":()=>import("./createSimplePolylineGeometry.js"),"./createSphereGeometry.js":()=>import("./createSphereGeometry.js"),"./createSphereOutlineGeometry.js":()=>import("./createSphereOutlineGeometry.js"),"./createTaskProcessorWorker.js":()=>import("./createTaskProcessorWorker.js"),"./createVectorTileClampedPolylines.js":()=>import("./createVectorTileClampedPolylines.js"),"./createVectorTileGeometries.js":()=>import("./createVectorTileGeometries.js"),"./createVectorTilePoints.js":()=>import("./createVectorTilePoints.js"),"./createVectorTilePolygons.js":()=>import("./createVectorTilePolygons.js"),"./createVectorTilePolylines.js":()=>import("./createVectorTilePolylines.js"),"./createVerticesFromGoogleEarthEnterpriseBuffer.js":()=>import("./createVerticesFromGoogleEarthEnterpriseBuffer.js"),"./createVerticesFromHeightmap.js":()=>import("./createVerticesFromHeightmap.js"),"./createVerticesFromQuantizedTerrainMesh.js":()=>import("./createVerticesFromQuantizedTerrainMesh.js"),"./createWallGeometry.js":()=>import("./createWallGeometry.js"),"./createWallOutlineGeometry.js":()=>import("./createWallOutlineGeometry.js"),"./decodeDraco.js":()=>import("./decodeDraco.js"),"./decodeGoogleEarthEnterprisePacket.js":()=>import("./decodeGoogleEarthEnterprisePacket.js"),"./decodeI3S.js":()=>import("./decodeI3S.js"),"./transcodeKTX2.js":()=>import("./transcodeKTX2.js"),"./transferTypedArrayTest.js":()=>import("./transferTypedArrayTest.js"),"./upsampleQuantizedTerrainMesh.js":()=>import("./upsampleQuantizedTerrainMesh.js")});var f={};async function h(s,t){let e=k(f[t]??f[s]);return r(e)?e:r(t)?(typeof exports=="object"?e=a(t):e=(await import(t)).default,f[t]=e,e):(typeof exports=="object"?e=a(`Workers/${s}`):e=(r(t)?await import(t):await b(`./${s}.js`)).default,f[s]=e,e)}async function x(s,t){let e=s.subTasks,n=e.length,u=new Array(n);for(let o=0;o<n;o++){let i=e[o],m=i.geometry,l=i.moduleName,c=i.modulePath;if(r(l)&&r(c))throw new y("Must only set moduleName or modulePath");r(l)||r(c)?u[o]=h(l,c).then(g=>g(m,i.offset)):u[o]=m}return Promise.all(u).then(function(o){return d.packCreateGeometryResults(o,t)})}var P=w(x);export{P as default};
