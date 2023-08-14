import "./app.css";
import * as Cesium from "cesium";
import * as dat from "dat.gui";
import { viewer } from "./main";
import SkyBoxOnGround from "./SkyBoxOnGround/index";
import Camera from "./Camera/index";
import Bloom from "./EffectComposerBloom/index";
import AmbientOcclusion from "./EffectComposerAmbientOcclusion/index";

const gui = new dat.GUI({
  name: "Cesium GUI",
  width: 450,
  autoPlace: true,
  closed: false,
});
gui.domElement.id = "gui";
gui.show();

viewer.clock.currentTime = Cesium.JulianDate.fromIso8601(
  "2023-08-14T11:00:00Z"
);

console.log("viewer.scene.postProcessStages.fxaa.enabled", viewer.scene.postProcessStages.fxaa.enabled)
console.log("viewer.scene.postProcessStages.bloom.enabled", viewer.scene.postProcessStages.bloom.enabled)
console.log("viewer.scene.postProcessStages.ambientOcclusion.enabled", viewer.scene.postProcessStages.ambientOcclusion.enabled)

viewer.scene.postProcessStages.fxaa.enabled = true;

const camera = new Camera(viewer, gui, undefined, true);

const skyBox = new SkyBoxOnGround(
  viewer,
  gui,
  {
    show: true,
    sourcesType: "day1",
    sourcesList: [
      {
        name: "day1",
        sources: {
          positiveX: "./static/skybox/skys/rightav9.jpg",
          negativeX: "./static/skybox/skys/leftav9.jpg",
          positiveY: "./static/skybox/skys/frontav9.jpg",
          negativeY: "./static/skybox/skys/backav9.jpg",
          positiveZ: "./static/skybox/skys/topav9.jpg",
          negativeZ: "./static/skybox/skys/bottomav9.jpg",
        },
      },
      {
        name: "day2",
        sources: {
          positiveX: "./static/skybox/skys/SunSetRight.png",
          negativeX: "./static/skybox/skys/SunSetLeft.png",
          positiveY: "./static/skybox/skys/SunSetFront.png",
          negativeY: "./static/skybox/skys/SunSetBack.png",
          positiveZ: "./static/skybox/skys/SunSetUp.png",
          negativeZ: "./static/skybox/skys/SunSetDown.png",
        },
      },
      {
        name: "day3",
        sources: {
          positiveX: "./static/skybox/skys/Right.jpg",
          negativeX: "./static/skybox/skys/Left.jpg",
          positiveY: "./static/skybox/skys/Front.jpg",
          negativeY: "./static/skybox/skys/Back.jpg",
          positiveZ: "./static/skybox/skys/Up.jpg",
          negativeZ: "./static/skybox/skys/Down.jpg",
        },
      },
    ],
  },
  true
);

let fxaa_folder = gui.addFolder("Fxaa");
fxaa_folder.add({ show: true }, "show").onChange((v: boolean) => {
  viewer.scene.postProcessStages.fxaa.enabled = v;
});

let bloom = new Bloom(
  viewer,
  gui,
  {
    show: false,
    glowOnly: false,
    contrast: 45,
    brightness: -0.12,
    delta: 1.0,
    sigma: 1.0,
    stepSize: 2.0,
  },
  false
);

let ambientOcclusion = new AmbientOcclusion(viewer, gui);

(async () => {
  const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(1240402, {
    show: true,
  });
  viewer.scene.primitives.add(tileset);

  camera.intance.position = new Cesium.Cartesian3(
    1234127.2294710164,
    -5086011.666443127,
    3633337.0413351045
  );
  camera.intance.direction = new Cesium.Cartesian3(
    -0.5310064396211631,
    -0.30299013818088416,
    -0.7913464078682514
  );
  camera.intance.right = new Cesium.Cartesian3(
    -0.8468592075426076,
    0.1574051185945647,
    0.507989282604011
  );
  camera.intance.up = Cesium.Cartesian3.cross(
    camera.intance.right,
    camera.intance.direction,
    new Cesium.Cartesian3()
  );
})();
