port module Game exposing (Effect(..), FxKind(..), GameState(..), Model, Msg(..), init, update, view)

import AStar
import Browser
import Browser.Events
import Collision
import Color exposing (Color)
import Common exposing (..)
import Dict exposing (Dict)
import Html exposing (Html)
import Html.Attributes
import Html.Events
import Html.Events.Extra.Mouse as Mouse
import Json.Decode as Decode
import List.Extra
import Math.Vector2 as Vec2 exposing (Vec2)
import Random
import Round
import Set exposing (Set)
import WebGL


type alias Model =
    { -- fluid things
      hero : Hero
    , bullets : List Bullet
    , composts : List Compost

    -- fluid bldgs?
    , creeps : List Creep

    -- bldgs
    , base : Base
    , enemyTowers : List EnemyTower
    , crops : List Crop

    -- hero things
    , timeSinceLastFire : Float
    , timeSinceLastSlash : Float
    , slashEffects : List ( Float, Graphic )
    , waterAmt : Float
    , equipped : Equippable

    -- map
    , map : Map
    , inv : Inv

    -- state
    , gameState : GameState
    , mousePos : Vec2
    , isMouseDown : Bool
    , age : Float
    , isPaused : Bool
    , money : Int
    , moolahSeedAmt : Int
    , turretSeedAmt : Int
    , shouldShowHelp : Bool

    -- upgrades
    , rangeLevel : Int
    , capacityLevel : Int
    , fireRateLevel : Int

    -- to be flushed at the end of every tick
    , fx : List Effect
    }


init : Session -> ( Model, List Effect )
init session =
    let
        c =
            session.c

        savedMap =
            case List.head session.savedMaps of
                Just map ->
                    map

                Nothing ->
                    --Debug.todo "whut you doin"
                    { name = "New Map"
                    , map =
                        mapFromAscii
                            """
11111111111111111111111111111
10000000000011100000000000001
10000000000001100000000000001
10000000000000100000111000001
10000000000001110000011000001
10000000000000110000011000001
10000000000000011000011000001
10000000000000000000011000001
10000000000000000000011000001
10000000000000000000011000001
10000000000000000000011000001
11111111111111111111111111111
"""
                    , hero = ( 3, 4 )
                    , enemyTowers = Set.fromList [ ( 24, 7 ) ]
                    , base = ( 2, 2 )
                    , size = ( 6, 5 )
                    }
    in
    ( { hero =
            { pos =
                tilePosToFloats savedMap.hero
                    --|> always ( 2, 2 )
                    |> tupleToVec2
                    |> Vec2.add (Vec2.vec2 0.5 0.5)
            , vel = Vec2.vec2 0 0
            , acc = Vec2.vec2 0 0
            , healthAmt = c.getFloat "hero:healthMax"
            , healthMax = c.getFloat "hero:healthMax"
            }
      , bullets = []
      , composts = []
      , creeps = []
      , enemyTowers =
            savedMap.enemyTowers
                |> Set.toList
                |> List.map
                    (\pos ->
                        { pos = pos
                        , timeSinceLastSpawn = 0
                        , healthAmt = c.getFloat "enemyBase:healthMax"
                        , healthMax = c.getFloat "enemyBase:healthMax"
                        , pathToBase =
                            AStar.findPath
                                pythagoreanCost
                                (possibleMoves savedMap.map)
                                pos
                                savedMap.base
                                |> Maybe.withDefault []
                        }
                    )
      , crops = []
      , base =
            { pos = savedMap.base
            , healthAmt = c.getFloat "base:healthMax"
            , healthMax = c.getFloat "base:healthMax"
            }
      , timeSinceLastFire = 0
      , timeSinceLastSlash = 99999
      , slashEffects = []
      , waterAmt = c.getFloat "waterGun:maxCapacity"
      , equipped = Gun
      , map = savedMap.map
      , inv =
            { compost = 0
            }
      , moolahSeedAmt = 4
      , turretSeedAmt = 0
      , money = 0
      , rangeLevel = 1
      , capacityLevel = 1
      , fireRateLevel = 1
      , gameState = MainMenu
      , isMouseDown = False
      , mousePos = Vec2.vec2 -99 -99
      , age = 0
      , isPaused = False
      , shouldShowHelp = False
      , fx = []
      }
    , [ DrawMap (drawMap savedMap) ]
    )



--initTryOut : Session -> SavedMap -> ( Model, Cmd Msg )
--initTryOut session savedMap =
--    let
--        c =
--            session.c
--    in
--    ( { hero =
--            { pos =
--                tilePosToFloats savedMap.hero
--                    |> tupleToVec2
--                    |> Vec2.add (Vec2.vec2 0.5 0.5)
--            , vel = Vec2.vec2 0 0
--            , acc = Vec2.vec2 0 0
--            , healthAmt = c.getFloat "hero:healthMax"
--            , healthMax = c.getFloat "hero:healthMax"
--            }
--      , bullets = []
--      , composts = []
--      , creeps = []
--      , enemyTowers =
--            savedMap.enemyTowers
--                |> Set.toList
--                |> List.map
--                    (\pos ->
--                        { pos = pos
--                        , timeSinceLastSpawn = 9999
--                        , healthAmt = c.getFloat "enemyBase:healthMax"
--                        , healthMax = c.getFloat "enemyBase:healthMax"
--                        }
--                    )
--      , crops = []
--      , base =
--            { pos = savedMap.base
--            , healthAmt = c.getFloat "base:healthMax"
--            , healthMax = c.getFloat "base:healthMax"
--            }
--      , timeSinceLastFire = 0
--      , timeSinceLastSlash = 99999
--      , slashEffects = []
--      , waterAmt = 75
--      , equipped = Gun
--      , map = savedMap.map
--      , inv =
--            { compost = 0
--            }
--      , money = 0
--      , rangeLevel = 1
--      , capacityLevel = 1
--      , fireRateLevel = 1
--      , moolahSeedAmt = 0
--      , turretSeedAmt = 0
--      , gameState = Playing
--      , isMouseDown = False
--      , mousePos = Vec2.vec2 -99 -99
--      , age = 0
--      , isPaused = False
--      , fx = []
--      , shouldShowHelp = False
--      }
--    , Cmd.none
--    )


port hardReset : () -> Cmd msg


type GameState
    = MainMenu
    | Playing
    | InStore
    | GameOver
    | Win


type alias Inv =
    { compost : Int
    }


type alias Compost =
    { pos : Vec2
    , age : Float
    }


type alias Config =
    { getFloat : String -> Float
    }


type alias Base =
    { pos : TilePos
    , healthAmt : Float
    , healthMax : Float
    }


type Equippable
    = Gun
    | Scythe
    | TurretSeed
    | MoolahCropSeed


type alias Creep =
    { pos : Vec2

    --, target : Target -- use for hero
    , timeSinceLastHop : Float
    , healthAmt : Float
    , healthMax : Float
    , age : Float
    , seed : Random.Seed
    , path : List TilePos
    }


type alias Cache =
    {}


type alias HeroPos =
    Vec2


type alias Hero =
    { pos : HeroPos
    , vel : Vec2
    , acc : Vec2
    , healthAmt : Float
    , healthMax : Float
    }


type alias EnemyTower =
    { pos : TilePos
    , timeSinceLastSpawn : Float
    , healthAmt : Float
    , healthMax : Float
    , pathToBase : List TilePos
    }


waterNeededToMatureC =
    3


type alias Crop =
    { pos : TilePos
    , healthAmt : Float
    , healthMax : Float
    , state : CropState
    , kind : CropKind
    }


type CropState
    = Seedling
        { waterNeededToMature : Float
        , waterConsumed : Float
        , waterCapacity : Float
        , waterInSoil : Float
        }
    | Mature


type CropKind
    = MoneyCrop
    | Turret { timeSinceLastFire : Float }


type alias Bullet =
    { kind : BulletKind
    , pos : Vec2
    , angle : Float
    , age : Float
    }


type BulletKind
    = PlayerBullet
    | PlantBullet


type alias Key =
    String


type Upgrade
    = Range
    | Capacity
    | FireRate


type Msg
    = KeyDown String
    | KeyUp String
    | MouseDown
    | MouseUp
    | MouseMove ( Float, Float )
    | Tick Float
    | TogglePause Bool
    | Buy Equippable Int
    | LeaveMarket
    | ToggleHelp Bool
    | BuyUpgrade Upgrade
    | ClickPlay


makeC : Dict String ConfigVal -> Config
makeC config =
    { getFloat =
        \n ->
            case
                config
                    |> Dict.get n
                    |> Maybe.map .val
            of
                Just val ->
                    val

                Nothing ->
                    -1
                        |> dlog ("YOU FOOOOL: " ++ n)
    }


type alias ConfigVal =
    { val : Float
    , min : Float
    , max : Float
    }


vec2ToTuple : Vec2 -> ( Float, Float )
vec2ToTuple vec2 =
    vec2
        |> Vec2.toRecord
        |> (\{ x, y } -> ( x, y ))


tupleToVec2 : ( Float, Float ) -> Vec2
tupleToVec2 ( x, y ) =
    { x = x, y = y }
        |> Vec2.fromRecord


viewMeter : Float -> Float -> Float -> Html Msg
viewMeter amt max meterWidth =
    let
        padding =
            meterWidth * 0.005

        ratio =
            amt / max
    in
    Html.div
        [ Html.Attributes.style "display" "inline-block"
        , Html.Attributes.style "background" "#111"
        , Html.Attributes.style "padding" (String.fromFloat (4 * padding) ++ "px")
        , Html.Attributes.style "font-size" "0"
        ]
        [ Html.div
            [ Html.Attributes.style "display" "inline-block"
            , Html.Attributes.style "width" (px meterWidth)
            , Html.Attributes.style "background" "#eee"
            , Html.Attributes.style "height" (px (0.1 * meterWidth))
            , Html.Attributes.style "border" (px (2 * padding) ++ " solid #eee")
            , Html.Attributes.style "border-radius" (px (4 * padding))
            ]
            [ Html.div
                (List.concat
                    [ [ Html.Attributes.style "background" "#5fcde4"
                      , Html.Attributes.style "border" "#5fcde4"
                      , Html.Attributes.style "width" (pct (100 * ratio))
                      , Html.Attributes.style "height" "100%"
                      , Html.Attributes.style "border-radius" (px (4 * padding))
                      ]
                    , if amt >= (0.98 * max) then
                        [ Html.Attributes.style "border-radius" (px (4 * padding)) ]

                      else
                        [ Html.Attributes.style "border-radius-right" "0" ]
                    ]
                )
                []
            ]
        ]


vec2FromTilePos : TilePos -> Vec2
vec2FromTilePos tilePos =
    tilePos
        |> tilePosToFloats
        |> tupleToVec2
        |> Vec2.add (Vec2.vec2 0.5 0.5)


tilePosSub : TilePos -> TilePos -> TilePos
tilePosSub ( a, b ) ( c, d ) =
    ( a - c, b - d )


tilePosToFloats : TilePos -> ( Float, Float )
tilePosToFloats ( col, row ) =
    ( toFloat col, toFloat row )


zoomedTileSize : Model -> Float
zoomedTileSize model =
    32


update : Msg -> Session -> Model -> ( Model, List Effect )
update msg session model =
    case msg of
        Tick d ->
            let
                delta =
                    -- set max frame at 0.25 sec
                    min (d / 1000) 0.25
            in
            model
                |> ageAll session delta
                |> soilAbsorbWaterFromBullets session delta
                |> cropsAbsorbWater session delta
                |> moveHero session delta
                |> refillWater session delta
                |> makeTurretBullets session delta
                |> makePlayerBullets session delta
                |> moveBullets session delta
                |> spawnCreeps session delta
                |> moveCreeps session delta
                |> applyCreepDamageToBase session delta
                |> applyCreepDamageToHero session delta
                |> collideBulletsWithCreeps session delta
                |> collideBulletsWithEnemyTowers session delta
                --|> heroPickUpCompost session delta
                |> checkIfInStore session delta
                |> checkGameOver session delta
                |> (\updatedModel ->
                        ( { updatedModel
                            | fx = []

                            --, isPaused = True
                          }
                        , [ DrawSprites (getSprites session updatedModel)
                          , DrawHero (drawHero session updatedModel)
                          , MoveCamera updatedModel.hero.pos
                          ]
                            ++ updatedModel.fx
                        )
                   )

        KeyUp str ->
            ( model |> applyKeyDown str
            , []
            )

        KeyDown str ->
            ( model |> applyKeyDown str
            , []
            )

        MouseMove ( x, y ) ->
            let
                mousePos =
                    ( x, y )
                        |> tupleToVec2
            in
            ( { model | mousePos = mousePos }
            , []
            )

        MouseDown ->
            ( { model | isMouseDown = True }
                |> (\m ->
                        case ( m.equipped, canPlace session model, hoveringTilePos session m ) of
                            ( MoolahCropSeed, Can, Just tilePos ) ->
                                { m
                                    | crops =
                                        { pos = tilePos
                                        , healthAmt = 1
                                        , healthMax = 1
                                        , state =
                                            Seedling
                                                { waterNeededToMature = session.c.getFloat "crops:moolah:waterNeededToMature"
                                                , waterConsumed = 0
                                                , waterCapacity = session.c.getFloat "crops:soilWaterCapacity"
                                                , waterInSoil = 0
                                                }
                                        , kind = MoneyCrop
                                        }
                                            :: m.crops
                                    , moolahSeedAmt = model.moolahSeedAmt - 1
                                }

                            ( TurretSeed, Can, Just tilePos ) ->
                                { m
                                    | crops =
                                        { pos = tilePos
                                        , healthAmt = session.c.getFloat "crops:turret:healthMax"
                                        , healthMax = session.c.getFloat "crops:turret:healthMax"
                                        , state =
                                            Seedling
                                                { waterNeededToMature = session.c.getFloat "crops:turret:waterNeededToMature"
                                                , waterConsumed = 0
                                                , waterCapacity = session.c.getFloat "crops:soilWaterCapacity"
                                                , waterInSoil = 0
                                                }
                                        , kind = Turret { timeSinceLastFire = 0 }
                                        }
                                            :: m.crops
                                    , turretSeedAmt = model.turretSeedAmt - 1
                                }

                            ( Scythe, _, _ ) ->
                                let
                                    ( crops, fxs ) =
                                        slashCrops session model
                                in
                                { model
                                    | timeSinceLastSlash = 0
                                    , slashEffects = ( 0, makeSlashEffect session model ) :: model.slashEffects
                                    , creeps = slashCreeps session model
                                    , crops = crops
                                    , fx = fxs ++ model.fx
                                    , money = model.money + (List.length fxs * round (session.c.getFloat "crops:moolah:cashValue"))
                                }

                            _ ->
                                m
                   )
            , []
            )

        MouseUp ->
            ( { model
                | isMouseDown = False
              }
            , []
            )

        TogglePause shouldPause ->
            ( { model
                | isPaused = shouldPause
              }
            , []
            )

        Buy seed cost ->
            if model.money >= cost then
                case seed of
                    MoolahCropSeed ->
                        ( { model
                            | money = model.money - cost
                            , moolahSeedAmt = model.moolahSeedAmt + 1
                          }
                        , []
                        )

                    TurretSeed ->
                        ( { model
                            | money = model.money - cost
                            , turretSeedAmt = model.turretSeedAmt + 1
                          }
                        , []
                        )

                    _ ->
                        ( model, [] )

            else
                ( model, [] )

        LeaveMarket ->
            let
                hero =
                    model.hero
            in
            ( { model
                | hero =
                    { hero
                        | pos = hero.pos |> Vec2.add (Vec2.vec2 0 1)
                        , healthAmt = hero.healthMax
                    }
                , gameState = Playing
              }
            , []
            )

        ToggleHelp shouldShow ->
            ( { model
                | shouldShowHelp = shouldShow
                , isPaused = shouldShow
              }
            , []
            )

        ClickPlay ->
            ( { model
                | shouldShowHelp = True
                , isPaused = True
                , gameState = Playing
              }
            , [ DrawSprites (getSprites session model)
              , DrawHero (drawHero session model)
              , MoveCamera model.hero.pos
              ]
            )

        BuyUpgrade upgrade ->
            ( { model | money = model.money - costForUpgrade session model upgrade }
                |> (\m ->
                        case upgrade of
                            Range ->
                                { m | rangeLevel = m.rangeLevel + 1 }

                            Capacity ->
                                { m | capacityLevel = m.capacityLevel + 1 }

                            FireRate ->
                                { m | fireRateLevel = m.fireRateLevel + 1 }
                   )
            , []
            )


slashDmg =
    2


creepRad =
    -- inconsistent w/ sprite :(
    0.4


checkIfInStore : Session -> Float -> Model -> Model
checkIfInStore session delta model =
    -- todo
    { model
        | gameState =
            if
                model.hero.pos
                    |> Vec2.add (Vec2.vec2 0 0)
                    |> vec2ToTuple
                    |> Tuple.mapBoth floor floor
                    |> (\pos -> pos == model.base.pos)
            then
                InStore

            else
                model.gameState
    }


drawHero : Session -> Model -> HeroSprite
drawHero session model =
    let
        ( xDir, yDir ) =
            if model.timeSinceLastSlash < 0.1 then
                mouseAngleToHero session model
                    - (pi / 4)
                    |> (\angle ->
                            if angle < -pi then
                                angle + 2 * pi

                            else
                                angle
                       )
                    |> angleToDir

            else
                mouseAngleToHero session model
                    |> angleToDir
    in
    { x = model.hero.pos |> Vec2.getX
    , y = model.hero.pos |> Vec2.getY
    , xDir = xDir --model.hero.vel |> Vec2.getX |> round
    , yDir = yDir --model.hero.vel |> Vec2.getY |> round
    , isWalking = Vec2.distance (Vec2.vec2 0 0) model.hero.vel > 0.1
    , equipped = model.equipped |> equippableStr
    }


heroDir : Session -> Model -> ( Int, Int )
heroDir session model =
    mouseAngleToHero session model
        |> angleToDir


angleToDir : Float -> ( Int, Int )
angleToDir angle =
    angle
        / pi
        |> (\rads ->
                if (5 / 8) < rads && (rads < 7 / 8) then
                    ( -1, 1 )

                else if (3 / 8) < rads && (rads < 5 / 8) then
                    ( 0, 1 )

                else if (1 / 8) < rads && (rads < 3 / 8) then
                    ( 1, 1 )

                else if (-1 / 8) < rads && (rads < 1 / 8) then
                    ( 1, 0 )

                else if (-3 / 8) < rads && (rads < -1 / 8) then
                    ( 1, -1 )

                else if (-5 / 8) < rads && (rads < -3 / 8) then
                    ( 0, -1 )

                else if (-7 / 8) < rads && (rads < -5 / 8) then
                    ( -1, -1 )

                else
                    ( -1, 0 )
           )


soilAbsorbWaterFromBullets : Session -> Float -> Model -> Model
soilAbsorbWaterFromBullets session delta model =
    { model
        | crops =
            model.crops
                |> List.map
                    (\crop ->
                        case crop.state of
                            Seedling seedlingData ->
                                let
                                    numBullets =
                                        model.bullets
                                            |> List.filter
                                                (\bullet ->
                                                    (bullet.kind == PlayerBullet)
                                                        && crop.pos
                                                        == (bullet.pos |> vec2ToTuple |> Tuple.mapBoth floor floor)
                                                )
                                            |> List.length
                                            |> toFloat
                                in
                                { crop
                                    | state =
                                        Seedling
                                            { seedlingData
                                                | waterInSoil =
                                                    min (delta * numBullets + seedlingData.waterInSoil) seedlingData.waterCapacity
                                            }
                                }

                            Mature ->
                                crop
                    )
    }


cropsAbsorbWater : Session -> Float -> Model -> Model
cropsAbsorbWater session delta model =
    { model
        | crops =
            model.crops
                |> List.map
                    (\crop ->
                        case crop.state of
                            Seedling { waterNeededToMature, waterConsumed, waterInSoil, waterCapacity } ->
                                let
                                    amtToAbsorb =
                                        min (delta * session.c.getFloat "crops:moolah:absorptionRate") waterInSoil
                                in
                                if waterConsumed + amtToAbsorb > waterNeededToMature then
                                    { crop | state = Mature }

                                else
                                    { crop
                                        | state =
                                            Seedling
                                                { waterConsumed = waterConsumed + amtToAbsorb
                                                , waterNeededToMature = waterNeededToMature
                                                , waterCapacity = waterCapacity
                                                , waterInSoil = waterInSoil - amtToAbsorb
                                                }
                                    }

                            Mature ->
                                crop
                    )
    }


maxWaterCapacity =
    1


slashCreeps : Session -> Model -> List Creep
slashCreeps session model =
    let
        slashPoly =
            getSlashPoly session model
    in
    model.creeps
        |> List.filterMap
            (\creep ->
                if
                    Collision.collision 10
                        ( slashPoly, polySupport )
                        ( polyFromSquare creep.pos creepRad, polySupport )
                        |> Maybe.withDefault False
                then
                    -- hit!
                    let
                        pushback =
                            ( 0.5, mouseAngleToHero session model )
                                |> fromPolar
                                |> tupleToVec2

                        damagedCreep =
                            { creep
                                | healthAmt = creep.healthAmt - 2
                                , pos = Vec2.add creep.pos pushback
                            }
                    in
                    if damagedCreep.healthAmt > 0 then
                        Just damagedCreep

                    else
                        Nothing

                else
                    Just creep
            )


slashCrops : Session -> Model -> ( List Crop, List Effect )
slashCrops session model =
    let
        slashPoly =
            getSlashPoly session model
    in
    model.crops
        |> List.map
            (\crop ->
                case ( crop.state, crop.kind ) of
                    ( Mature, MoneyCrop ) ->
                        if
                            Collision.collision 10
                                ( slashPoly, polySupport )
                                ( polyFromSquare (crop.pos |> vec2FromTilePos) 0.5, polySupport )
                                |> Maybe.withDefault False
                        then
                            -- hit!
                            ( Nothing, Just (DrawFx (crop.pos |> vec2FromTilePos) HarvestFx) )

                        else
                            ( Just crop, Nothing )

                    _ ->
                        ( Just crop, Nothing )
            )
        |> List.unzip
        |> (\( maybeCrops, maybeFxs ) ->
                ( maybeCrops |> List.filterMap identity
                , maybeFxs |> List.filterMap identity
                )
           )


getSlashPoly : Session -> Model -> List Collision.Pt
getSlashPoly session model =
    let
        ( leftCorner, tippyTop, rightCorner ) =
            scythePoints session model
    in
    [ leftCorner, tippyTop, rightCorner, model.hero.pos ]
        |> List.map vec2ToTuple


mouseAngleToHero : Session -> Model -> Float
mouseAngleToHero session model =
    let
        heroPos =
            model.hero.pos

        mousePos =
            mouseGamePos session model

        xDiff =
            Vec2.sub mousePos heroPos
                |> Vec2.getX

        yDiff =
            Vec2.sub mousePos heroPos
                |> Vec2.getY

        ( _, mouseAngle ) =
            toPolar ( xDiff, yDiff )
    in
    mouseAngle


makeSlashEffect : Session -> Model -> Graphic
makeSlashEffect session model =
    let
        height =
            2

        halfWidth =
            1

        heroPos =
            model.hero.pos

        ( leftCorner, tippyTop, rightCorner ) =
            scythePoints session model
    in
    { x = model.hero.pos |> Vec2.getX
    , y = model.hero.pos |> Vec2.getY
    , width = 60
    , height = 100
    , bgColor = "#ffffff"
    , lineStyleWidth = 0
    , lineStyleColor = "#000000"
    , lineStyleAlpha = 1
    , alpha = 1 --max 0 ((maxTimeToShowSlash - model.timeSinceLastSlash) / maxTimeToShowSlash)
    , shape = Arc leftCorner tippyTop rightCorner
    }


ageAll : Session -> Float -> Model -> Model
ageAll session delta model =
    { model
        | age = delta + model.age
        , creeps =
            model.creeps
                |> List.map
                    (\creep ->
                        { creep | age = creep.age + delta }
                    )
        , timeSinceLastSlash = delta + model.timeSinceLastSlash
        , slashEffects =
            model.slashEffects
                |> List.filterMap
                    (\( age, slash ) ->
                        if age + delta > maxTimeToShowSlash then
                            Nothing

                        else
                            Just ( age + delta, slash )
                    )
    }


hoveringTileAndPos : Session -> Model -> Maybe ( Tile, TilePos )
hoveringTileAndPos session model =
    case hoveringTilePos session model of
        Just tilePos ->
            Dict.get tilePos model.map
                |> Maybe.map (\tile -> ( tile, tilePos ))

        Nothing ->
            Nothing


hoveringTile : Session -> Model -> Maybe Tile
hoveringTile session model =
    case hoveringTilePos session model of
        Just tile ->
            Dict.get tile model.map

        Nothing ->
            Nothing


applyKeyDown : String -> Model -> Model
applyKeyDown str model =
    case str of
        "1" ->
            { model | equipped = Gun }

        "2" ->
            { model | equipped = Scythe }

        "3" ->
            { model | equipped = MoolahCropSeed }

        "4" ->
            { model | equipped = TurretSeed }

        _ ->
            model


makePlayerBullets : Session -> Float -> Model -> Model
makePlayerBullets session delta model =
    if model.isMouseDown && model.equipped == Gun && model.waterAmt > 1 then
        if model.timeSinceLastFire > (1 / ((toFloat model.fireRateLevel / 2) * session.c.getFloat "waterGun:fireRate")) then
            { model
                | timeSinceLastFire = 0
                , bullets =
                    (makeBullet PlayerBullet
                        --(Vec2.add model.hero.pos (barrelPos session model))
                        model.hero.pos
                        (mouseGamePos session model)
                        |> (\bullet ->
                                { bullet | pos = Vec2.add bullet.pos (barrelPos session model) }
                           )
                    )
                        :: model.bullets
                , waterAmt = model.waterAmt - 1
            }

        else
            { model | timeSinceLastFire = model.timeSinceLastFire + delta }

    else
        { model | timeSinceLastFire = model.timeSinceLastFire + delta }


barrelPos : Session -> Model -> Vec2
barrelPos session model =
    heroDir session model
        |> Tuple.mapBoth toFloat toFloat
        |> (\( x, y ) ->
                if round y == 0 then
                    -- side view has barrel pretty low
                    Vec2.vec2
                        (x * 1)
                        (y * 1 + 0.25)

                else if round y > 0 then
                    -- oh and bottom is too high
                    Vec2.vec2
                        (x * 1)
                        (y * 1 - 0.35)

                else
                    -- ok it's all a little askew
                    Vec2.vec2
                        (x * 1)
                        (y * 1 + 0.35)
           )


refillWater : Session -> Float -> Model -> Model
refillWater session delta model =
    { model
        | waterAmt =
            if nearbyWater model then
                min
                    (model.waterAmt + (delta * session.c.getFloat "waterGun:refillRate"))
                    (heroWaterMax session model |> toFloat)

            else
                model.waterAmt
    }


nearbyWater : Model -> Bool
nearbyWater model =
    model.hero.pos
        |> getTilesSurroundingVec2 model
        |> List.any (\tile -> tile == Water)


getTilesSurroundingVec2 : Model -> Vec2 -> List Tile
getTilesSurroundingVec2 model pos =
    pos
        |> Vec2.add (Vec2.vec2 -0.5 -0.5)
        |> vec2ToTuple
        |> Tuple.mapBoth round round
        |> (\( x, y ) ->
                [ ( x - 1, y - 1 )
                , ( x - 1, y )
                , ( x - 1, y + 1 )
                , ( x, y - 1 )
                , ( x, y )
                , ( x, y + 1 )
                , ( x + 1, y - 1 )
                , ( x + 1, y )
                , ( x + 1, y + 1 )
                ]
           )
        |> List.map (\neighborPos -> Dict.get neighborPos model.map |> Maybe.withDefault Water)


getTilePosSurroundingVec2 : Model -> Vec2 -> List TilePos
getTilePosSurroundingVec2 model pos =
    pos
        |> Vec2.add (Vec2.vec2 -0.5 -0.5)
        |> vec2ToTuple
        |> Tuple.mapBoth round round
        |> (\( x, y ) ->
                [ ( x - 1, y - 1 )
                , ( x - 1, y )
                , ( x - 1, y + 1 )
                , ( x, y - 1 )
                , ( x, y )
                , ( x, y + 1 )
                , ( x + 1, y - 1 )
                , ( x + 1, y )
                , ( x + 1, y + 1 )
                ]
           )


makeTurretBullets : Session -> Float -> Model -> Model
makeTurretBullets session delta model =
    let
        ( newBullets, newCrops ) =
            model.crops
                |> List.foldl
                    (\crop ( bullets, crops ) ->
                        case ( crop.state, crop.kind ) of
                            ( Mature, Turret { timeSinceLastFire } ) ->
                                let
                                    shotBullet =
                                        if timeSinceLastFire > 0.2 then
                                            model.creeps
                                                |> List.Extra.minimumBy (\closestCreep -> Vec2.distanceSquared closestCreep.pos (vec2FromTilePos crop.pos))
                                                |> Maybe.andThen
                                                    (\closestCreep ->
                                                        if Vec2.distanceSquared closestCreep.pos (vec2FromTilePos crop.pos) < 5 ^ 2 then
                                                            Just (makeBullet PlantBullet (vec2FromTilePos crop.pos) closestCreep.pos)

                                                        else
                                                            Nothing
                                                    )

                                        else
                                            Nothing
                                in
                                case shotBullet of
                                    Just bullet ->
                                        ( bullet :: bullets
                                        , { crop
                                            | kind = Turret { timeSinceLastFire = 0 }
                                          }
                                            :: crops
                                        )

                                    Nothing ->
                                        ( bullets
                                        , { crop
                                            | kind =
                                                Turret
                                                    { timeSinceLastFire = timeSinceLastFire + delta
                                                    }
                                          }
                                            :: crops
                                        )

                            _ ->
                                ( bullets, crop :: crops )
                    )
                    ( model.bullets, [] )
    in
    { model
        | crops = newCrops
        , bullets = newBullets
    }


moveCreeps : Session -> Float -> Model -> Model
moveCreeps session delta model =
    { model
        | creeps =
            model.creeps
                |> List.map (moveCreep session model delta)
    }


moveCreep : Session -> Model -> Float -> Creep -> Creep
moveCreep session model delta creep =
    case creep.path of
        [] ->
            -- maybe wiggle or something?
            creep

        nextTilePos :: rest ->
            let
                ( offset, newSeed ) =
                    Random.step
                        (vec2OffsetGenerator -0.5 0.5)
                        creep.seed

                nextPos =
                    nextTilePos |> vec2FromTilePos |> Vec2.add offset

                speed =
                    session.c.getFloat "creeps:global:speed"
                        * session.c.getFloat "creeps:attacker:melee:speed"
                        * 0.4
                        * (1.1 + sin (10 * creep.age))

                distToTravel =
                    Vec2.distance creep.pos nextPos

                deltaNeededToTravel =
                    distToTravel / speed
            in
            if deltaNeededToTravel < delta then
                { creep
                    | pos = nextPos
                    , seed = newSeed
                    , path = List.drop 1 creep.path
                }

            else
                { creep
                    | pos =
                        Vec2.direction creep.pos nextPos
                            |> Vec2.scale (-delta * speed)
                            |> Vec2.add creep.pos
                }


isCreepOnHero : Hero -> Creep -> Bool
isCreepOnHero hero creep =
    (creep.pos
        |> Vec2.add (Vec2.vec2 0 -0.0)
        |> Vec2.distanceSquared hero.pos
    )
        < (0.8 ^ 2)


applyCreepDamageToBase : Session -> Float -> Model -> Model
applyCreepDamageToBase session delta ({ base } as model) =
    let
        creepDps =
            session.c.getFloat "creeps:attacker:melee:damage"

        dmg =
            creepDps * delta

        numCreeps =
            model.creeps
                |> List.filter
                    (\creep ->
                        Vec2.distance creep.pos (vec2FromTilePos base.pos) < 1
                     -- todo use session.c.getFloat "creeps:attacker:melee:range"
                    )
                |> List.length

        newBase =
            { base
                | healthAmt =
                    base.healthAmt - (dmg * toFloat numCreeps)
            }
    in
    { model | base = newBase }


applyCreepDamageToHero : Session -> Float -> Model -> Model
applyCreepDamageToHero session delta ({ hero } as model) =
    let
        creepDps =
            session.c.getFloat "creeps:attacker:melee:damage"

        dmg =
            creepDps * delta

        numCreeps =
            model.creeps
                |> List.filter (isCreepOnHero model.hero)
                |> List.length

        newHero =
            { hero
                | healthAmt =
                    model.hero.healthAmt - (dmg * toFloat numCreeps)
            }
    in
    { model | hero = newHero }


collideBulletsWithCreeps : Session -> Float -> Model -> Model
collideBulletsWithCreeps session delta model =
    let
        { bullets, creeps, composts, seed, fx } =
            model.bullets
                |> List.foldl
                    (\bullet tmp ->
                        case List.Extra.splitWhen (\creep -> collidesWith ( bullet.pos, 0.1 ) ( creep.pos, 0.5 )) tmp.creeps of
                            Just ( firstHalf, foundCreep :: secondHalf ) ->
                                let
                                    pushback =
                                        ( 0.5, bullet.angle )
                                            |> fromPolar
                                            |> tupleToVec2

                                    newCreep =
                                        -- TODO different bullet dmgs
                                        { foundCreep
                                            | healthAmt = foundCreep.healthAmt - session.c.getFloat "waterGun:bulletDmg"
                                            , pos = Vec2.add foundCreep.pos pushback
                                        }

                                    ( angle, newSeed ) =
                                        Random.step
                                            (Random.float 0 (2 * pi))
                                            tmp.seed
                                in
                                { bullets = tmp.bullets
                                , creeps =
                                    if newCreep.healthAmt > 0 then
                                        firstHalf ++ (newCreep :: secondHalf)

                                    else
                                        firstHalf ++ secondHalf
                                , composts =
                                    if newCreep.healthAmt > 0 then
                                        tmp.composts

                                    else
                                        { pos = foundCreep.pos, age = 0 } :: tmp.composts
                                , seed = newSeed
                                , fx =
                                    if newCreep.healthAmt > 0 then
                                        DrawFx foundCreep.pos Splash :: tmp.fx

                                    else
                                        [ DrawFx foundCreep.pos CreepDeath
                                        , DrawFx foundCreep.pos Splash
                                        ]
                                            ++ tmp.fx
                                }

                            _ ->
                                { bullets = bullet :: tmp.bullets
                                , creeps = tmp.creeps
                                , composts = tmp.composts
                                , seed = tmp.seed
                                , fx = tmp.fx
                                }
                    )
                    { bullets = []
                    , creeps = model.creeps
                    , composts = model.composts
                    , seed = session.seed
                    , fx = model.fx
                    }
    in
    { model
        | creeps = creeps
        , bullets = bullets
        , composts = composts
        , fx = model.fx ++ fx

        --, seed = seed
    }


collideBulletsWithEnemyTowers : Session -> Float -> Model -> Model
collideBulletsWithEnemyTowers session delta model =
    let
        { bullets, enemyTowers, composts, seed, fx } =
            model.bullets
                |> List.foldl
                    (\bullet tmp ->
                        case List.Extra.splitWhen (\enemyTower -> collidesWith ( bullet.pos, 0.1 ) ( vec2FromTilePos enemyTower.pos, 0.5 )) tmp.enemyTowers of
                            Just ( firstHalf, foundEnemyTower :: secondHalf ) ->
                                let
                                    newEnemyTower =
                                        { foundEnemyTower | healthAmt = foundEnemyTower.healthAmt - session.c.getFloat "waterGun:bulletDmg" }

                                    ( angle, newSeed ) =
                                        Random.step
                                            (Random.float 0 (2 * pi))
                                            tmp.seed
                                in
                                { bullets = tmp.bullets
                                , enemyTowers =
                                    if newEnemyTower.healthAmt > 0 then
                                        firstHalf ++ (newEnemyTower :: secondHalf)

                                    else
                                        firstHalf ++ secondHalf
                                , composts =
                                    if newEnemyTower.healthAmt > 0 then
                                        tmp.composts

                                    else
                                        { pos = vec2FromTilePos foundEnemyTower.pos, age = 0 } :: tmp.composts
                                , seed = newSeed
                                , fx = DrawFx bullet.pos Splash :: tmp.fx
                                }

                            _ ->
                                { bullets = bullet :: tmp.bullets
                                , enemyTowers = tmp.enemyTowers
                                , composts = tmp.composts
                                , seed = tmp.seed
                                , fx = tmp.fx
                                }
                    )
                    { bullets = []
                    , enemyTowers = model.enemyTowers
                    , composts = model.composts
                    , seed = session.seed
                    , fx = model.fx
                    }
    in
    { model
        | enemyTowers = enemyTowers
        , bullets = bullets
        , composts = composts
        , fx = model.fx ++ fx

        --, seed = seed
    }


heroPickUpCompost : Session -> Float -> Model -> Model
heroPickUpCompost session delta ({ inv } as model) =
    let
        newComposts =
            model.composts
                |> List.filter
                    (\compost ->
                        Vec2.distance compost.pos model.hero.pos > 1
                    )

        numPickedUp =
            List.length model.composts - List.length newComposts

        newInv =
            { inv | compost = inv.compost + numPickedUp }
    in
    { model
        | composts = newComposts
        , inv = newInv
    }


checkGameOver : Session -> Float -> Model -> Model
checkGameOver session tick model =
    { model
        | gameState =
            if (model.hero.healthAmt <= 0) || (model.base.healthAmt <= 0) then
                GameOver

            else if List.length model.enemyTowers == 0 then
                Win

            else
                model.gameState
    }


collidesWith : ( Vec2, Float ) -> ( Vec2, Float ) -> Bool
collidesWith ( v1, rad1 ) ( v2, rad2 ) =
    Vec2.distance v1 v2 <= rad1 + rad2


moveBullets : Session -> Float -> Model -> Model
moveBullets session delta model =
    { model
        | bullets =
            model.bullets
                |> List.filterMap
                    (\bullet ->
                        let
                            ( speed, maxAge ) =
                                case bullet.kind of
                                    PlayerBullet ->
                                        ( session.c.getFloat "waterGun:bulletSpeed"
                                        , session.c.getFloat "waterGun:bulletMaxAge" * toFloat model.rangeLevel
                                        )

                                    PlantBullet ->
                                        ( session.c.getFloat "crops:turret:bulletSpeed"
                                        , session.c.getFloat "crops:turret:bulletMaxAge"
                                        )

                            newAge =
                                bullet.age + delta
                        in
                        if newAge > maxAge then
                            Nothing

                        else
                            Just
                                { bullet
                                    | pos =
                                        Vec2.add
                                            (tupleToVec2 (fromPolar ( speed * delta, bullet.angle )))
                                            bullet.pos
                                    , age = bullet.age + delta
                                }
                    )
    }


type PlacementAvailability
    = Shouldnt
    | Cant
    | Can


canPlace : Session -> Model -> PlacementAvailability
canPlace session model =
    if
        case model.equipped of
            TurretSeed ->
                model.turretSeedAmt > 0

            MoolahCropSeed ->
                model.moolahSeedAmt > 0

            Gun ->
                False

            Scythe ->
                False
    then
        case hoveringTilePos session model of
            Just tilePos ->
                if
                    Vec2.distanceSquared
                        (tilePos
                            |> tilePosToFloats
                            |> tupleToVec2
                            |> Vec2.add (Vec2.vec2 0.5 0.5)
                        )
                        model.hero.pos
                        < (3 ^ 2)
                then
                    case hoveringTile session model of
                        Just Grass ->
                            -- check for buildings
                            [ [ model.base.pos ]
                            , List.map .pos model.enemyTowers
                            , List.map .pos model.crops
                            ]
                                |> List.concat
                                |> Set.fromList
                                |> Set.member tilePos
                                |> (\bldgInWay ->
                                        if bldgInWay then
                                            Cant

                                        else
                                            Can
                                   )

                        _ ->
                            Cant

                else
                    Shouldnt

            Nothing ->
                Cant

    else
        Shouldnt


offsettedNextPosGenerator : TilePos -> List TilePos -> Random.Generator Vec2
offsettedNextPosGenerator curPos path =
    path
        |> List.head
        |> Maybe.withDefault curPos
        |> (\tilePos ->
                vec2OffsetGenerator -0.5 -0.5
                    |> Random.map
                        (\offset ->
                            Vec2.add (vec2FromTilePos tilePos) offset
                        )
           )


spawnCreeps : Session -> Float -> Model -> Model
spawnCreeps session delta model =
    let
        ( newEnemyTowers, newCreeps ) =
            --, newSeed ) =
            model.enemyTowers
                |> List.foldl
                    (\enemyTower ( enemyTowers, creeps ) ->
                        --, seed ) ->
                        if enemyTower.timeSinceLastSpawn + delta > session.c.getFloat "enemyBase:secondsBetweenSpawnsAtDay" then
                            let
                                seed =
                                    -- (ruh roh)
                                    Random.initialSeed (1000 * delta |> round)
                            in
                            ( { enemyTower | timeSinceLastSpawn = 0 } :: enemyTowers
                            , { pos = enemyTower.pos |> vec2FromTilePos
                              , timeSinceLastHop = 0 -- todo perhaps half default?
                              , healthAmt =
                                    session.c.getFloat "creeps:global:health"
                                        * session.c.getFloat "creeps:attacker:melee:health"
                              , healthMax =
                                    session.c.getFloat "creeps:global:health"
                                        * session.c.getFloat "creeps:attacker:melee:health"
                              , age = 0
                              , seed = seed
                              , path = enemyTower.pathToBase
                              }
                                :: creeps
                              --, newSeed2
                            )

                        else
                            ( { enemyTower | timeSinceLastSpawn = enemyTower.timeSinceLastSpawn + delta } :: enemyTowers
                            , creeps
                              --, seed
                            )
                    )
                    -- ( [], [], model.seed )
                    ( [], [] )
    in
    { model
        | enemyTowers = newEnemyTowers
        , creeps = List.append newCreeps model.creeps

        --, seed = newSeed
    }


vec2OffsetGenerator : Float -> Float -> Random.Generator Vec2
vec2OffsetGenerator min max =
    Random.pair (Random.float min max) (Random.float min max)
        |> Random.map tupleToVec2


moveHero : Session -> Float -> Model -> Model
moveHero session delta model =
    let
        hero =
            model.hero

        heroInput =
            heroDirInput session.keysPressed
                |> (\input ->
                        input
                            |> Vec2.setY (-1 * Vec2.getY input)
                   )

        newAcc =
            Vec2.scale (session.c.getFloat "hero:acceleration")
                (heroDirInput session.keysPressed
                    |> (\input ->
                            input
                                |> Vec2.setY (-1 * Vec2.getY input)
                       )
                )

        newVelUncapped =
            Vec2.scale delta (Vec2.add model.hero.vel newAcc)

        newVel =
            if Vec2.length newVelUncapped > session.c.getFloat "hero:maxSpeed" then
                Vec2.scale (session.c.getFloat "hero:maxSpeed") (Vec2.normalize newVelUncapped)

            else
                newVelUncapped

        newPos =
            Vec2.add model.hero.pos (Vec2.scale delta newVel)

        ( newestPos, newestVel ) =
            if not <| isHeroColliding model newPos then
                ( newPos, newVel )
                -- also check common x/y slides

            else if not <| isHeroColliding model (Vec2.vec2 (Vec2.getX newPos) (Vec2.getY hero.pos)) then
                ( Vec2.vec2 (Vec2.getX newPos) (Vec2.getY hero.pos)
                , Vec2.vec2 (Vec2.getX newVel) 0
                )

            else if not <| isHeroColliding model (Vec2.vec2 (Vec2.getX hero.pos) (Vec2.getY newPos)) then
                ( Vec2.vec2 (Vec2.getX hero.pos) (Vec2.getY newPos)
                , Vec2.vec2 0 (Vec2.getY newVel)
                )

            else
                ( hero.pos, Vec2.vec2 0 0 )

        newHero =
            { hero
                | pos = newestPos
                , vel = newestVel
            }
    in
    { model | hero = newHero }


heroRad =
    0.4


isHeroColliding : Model -> Vec2 -> Bool
isHeroColliding model heroPos =
    -- TODO performance!
    let
        heroPoly =
            polyFromSquare heroPos heroRad
    in
    heroPos
        |> Vec2.add (Vec2.vec2 -0.5 -0.5)
        |> vec2ToTuple
        |> Tuple.mapBoth round round
        |> (\( x, y ) ->
                [ ( x - 1, y - 1 )
                , ( x - 1, y )
                , ( x - 1, y + 1 )
                , ( x, y - 1 )
                , ( x, y )
                , ( x, y + 1 )
                , ( x + 1, y - 1 )
                , ( x + 1, y )
                , ( x + 1, y + 1 )
                ]
           )
        |> List.any
            (\( x, y ) ->
                if Dict.get ( x, y ) model.map |> Maybe.withDefault Water |> isPassable then
                    False

                else
                    Collision.collision 10
                        ( heroPoly, polySupport )
                        ( polyFromSquare (Vec2.vec2 (0.5 + toFloat x) (0.1 + toFloat y)) 0.5, polySupport )
                        |> Maybe.withDefault False
            )
        |> (\doesCollide ->
                if doesCollide then
                    True

                else
                    -- check for base
                    model.base.pos
                        |> (\( x, y ) ->
                                [ ( x - 1, y - 1 )
                                , ( x - 1, y )
                                , ( x - 1, y + 1 )
                                , ( x, y - 1 )
                                , ( x + 1, y - 1 )
                                , ( x + 1, y )
                                , ( x + 1, y + 1 )
                                ]
                           )
                        |> List.any
                            (\( x, y ) ->
                                Collision.collision 10
                                    ( heroPoly, polySupport )
                                    ( polyFromSquare (Vec2.vec2 (0.5 + toFloat x) (0.5 + toFloat y)) 0.5, polySupport )
                                    |> Maybe.withDefault False
                            )
           )


polyFromSquare : Vec2 -> Float -> List Collision.Pt
polyFromSquare center halfLength =
    center
        |> Vec2.toRecord
        |> (\{ x, y } ->
                [ ( x + halfLength, y - halfLength )
                , ( x + halfLength, y + halfLength )
                , ( x - halfLength, y + halfLength )
                , ( x - halfLength, y - halfLength )
                ]
           )


isPassable : Tile -> Bool
isPassable tile =
    case tile of
        Water ->
            False

        Grass ->
            True

        Poop ->
            False


dot : Collision.Pt -> Collision.Pt -> Float
dot ( x1, y1 ) ( x2, y2 ) =
    (x1 * x2) + (y1 * y2)


polySupport : List Collision.Pt -> Collision.Pt -> Maybe Collision.Pt
polySupport list d =
    let
        dotList =
            List.map (dot d) list

        decorated =
            List.map2 Tuple.pair dotList list

        max =
            List.maximum decorated
    in
    case max of
        Just ( m, p ) ->
            Just p

        _ ->
            Nothing


nextPosTowardsGenerator : Model -> Vec2 -> Vec2 -> Random.Generator Vec2
nextPosTowardsGenerator model origin destination =
    let
        originTilePos =
            origin |> Vec2.toRecord |> (\{ x, y } -> ( floor x, floor y ))

        destinationTilePos =
            destination |> Vec2.toRecord |> (\{ x, y } -> ( floor x, floor y ))
    in
    vec2OffsetGenerator -0.5 0.5
        |> Random.map
            (\offset ->
                AStar.findPath
                    pythagoreanCost
                    (possibleMoves model.map)
                    originTilePos
                    destinationTilePos
                    |> Maybe.andThen List.head
                    |> Maybe.map vec2FromTilePos
                    |> Maybe.withDefault origin
                    |> Vec2.add offset
            )


pythagoreanCost : AStar.Position -> AStar.Position -> Float
pythagoreanCost ( x1, y1 ) ( x2, y2 ) =
    -- TODO randomize a bit to fix weird diagnoal-prioritizing bug
    let
        dx =
            toFloat <| abs (x1 - x2)

        dy =
            toFloat <| abs (y1 - y2)
    in
    --abs <| (sqrt 2 * min dx dy) + abs (dy - dx)
    sqrt ((dx ^ 2) + (dy ^ 2))


isDiagonal : TilePos -> TilePos -> Bool
isDiagonal ( posCol, posRow ) ( nextPosCol, nextPosRow ) =
    (abs (posCol - nextPosCol) + abs (posRow - nextPosRow)) == 2


possibleMoves : Map -> TilePos -> Set TilePos
possibleMoves map ( col, row ) =
    [ ( col - 1, row )
    , ( col + 1, row )
    , ( col, row - 1 )
    , ( col, row + 1 )

    --- diagonals
    , ( col - 1, row - 1 )
    , ( col - 1, row + 1 )
    , ( col + 1, row - 1 )
    , ( col + 1, row + 1 )
    ]
        |> List.filterMap (\pos -> Dict.get pos map |> Maybe.map (Tuple.pair pos))
        |> List.filter
            (\( _, tile ) ->
                case tile of
                    Grass ->
                        True

                    Water ->
                        False

                    Poop ->
                        False
            )
        |> List.map Tuple.first
        |> Set.fromList


hoveringTilePos : Session -> Model -> Maybe TilePos
hoveringTilePos session model =
    mouseGamePos session model
        |> Vec2.toRecord
        |> (\{ x, y } ->
                -- always return tilepos for now
                -- return nothing once we have actually ui
                Just
                    ( -0.5 + x |> round
                    , -0.5 + y |> round
                    )
           )


makeBullet : BulletKind -> Vec2 -> Vec2 -> Bullet
makeBullet kind heroPos aimPos =
    { kind = kind
    , pos = heroPos
    , angle =
        toPolar
            (Vec2.sub aimPos heroPos |> vec2ToTuple)
            |> Tuple.second
    , age = 0
    }


subscriptions : Model -> Sub Msg
subscriptions model =
    if model.isPaused then
        Sub.none

    else
        Sub.batch
            [ Browser.Events.onKeyDown (Decode.map KeyDown (Decode.field "key" Decode.string))
            , Browser.Events.onKeyUp (Decode.map KeyUp (Decode.field "key" Decode.string))
            , Sub.batch
                (case model.gameState of
                    MainMenu ->
                        []

                    Playing ->
                        [ Browser.Events.onAnimationFrameDelta Tick
                        ]

                    InStore ->
                        -- maybe make toggleable?
                        []

                    GameOver ->
                        []

                    Win ->
                        []
                )
            ]


view : Session -> Model -> Html Msg
view session model =
    Html.div
        [ Html.Attributes.style "height" "100%"
        , Html.Attributes.style "width" "100%"
        , Html.Attributes.style "font-family" "'Open Sans', sans-serif"
        ]
        [ --, drawClock session model
          drawGlass session model
        , viewScreens session model
        , drawHud session model
        , drawEquippables session model
        , drawHelp session model
        ]


drawHud : Session -> Model -> Html Msg
drawHud session model =
    Html.div
        [ Html.Attributes.style "position" "fixed"
        , Html.Attributes.style "top" "20px"
        , Html.Attributes.style "left" "20px"
        , Html.Attributes.style "display" "flex"
        , Html.Attributes.style "font-size" "24px"
        , Html.Attributes.style "color" "#cfc"
        ]
        [ Html.div
            [ Html.Attributes.style "width" "200px"
            ]
            [ Html.text ("Money: $" ++ String.fromInt model.money) ]
        , Html.div
            [ Html.Attributes.style "width" "200px"
            ]
            [ Html.text
                ("Water: "
                    ++ String.fromInt (round model.waterAmt)
                    ++ " / "
                    ++ String.fromInt (heroWaterMax session model)
                )
            ]
        , viewMeter model.waterAmt (heroWaterMax session model |> toFloat) (session.c.getFloat "ui:meterWidth")
        ]



--[ Html.button
--    [ Html.Events.onClick (TogglePause (model.isPaused))
--    ]
--    [ Html.text (if model.isPaused then "Unpause" else "Pause" ]
--    ]
--]


drawHelp : Session -> Model -> Html Msg
drawHelp session model =
    Html.div []
        [ Html.button
            [ Html.Attributes.style "position" "fixed"
            , Html.Attributes.style "left" "10px"
            , Html.Attributes.style "bottom" "10px"
            , Html.Attributes.style "background" "#ffb020"
            , Html.Attributes.style "border-color" "#eb2"
            , Html.Attributes.style "width" "40px"
            , Html.Attributes.style "height" "40px"
            , Html.Attributes.style "font-size" "24px"
            , Html.Attributes.style "border-radius" "4px"
            , Html.Events.onClick (ToggleHelp True)
            ]
            [ Html.text "?" ]
        , if model.shouldShowHelp then
            Html.div
                [ Html.Attributes.style "position" "fixed"
                , Html.Attributes.style "top" "50%"
                , Html.Attributes.style "left" "50%"
                , Html.Attributes.style "transform" "translate(-50%, -50%)"
                , Html.Attributes.style "background" "#eef"
                , Html.Attributes.style "width" "700px"
                , Html.Attributes.style "font-size" "20px"
                , Html.Attributes.style "padding" "20px"
                ]
                [ Html.text "You've landed on an alien planet and must terraform to survive! "
                , Html.br [] []
                , Html.br [] []
                , Html.text "Plant, water, and harvest "
                , Html.strong [] [ Html.text "Moolah" ]
                , Html.text " crops to make money. Plant "
                , Html.strong [] [ Html.text "Turret" ]
                , Html.text " seeds to defend against enemy creeps. Buy more seeds, heal up, and upgrade your water gun in your base."
                , Html.br [] []
                , Html.br [] []
                , Html.strong [] [ Html.text "Goal: " ]
                , Html.text "Destroy the enemy base before the spawned creeps overrun your farm!"
                , Html.br [] []
                , Html.br [] []
                , Html.strong [] [ Html.text "WASD: " ]
                , Html.text "Move"
                , Html.br [] []
                , Html.strong [] [ Html.text "1: " ]
                , Html.text "Water Gun"
                , Html.br [] []
                , Html.strong [] [ Html.text "2: " ]
                , Html.text "Scythe"
                , Html.br [] []
                , Html.strong [] [ Html.text "3: " ]
                , Html.text "Moolah Seeds"
                , Html.br [] []
                , Html.strong [] [ Html.text "4: " ]
                , Html.text "Turret Seeds"
                , Html.br [] []
                , Html.br [] []
                , Html.button
                    [ Html.Attributes.style "text-align" "center"
                    , Html.Attributes.style "margin" "auto"
                    , Html.Attributes.style "display" "block"
                    , Html.Attributes.style "padding" "10px 20px"
                    , Html.Attributes.style "border-radius" "3px"
                    , Html.Events.onClick (ToggleHelp False)
                    ]
                    [ Html.text "OK" ]
                ]

          else
            Html.text ""
        ]


viewScreens : Session -> Model -> Html Msg
viewScreens session model =
    case model.gameState of
        MainMenu ->
            Html.div
                [ Html.Attributes.style "position" "absolute"
                , Html.Attributes.style "top" "0"
                , Html.Attributes.style "left" "0"
                , Html.Attributes.style "width" "100%"
                , Html.Attributes.style "height" "100%"
                , Html.Attributes.style "z-index" "99"
                , Html.Attributes.style "background-image" "linear-gradient(15deg, #13547a 0%, #80d0c7 100%)"
                ]
                [ Html.div
                    [ Html.Attributes.style "color" "white"
                    , Html.Attributes.style "text-align" "center"
                    , Html.Attributes.style "top" "10%"
                    , Html.Attributes.style "width" "100%"
                    , Html.Attributes.style "height" "100%"
                    , Html.Attributes.style "position" "absolute"
                    , Html.Attributes.style "line-height" "48px"
                    ]
                    [ Html.div
                        [ Html.Attributes.style "font-size" "48px"
                        , Html.Attributes.style "font-family" "'Rock Salt', cursive"
                        , Html.Attributes.style "line-height" "69px"
                        ]
                        [ Html.text "Workin'"
                        , Html.br [] []
                        , Html.text "Progress"
                        ]
                    , Html.div
                        [ Html.Attributes.style "font-size" "24px"
                        ]
                        [ Html.span
                            [ Html.Attributes.style "color" "#fff"
                            , Html.Attributes.style "font-family" "'Open Sans', sans-serif"
                            ]
                            [ Html.text "version 0.0001"
                            ]
                        ]
                    , Html.div
                        [ Html.Attributes.style "font-size" "16px"
                        ]
                        [ Html.a
                            [ Html.Attributes.href "https://github.com/jamesgary/game_off_2018"
                            , Html.Attributes.target "_blank"
                            , Html.Attributes.style "color" "#aff"
                            , Html.Attributes.style "font-family" "'Open Sans', sans-serif"
                            ]
                            [ Html.text "source code" ]
                        ]
                    , Html.div
                        [ Html.Attributes.style "font-size" "14px"
                        ]
                        [ Html.span
                            [ Html.Attributes.style "color" "#fff"
                            , Html.Attributes.style "font-family" "'Open Sans', sans-serif"
                            ]
                            [ Html.text "A hybrid mash-up of farming simulator and tower defense!"
                            ]
                        ]
                    , Html.button
                        [ Html.Attributes.style "font-size" "24px"
                        , Html.Attributes.style "border-radius" "4px"
                        , Html.Attributes.style "padding" "8px 16px"
                        , Html.Events.onClick ClickPlay
                        ]
                        [ Html.text "Play"
                        ]
                    ]
                ]

        GameOver ->
            Html.div
                [ Html.Attributes.style "position" "absolute"
                , Html.Attributes.style "top" "0"
                , Html.Attributes.style "left" "0"
                , Html.Attributes.style "width" "100%"
                , Html.Attributes.style "height" "100%"
                , Html.Attributes.style "background" "rgba(0,0,0,0.5)"
                ]
                [ Html.div
                    [ Html.Attributes.style "font-size" "48px"
                    , Html.Attributes.style "color" "white"
                    , Html.Attributes.style "text-align" "center"
                    , Html.Attributes.style "top" "40%"
                    , Html.Attributes.style "width" "100%"
                    , Html.Attributes.style "height" "100%"
                    , Html.Attributes.style "position" "absolute"
                    ]
                    [ Html.text "GAME OVER" ]
                ]

        Win ->
            Html.div
                [ Html.Attributes.style "position" "absolute"
                , Html.Attributes.style "top" "0"
                , Html.Attributes.style "left" "0"
                , Html.Attributes.style "width" "100%"
                , Html.Attributes.style "height" "100%"
                , Html.Attributes.style "background" "rgba(0,0,0,0.5)"
                ]
                [ Html.div
                    [ Html.Attributes.style "font-size" "48px"
                    , Html.Attributes.style "color" "white"
                    , Html.Attributes.style "text-align" "center"
                    , Html.Attributes.style "top" "40%"
                    , Html.Attributes.style "width" "100%"
                    , Html.Attributes.style "height" "100%"
                    , Html.Attributes.style "position" "absolute"
                    ]
                    [ Html.text "A WINNER IS YOU" ]
                ]

        Playing ->
            Html.text ""

        InStore ->
            Html.div
                [ Html.Attributes.style "width" "100%"
                , Html.Attributes.style "height" "100%"
                , Html.Attributes.style "background" "rgba(0,0,0,0.5)"
                , Html.Attributes.style "left" "0"
                , Html.Attributes.style "top" "0"
                , Html.Attributes.style "position" "absolute"
                , Html.Attributes.style "font-size" "36px"
                , Html.Attributes.style "z-index" "99"
                , Html.Attributes.style "display" "flex"
                , Html.Attributes.style "justify-content" "center"
                , Html.Attributes.style "align-items" "center"
                , Html.Attributes.style "align-content" "center"
                ]
                [ Html.div
                    [ Html.Attributes.style "background" "#003d00"
                    , Html.Attributes.style "color" "white"
                    , Html.Attributes.style "border" "10px double #2ab02a"
                    , Html.Attributes.style "padding" "20px"
                    ]
                    [ Html.h1
                        [ Html.Attributes.style "margin" "0"
                        , Html.Attributes.style "font-size" "36px"
                        , Html.Attributes.style "text-align" "center"
                        , Html.Attributes.style "font-family" "'Rock Salt', cursive"
                        , Html.Attributes.style "letter-spacing" "3px"
                        ]
                        [ Html.text "Terraformer's Market" ]
                    , Html.hr
                        [ Html.Attributes.style "border-color" "#2ab02a"
                        ]
                        []

                    -- begin panels
                    , Html.div
                        [ Html.Attributes.style "display" "flex"
                        , Html.Attributes.style "justify-content" "center"
                        ]
                        (([ { title = "Moolah Seed"
                            , icon = "images/mature-money.png"
                            , desc = "Harvesting mature Moolah with your scythe will yield money. Use money to buy more crops."
                            , cost = 10
                            , msg = Buy MoolahCropSeed
                            , currentAmt = model.moolahSeedAmt
                            }
                          , { title = "Turret Seed"
                            , icon = "images/turret.png"
                            , desc = "Mature Turrets will automatically attack incoming creeps. Make sure to grow these before the harder waves!"
                            , cost = 50
                            , msg = Buy TurretSeed
                            , currentAmt = model.turretSeedAmt
                            }
                          ]
                            |> List.map
                                (\{ title, icon, desc, cost, msg, currentAmt } ->
                                    Html.div
                                        [ Html.Attributes.style "display" "flex"
                                        , Html.Attributes.style "flex-direction" "column"
                                        , Html.Attributes.style "align-items" "center"
                                        , Html.Attributes.style "margin" "0 20px"
                                        ]
                                        [ Html.span
                                            [ Html.Attributes.style "font-size" "24px"
                                            ]
                                            [ Html.text title ]
                                        , Html.div
                                            [ Html.Attributes.style "border" "7px ridge white"
                                            , Html.Attributes.style "border-radius" "4px"
                                            , Html.Attributes.style "background" "rgba(255, 255, 255, 0.4)"
                                            , Html.Attributes.style "margin" "0 5px"
                                            , Html.Attributes.style "width" "auto"
                                            , Html.Attributes.style "display" "inline-block"
                                            , Html.Attributes.style "font-size" "0"
                                            , Html.Attributes.style "margin" "12px 0"
                                            ]
                                            [ Html.img
                                                [ Html.Attributes.src icon
                                                , Html.Attributes.style "width" "50px"
                                                , Html.Attributes.style "height" "50px"
                                                , Html.Attributes.style "margin" "3px"
                                                ]
                                                []
                                            ]
                                        , Html.em
                                            [ Html.Attributes.style "font-size" "16px"
                                            , Html.Attributes.style "line-height" "20px"

                                            --, Html.Attributes.style "margin-left" "5px"
                                            , Html.Attributes.style "text-align" "center"
                                            , Html.Attributes.style "width" "200px"
                                            , Html.Attributes.style "height" "110px" -- :/
                                            ]
                                            [ Html.text desc ]
                                        , Html.span
                                            [ Html.Attributes.style "font-size" "16px"
                                            , Html.Attributes.style "text-align" "center"
                                            ]
                                            [ Html.text ("Cost: $" ++ String.fromInt cost) ]
                                        , Html.button
                                            ([ Html.Attributes.style "margin" "10px"
                                             , Html.Attributes.style "color" "#000"
                                             , Html.Attributes.style "font-size" "16px"
                                             , Html.Attributes.style "border-radius" "3px"
                                             , Html.Attributes.style "padding" "5px"
                                             , Html.Events.onClick (msg cost)
                                             ]
                                                ++ (if model.money >= cost then
                                                        [ Html.Attributes.style "background" "#0d3"
                                                        , Html.Attributes.style "cursor" "pointer"
                                                        , Html.Attributes.style "border-color" "#2f8"
                                                        ]

                                                    else
                                                        [ Html.Attributes.style "background" "#aaa"
                                                        , Html.Attributes.disabled True
                                                        ]
                                                   )
                                            )
                                            [ Html.text ("Buy " ++ title) ]
                                        , Html.span
                                            [ Html.Attributes.style "font-size" "16px"
                                            , Html.Attributes.style "text-align" "center"
                                            ]
                                            [ Html.text ("Current amount: " ++ String.fromInt currentAmt) ]
                                        ]
                                )
                         )
                            ++ [ Html.div
                                    [ Html.Attributes.style "display" "flex"
                                    , Html.Attributes.style "flex-direction" "column"
                                    , Html.Attributes.style "align-items" "center"
                                    , Html.Attributes.style "margin" "0 20px"
                                    ]
                                    [ Html.span
                                        [ Html.Attributes.style "font-size" "24px"
                                        ]
                                        [ Html.text "Water Gun Upgrades" ]
                                    , Html.div []
                                        ([ ( Range, "Range" )
                                         , ( Capacity, "Capacity" )
                                         , ( FireRate, "Fire Rate" )
                                         ]
                                            |> List.map
                                                (\( kind, str ) ->
                                                    let
                                                        cost =
                                                            costForUpgrade session model kind

                                                        lvl =
                                                            currentLevelForUpgrade session model kind
                                                    in
                                                    Html.div []
                                                        [ Html.span
                                                            [ Html.Attributes.style "font-size" "16px"
                                                            , Html.Attributes.style "text-align" "center"
                                                            ]
                                                            [ Html.text ("Cost: $" ++ String.fromInt cost) ]
                                                        , Html.button
                                                            ([ Html.Attributes.style "margin" "10px"
                                                             , Html.Attributes.style "color" "#000"
                                                             , Html.Attributes.style "font-size" "16px"
                                                             , Html.Attributes.style "border-radius" "3px"
                                                             , Html.Attributes.style "padding" "5px"
                                                             , Html.Events.onClick (BuyUpgrade kind)
                                                             ]
                                                                ++ (if model.money >= cost then
                                                                        [ Html.Attributes.style "background" "#0d3"
                                                                        , Html.Attributes.style "cursor" "pointer"
                                                                        , Html.Attributes.style "border-color" "#2f8"
                                                                        ]

                                                                    else
                                                                        [ Html.Attributes.style "background" "#aaa"
                                                                        , Html.Attributes.disabled True
                                                                        ]
                                                                   )
                                                            )
                                                            [ Html.text
                                                                ("Upgrade "
                                                                    ++ str
                                                                    ++ " ("
                                                                    ++ String.fromInt lvl
                                                                    ++ "->"
                                                                    ++ String.fromInt (1 + lvl)
                                                                    ++ ")"
                                                                )
                                                            ]
                                                        ]
                                                )
                                        )
                                    ]
                               ]
                        )
                    , Html.div
                        [ Html.Attributes.style "width" "100%"
                        , Html.Attributes.style "display" "flex"
                        , Html.Attributes.style "justify-content" "center"
                        , Html.Attributes.style "margin-top" "15px"
                        ]
                        [ Html.button
                            [ Html.Attributes.style "font-size" "18px"
                            , Html.Attributes.style "border-radius" "3px"
                            , Html.Events.onClick LeaveMarket
                            ]
                            [ Html.text "Exit" ]
                        ]
                    ]
                ]


drawEquippables : Session -> Model -> Html Msg
drawEquippables session model =
    let
        size =
            "50px"

        equippables =
            [ { equippable = Gun
              , imgSrc = "images/icon-watergun.png"
              , maybeAmt = Nothing
              , keyStr = "1"
              }
            , { equippable = Scythe
              , imgSrc = "images/scythe.png"
              , maybeAmt = Nothing
              , keyStr = "2"
              }
            , { equippable = MoolahCropSeed
              , imgSrc = "images/mature-money.png"
              , maybeAmt = Just model.moolahSeedAmt
              , keyStr = "3"
              }
            , { equippable = TurretSeed
              , imgSrc = "images/turret.png"
              , maybeAmt = Just model.turretSeedAmt
              , keyStr = "4"
              }
            ]
    in
    Html.div
        [ Html.Attributes.style "position" "fixed"
        , Html.Attributes.style "bottom" "5px"
        , Html.Attributes.style "width" "100%"
        ]
        [ Html.div
            [ Html.Attributes.style "display" "flex"
            , Html.Attributes.style "justify-content" "center"
            ]
            (equippables
                |> List.map
                    (\{ equippable, imgSrc, maybeAmt, keyStr } ->
                        Html.div
                            ([ Html.Attributes.style "border" "7px ridge white"
                             , Html.Attributes.style "border-radius" "4px"
                             , Html.Attributes.style "background" "rgba(255, 255, 255, 0.4)"
                             , Html.Attributes.style "margin" "0 5px"
                             , Html.Attributes.style "position" "relative"
                             , Html.Attributes.style "cursor" "pointer"
                             , Html.Events.onClick (KeyDown keyStr)
                             ]
                                ++ (if model.equipped == equippable then
                                        [ Html.Attributes.style "background" "rgba(90, 255, 90, 0.6)"
                                        , Html.Attributes.style "border" "7px ridge rgb(90, 255, 90)"
                                        ]

                                    else
                                        []
                                   )
                            )
                            [ Html.img
                                [ Html.Attributes.src imgSrc
                                , Html.Attributes.style "width" size
                                , Html.Attributes.style "height" size
                                , Html.Attributes.style "margin" "3px"
                                ]
                                []
                            , case maybeAmt of
                                Just amt ->
                                    Html.div
                                        [ Html.Attributes.style "font-size" "12px"
                                        , Html.Attributes.style "color" "white"
                                        , Html.Attributes.style "position" "absolute"
                                        , Html.Attributes.style "bottom" "1px"
                                        , Html.Attributes.style "right" "3px"
                                        , Html.Attributes.style "text-shadow" "1px 1px 1px black"
                                        ]
                                        [ Html.text (String.fromInt amt)
                                        ]

                                Nothing ->
                                    Html.text ""
                            ]
                    )
            )
        ]


drawClock : Session -> Model -> Html Msg
drawClock session model =
    let
        size =
            px 200

        padding =
            px 1

        borderWidth =
            px 10

        timeCoef =
            30

        minutesDegrees =
            ((model.age * timeCoef) / 60 * 360)
                + 90
                |> String.fromFloat

        hourDegrees =
            ((model.age / 12 * timeCoef) / 60 * 360)
                + 90
                |> String.fromFloat
    in
    Html.div
        [ Html.Attributes.class "clock"
        , Html.Attributes.style "position" "fixed"
        , Html.Attributes.style "bottom" "60px"
        , Html.Attributes.style "right" "10px"
        , Html.Attributes.style "width" size
        , Html.Attributes.style "height" size
        , Html.Attributes.style "padding" padding
        , Html.Attributes.style "border-width" borderWidth
        ]
        [ Html.div
            [ Html.Attributes.class "outer-clock-face"
            , Html.Attributes.style "background" "#fafafa"
            ]
            [ Html.div [ Html.Attributes.class "marking marking-one" ] []
            , Html.div [ Html.Attributes.class "marking marking-two" ] []
            , Html.div [ Html.Attributes.class "marking marking-three" ] []
            , Html.div [ Html.Attributes.class "marking marking-four" ] []
            , Html.div
                [ Html.Attributes.class "inner-clock-face"
                , Html.Attributes.style "background" "#fafafa"
                ]
                [ Html.div
                    [ Html.Attributes.style "font-size" "16px"
                    , Html.Attributes.style "font-family" "monospace"
                    , Html.Attributes.style "position" "absolute"
                    , Html.Attributes.style "bottom" "30px"
                    , Html.Attributes.style "text-align" "center"
                    , Html.Attributes.style "width" "100%"
                    ]
                    [ Html.span
                        [ Html.Attributes.style "background" "white"
                        , Html.Attributes.style "border" "2px inset #ddd"
                        , Html.Attributes.style "padding" "3px 8px"
                        ]
                        [ Html.text (formatTime model)
                        ]
                    ]
                , Html.div
                    [ Html.Attributes.class "hand hour-hand"
                    , Html.Attributes.style "transform" ("rotate(" ++ hourDegrees ++ "deg)")
                    ]
                    []
                , Html.div
                    [ Html.Attributes.class "hand min-hand"
                    , Html.Attributes.style "transform" ("rotate(" ++ minutesDegrees ++ "deg)")
                    ]
                    []

                --, Html.div [ Html.Attributes.class "hand second-hand" ] []
                ]
            ]
        ]


formatTime : Model -> String
formatTime model =
    let
        seconds =
            model.age * 30 |> round

        mm =
            modBy 60 seconds

        hh =
            ((seconds - mm) // 60)
                |> modBy 24

        ( hhh, ampm ) =
            if hh == 0 then
                ( 12, "AM" )

            else if hh < 12 then
                ( hh, "AM" )

            else if hh == 12 then
                ( hh, "PM" )

            else
                ( hh - 12, "PM" )

        leadingZero num =
            if num < 10 then
                "0" ++ String.fromInt num

            else
                String.fromInt num
    in
    (hhh |> leadingZero)
        ++ ":"
        ++ (mm |> leadingZero)
        ++ " "
        ++ ampm


formatConfigFloat : Float -> String
formatConfigFloat val =
    Round.round 1 val


equippableStr : Equippable -> String
equippableStr equippable =
    case equippable of
        Gun ->
            "gun"

        Scythe ->
            "scythe"

        MoolahCropSeed ->
            "seed"

        TurretSeed ->
            "seed"


drawGlass : Session -> Model -> Html Msg
drawGlass session model =
    Html.div
        [ Html.Attributes.style "display" "inline-block"
        , Html.Attributes.style "position" "relative"
        , Html.Attributes.style "margin" "0"
        , Html.Attributes.style "font-size" "0"
        , Html.Attributes.style "width" "100%"
        , Html.Attributes.style "height" "100%"
        , Html.Attributes.style "cursor" "default"

        --, Html.Attributes.style "background" "rgba(0,255,0,0.5)"
        , Mouse.onDown (\_ -> MouseDown)
        , Mouse.onUp (\_ -> MouseUp)
        , Mouse.onMove (\event -> MouseMove event.offsetPos)

        --, Wheel.onWheel Zoom
        ]
        []


drawMap : SavedMap -> List Sprite
drawMap savedMap =
    savedMap.map
        |> Dict.toList
        |> List.map
            (\( ( x, y ), tile ) ->
                { x = x |> toFloat
                , y = y |> toFloat
                , texture = tileToStr tile
                }
            )


getSprites : Session -> Model -> List SpriteLayer
getSprites session model =
    let
        cursorLayer =
            { name = "cursor"
            , sprites =
                let
                    tileCursor =
                        case ( canPlace session model, hoveringTilePos session model ) of
                            ( Can, Just ( x, y ) ) ->
                                [ { x = x |> toFloat
                                  , y = y |> toFloat
                                  , texture = "selectedTile"
                                  }
                                ]

                            ( Shouldnt, Just ( x, y ) ) ->
                                []

                            --[ { x = x |> toFloat
                            --  , y = y |> toFloat
                            --  , texture = "selectedTile-inactive"
                            --  }
                            --]
                            _ ->
                                []
                in
                case model.equipped of
                    Gun ->
                        []

                    Scythe ->
                        []

                    MoolahCropSeed ->
                        tileCursor

                    TurretSeed ->
                        tileCursor
            , graphics = []
            }

        heroLayer =
            { name = "hero"
            , sprites = []
            , graphics =
                drawHealthMeter
                    model.hero.pos
                    1.4
                    model.hero.healthAmt
                    model.hero.healthMax
                    ++ drawSlash session model
            }

        buildingsLayer =
            { name = "buildings"
            , sprites =
                [ case model.base.pos of
                    ( x, y ) ->
                        [ { x = x - 1 |> toFloat
                          , y = y - 1 |> toFloat
                          , texture = "base"
                          }
                        ]
                , model.enemyTowers
                    |> List.map
                        (\enemyTower ->
                            case enemyTower.pos of
                                ( etX, etY ) ->
                                    { x = etX |> toFloat
                                    , y = etY |> toFloat
                                    , texture = "enemyTower"
                                    }
                        )
                , model.crops
                    |> List.map
                        (\crop ->
                            case crop.pos of
                                ( etX, etY ) ->
                                    { x = etX |> toFloat
                                    , y = etY |> toFloat
                                    , texture =
                                        case crop.state of
                                            Seedling sData ->
                                                if sData.waterConsumed / sData.waterNeededToMature < 0.25 then
                                                    "seedling"

                                                else
                                                    "young-money"

                                            Mature ->
                                                case crop.kind of
                                                    MoneyCrop ->
                                                        "mature-money"

                                                    Turret _ ->
                                                        "turret"
                                    }
                        )
                ]
                    |> List.concat
            , graphics =
                [ (case model.base.pos of
                    ( x, y ) ->
                        [ drawHealthMeter
                            (Vec2.vec2 (toFloat x + 0.5) (toFloat y + 0))
                            1
                            model.base.healthAmt
                            model.base.healthMax
                        ]
                  )
                    |> List.concat
                , model.enemyTowers
                    |> List.map
                        (\enemyTower ->
                            case enemyTower.pos of
                                ( etX, etY ) ->
                                    drawHealthMeter
                                        (Vec2.vec2 (toFloat etX + 0.5) (toFloat etY + 0.5))
                                        2
                                        enemyTower.healthAmt
                                        enemyTower.healthMax
                        )
                    |> List.concat
                , model.crops
                    |> List.map
                        (\crop ->
                            case crop.pos of
                                ( etX, etY ) ->
                                    case crop.state of
                                        Seedling { waterNeededToMature, waterConsumed, waterCapacity, waterInSoil } ->
                                            [ drawMaturityMeter
                                                (Vec2.vec2 (toFloat etX + 0.5) (toFloat etY + 0.4))
                                                0.8
                                                waterConsumed
                                                waterNeededToMature
                                                waterInSoil
                                            , drawWaterMeter
                                                (Vec2.vec2 (toFloat etX + 0.5) (toFloat etY + 0.6))
                                                0.8
                                                waterInSoil
                                                waterCapacity
                                            ]

                                        Mature ->
                                            [-- drawHealthMeter
                                             --   (Vec2.vec2 (toFloat etX + 0.5) (toFloat etY + 0.5))
                                             --   0.8
                                             --   crop.healthAmt
                                             --   crop.healthMax
                                            ]
                        )
                    |> List.concat
                    |> List.concat
                ]
                    |> List.concat
            }

        bulletsLayer =
            { name = "bullets"
            , sprites =
                model.bullets
                    |> List.map
                        (\bullet ->
                            { x = (bullet.pos |> Vec2.getX) - 0.5
                            , y = (bullet.pos |> Vec2.getY) - 0.5
                            , texture =
                                case bullet.kind of
                                    PlayerBullet ->
                                        "bullet"

                                    PlantBullet ->
                                        "plantBullet"
                            }
                        )
            , graphics = []
            }

        creepsLayer =
            { name = "creeps"
            , sprites =
                model.creeps
                    |> List.map
                        (\creep ->
                            { x = (creep.pos |> Vec2.getX) - 0.5
                            , y = (creep.pos |> Vec2.getY) - 0.25
                            , texture = "creep"
                            }
                        )
            , graphics =
                model.creeps
                    |> List.filterMap
                        (\creep ->
                            if creep.healthAmt == creep.healthMax then
                                Nothing

                            else
                                Just <|
                                    drawHealthMeter
                                        creep.pos
                                        1
                                        creep.healthAmt
                                        creep.healthMax
                        )
                    |> List.concat
            }
    in
    [ buildingsLayer
    , heroLayer
    , creepsLayer
    , bulletsLayer
    , cursorLayer
    ]
        |> List.indexedMap
            (\i layer ->
                { name = layer.name
                , sprites = layer.sprites
                , graphics = layer.graphics
                , zOrder = i -- not used yet
                }
            )


maxTimeToShowSlash =
    0.1


drawSlash : Session -> Model -> List Graphic
drawSlash session model =
    model.slashEffects
        |> List.map
            (\( age, slash ) ->
                { slash
                    | alpha = max 0 ((maxTimeToShowSlash - age) / maxTimeToShowSlash)
                }
            )


scythePoints : Session -> Model -> ( Vec2, Vec2, Vec2 )
scythePoints session model =
    let
        height =
            2

        halfWidth =
            1

        heroPos =
            model.hero.pos

        mouseAngle =
            mouseAngleToHero session model

        leftCorner =
            Vec2.vec2 height -halfWidth
                |> Vec2.toRecord
                |> (\{ x, y } ->
                        toPolar ( x, y )
                            |> (\( r, o ) ->
                                    fromPolar ( r, o + mouseAngle )
                               )
                   )
                |> tupleToVec2
                |> Vec2.add heroPos

        tippyTop =
            Vec2.vec2 (1.5 * height) 0
                |> Vec2.toRecord
                |> (\{ x, y } ->
                        toPolar ( x, y )
                            |> (\( r, o ) ->
                                    fromPolar ( r, o + mouseAngle )
                               )
                   )
                |> tupleToVec2
                |> Vec2.add heroPos

        rightCorner =
            Vec2.vec2 height halfWidth
                |> Vec2.toRecord
                |> (\{ x, y } ->
                        toPolar ( x, y )
                            |> (\( r, o ) ->
                                    fromPolar ( r, o + mouseAngle )
                               )
                   )
                |> tupleToVec2
                |> Vec2.add heroPos
    in
    ( leftCorner
    , tippyTop
    , rightCorner
    )


mouseGamePos : Session -> Model -> Vec2
mouseGamePos session model =
    model.mousePos
        |> Vec2.add
            -- camera offset
            (model.hero.pos
                |> Vec2.scale (zoomedTileSize model)
                |> Vec2.add
                    (Vec2.vec2
                        (session.windowWidth * -0.5)
                        (session.windowHeight * -0.5)
                    )
            )
        |> Vec2.scale (1 / zoomedTileSize model)


type Effect
    = DrawSprites (List SpriteLayer)
    | DrawMap (List Sprite)
    | DrawHero HeroSprite
    | MoveCamera Vec2
    | DrawFx Vec2 FxKind


type FxKind
    = Splash
    | CreepDeath
    | HarvestFx


drawHealthMeter : Vec2 -> Float -> Float -> Float -> List Graphic
drawHealthMeter pos width amt max =
    drawMeter pos width amt max "#00ff00"


drawWaterMeter : Vec2 -> Float -> Float -> Float -> List Graphic
drawWaterMeter pos width amt max =
    drawMeter pos width amt max "#00ffff"


drawMeter : Vec2 -> Float -> Float -> Float -> String -> List Graphic
drawMeter pos width amt max color =
    let
        ( x, y ) =
            ( Vec2.getX pos - (width / 2)
            , Vec2.getY pos + 0.7
            )

        height =
            0.1 * width

        outlineRatio =
            0.05

        offset =
            outlineRatio * width
    in
    [ { x = x - offset
      , y = y - offset
      , width = width + (offset * 2)
      , height = height + (offset * 2)
      , bgColor = "#000000"
      , lineStyleWidth = 0
      , lineStyleColor = "#000000"
      , lineStyleAlpha = 1
      , alpha = 1
      , shape = Rect
      }
    , { x = x
      , y = y
      , width = width * (amt / max)
      , height = height
      , bgColor = color
      , lineStyleWidth = 0
      , lineStyleColor = "#000000"
      , lineStyleAlpha = 1
      , alpha = 1
      , shape = Rect
      }
    ]


drawMaturityMeter : Vec2 -> Float -> Float -> Float -> Float -> List Graphic
drawMaturityMeter pos width consumed need has =
    let
        ( x, y ) =
            ( Vec2.getX pos - (width / 2)
            , Vec2.getY pos + 0.7
            )

        height =
            0.1 * width

        outlineRatio =
            0.05

        offset =
            outlineRatio * width
    in
    [ -- bg
      { x = x - offset
      , y = y - offset
      , width = width + (offset * 2)
      , height = height + (offset * 2)
      , bgColor = "#000000"
      , lineStyleWidth = 0
      , lineStyleColor = "#000000"
      , lineStyleAlpha = 1
      , alpha = 1
      , shape = Rect
      }
    , -- water
      { x = x
      , y = y
      , width = width * min 1 ((consumed + has) / need)
      , height = height
      , bgColor = "#00eeee"
      , lineStyleWidth = 0
      , lineStyleColor = "#000000"
      , lineStyleAlpha = 1
      , alpha = 1
      , shape = Rect
      }
    , -- growth
      { x = x
      , y = y
      , width = width * (consumed / need)
      , height = height
      , bgColor = "#00aa00"
      , lineStyleWidth = 0
      , lineStyleColor = "#000000"
      , lineStyleAlpha = 1
      , alpha = 1
      , shape = Rect
      }
    ]


costForUpgrade : Session -> Model -> Upgrade -> Int
costForUpgrade session model upgrade =
    case upgrade of
        Range ->
            model.rangeLevel * 20

        Capacity ->
            model.capacityLevel * 20

        FireRate ->
            model.fireRateLevel * 20


currentLevelForUpgrade : Session -> Model -> Upgrade -> Int
currentLevelForUpgrade session model upgrade =
    case upgrade of
        Range ->
            model.rangeLevel

        Capacity ->
            model.capacityLevel

        FireRate ->
            model.fireRateLevel


heroWaterMax : Session -> Model -> Int
heroWaterMax session model =
    round (session.c.getFloat "waterGun:maxCapacity") * model.capacityLevel
