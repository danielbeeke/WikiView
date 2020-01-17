import {MarkerGlobe} from './MarkerGlobe';
import {WikiDataSparql} from './WikiDataSparql';
import {battlesQuery} from './SparqlQueries';
import {GeoCoordinates} from '@here/harp-geoutils';

// Real live size of globe.
const earthSize = 6371000;

AFRAME.registerComponent('harp', {

  /**
   * I have used https://github.com/jeromeetienne/threejs-inspector
   * With his I can see that the 3D objects are loaded in the scene of A-frame.
   */
  init: function () {
    this.data.timestamp = Date.now();
    const originalCanvas = this.el.parentElement.querySelector('canvas');
    const canvas = document.createElement('canvas');
    canvas.width = originalCanvas.width;
    canvas.height = originalCanvas.height;

    const map = new MarkerGlobe(canvas);
    this.map = map;
    const globe = map.get3dObject();
    this.harpCamera = map.getCamera();

    const factor = 1 / earthSize;

    globe.scale.set(factor, factor, factor);
    globe.position.set(3,0,0);
    this.el.setObject3D('globe', globe);

    // Set for debugging purposes.
    globe.name = 'globe';
    window.THREE = THREE;
    window.scene = globe.parent.parent;

    const wikiData = new WikiDataSparql();

    // Add markers.
    wikiData.get(battlesQuery).then(GeoJSONFeatureCollection => {
      map.setMarkers(GeoJSONFeatureCollection);
    });
  },

  tick: function () {
    if (Date.now() - this.data.timestamp > 1000) {
      this.data.timestamp += 1000;
      this.data.seconds += 1;
      // TODO Calculate the angle of the earth that we want to see.

      const cameraEl = this.el.sceneEl.camera.el;
      // const rotation = cameraEl.getAttribute('rotation');
      const worldPos = new THREE.Vector3();
      worldPos.setFromMatrixPosition(cameraEl.object3D.matrixWorld);

      const state = {
        geoPos: new GeoCoordinates(40.707, -74.01, 0),
        zoomLevel: 16,
        yawDeg: 0,
        pitchDeg: 35
      };
      // this.harpCamera.position.set(
      //   worldPos.x,
      //   worldPos.y,
      //   worldPos.z
      // );
      // this.map.getMap().setCameraGeolocationAndZoom(
      //     state.geoPos,
      //     state.zoomLevel,
      //     (state.yawDeg += 0.1),
      //     state.pitchDeg
      //   );
      this.map.getMap().renderSync();
      // this.harpCamera.rotation.set(rotation.x * earthSize, rotation.y * earthSize, rotation.z * earthSize);
    }
  },

  remove: function () {
    this.el.removeObject3D('globe');
  }
});
