import { Vec2D } from './math'
import { GameObject } from './game_object'
import { renderer } from './graphics'

class Camera {
  constructor() {
    this.pos = new PIXI.Point(0, 0)
    this.scale = new PIXI.Point(10, window.innerHeight / window.innerWidth * 10)
  }
}

class World {
  constructor() {
    this.camera = new Camera()
    this.Create()
  }

  Create() {
    this._CreateScene()
    this.test = new GameObject(new Vec2D(0, 1), new Vec2D(1, 1))
    this.scene.addChild(this.test.graphic)
  }

  _CreateScene() {
    this.scene = new PIXI.Container()
    this.scene.transform.localTransform = new PIXI.Matrix(
      1,    // x scale
      0,    // x skew
      0,    // y skew
      1,    // y scale
      0,    // x translation
      0     // y translation
    )
    // invert y-axis
    this.scene.position.y += window.innerHeight / renderer.resolution
    this.scene.scale.y *= -1
    // scale
    const pix_per_unit = window.innerWidth / this.camera.scale.x
    this.scene.scale.x *= pix_per_unit / renderer.resolution
    this.scene.scale.y *= pix_per_unit / renderer.resolution
  }

}

export { World }