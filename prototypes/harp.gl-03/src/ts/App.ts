import '../../scss/style.scss';
import 'aframe';
import './AframeHarpGl.js';

window.addEventListener('DOMContentLoaded', (event) => {
  document.body.innerHTML = `
  <a-scene>
      <a-globe position="1 0.75 -3"></a-globe>
      <a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>
      <a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane>
      <a-sky color="#ECECEC"></a-sky>
  </a-scene>
`;
});