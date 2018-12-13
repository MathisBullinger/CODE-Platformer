import { Firearm } from './firearm'
import { Bullet } from './bullet'
import { Vec2D } from './../math'

class Minigun extends Firearm {
  constructor() {
    super(new Vec2D(0, 0.25), new Vec2D(0.75, 1.5), 100)
    this.ammunition = Bullet
  }
}
Minigun.Name = 'Minigun'

export { Minigun }
