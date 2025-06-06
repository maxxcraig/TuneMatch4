
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import $ from "jquery";
import "./global.css";


// 🔮 Optional: add the gradient animation AFTER the app loads
var colors = [
  [62, 35, 255],
  [60, 255, 60],
  [255, 35, 98],
  [45, 175, 230],
  [255, 0, 255],
  [255, 128, 0],
];

var step = 0;
var colorIndices = [0, 1, 2, 3];
var gradientSpeed = 0.002;

function updateGradient() {
  if (typeof window.$ === "undefined") return;

  var c0_0 = colors[colorIndices[0]];
  var c0_1 = colors[colorIndices[1]];
  var c1_0 = colors[colorIndices[2]];
  var c1_1 = colors[colorIndices[3]];

  var istep = 1 - step;
  var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
  var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
  var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
  var color1 = "rgb(" + r1 + "," + g1 + "," + b1 + ")";

  var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
  var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
  var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
  var color2 = "rgb(" + r2 + "," + g2 + "," + b2 + ")";

  window.$("#gradient")
    .css({
      background:
        "-webkit-gradient(linear, left top, right top, from(" +
        color1 +
        "), to(" +
        color2 +
        "))",
    })
    .css({
      background:
        "-moz-linear-gradient(left, " + color1 + " 0%, " + color2 + " 100%)",
    });

  step += gradientSpeed;
  if (step >= 1) {
    step %= 1;
    colorIndices[0] = colorIndices[1];
    colorIndices[2] = colorIndices[3];
    colorIndices[1] =
      (colorIndices[1] +
        Math.floor(1 + Math.random() * (colors.length - 1))) %
      colors.length;
    colorIndices[3] =
      (colorIndices[3] +
        Math.floor(1 + Math.random() * (colors.length - 1))) %
      colors.length;
  }
}

setInterval(updateGradient, 10);

// 🔁 Mount React app
const root = createRoot(document.getElementById("app"));
root.render(<App />);
