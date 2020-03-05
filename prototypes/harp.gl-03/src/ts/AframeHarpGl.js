import {AframeHarpGlobe} from './AframeHarpGlobe';

const componentName = 'globe';

AFRAME.registerComponent('harp', {
  init: function () {
    const aframeHarpGlobe = new AframeHarpGlobe(componentName, this.el);
    window.THREE = THREE;
    window.scene = aframeHarpGlobe.globe.parent.parent;
  },

  remove: function () {
    this.el.removeObject3D(componentName);
  }
});

AFRAME.registerPrimitive('a-globe', {
  defaultComponents: {
    harp: {},
  },
  mappings: {
    position: 'harp.position'
  }});