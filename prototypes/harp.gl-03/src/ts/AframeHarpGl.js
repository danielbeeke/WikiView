import {MarkerGlobe} from './MarkerGlobe';

AFRAME.registerComponent('harp', {

  /**
   * I have used https://github.com/jeromeetienne/threejs-inspector
   * With his I can see that the 3D objects are loaded in the scene of A-frame.
   */
  init: function () {
    const canvas = document.createElement('canvas');
    let map = new MarkerGlobe(canvas);
    const globe = map.get3dObject().parent.children[0].clone();

    globe.position.set(1, 1, 1);
    this.el.setObject3D('globe', globe);

    // Set for debugging purposes.
    globe.name = 'globe';
    window.THREE = THREE;
    window.scene = globe.parent.parent;
  },

  // Remove the line geometry.
  remove: function () {
    this.el.removeObject3D('globe');
  }
});
