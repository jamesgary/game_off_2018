port module Game exposing (Effect(..), FxKind(..), GameState(..), Model, Msg(..), init, initTryOut, update, view)

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
    , waterMax : Float
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

    -- to be flushed at the end of every tick
    , fx : List Effect
    }


init : Session -> Model
init session =
    let
        c =
            session.c

        savedMap =
            case List.head session.savedMaps of
                Just map ->
                    map

                Nothing ->
                    Debug.todo "whut you doin"
    in
    { hero =
        { pos =
            tilePosToFloats savedMap.hero
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
                    , timeSinceLastSpawn = 9999
                    , healthAmt = c.getFloat "enemyBase:healthMax"
                    , healthMax = c.getFloat "enemyBase:healthMax"
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
    , waterAmt = 75
    , waterMax = 100
    , equipped = Gun
    , map = savedMap.map
    , inv =
        { compost = 0
        }
    , gameState = Playing
    , isMouseDown = False
    , mousePos = Vec2.vec2 -99 -99
    , age = 0
    , isPaused = False
    , fx = []
    }


initTryOut : Session -> SavedMap -> ( Model, Cmd Msg )
initTryOut session savedMap =
    let
        c =
            session.c
    in
    ( { hero =
            { pos =
                tilePosToFloats savedMap.hero
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
                        , timeSinceLastSpawn = 9999
                        , healthAmt = c.getFloat "enemyBase:healthMax"
                        , healthMax = c.getFloat "enemyBase:healthMax"
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
      , waterAmt = 75
      , waterMax = 100
      , equipped = Gun
      , map = savedMap.map
      , inv =
            { compost = 0
            }
      , gameState = Playing
      , isMouseDown = False
      , mousePos = Vec2.vec2 -99 -99
      , age = 0
      , isPaused = False
      , fx = []
      }
    , Cmd.none
    )


port hardReset : () -> Cmd msg


type GameState
    = Playing
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
    | MoneyCropSeed


type alias Creep =
    { pos : Vec2
    , nextPos : Vec2

    --, target : Target -- use for hero
    , timeSinceLastHop : Float
    , healthAmt : Float
    , healthMax : Float
    , age : Float
    , seed : Random.Seed
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
    }


waterNeededToMatureC =
    100


type alias Crop =
    { pos : TilePos
    , healthAmt : Float
    , healthMax : Float
    , state : CropState
    , kind : CropKind
    }


type CropState
    = Seedling { waterNeededToMature : Float, waterConsumed : Float }
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


type Msg
    = KeyDown String
    | KeyUp String
    | MouseDown
    | MouseUp
    | MouseMove ( Float, Float )
    | Tick Float
    | TogglePause Bool


dlog : String -> a -> a
dlog str val =
    --Debug.log str val
    val


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

        --, Html.span [] [ Html.text (String.fromFloat waterAmt) ]
        --, Html.span [] [ Html.text "/" ]
        --, Html.span [] [ Html.text (String.fromFloat waterMax) ]
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
                |> heroPickUpCompost session delta
                |> checkGameOver session delta
                |> (\updatedModel ->
                        ( { updatedModel
                            | fx = []

                            --, isPaused = True
                          }
                        , [ DrawSprites (getSprites session updatedModel)
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
                            ( MoneyCropSeed, Can, Just tilePos ) ->
                                { m
                                    | crops =
                                        { pos = tilePos
                                        , healthAmt = session.c.getFloat "crops:moneyCrop:healthMax"
                                        , healthMax = session.c.getFloat "crops:moneyCrop:healthMax"
                                        , state =
                                            Seedling
                                                { waterNeededToMature = waterNeededToMatureC
                                                , waterConsumed = 0
                                                }
                                        , kind = MoneyCrop
                                        }
                                            :: m.crops
                                }

                            ( TurretSeed, Can, Just tilePos ) ->
                                { m
                                    | crops =
                                        { pos = tilePos
                                        , healthAmt = session.c.getFloat "crops:turret:healthMax"
                                        , healthMax = session.c.getFloat "crops:turret:healthMax"
                                        , state =
                                            Seedling
                                                { waterNeededToMature = waterNeededToMatureC
                                                , waterConsumed = 0
                                                }
                                        , kind = Turret { timeSinceLastFire = 0 }
                                        }
                                            :: m.crops
                                }

                            ( Scythe, _, _ ) ->
                                { model
                                    | timeSinceLastSlash = 0
                                    , slashEffects = ( 0, makeSlashEffect session model ) :: model.slashEffects
                                    , creeps = slashCreeps session model
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


slashDmg =
    2


creepRad =
    -- inconsistent w/ sprite :(
    0.4


absorptionRate =
    50


cropsAbsorbWater : Session -> Float -> Model -> Model
cropsAbsorbWater session delta model =
    { model
        | crops =
            model.crops
                |> List.map
                    (\crop ->
                        case crop.state of
                            Seedling { waterNeededToMature, waterConsumed } ->
                                let
                                    numBullets =
                                        model.bullets
                                            |> List.filter
                                                (\bullet ->
                                                    crop.pos == (bullet.pos |> vec2ToTuple |> Tuple.mapBoth floor floor)
                                                )
                                            |> List.length
                                            |> toFloat
                                in
                                if waterConsumed + (delta * absorptionRate * numBullets) >= waterNeededToMature then
                                    { crop | state = Mature }

                                else
                                    { crop
                                        | state =
                                            Seedling
                                                { waterConsumed = waterConsumed + (delta * absorptionRate * numBullets)
                                                , waterNeededToMature = waterNeededToMature
                                                }
                                    }

                            Mature ->
                                crop
                    )
    }


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
            { model | equipped = MoneyCropSeed }

        "4" ->
            { model | equipped = TurretSeed }

        _ ->
            model


makePlayerBullets : Session -> Float -> Model -> Model
makePlayerBullets session delta model =
    if model.isMouseDown && model.equipped == Gun && model.waterAmt > session.c.getFloat "waterGun:bulletCost" then
        if model.timeSinceLastFire > 0.15 then
            { model
                | timeSinceLastFire = 0
                , bullets =
                    makeBullet PlayerBullet model.hero.pos (mouseGamePos session model)
                        :: model.bullets
                , waterAmt = model.waterAmt - session.c.getFloat "waterGun:bulletCost"
            }

        else
            { model | timeSinceLastFire = model.timeSinceLastFire + delta }

    else
        { model | timeSinceLastFire = model.timeSinceLastFire + delta }


refillWater : Session -> Float -> Model -> Model
refillWater session delta model =
    { model
        | waterAmt =
            if nearbyWater model then
                min (model.waterAmt + (delta * session.c.getFloat "waterGun:refillRate")) model.waterMax

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
        |> List.filterMap (\neighborPos -> Dict.get neighborPos model.map)


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
    let
        speed =
            session.c.getFloat "creeps:global:speed"
                * session.c.getFloat "creeps:attacker:melee:speed"
                * 0.4
                * (1.1 + sin (10 * creep.age))

        distToTravel =
            Vec2.distance creep.pos creep.nextPos

        deltaNeededToTravel =
            distToTravel / speed
    in
    if deltaNeededToTravel < delta then
        -- can go to next tile this tick
        -- go naively to next pos, assuming you're not going faster than 1 tile per tick
        let
            ( nextPos, newSeed ) =
                Random.step
                    (nextPosTowardsGenerator model creep.nextPos (model.base.pos |> vec2FromTilePos))
                    creep.seed
        in
        -- todo not great
        if Vec2.distance creep.nextPos nextPos < 0.1 then
            { creep
                | pos = nextPos
                , nextPos = nextPos
                , seed = newSeed

                --, timeSinceLastHop = creep.timeSinceLastHop + delta
            }

        else
            { creep
                | pos =
                    Vec2.direction creep.pos creep.nextPos
                        |> Vec2.scale (-delta * speed)
                        |> Vec2.add creep.pos
                , nextPos = nextPos
                , seed = newSeed

                --, timeSinceLastHop = creep.timeSinceLastHop + delta
            }

    else
        { creep
            | pos =
                Vec2.direction creep.pos creep.nextPos
                    |> Vec2.scale (-delta * speed)
                    |> Vec2.add creep.pos

            --, timeSinceLastHop = creep.timeSinceLastHop + delta
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
                Playing
    }


collidesWith : ( Vec2, Float ) -> ( Vec2, Float ) -> Bool
collidesWith ( v1, rad1 ) ( v2, rad2 ) =
    Vec2.distance v1 v2 <= rad1 + rad2


moveBullets : Session -> Float -> Model -> Model
moveBullets session delta model =
    { model
        | bullets =
            model.bullets
                |> List.map
                    (\bullet ->
                        { bullet
                            | pos =
                                Vec2.add
                                    -- TODO different bullet types
                                    (tupleToVec2 (fromPolar ( session.c.getFloat "waterGun:bulletSpeed" * delta, bullet.angle )))
                                    bullet.pos
                            , age = bullet.age + delta
                        }
                    )
                |> List.filter (\bullet -> bullet.age < session.c.getFloat "waterGun:bulletMaxAge")
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
                True

            MoneyCropSeed ->
                True

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

                                ( nextPos, newSeed ) =
                                    Random.step
                                        (nextPosTowardsGenerator model
                                            (enemyTower.pos |> vec2FromTilePos)
                                            (model.base.pos |> vec2FromTilePos)
                                        )
                                        seed
                            in
                            ( { enemyTower | timeSinceLastSpawn = 0 } :: enemyTowers
                            , { pos = enemyTower.pos |> vec2FromTilePos
                              , nextPos = nextPos
                              , timeSinceLastHop = 0 -- todo perhaps half default?
                              , healthAmt =
                                    session.c.getFloat "creeps:global:health"
                                        * session.c.getFloat "creeps:attacker:melee:health"
                              , healthMax =
                                    session.c.getFloat "creeps:global:health"
                                        * session.c.getFloat "creeps:attacker:melee:health"
                              , age = 0
                              , seed = newSeed
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


creepGenerator : Session -> Model -> TilePos -> Random.Generator Creep
creepGenerator session model tilePos =
    Random.map3
        (\nextPos offsettedPos seed ->
            { pos = offsettedPos
            , nextPos = nextPos
            , timeSinceLastHop = 0 -- todo perhaps half default?
            , healthAmt =
                session.c.getFloat "creeps:global:health"
                    * session.c.getFloat "creeps:attacker:melee:health"
            , healthMax =
                session.c.getFloat "creeps:global:health"
                    * session.c.getFloat "creeps:attacker:melee:health"
            , age = 0
            , seed = seed
            }
        )
        (nextPosTowardsGenerator model
            (tilePos |> vec2FromTilePos)
            (model.base.pos |> vec2FromTilePos)
        )
        (vec2OffsetGenerator -0.5 0.5)
        Random.independentSeed


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
            if not <| isHeroColliding model.map newPos then
                ( newPos, newVel )
                -- also check common x/y slides

            else if not <| isHeroColliding model.map (Vec2.vec2 (Vec2.getX newPos) (Vec2.getY hero.pos)) then
                ( Vec2.vec2 (Vec2.getX newPos) (Vec2.getY hero.pos)
                , Vec2.vec2 (Vec2.getX newVel) 0
                )

            else if not <| isHeroColliding model.map (Vec2.vec2 (Vec2.getX hero.pos) (Vec2.getY newPos)) then
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
    0.45


isHeroColliding : Map -> Vec2 -> Bool
isHeroColliding map heroPos =
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
                case Dict.get ( x, y ) map |> Maybe.map (not << isPassable) of
                    Just True ->
                        Collision.collision 10
                            ( heroPoly, polySupport )
                            ( polyFromSquare (Vec2.vec2 (0.5 + toFloat x) (0.5 + toFloat y)) 0.5, polySupport )
                            |> Maybe.withDefault False

                    _ ->
                        False
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
                    (possibleMoves model)
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


possibleMoves : Model -> TilePos -> Set TilePos
possibleMoves model ( col, row ) =
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
        |> List.filterMap (\pos -> Dict.get pos model.map |> Maybe.map (Tuple.pair pos))
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
                    Playing ->
                        [ Browser.Events.onAnimationFrameDelta Tick
                        ]

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
        ]
        [ Html.div
            [ Html.Attributes.style "margin" "5px 20px 0"
            , Html.Attributes.style "font-family" "sans-serif"
            , Html.Attributes.style "font-size" "14px"
            , Html.Attributes.style "background" "rgba(0,0,0,0.8)"
            , Html.Attributes.style "margin" "0"
            , Html.Attributes.style "padding" "0"
            , Html.Attributes.style "top" "0"
            , Html.Attributes.style "position" "absolute"
            , Html.Attributes.style "width" "100%"
            , Html.Attributes.style "color" "white"
            , Html.Attributes.style "z-index" "99"
            ]
            [ Html.button
                [ Html.Events.onClick (TogglePause True)
                , Html.Attributes.style "z-index" "99"
                ]
                [ Html.text "Pause" ]
            , Html.div
                [ Html.Attributes.style "margin" "5px 20px 0"
                , Html.Attributes.style "font-family" "sans-serif"
                , Html.Attributes.style "font-size" "14px"
                ]
                [ Html.text "WASD to move. 1 to switch to Gun, 2 to switch to MoneyCrop Seeds, 3 to switch to Turret Seeds."
                ]
            , Html.hr [] []
            , Html.div
                [ Html.Attributes.style "margin" "5px 20px 0"
                , Html.Attributes.style "font-family" "monospace"
                , Html.Attributes.style "font-size" "14px"
                ]
                [ Html.text "Currently equipped: "
                , Html.strong [] [ Html.text (equippableStr model.equipped) ]
                , Html.br [] []
                , Html.text "Compost: "
                , Html.strong [] [ Html.text (String.fromInt model.inv.compost) ]
                , Html.br [] []
                ]
            , Html.hr [] []
            , Html.div
                [ Html.Attributes.style "margin" "5px 20px 0"
                , Html.Attributes.style "font-family" "monospace"
                , Html.Attributes.style "font-size" "14px"
                ]
                [ Html.text "--- DEBUG ---"
                , Html.br [] []

                --, Html.text "Map sprites (visible/total): "
                --, Html.strong [] [ Html.text (String.fromInt (List.length map)) ]
                --, Html.strong [] [ Html.text "/" ]
                --, Html.strong [] [ Html.text (String.fromInt (Dict.size model.map)) ]
                --, Html.br [] []
                --, Html.br [] []
                , Html.span [] [ Html.text "Water: " ]
                , viewMeter model.waterAmt model.waterMax (session.c.getFloat "ui:meterWidth")
                ]
            ]
        , drawEquippables session model
        , drawClock session model
        , drawGlass session model
        , Html.div []
            [ case model.gameState of
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
                            , Html.Attributes.style "margin-top" "30%"
                            , Html.Attributes.style "cursor" "default"
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
                            , Html.Attributes.style "margin-top" "30%"
                            , Html.Attributes.style "cursor" "default"
                            ]
                            [ Html.text "A WINNER IS YOU" ]
                        ]

                Playing ->
                    Html.text ""
            ]
        ]


drawEquippables : Session -> Model -> Html Msg
drawEquippables session model =
    let
        size =
            "50px"

        equippables =
            [ ( Gun, "images/icon-watergun.png" )
            , ( Scythe, "images/scythe.png" )
            , ( MoneyCropSeed, "images/moneyCrop.png" )
            , ( TurretSeed, "images/turret.png" )
            , ( TurretSeed, "images/hedge.png" )
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
                    (\( equippable, imgSrc ) ->
                        Html.div
                            ([ Html.Attributes.style "border" "7px ridge white"
                             , Html.Attributes.style "border-radius" "4px"
                             , Html.Attributes.style "background" "rgba(255, 255, 255, 0.4)"
                             , Html.Attributes.style "margin" "0 5px"
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
            "Gun"

        Scythe ->
            "Scythe"

        MoneyCropSeed ->
            "MoneyCrop Seed"

        TurretSeed ->
            "Turret Seed"


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


getSprites : Session -> Model -> List SpriteLayer
getSprites session model =
    let
        mapLayer =
            { name = "map"
            , sprites =
                model.map
                    |> Dict.toList
                    |> List.map
                        (\( ( x, y ), tile ) ->
                            { x = x |> toFloat
                            , y = y |> toFloat
                            , texture = tileToStr tile
                            }
                        )
            , graphics = []
            }

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

                    MoneyCropSeed ->
                        tileCursor

                    TurretSeed ->
                        tileCursor
            , graphics = []
            }

        heroLayer =
            { name = "hero"
            , sprites =
                [ { x = Vec2.getX model.hero.pos - 0.5
                  , y = Vec2.getY model.hero.pos - 0.5
                  , texture = "hero"
                  }
                ]
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
                        [ { x = x |> toFloat
                          , y = y |> toFloat
                          , texture = "tower"
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
                                            Seedling _ ->
                                                "seedling"

                                            Mature ->
                                                case crop.kind of
                                                    MoneyCrop ->
                                                        "moneyCrop"

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
                            (Vec2.vec2 (toFloat x + 0.5) (toFloat y + 0.5))
                            2
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
                                        Seedling { waterNeededToMature, waterConsumed } ->
                                            drawWaterMeter
                                                (Vec2.vec2 (toFloat etX + 0.5) (toFloat etY + 0.5))
                                                0.8
                                                waterConsumed
                                                waterNeededToMature

                                        Mature ->
                                            drawHealthMeter
                                                (Vec2.vec2 (toFloat etX + 0.5) (toFloat etY + 0.5))
                                                0.9
                                                crop.healthAmt
                                                crop.healthMax
                        )
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
                            , texture = "bullet"
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
                    |> List.map
                        (\creep ->
                            drawHealthMeter
                                creep.pos
                                1
                                creep.healthAmt
                                creep.healthMax
                        )
                    |> List.concat
            }
    in
    [ mapLayer
    , buildingsLayer
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
    | MoveCamera Vec2
    | DrawFx Vec2 FxKind


type FxKind
    = Splash
    | CreepDeath


drawHealthMeter : Vec2 -> Float -> Float -> Float -> List Graphic
drawHealthMeter pos width amt max =
    drawMeter pos width amt max "#00ff00"


drawWaterMeter : Vec2 -> Float -> Float -> Float -> List Graphic
drawWaterMeter pos width amt max =
    drawMeter pos width amt max "#00ffff"


drawMeter : Vec2 -> Float -> Float -> Float -> String -> List Graphic
drawMeter pos width amt max color =
    let
        ( healthX, healthY ) =
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
    [ { x = healthX - offset
      , y = healthY - offset
      , width = width + (offset * 2)
      , height = height + (offset * 2)
      , bgColor = "#000000"
      , lineStyleWidth = 0
      , lineStyleColor = "#000000"
      , lineStyleAlpha = 1
      , alpha = 1
      , shape = Rect
      }
    , { x = healthX
      , y = healthY
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
