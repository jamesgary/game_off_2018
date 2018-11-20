port module Main exposing (main)

import AStar
import Browser
import Browser.Events
import Collision
import Color exposing (Color)
import Dict exposing (Dict)
import Game.Resources as Resources exposing (Resources)
import Game.TwoD as GameTwoD
import Game.TwoD.Camera as GameTwoDCamera exposing (Camera)
import Game.TwoD.Render as GameTwoDRender
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


port saveFlags : Persistence -> Cmd msg


port hardReset : () -> Cmd msg


defaultPesistence : Persistence
defaultPesistence =
    { isConfigOpen = False
    , config =
        [ ( "bulletDmg", { val = 15, min = 0, max = 20 } )
        , ( "bulletMaxAge", { val = 2, min = 0, max = 5 } )
        , ( "bulletSpeed", { val = 10, min = 5, max = 50 } )
        , ( "canvasHeight", { val = 600, min = 300, max = 1200 } )
        , ( "canvasWidth", { val = 800, min = 400, max = 1600 } )
        , ( "creepDps", { val = 10, min = 0, max = 200 } )
        , ( "creepHealth", { val = 100, min = 1, max = 200 } )
        , ( "creepSpeed", { val = 1, min = 0, max = 2 } )
        , ( "heroAcc", { val = 70, min = 10, max = 200 } )
        , ( "heroHealthMax", { val = 100, min = 1, max = 10000 } )
        , ( "heroMaxSpeed", { val = 20, min = 10, max = 100 } )
        , ( "meterWidth", { val = 450, min = 10, max = 800 } )
        , ( "refillRate", { val = 20, min = 0, max = 1000 } )
        , ( "tilesToShowLengthwise", { val = 20, min = 10, max = 200 } )
        , ( "towerHealthMax", { val = 1000, min = 100, max = 5000 } )
        , ( "turretTimeToSprout", { val = 5, min = 0, max = 30 } )
        , ( "waterBulletCost", { val = 5, min = 0, max = 25 } )
        ]
    }


main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type alias Flags =
    { timestamp : Float
    , persistence : Maybe Persistence
    }


type alias Persistence =
    { isConfigOpen : Bool
    , config : List ( String, ConfigVal )
    }


type alias Model =
    { -- fluid things
      hero : Hero
    , bullets : List Bullet
    , composts : List Compost

    -- fluid bldgs?
    , particles : List Particle
    , creeps : List Creep

    -- bldgs
    , enemyTowers : List EnemyTower
    , turrets : List Turret
    , base : Base

    -- hero things
    , timeSinceLastFire : Float
    , waterAmt : Float
    , waterMax : Float
    , equipped : Equippable

    -- map
    , map : Map
    , inv : Inv

    --config
    , config : Dict String ConfigVal
    , isConfigOpen : Bool
    , c : Config

    -- input
    , keysPressed : Set Key
    , mousePos : Vec2
    , isMouseDown : Bool

    -- misc
    , gameState : GameState
    , age : Float
    , resources : Resources
    , seed : Random.Seed
    , cache : Cache
    }


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


type Particle
    = BulletHitCreep Vec2 Float Float


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
    | TurretSeed


type alias Creep =
    { pos : TilePos
    , nextPos : TilePos
    , progress : Float
    , diagonal : Bool
    , healthAmt : Float
    , healthMax : Float
    , offset : Vec2
    }


type alias Cache =
    {}


type alias HeroPos =
    Vec2


type alias Hero =
    { pos : HeroPos
    , vel : Vec2
    , healthAmt : Float
    , healthMax : Float
    }


type alias EnemyTower =
    { pos : TilePos
    , timeSinceLastSpawn : Float
    , healthAmt : Float
    , healthMax : Float
    }


type alias Turret =
    { pos : TilePos
    , timeSinceLastFire : Float
    , age : Float
    , healthAmt : Float
    , healthMax : Float
    }


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


type alias TilePos =
    ( Int, Int )


type alias Map =
    Dict TilePos Tile


type HDir
    = Left
    | Right


type VDir
    = Top
    | Down


type Tile
    = Grass
    | Water
    | Poop


type Msg
    = KeyDown String
    | KeyUp String
    | MouseDown
    | MouseUp
    | MouseMove ( Float, Float )
    | Tick Float
    | Resources Resources.Msg
    | ChangeConfig String String
    | ToggleConfig Bool
    | HardReset


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
                        |> Debug.log ("YOU FOOOOL: " ++ n)
    }


init : Flags -> ( Model, Cmd Msg )
init flags =
    let
        ( config, isConfigOpen ) =
            case flags.persistence of
                Just p ->
                    ( Dict.fromList p.config
                    , p.isConfigOpen
                    )

                Nothing ->
                    ( Dict.fromList defaultPesistence.config
                    , defaultPesistence.isConfigOpen
                    )
    in
    ( { hero =
            { pos = Vec2.vec2 9 -3
            , vel = Vec2.vec2 0 0
            , healthAmt = (makeC config).getFloat "heroHealthMax"
            , healthMax = (makeC config).getFloat "heroHealthMax"
            }
      , bullets = []
      , composts = []
      , particles = []
      , creeps = []
      , enemyTowers =
            [ { pos = ( 2, -8 )
              , timeSinceLastSpawn = 9999
              , healthAmt = (makeC config).getFloat "towerHealthMax"
              , healthMax = (makeC config).getFloat "towerHealthMax"
              }
            , { pos = ( 11, -5 )
              , timeSinceLastSpawn = 9999
              , healthAmt = (makeC config).getFloat "towerHealthMax"
              , healthMax = (makeC config).getFloat "towerHealthMax"
              }
            , { pos = ( 14, -1 )
              , timeSinceLastSpawn = 9999
              , healthAmt = (makeC config).getFloat "towerHealthMax"
              , healthMax = (makeC config).getFloat "towerHealthMax"
              }
            ]
      , turrets = []
      , base =
            { pos = ( 3, -3 )
            , healthAmt = (makeC config).getFloat "towerHealthMax"
            , healthMax = (makeC config).getFloat "towerHealthMax"
            }
      , timeSinceLastFire = 0
      , waterAmt = 75
      , waterMax = 100
      , equipped = Gun
      , map = initMap
      , inv =
            { compost = 0
            }
      , config = config
      , isConfigOpen = isConfigOpen
      , c = makeC config
      , keysPressed = Set.empty
      , mousePos = Vec2.vec2 0 0
      , isMouseDown = False
      , gameState = Playing
      , age = 0
      , resources = Resources.init
      , seed = Random.initialSeed (round flags.timestamp)
      , cache = {}
      }
    , Resources.loadTextures
        [ "images/grass.png"
        , "images/water.png"
        , "images/selectedTile.png"
        , "images/selectedTile-inactive.png"
        , "images/enemyTower.png"
        , "images/turret.png"
        , "images/creep.png"
        , "images/tower.png"
        , "images/seedling.png"
        , "images/compost.png"
        ]
        |> Cmd.map Resources
    )


type alias ConfigVal =
    { val : Float
    , min : Float
    , max : Float
    }


cameraOnHero : Model -> Camera
cameraOnHero model =
    GameTwoDCamera.fixedArea
        (tilesToShowHeightwise model.c * model.c.getFloat "tilesToShowLengthwise")
        ( Vec2.getX model.hero.pos, Vec2.getY model.hero.pos )


initMap : Map
initMap =
    """
11111111111111111111
10000000000000000001
10000000000000000001
10000000000000000001
10000010000000000001
10000010000000000001
11111111111111111101
11111100000000000001
10001110000000000001
10001110011111111111
10001110000000000001
10001110000000000001
10001111111110000001
10000011111111111001
10000011111111000001
10000011111111000001
10000001111111001111
10000000000000000111
11111111111111111111
"""
        |> String.trim
        |> String.lines
        |> List.indexedMap
            (\row line ->
                line
                    |> String.toList
                    |> List.indexedMap
                        (\col char ->
                            ( ( col, -row )
                            , case char of
                                '0' ->
                                    Grass

                                '1' ->
                                    Water

                                _ ->
                                    Poop
                            )
                        )
            )
        |> List.concat
        |> Dict.fromList


vec2ToTuple : Vec2 -> ( Float, Float )
vec2ToTuple vec2 =
    vec2
        |> Vec2.toRecord
        |> (\{ x, y } -> ( x, y ))


tupleToVec2 : ( Float, Float ) -> Vec2
tupleToVec2 ( x, y ) =
    { x = x, y = y }
        |> Vec2.fromRecord


heroDirInput : Model -> Vec2
heroDirInput model =
    { x =
        if
            Set.member "ArrowLeft" model.keysPressed
                || Set.member "a" model.keysPressed
        then
            -1

        else if
            Set.member "ArrowRight" model.keysPressed
                || Set.member "d" model.keysPressed
        then
            1

        else
            0
    , y =
        if
            Set.member "ArrowUp" model.keysPressed
                || Set.member "w" model.keysPressed
        then
            1

        else if
            Set.member "ArrowDown" model.keysPressed
                || Set.member "s" model.keysPressed
        then
            -1

        else
            0
    }
        |> Vec2.fromRecord


currentCameraPos : Model -> Vec2
currentCameraPos model =
    cameraOnHero model
        |> GameTwoDCamera.getPosition
        |> tupleToVec2


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Tick d ->
            let
                delta =
                    -- set max frame at 0.25 sec
                    min (d / 1000) 0.25
            in
            ( model
                |> ageSelf delta
                |> ageParticles delta
                |> moveHero delta
                |> refillWater delta
                |> makeTurretBullets delta
                |> makePlayerBullets delta
                |> ageTurrets delta
                |> moveBullets delta
                |> spawnCreeps delta
                |> moveCreeps delta
                |> applyCreepDamageToBase delta
                |> applyCreepDamageToHero delta
                |> collideBulletsWithCreeps delta
                |> collideBulletsWithEnemyTowers delta
                |> heroPickUpCompost delta
                |> checkGameOver delta
            , Cmd.none
            )

        KeyUp str ->
            ( { model | keysPressed = Set.remove str model.keysPressed }, Cmd.none )

        KeyDown str ->
            ( { model | keysPressed = Set.insert str model.keysPressed }
                |> applyKeyDown str
            , Cmd.none
            )

        MouseMove ( mouseX, mouseY ) ->
            let
                cameraPos =
                    currentCameraPos model

                mousePos =
                    Vec2.vec2 mouseX mouseY
            in
            ( { model
                | mousePos =
                    mousePos
                        |> Vec2.toRecord
                        |> (\{ x, y } ->
                                { x =
                                    (x - (model.c.getFloat "canvasWidth" / 2))
                                        / (model.c.getFloat "canvasWidth" / model.c.getFloat "tilesToShowLengthwise")
                                , y =
                                    (y - (model.c.getFloat "canvasHeight" / 2))
                                        / (-(model.c.getFloat "canvasHeight") / tilesToShowHeightwise model.c)
                                }
                           )
                        |> Vec2.fromRecord
                        |> Vec2.add (currentCameraPos model)
              }
            , Cmd.none
            )

        MouseDown ->
            ( { model | isMouseDown = True }
                |> (\m ->
                        case m.equipped of
                            TurretSeed ->
                                if not (canPhysicallyPlaceTurretOnMap model) then
                                    m

                                else
                                    case hoveringTileAndPos m of
                                        Just ( Grass, tilePos ) ->
                                            { m
                                                | turrets =
                                                    { pos = tilePos
                                                    , timeSinceLastFire = 0
                                                    , healthAmt = model.c.getFloat "baseHealthMax"
                                                    , healthMax = model.c.getFloat "baseHealthMax"
                                                    , age = 0
                                                    }
                                                        :: m.turrets
                                            }

                                        _ ->
                                            m

                            _ ->
                                m
                   )
            , Cmd.none
            )

        MouseUp ->
            ( { model
                | isMouseDown = False
              }
            , Cmd.none
            )

        Resources resourcesMsg ->
            ( { model | resources = Resources.update resourcesMsg model.resources }, Cmd.none )

        ChangeConfig name inputStr ->
            let
                newConfig =
                    model.config
                        |> (\config ->
                                case String.toFloat inputStr of
                                    Just val ->
                                        Dict.update name (Maybe.map (\cv -> { cv | val = val })) config

                                    Nothing ->
                                        config
                           )

                newModel =
                    { model
                        | config = newConfig
                        , c = makeC newConfig
                    }
            in
            ( newModel, saveFlags (modelToPersistence newModel) )

        ToggleConfig shouldOpen ->
            let
                newModel =
                    { model | isConfigOpen = shouldOpen }
            in
            ( newModel, saveFlags (modelToPersistence newModel) )

        HardReset ->
            ( { model
                | isConfigOpen = True
                , config = Dict.fromList defaultPesistence.config
                , c = makeC (Dict.fromList defaultPesistence.config)
              }
            , hardReset ()
            )


ageSelf : Float -> Model -> Model
ageSelf delta model =
    { model | age = delta + model.age }


modelToPersistence : Model -> Persistence
modelToPersistence model =
    { isConfigOpen = model.isConfigOpen
    , config = Dict.toList model.config
    }


hoveringTileAndPos : Model -> Maybe ( Tile, TilePos )
hoveringTileAndPos model =
    case hoveringTilePos model of
        Just tilePos ->
            Dict.get tilePos model.map
                |> Maybe.map (\tile -> ( tile, tilePos ))

        Nothing ->
            Nothing


hoveringTile : Model -> Maybe Tile
hoveringTile model =
    case hoveringTilePos model of
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
            { model | equipped = TurretSeed }

        _ ->
            model


makePlayerBullets : Float -> Model -> Model
makePlayerBullets delta model =
    if model.isMouseDown && model.equipped == Gun && model.waterAmt > model.c.getFloat "waterBulletCost" then
        if model.timeSinceLastFire > 0.15 then
            { model
                | timeSinceLastFire = 0
                , bullets = makeBullet PlayerBullet model.hero.pos model.mousePos :: model.bullets
                , waterAmt = model.waterAmt - model.c.getFloat "waterBulletCost"
            }

        else
            { model | timeSinceLastFire = model.timeSinceLastFire + delta }

    else
        { model | timeSinceLastFire = model.timeSinceLastFire + delta }


ageTurrets : Float -> Model -> Model
ageTurrets delta ({ turrets } as model) =
    let
        newTurrets =
            turrets
                |> List.map
                    (\turret ->
                        { turret
                            | age = turret.age + delta
                        }
                    )
    in
    { model | turrets = newTurrets }


refillWater : Float -> Model -> Model
refillWater delta model =
    { model
        | waterAmt =
            if nearbyWater model then
                min (model.waterAmt + (delta * model.c.getFloat "refillRate")) model.waterMax

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


makeTurretBullets : Float -> Model -> Model
makeTurretBullets delta model =
    let
        ( newBullets, newTurrets ) =
            model.turrets
                |> List.foldl
                    (\turret ( bullets, turrets ) ->
                        let
                            shotBullet =
                                if turret.age > model.c.getFloat "turretTimeToSprout" && turret.timeSinceLastFire > 0.5 then
                                    model.creeps
                                        |> List.Extra.minimumBy (\closestCreep -> Vec2.distanceSquared (vec2FromCreep closestCreep) (vec2FromTurretPos turret.pos))
                                        |> Maybe.andThen
                                            (\closestCreep ->
                                                if Vec2.distanceSquared (vec2FromCreep closestCreep) (vec2FromTurretPos turret.pos) < 5 ^ 2 then
                                                    Just (makeBullet PlantBullet (vec2FromTurretPos turret.pos) (vec2FromCreep closestCreep))

                                                else
                                                    Nothing
                                            )

                                else
                                    Nothing
                        in
                        case shotBullet of
                            Just bullet ->
                                ( bullet :: bullets, { turret | timeSinceLastFire = 0 } :: turrets )

                            Nothing ->
                                ( bullets, { turret | timeSinceLastFire = turret.timeSinceLastFire + delta } :: turrets )
                    )
                    ( model.bullets, [] )
    in
    { model
        | turrets = newTurrets
        , bullets = newBullets
    }


moveCreeps : Float -> Model -> Model
moveCreeps delta model =
    { model
        | creeps =
            model.creeps
                |> List.map
                    (\creep ->
                        let
                            newProgress =
                                if creep.diagonal then
                                    delta * model.c.getFloat "creepSpeed" + creep.progress

                                else
                                    sqrt 2 * delta * model.c.getFloat "creepSpeed" + creep.progress

                            ( pos, nextPos, freshProgress ) =
                                if newProgress > 1 then
                                    ( creep.nextPos, findNextTileTowards model creep.nextPos model.base.pos, newProgress - 1 )

                                else
                                    ( creep.pos, creep.nextPos, newProgress )
                        in
                        if isCreepOnHero model.hero creep then
                            creep

                        else
                            { creep
                                | pos = pos
                                , nextPos = nextPos
                                , progress = freshProgress
                                , diagonal = isDiagonal pos nextPos
                            }
                    )
    }


isCreepOnHero : Hero -> Creep -> Bool
isCreepOnHero hero creep =
    (creep
        |> vec2FromCreep
        |> Vec2.add (Vec2.vec2 0 -0.0)
        |> Vec2.distanceSquared hero.pos
    )
        < (0.8 ^ 2)


applyCreepDamageToBase : Float -> Model -> Model
applyCreepDamageToBase delta ({ base } as model) =
    let
        creepDps =
            model.c.getFloat "creepDps"

        dmg =
            creepDps * delta

        tilesToCheck =
            base.pos
                |> vec2FromTurretPos
                |> getTilePosSurroundingVec2 model

        numCreeps =
            model.creeps
                |> List.filter
                    (\creep ->
                        tilesToCheck
                            |> List.member creep.pos
                    )
                |> List.length

        newBase =
            { base
                | healthAmt =
                    base.healthAmt - (dmg * toFloat numCreeps)
            }
    in
    { model | base = newBase }


applyCreepDamageToHero : Float -> Model -> Model
applyCreepDamageToHero delta ({ hero } as model) =
    let
        creepDps =
            model.c.getFloat "creepDps"

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


collideBulletsWithCreeps : Float -> Model -> Model
collideBulletsWithCreeps delta model =
    let
        { particles, bullets, creeps, composts, seed } =
            model.bullets
                |> List.foldl
                    (\bullet tmp ->
                        case List.Extra.splitWhen (\creep -> collidesWith ( bullet.pos, 0.1 ) ( vec2FromCreep creep, 0.5 )) tmp.creeps of
                            Just ( firstHalf, foundCreep :: secondHalf ) ->
                                let
                                    newCreep =
                                        { foundCreep | healthAmt = foundCreep.healthAmt - model.c.getFloat "bulletDmg" }

                                    ( angle, newSeed ) =
                                        Random.step
                                            (Random.float 0 (2 * pi))
                                            tmp.seed
                                in
                                { particles = BulletHitCreep bullet.pos angle 0 :: tmp.particles
                                , bullets = tmp.bullets
                                , creeps =
                                    if newCreep.healthAmt > 0 then
                                        firstHalf ++ (newCreep :: secondHalf)

                                    else
                                        firstHalf ++ secondHalf
                                , composts =
                                    if newCreep.healthAmt > 0 then
                                        tmp.composts

                                    else
                                        { pos = vec2FromCreep foundCreep, age = 0 } :: tmp.composts
                                , seed = newSeed
                                }

                            _ ->
                                { particles = tmp.particles
                                , bullets = bullet :: tmp.bullets
                                , creeps = tmp.creeps
                                , composts = tmp.composts
                                , seed = tmp.seed
                                }
                    )
                    { particles = model.particles
                    , bullets = []
                    , creeps = model.creeps
                    , composts = model.composts
                    , seed = model.seed
                    }
    in
    { model
        | creeps = creeps
        , bullets = bullets
        , particles = particles
        , composts = composts
        , seed = seed
    }


collideBulletsWithEnemyTowers : Float -> Model -> Model
collideBulletsWithEnemyTowers delta model =
    let
        { particles, bullets, enemyTowers, composts, seed } =
            model.bullets
                |> List.foldl
                    (\bullet tmp ->
                        case List.Extra.splitWhen (\enemyTower -> collidesWith ( bullet.pos, 0.1 ) ( vec2FromTurretPos enemyTower.pos, 0.5 )) tmp.enemyTowers of
                            Just ( firstHalf, foundEnemyTower :: secondHalf ) ->
                                let
                                    newEnemyTower =
                                        { foundEnemyTower | healthAmt = foundEnemyTower.healthAmt - model.c.getFloat "bulletDmg" }

                                    ( angle, newSeed ) =
                                        Random.step
                                            (Random.float 0 (2 * pi))
                                            tmp.seed
                                in
                                { particles = BulletHitCreep bullet.pos angle 0 :: tmp.particles
                                , bullets = tmp.bullets
                                , enemyTowers =
                                    if newEnemyTower.healthAmt > 0 then
                                        firstHalf ++ (newEnemyTower :: secondHalf)

                                    else
                                        firstHalf ++ secondHalf
                                , composts =
                                    if newEnemyTower.healthAmt > 0 then
                                        tmp.composts

                                    else
                                        { pos = vec2FromTurretPos foundEnemyTower.pos, age = 0 } :: tmp.composts
                                , seed = newSeed
                                }

                            _ ->
                                { particles = tmp.particles
                                , bullets = bullet :: tmp.bullets
                                , enemyTowers = tmp.enemyTowers
                                , composts = tmp.composts
                                , seed = tmp.seed
                                }
                    )
                    { particles = model.particles
                    , bullets = []
                    , enemyTowers = model.enemyTowers
                    , composts = model.composts
                    , seed = model.seed
                    }
    in
    { model
        | enemyTowers = enemyTowers
        , bullets = bullets
        , particles = particles
        , composts = composts
        , seed = seed
    }


heroPickUpCompost : Float -> Model -> Model
heroPickUpCompost delta ({ inv } as model) =
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


checkGameOver : Float -> Model -> Model
checkGameOver tick model =
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


moveBullets : Float -> Model -> Model
moveBullets delta model =
    { model
        | bullets =
            model.bullets
                |> List.map
                    (\bullet ->
                        { bullet
                            | pos =
                                Vec2.add
                                    (tupleToVec2 (fromPolar ( model.c.getFloat "bulletSpeed" * delta, bullet.angle )))
                                    bullet.pos
                            , age = bullet.age + delta
                        }
                    )
                |> List.filter (\bullet -> bullet.age < model.c.getFloat "bulletMaxAge")
    }


canPhysicallyPlaceTurretOnMap : Model -> Bool
canPhysicallyPlaceTurretOnMap model =
    (model.equipped == TurretSeed)
        && (case hoveringTilePos model of
                Just tilePos ->
                    Vec2.distanceSquared
                        (tilePos
                            |> tilePosToFloats
                            |> tupleToVec2
                            |> Vec2.add (Vec2.vec2 0.5 0.5)
                        )
                        model.hero.pos
                        < (3 ^ 2)

                Nothing ->
                    False
           )


spawnCreeps : Float -> Model -> Model
spawnCreeps delta model =
    let
        ( newEnemyTowers, newCreeps, newSeed ) =
            model.enemyTowers
                |> List.foldl
                    (\enemyTower ( enemyTowers, creeps, seed ) ->
                        if enemyTower.timeSinceLastSpawn + delta > 1.8 then
                            let
                                nextPos =
                                    findNextTileTowards model enemyTower.pos model.base.pos

                                ( offset, newSeed2 ) =
                                    Random.step (vec2OffsetGenerator -0.5 0.5) model.seed
                            in
                            ( { enemyTower | timeSinceLastSpawn = 0 } :: enemyTowers
                            , { pos = enemyTower.pos
                              , nextPos = nextPos
                              , progress = 0
                              , diagonal = isDiagonal enemyTower.pos nextPos
                              , healthAmt = model.c.getFloat "creepHealth"
                              , healthMax = model.c.getFloat "creepHealth"
                              , offset = offset
                              }
                                :: creeps
                            , newSeed2
                            )

                        else
                            ( { enemyTower | timeSinceLastSpawn = enemyTower.timeSinceLastSpawn + delta } :: enemyTowers
                            , creeps
                            , seed
                            )
                    )
                    ( [], [], model.seed )
    in
    { model
        | enemyTowers = newEnemyTowers
        , creeps = List.append newCreeps model.creeps
        , seed = newSeed
    }


vec2OffsetGenerator : Float -> Float -> Random.Generator Vec2
vec2OffsetGenerator min max =
    Random.pair (Random.float min max) (Random.float min max)
        |> Random.map tupleToVec2


ageParticles : Float -> Model -> Model
ageParticles delta model =
    let
        newParticles =
            model.particles
                |> List.filterMap
                    (\particle ->
                        case particle of
                            BulletHitCreep pos angle age ->
                                if age + delta < 1 then
                                    Just (BulletHitCreep pos angle (age + delta))

                                else
                                    Nothing
                    )
    in
    { model | particles = newParticles }


moveHero : Float -> Model -> Model
moveHero delta model =
    let
        hero =
            model.hero

        newAcc =
            Vec2.scale (model.c.getFloat "heroAcc") (heroDirInput model)

        newVelUncapped =
            Vec2.add model.hero.vel (Vec2.scale delta newAcc)

        percentBeyondCap =
            Vec2.length newVelUncapped / model.c.getFloat "heroMaxSpeed"

        newVel =
            (if percentBeyondCap > 1.0 then
                Vec2.scale (1 / percentBeyondCap) newVelUncapped

             else
                newVelUncapped
            )
                |> Vec2.scale 0.8

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


isHeroColliding : Map -> Vec2 -> Bool
isHeroColliding map heroPos =
    let
        heroPoly =
            polyFromSquare heroPos 0.45
    in
    map
        |> Dict.filter (\_ tile -> not (isPassable tile))
        |> Dict.map
            (\( x, y ) tile ->
                Collision.collision 10 ( heroPoly, polySupport ) ( polyFromSquare (Vec2.vec2 (0.5 + toFloat x) (0.5 + toFloat y)) 0.5, polySupport )
                    |> Maybe.withDefault False
            )
        |> Dict.values
        |> List.filter identity
        |> (not << List.isEmpty)


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


findNextTileTowards : Model -> TilePos -> TilePos -> TilePos
findNextTileTowards model origin destination =
    AStar.findPath
        pythagoreanCost
        (possibleMoves model)
        origin
        destination
        |> Maybe.andThen List.head
        |> Maybe.withDefault origin


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


hoveringTilePos : Model -> Maybe TilePos
hoveringTilePos model =
    model.mousePos
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


tilesToShowHeightwise : Config -> Float
tilesToShowHeightwise c =
    c.getFloat "tilesToShowLengthwise" * (c.getFloat "canvasHeight" / c.getFloat "canvasWidth")


drawCircle : Color -> Vec2 -> Float -> GameTwoDRender.Renderable
drawCircle color pos rad =
    GameTwoDRender.shape
        GameTwoDRender.circle
        { color = color
        , position = Vec2.add (Vec2.vec2 (rad / -2) (rad / -2)) pos |> vec2ToTuple
        , size = Vec2.vec2 rad rad |> vec2ToTuple
        }


drawRect : Color -> Vec2 -> Vec2 -> GameTwoDRender.Renderable
drawRect color pos size =
    GameTwoDRender.shape
        GameTwoDRender.rectangle
        { color = color
        , position = Vec2.add (Vec2.scale -0.5 size) pos |> vec2ToTuple
        , size = size |> vec2ToTuple
        }


view : Model -> Html Msg
view model =
    let
        map =
            model.map
                |> Dict.toList
                |> List.map
                    (\( ( col, row ), tile ) ->
                        case tile of
                            Grass ->
                                GameTwoDRender.sprite
                                    { position = ( toFloat col, toFloat row )
                                    , size = ( 1, 1 )
                                    , texture = Resources.getTexture "images/grass.png" model.resources
                                    }

                            Water ->
                                GameTwoDRender.sprite
                                    { position = ( toFloat col, toFloat row )
                                    , size = ( 1, 1 )
                                    , texture = Resources.getTexture "images/water.png" model.resources
                                    }

                            Poop ->
                                GameTwoDRender.sprite
                                    { position = ( toFloat col, toFloat row )
                                    , size = ( 1, 1 )
                                    , texture = Nothing
                                    }
                    )

        hero =
            drawRect
                Color.black
                model.hero.pos
                (Vec2.vec2 1 1)
                :: drawRect
                    Color.darkGray
                    model.hero.pos
                    (Vec2.vec2 0.9 0.9)
                :: viewHealthMeter
                    0.9
                    (model.hero.pos
                        |> Vec2.add (Vec2.vec2 0 -0.04)
                    )
                    model.hero.healthAmt
                    model.hero.healthMax

        base =
            GameTwoDRender.sprite
                { position = tilePosToFloats model.base.pos
                , size = ( 1, 1 )
                , texture = Resources.getTexture "images/tower.png" model.resources
                }
                :: viewHealthMeter
                    1.5
                    (tilePosToFloats model.base.pos
                        |> tupleToVec2
                        |> Vec2.add (Vec2.vec2 0.5 0.4)
                    )
                    model.base.healthAmt
                    model.base.healthMax

        enemyTowers =
            model.enemyTowers
                |> List.map
                    (\enemyTower ->
                        GameTwoDRender.sprite
                            { position = tilePosToFloats enemyTower.pos
                            , size = ( 1, 1 )
                            , texture = Resources.getTexture "images/enemyTower.png" model.resources
                            }
                            :: viewHealthMeter
                                1.2
                                (tilePosToFloats enemyTower.pos
                                    |> tupleToVec2
                                    |> Vec2.add (Vec2.vec2 0.5 0.2)
                                )
                                enemyTower.healthAmt
                                enemyTower.healthMax
                    )
                |> List.concat

        turrets =
            model.turrets
                |> List.map
                    (\turret ->
                        if turret.age >= model.c.getFloat "turretTimeToSprout" then
                            [ GameTwoDRender.sprite
                                { position = tilePosToFloats turret.pos
                                , size = ( 1, 1 )
                                , texture = Resources.getTexture "images/turret.png" model.resources
                                }
                            ]

                        else
                            GameTwoDRender.sprite
                                { position = tilePosToFloats turret.pos
                                , size = ( 1, 1 )
                                , texture = Resources.getTexture "images/seedling.png" model.resources
                                }
                                :: viewHealthMeter
                                    1
                                    (tilePosToFloats turret.pos
                                        |> tupleToVec2
                                        |> Vec2.add (Vec2.vec2 0.5 0.2)
                                    )
                                    turret.age
                                    (model.c.getFloat "turretTimeToSprout")
                    )
                |> List.concat

        selectedTileOutline =
            case ( model.equipped, hoveringTilePos model ) of
                ( TurretSeed, Just ( x, y ) ) ->
                    if canPhysicallyPlaceTurretOnMap model then
                        [ GameTwoDRender.spriteWithOptions
                            { position = ( toFloat x, toFloat y, 0 )
                            , size = ( 1, 1 )
                            , texture = Resources.getTexture "images/selectedTile.png" model.resources
                            , rotation = 0
                            , pivot = ( 0, 0 )
                            , tiling = ( 1, 1 )
                            }
                        ]

                    else
                        [ GameTwoDRender.spriteWithOptions
                            { position = ( toFloat x, toFloat y, 0 )
                            , size = ( 1, 1 )
                            , texture = Resources.getTexture "images/selectedTile-inactive.png" model.resources
                            , rotation = 0
                            , pivot = ( 0, 0 )
                            , tiling = ( 1, 1 )
                            }
                        ]

                _ ->
                    []

        creeps =
            List.concat
                [ model.creeps
                    |> List.map
                        (\creep ->
                            GameTwoDRender.sprite
                                { position =
                                    creep
                                        |> vec2FromCreep
                                        |> Vec2.add (Vec2.vec2 -0.5 -0.5)
                                        |> vec2ToTuple
                                , size = ( 1, 1 )
                                , texture = Resources.getTexture "images/creep.png" model.resources
                                }
                        )
                , model.creeps
                    |> List.map
                        (\creep ->
                            viewHealthMeter 0.8 (vec2FromCreep creep) creep.healthAmt creep.healthMax
                        )
                    |> List.concat
                ]

        composts =
            model.composts
                |> List.map
                    (\compost ->
                        GameTwoDRender.sprite
                            { position =
                                compost.pos
                                    |> Vec2.add (Vec2.vec2 -0.5 -0.5)
                                    |> vec2ToTuple
                            , size = ( 1, 1 )
                            , texture = Resources.getTexture "images/compost.png" model.resources
                            }
                    )

        particles =
            model.particles
                |> List.map
                    (\particle ->
                        case particle of
                            BulletHitCreep pos angle age ->
                                let
                                    makeUniforms { cameraProj, transform, time } =
                                        { cameraProj = cameraProj
                                        , transform = transform
                                        , time = time
                                        , age = age
                                        , angle = angle
                                        }

                                    size =
                                        5

                                    render =
                                        GameTwoDRender.customFragment makeUniforms
                                            { fragmentShader = bulletHitFrag
                                            , position = ( Vec2.getX pos - (0.5 * size), Vec2.getY pos - (0.5 * size), 0 )
                                            , size = ( size, size )
                                            , rotation = 0
                                            , pivot = ( 0, 0 )
                                            }
                                in
                                render
                    )
    in
    Html.div []
        [ Html.div
            [ Html.Attributes.style "margin" "5px 20px 0"
            , Html.Attributes.style "font-family" "sans-serif"
            , Html.Attributes.style "font-size" "14px"
            ]
            [ Html.text "WASD to move. 1 to switch to Gun, 2 to switch to Turret Seeds."
            , Html.hr [] []
            ]
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
            , Html.br [] []
            , Html.span [] [ Html.text "Water: " ]
            , viewMeter model.waterAmt model.waterMax (model.c.getFloat "meterWidth")
            ]
        , Html.div
            [ Html.Attributes.style "border" "1px solid black"
            , Html.Attributes.style "display" "inline-block"
            , Html.Attributes.style "margin" "20px"
            , Html.Attributes.style "font-size" "0"
            , Html.Attributes.style "position" "relative"
            , Mouse.onDown (\_ -> MouseDown)
            , Mouse.onUp (\_ -> MouseUp)
            , Mouse.onMove (\event -> MouseMove event.offsetPos)
            ]
            [ GameTwoD.render
                { time = model.age
                , size = ( round (model.c.getFloat "canvasWidth"), round (model.c.getFloat "canvasHeight") )
                , camera = cameraOnHero model
                }
                (List.concat
                    [ map
                    , base
                    , enemyTowers
                    , turrets
                    , composts
                    , hero
                    , creeps
                    , particles
                    , model.bullets
                        |> List.map (\bullet -> drawCircle Color.darkBlue bullet.pos 0.3)
                    , selectedTileOutline
                    ]
                )
            , case model.gameState of
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
        , Html.div
            [ Html.Attributes.style "position" "absolute"
            , Html.Attributes.style "top" "10px"
            , Html.Attributes.style "right" "10px"
            , Html.Attributes.style "background" "#eee"
            , Html.Attributes.style "border" "1px solid #333"
            , Html.Attributes.style "font-family" "sans-serif"
            , Html.Attributes.style "font-size" "18px"
            , Html.Attributes.style "padding" "8px"
            ]
            [ Html.div []
                (if model.isConfigOpen then
                    Html.button
                        [ Html.Attributes.style "float" "left"
                        , Html.Events.onClick HardReset
                        ]
                        [ Html.text "Hard Reset" ]
                        :: Html.a
                            [ Html.Events.onClick (ToggleConfig False)
                            , Html.Attributes.style "float" "right"
                            , Html.Attributes.style "display" "inline-block"
                            ]
                            [ Html.text "Collapse Config" ]
                        :: Html.br [] []
                        :: (model.config
                                |> Dict.toList
                                |> List.map
                                    (\( name, { val, min, max } ) ->
                                        Html.div
                                            [ Html.Attributes.style "display" "flex"
                                            , Html.Attributes.style "justify-content" "space-between"
                                            , Html.Attributes.style "margin" "10px 10px"
                                            ]
                                            [ Html.div
                                                []
                                                [ Html.text name
                                                ]
                                            , Html.div
                                                []
                                                [ Html.span [ Html.Attributes.style "margin" "0 10px" ] [ Html.text (formatConfigFloat val) ]
                                                , Html.input
                                                    [ Html.Attributes.style "width" "40px"
                                                    , Html.Attributes.value (formatConfigFloat min)
                                                    ]
                                                    []
                                                , Html.input
                                                    [ Html.Attributes.type_ "range"
                                                    , Html.Attributes.value (formatConfigFloat val)
                                                    , Html.Attributes.min (formatConfigFloat min)
                                                    , Html.Attributes.max (formatConfigFloat max)
                                                    , Html.Attributes.step "any"
                                                    , Html.Events.onInput (ChangeConfig name)
                                                    ]
                                                    []
                                                , Html.input
                                                    [ Html.Attributes.style "width" "40px"
                                                    , Html.Attributes.value (formatConfigFloat max)
                                                    ]
                                                    []
                                                ]
                                            ]
                                    )
                           )

                 else
                    [ Html.a [ Html.Events.onClick (ToggleConfig True) ] [ Html.text "Expand Config" ] ]
                )
            ]
        ]


bulletHitFrag : WebGL.Shader a { b | age : Float, angle : Float } { vcoord : Vec2 }
bulletHitFrag =
    [glsl|
      precision mediump float;

      varying vec2 vcoord;
      uniform float age;
      uniform float angle;

      void main () {
        float maxAge = 0.4;
        float ageProgress = age / maxAge;
        float radius = 0.04 + (0.07 * ageProgress);
        //vec2  pos = vec2(0.5, (0.5 + (0.2 * ageProgress)));
        vec2  pos = vec2(0.5 + 0.2 * ageProgress * sin(angle), 0.5 + 0.2 * ageProgress * cos(angle));
        float dist = length(pos - vcoord);

        float alpha = smoothstep(radius - 0.01, radius, dist);
        vec4 color = vec4(
          (1.0 * ageProgress) + 0.4,
          (1.0 * ageProgress) + 0.4,
          (1.0 * ageProgress) + 1.0,
          (1.0 - alpha) * (1.0 - age / maxAge)
        );

        gl_FragColor = color;
      }
    |]


viewHealthMeter : Float -> Vec2 -> Float -> Float -> List GameTwoDRender.Renderable
viewHealthMeter size pos amt max =
    let
        healthOffset =
            Vec2.vec2 0 -0.25

        outlineAmt =
            0.8

        ratio =
            -- Basics.max 0 (amt / max) -- can spot bugs faster without this
            amt / max
    in
    [ drawRect
        Color.black
        (pos |> Vec2.add healthOffset)
        (Vec2.scale size (Vec2.vec2 0.9 0.2))
    , drawRect
        Color.green
        (pos
            |> Vec2.add healthOffset
            |> Vec2.add (Vec2.vec2 (size * outlineAmt * -0.5 * (1 - ratio)) 0)
        )
        (Vec2.vec2 (outlineAmt * ratio) 0.1
            |> Vec2.scale size
        )
    ]


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


px : Float -> String
px length =
    String.fromFloat length ++ "px"


pct : Float -> String
pct length =
    String.fromFloat length ++ "%"


formatConfigFloat : Float -> String
formatConfigFloat val =
    Round.round 1 val


equippableStr : Equippable -> String
equippableStr equippable =
    case equippable of
        Gun ->
            "Gun"

        TurretSeed ->
            "Turret Seed"


vec2FromTurretPos : TilePos -> Vec2
vec2FromTurretPos tilePos =
    tilePos
        |> tilePosToFloats
        |> tupleToVec2
        |> Vec2.add (Vec2.vec2 0.5 0.5)


vec2FromCreep : Creep -> Vec2
vec2FromCreep creep =
    tilePosSub creep.nextPos creep.pos
        |> tilePosToFloats
        |> tupleToVec2
        |> Vec2.scale creep.progress
        |> Vec2.add (creep.pos |> tilePosToFloats |> tupleToVec2)
        |> Vec2.add creep.offset
        |> Vec2.add (Vec2.vec2 0.5 0.5)


tilePosSub : TilePos -> TilePos -> TilePos
tilePosSub ( a, b ) ( c, d ) =
    ( a - c, b - d )


tilePosToFloats : TilePos -> ( Float, Float )
tilePosToFloats ( col, row ) =
    ( toFloat col, toFloat row )
