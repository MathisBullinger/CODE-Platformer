import { Vec2D } from './../math'
import { Graphics } from './../graphics'
import { Movable } from './../game_object'

/**
  * General projectile entity. This class is not meant to be instantiated
  * directly
  */
class Projectile extends Movable {
  /**
    * Initializes a new projectile
    */
  constructor(weapon, scale, shooting_velocity, mass, radians_offset = 0) {
    super(Projectile._GetNozzlePosition(weapon, scale), scale)
    // This ES6 snippet prevents direct instatiation in order to ensure an "abstract" class
    if (new.target === Projectile) {
      throw new TypeError('Cannot construct abstract Projectile instances directly')
    }
    // Set attributes
    this.weapon = weapon
    this.mass = mass
    // Get projectile orientation and scale direction vector by velocity
    this.vel = Vec2D.Add(Vec2D.Mult(Projectile._RadiansToVector(weapon, radians_offset), shooting_velocity), new Vec2D(0, 0))
    // Find nozzle and set position to nozzle position
    this.graphic = Graphics.CreateRectangle(
      this.pos.x, this.pos.y, scale.x, scale.y, 0x000000
    )
    const a = weapon.graphic.parent.rotation
    const offset = 1
    const off_vec = new Vec2D(offset * Math.sin(a) * -1, offset * Math.cos(a)) // don't shoot yourself
    this.pos = Vec2D.Add(this.pos, off_vec)
    console.log(off_vec)
    // Center pivot and apply holster rotation
    this.graphic.pivot.set(scale.x / 2, scale.y / 2)
    this.graphic.rotation = weapon.graphic.parent.rotation
    // set base damage
    this.damage = 1
  }

  /**
    * Update projectile position based on velocity
    */
  Update(dt) {
    super.Update(dt)
    this.graphic.rotation = Math.atan2(this.vel.y, this.vel.x) + (Math.PI / 2)
  }

  /**
    * Gets the position of the weapon nozzle on the game grid.
    * Can't use the weapon.graphic.worldTransform matrix since
    * it already include the inverse y and scene scaling.
    * (Most likely there is a way but I don't want to do the math for that)
    */
  static _GetNozzlePosition(weapon, scale) {
    // Get graphics for all relevant entities. This is an ES6 notation, will fail on different es versions
    const [ holster_rot, holster_graphic, player_graphic ] = [ weapon.graphic.parent.rotation, weapon.graphic.parent, weapon.graphic.parent.parent ]
    // Holster is at pos = player_graphic pos + holster_graphic_pos
    const holster_pos = Vec2D.Add(
      new Vec2D(player_graphic.position.x, player_graphic.position.y),
      new Vec2D(holster_graphic.position.x, holster_graphic.position.y)
    )
    // Get cos and sin
    const [ cs, sn ] = [ Math.cos(holster_rot), Math.sin(holster_rot) ]
    // x = x * cs - y * sn;
    // y = x * sn + y * cs;
    return Vec2D.Add(holster_pos, new Vec2D(
      weapon.pos.x * cs - (weapon.pos.y + scale.y / 2) * sn,
      weapon.pos.x * sn + (weapon.pos.y + scale.y / 2) * cs
    ))
  }

  /**
   * Gets the projectiles current impulse.
   * p = m * v
   */
  GetImpulse() {
    return this.mass * Math.sqrt(Math.pow(this.vel.x, 2) + Math.pow(this.vel.y, 2))
  }

  /**
    * Takes a weapon and converts the rotation of the weapon holster
    * from radians to a direction vector.
    */
  static _RadiansToVector(weapon, radians_offset = 0) {
    const radians = weapon.graphic.parent.rotation + radians_offset
    const [ cs, sn ] = [ Math.cos(radians), Math.sin(radians) ]
    return new Vec2D(
      weapon.pos.x * cs - weapon.pos.y * sn,
      weapon.pos.x * sn + weapon.pos.y * cs
    )
  }
}

export { Projectile }
