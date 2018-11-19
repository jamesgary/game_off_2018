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
import Html
import Html.Attributes
import Html.Events
import Html.Events.Extra.Mouse as Mouse
import Json.Decode as Decode
import List.Extra
import Math.Vector2 as Vec2 exposing (Vec2)
import Round
import Set exposing (Set)


port saveFlags : Flags -> Cmd msg


main =
    Browser.document
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type alias Flags =
    { isConfigOpen : Bool
    , config : List ( String, ConfigVal )
    }


type alias Model =
    { hero : Hero
    , bullets : List Bullet
    , keysPressed : Set Key
    , mousePos : Vec2
    , isMouseDown : Bool
    , resources : Resources
    , map : Map
    , enemyTowers : List EnemyTower
    , turrets : Dict TilePos Turret
    , creeps : List Creep
    , timeSinceLastFire : Float
    , cache : Cache
    , equipped : Equippable
    , config : Dict String ConfigVal
    , c : Config
    , isConfigOpen : Bool
    }


type alias Config =
    { getFloat : String -> Float
    }


type Equippable
    = Gun
    | TurretSeed


type alias Creep =
    { pos : TilePos
    , nextPos : TilePos
    , progress : Float
    , diagonal : Bool

    --, offset : Vec2
    }


type alias Cache =
    { heroTowerPos : TilePos
    }


type alias HeroPos =
    Vec2


type alias Hero =
    { pos : HeroPos
    , vel : Vec2
    }


type alias EnemyTower =
    { pos : TilePos
    , timeSinceLastSpawn : Float
    }


type alias Turret =
    { timeSinceLastFire : Float
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
    | Tower
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


makeC : Dict String ConfigVal -> Config
makeC config =
    { getFloat =
        \n ->
            config
                |> Dict.get n
                |> Maybe.map .val
                |> Maybe.withDefault -1
    }


init : Flags -> ( Model, Cmd Msg )
init flags =
    let
        ( config, isConfigOpen ) =
            ( Dict.fromList flags.config
            , flags.isConfigOpen
            )
    in
    ( { hero =
            { pos = Vec2.vec2 9 -3
            , vel = Vec2.vec2 0 0
            }
      , bullets = []
      , keysPressed = Set.empty
      , mousePos = Vec2.vec2 0 0
      , isMouseDown = False
      , resources = Resources.init
      , map = initMap
      , creeps = []
      , cache =
            { heroTowerPos = ( 2, -2 )
            }
      , enemyTowers =
            [ { pos = ( 2, -8 ), timeSinceLastSpawn = 0 }
            , { pos = ( 13, -4 ), timeSinceLastSpawn = 0 }
            ]
      , turrets =
            [ ( ( 8, -5 ), { timeSinceLastFire = 0 } )
            ]
                |> Dict.fromList
                |> always Dict.empty
      , timeSinceLastFire = 0
      , equipped = Gun
      , config = config
      , isConfigOpen = isConfigOpen
      , c = makeC config
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
10T00010000000000001
11111110000000000001
11111100000001000001
10001110000000000001
10001110000000000001
10001110000000000001
10001110000000000001
10001111111110000001
10000011111111000001
10000011111111000001
10000011111111000001
10000001111111001111
10000000000000000111
10000000000000000001
10000000000000000001
10000000000000000001
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

                                'T' ->
                                    Tower

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
                |> moveHero delta
                |> makeTurretBullets delta
                |> makePlayerBullets delta
                |> moveBullets delta
                |> spawnCreeps delta
                |> moveCreeps delta
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
                                            { m | turrets = Dict.insert tilePos { timeSinceLastFire = 0 } m.turrets }

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
            ( newModel, saveFlags (modelToFlags newModel) )

        ToggleConfig shouldOpen ->
            let
                newModel =
                    { model | isConfigOpen = shouldOpen }
            in
            ( newModel, saveFlags (modelToFlags newModel) )


modelToFlags : Model -> Flags
modelToFlags model =
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
    if model.isMouseDown && model.equipped == Gun then
        if model.timeSinceLastFire > 0.15 then
            { model
                | timeSinceLastFire = 0
                , bullets = makeBullet PlayerBullet model.hero.pos model.mousePos :: model.bullets
            }

        else
            { model | timeSinceLastFire = model.timeSinceLastFire + delta }

    else
        { model | timeSinceLastFire = model.timeSinceLastFire + delta }


makeTurretBullets : Float -> Model -> Model
makeTurretBullets delta model =
    let
        ( newBullets, newTurrets ) =
            model.turrets
                |> Dict.foldl
                    (\pos turret ( bullets, turrets ) ->
                        let
                            shotBullet =
                                if turret.timeSinceLastFire > 0.5 then
                                    model.creeps
                                        |> List.Extra.minimumBy (\closestCreep -> Vec2.distanceSquared (vec2FromCreep closestCreep) (vec2FromTurretPos pos))
                                        |> Maybe.andThen
                                            (\closestCreep ->
                                                if Vec2.distanceSquared (vec2FromCreep closestCreep) (vec2FromTurretPos pos) < 5 ^ 2 then
                                                    Just (makeBullet PlantBullet (vec2FromTurretPos pos) (vec2FromCreep closestCreep))

                                                else
                                                    Nothing
                                            )

                                else
                                    Nothing
                        in
                        case shotBullet of
                            Just bullet ->
                                ( bullet :: bullets, Dict.insert pos { turret | timeSinceLastFire = 0 } turrets )

                            Nothing ->
                                ( bullets, Dict.insert pos { turret | timeSinceLastFire = turret.timeSinceLastFire + delta } turrets )
                    )
                    ( model.bullets, Dict.empty )
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
                                    ( creep.nextPos, findNextTileTowards model creep.nextPos model.cache.heroTowerPos, newProgress - 1 )

                                else
                                    ( creep.pos, creep.nextPos, newProgress )
                        in
                        { creep
                            | pos = pos
                            , nextPos = nextPos
                            , progress = freshProgress
                            , diagonal = isDiagonal pos nextPos
                        }
                    )
    }


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
        newEnemyTowersAndCreeps =
            model.enemyTowers
                |> List.map
                    (\enemyTower ->
                        if enemyTower.timeSinceLastSpawn + delta > 1.8 then
                            let
                                nextPos =
                                    findNextTileTowards model enemyTower.pos model.cache.heroTowerPos
                            in
                            ( { enemyTower | timeSinceLastSpawn = 0 }
                            , [ { pos = enemyTower.pos
                                , nextPos = nextPos
                                , progress = 0
                                , diagonal = isDiagonal enemyTower.pos nextPos
                                }
                              ]
                            )

                        else
                            ( { enemyTower | timeSinceLastSpawn = enemyTower.timeSinceLastSpawn + delta }
                            , []
                            )
                    )

        newEnemyTowers =
            newEnemyTowersAndCreeps
                |> List.map Tuple.first

        newCreeps =
            newEnemyTowersAndCreeps
                |> List.map Tuple.second
                |> List.concat
    in
    { model
        | enemyTowers = newEnemyTowers
        , creeps = List.append newCreeps model.creeps
    }


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

        Tower ->
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

                    Tower ->
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
        , Browser.Events.onAnimationFrameDelta Tick
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


view : Model -> Browser.Document Msg
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

                            Tower ->
                                GameTwoDRender.sprite
                                    { position = ( toFloat col, toFloat row )
                                    , size = ( 1, 1 )
                                    , texture = Resources.getTexture "images/tower.png" model.resources
                                    }

                            Poop ->
                                GameTwoDRender.sprite
                                    { position = ( toFloat col, toFloat row )
                                    , size = ( 1, 1 )
                                    , texture = Nothing
                                    }
                    )

        hero =
            [ drawRect
                Color.black
                model.hero.pos
                (Vec2.vec2 1 1)
            , drawRect
                Color.darkGray
                model.hero.pos
                (Vec2.vec2 0.9 0.9)
            ]

        enemyTowers =
            model.enemyTowers
                |> List.map
                    (\{ pos } ->
                        GameTwoDRender.sprite
                            { position = tilePosToFloats pos
                            , size = ( 1, 1 )
                            , texture = Resources.getTexture "images/enemyTower.png" model.resources
                            }
                    )

        turrets =
            model.turrets
                |> Dict.map
                    (\pos turret ->
                        GameTwoDRender.sprite
                            { position = tilePosToFloats pos
                            , size = ( 1, 1 )
                            , texture = Resources.getTexture "images/turret.png" model.resources
                            }
                    )
                |> Dict.values

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
            model.creeps
                |> List.map
                    (\creep ->
                        GameTwoDRender.sprite
                            { position =
                                tilePosSub creep.nextPos creep.pos
                                    |> tilePosToFloats
                                    |> tupleToVec2
                                    |> Vec2.scale creep.progress
                                    |> Vec2.add (creep.pos |> tilePosToFloats |> tupleToVec2)
                                    |> vec2ToTuple
                            , size = ( 1, 1 )
                            , texture = Resources.getTexture "images/creep.png" model.resources
                            }
                    )
    in
    { title = "GAME"
    , body =
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
            , Html.br [] []
            , Html.span [] [ Html.text "Water: " ]
            , Html.span [] [ Html.text "60" ]
            , Html.span [] [ Html.text "/" ]
            , Html.span [] [ Html.text "100" ]
            ]
        , Html.div
            [ Html.Attributes.style "border" "1px solid black"
            , Html.Attributes.style "display" "inline-block"
            , Html.Attributes.style "margin" "20px"
            , Html.Attributes.style "font-size" "0"
            , Mouse.onDown (\_ -> MouseDown)
            , Mouse.onUp (\_ -> MouseUp)
            , Mouse.onMove (\event -> MouseMove event.offsetPos)
            ]
            [ GameTwoD.render
                { time = 0
                , size = ( round (model.c.getFloat "canvasWidth"), round (model.c.getFloat "canvasHeight") )
                , camera = cameraOnHero model
                }
                (List.concat
                    [ map
                    , enemyTowers
                    , turrets
                    , hero
                    , creeps
                    , model.bullets
                        |> List.map (\bullet -> drawCircle Color.red bullet.pos 0.5)
                    , selectedTileOutline
                    ]
                )
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
                    Html.a
                        [ Html.Events.onClick (ToggleConfig False)
                        , Html.Attributes.style "text-align" "right"
                        , Html.Attributes.style "display" "inline-block"
                        , Html.Attributes.style "width" "100%"
                        ]
                        [ Html.text "Collapse Config" ]
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
    }


formatConfigFloat : Float -> String
formatConfigFloat val =
    Round.round 2 val


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
        |> Vec2.add (Vec2.vec2 0.5 0.5)


tilePosSub : TilePos -> TilePos -> TilePos
tilePosSub ( a, b ) ( c, d ) =
    ( a - c, b - d )


tilePosToFloats : TilePos -> ( Float, Float )
tilePosToFloats ( col, row ) =
    ( toFloat col, toFloat row )
