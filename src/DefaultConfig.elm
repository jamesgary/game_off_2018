module DefaultConfig exposing (json)

import Json.Decode



-- Put this in your browser console:
-- JSON.stringify(JSON.parse(localStorage.getItem('persistence')).configFloats, null, 2)


json : String
json =
    """
{
  "base:healthMax": {
    "val": 12.9297505274916,
    "min": 0,
    "max": 25
  },
  "creeps:attacker:melee:attackPerSecond": {
    "val": 0.443713541020231,
    "min": 0,
    "max": 25
  },
  "creeps:attacker:melee:damage": {
    "val": 0.515080054610897,
    "min": 0,
    "max": 25
  },
  "creeps:attacker:melee:health": {
    "val": 5,
    "min": 0,
    "max": 25
  },
  "creeps:attacker:melee:speed": {
    "val": 0.907533821521658,
    "min": 0,
    "max": 1
  },
  "creeps:global:damage": {
    "val": 5,
    "min": 0,
    "max": 25
  },
  "creeps:global:health": {
    "val": 5,
    "min": 0,
    "max": 25
  },
  "creeps:global:speed": {
    "val": 5,
    "min": 0,
    "max": 25
  },
  "crops:moneyCrop:healthMax": {
    "val": 5,
    "min": 0,
    "max": 25
  },
  "crops:turret:healthMax": {
    "val": 5,
    "min": 0,
    "max": 25
  },
  "crops:turret:timeToSprout": {
    "val": 5,
    "min": 0,
    "max": 25
  },
  "enemyBase:creepsPerSpawn": {
    "val": 5,
    "min": 0,
    "max": 25
  },
  "enemyBase:healthMax": {
    "val": 5,
    "min": 0,
    "max": 25
  },
  "enemyBase:secondsBetweenSpawnsAtDay": {
    "val": 0.790616854908775,
    "min": 0,
    "max": 5
  },
  "enemyBase:secondsBetweenSpawnsAtNight": {
    "val": 5,
    "min": 0,
    "max": 25
  },
  "hero:acceleration": {
    "val": 497.827975673328,
    "min": 0,
    "max": 1000.003
  },
  "hero:healthMax": {
    "val": 5,
    "min": 0,
    "max": 25
  },
  "hero:maxSpeed": {
    "val": 15,
    "min": 0,
    "max": 15
  },
  "hero:size": {
    "val": 5,
    "min": 0,
    "max": 25
  },
  "hero:velocity": {
    "val": 5,
    "min": 0,
    "max": 25
  },
  "system:gameSpeed": {
    "val": 5,
    "min": 0,
    "max": 25
  },
  "system:tiles:grass:friction": {
    "val": 97,
    "min": 0,
    "max": 100
  },
  "ui:meterWidth": {
    "val": 225,
    "min": 0,
    "max": 225
  },
  "waterGun:ammoMax": {
    "val": 5,
    "min": 0,
    "max": 25
  },
  "waterGun:bulletCost": {
    "val": 5,
    "min": 0,
    "max": 25
  },
  "waterGun:bulletDmg": {
    "val": 5,
    "min": 0,
    "max": 25
  },
  "waterGun:bulletMaxAge": {
    "val": 5,
    "min": 0,
    "max": 25
  },
  "waterGun:bulletPushback": {
    "val": 13.2090107980638,
    "min": 0,
    "max": 25
  },
  "waterGun:bulletSpeed": {
    "val": 13.2090107980638,
    "min": 0,
    "max": 25
  },
  "waterGun:fireRate": {
    "val": 18.4249720739729,
    "min": 0,
    "max": 25
  },
  "waterGun:refillRate": {
    "val": 20.5721732654834,
    "min": 0,
    "max": 25
  }
}
"""
