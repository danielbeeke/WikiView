import {MarkerGlobe} from './MarkerGlobe';

AFRAME.registerComponent('harp', {

  /**
   * I have used https://github.com/jeromeetienne/threejs-inspector
   * With his I can see that the 3D objects are loaded in the scene of A-frame.
   */
  init: function () {
    let originalCanvas = this.el.parentElement.querySelector('canvas');
    const canvas = document.createElement('canvas');
    canvas.width = originalCanvas.width;
    canvas.height = originalCanvas.height;
    let map = new MarkerGlobe(canvas);
    const globe = map.get3dObject();

    console.log(map.getCamera())

    // Real live size of globe.
    let factor = 1 / 6371000;

    globe.scale.set(factor, factor, factor);
    globe.position.set(3, 1, 1);
    this.el.setObject3D('globe', globe);

    // Set for debugging purposes.
    globe.name = 'globe';
    window.THREE = THREE;
    window.scene = globe.parent.parent;
  },

  remove: function () {
    this.el.removeObject3D('globe');
  }
});
