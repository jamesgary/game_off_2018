module Main exposing (main)

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
import Html.Events.Extra.Mouse as Mouse
import Json.Decode as Decode
import List.Extra
import Math.Vector2 as Vec2 exposing (Vec2)
import Set exposing (Set)


main =
    Browser.document
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type alias Flags =
    ()


type alias Model =
    { hero : Hero
    , bullets : List Bullet
    , keysPressed : Set Key
    , mousePos : Vec2
    , isMouseDown : Bool
    , resources : Resources
    , selectedTile : Maybe Pos
    , map : Map
    , enemyTowers : List EnemyTower
    , turrets : List Turret
    , creeps : List Creep
    , cache : Cache
    }


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
    { pos : TilePos
    , timeSinceLastFire : Float
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


type alias Pos =
    { x : Int, y : Int }


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


init : Flags -> ( Model, Cmd Msg )
init flags =
    let
        hero =
            { pos = Vec2.vec2 9 -3
            , vel = Vec2.vec2 0 0
            }
    in
    ( { hero = hero
      , bullets = []
      , keysPressed = Set.empty
      , mousePos = Vec2.vec2 0 0
      , isMouseDown = False
      , resources = Resources.init
      , selectedTile = Nothing
      , map = initMap
      , creeps = []
      , cache =
            { heroTowerPos = ( 2, -2 )
            }
      , enemyTowers =
            [ { pos = ( 2, -8 ), timeSinceLastSpawn = 0 }
            , { pos = ( 13, -1 ), timeSinceLastSpawn = 0 }
            ]
      , turrets =
            [ { pos = ( 8, -5 ), timeSinceLastFire = 0 }
            ]
      }
    , Resources.loadTextures
        [ "images/grass.png"
        , "images/water.png"
        , "images/selectedTile.png"
        , "images/enemyTower.png"
        , "images/turret.png"
        , "images/creep.png"
        , "images/tower.png"
        ]
        |> Cmd.map Resources
    )


cameraOnHero : Hero -> Camera
cameraOnHero hero =
    GameTwoDCamera.fixedArea
        (tilesToShowHeightwise * tilesToShowLengthwise)
        ( Vec2.getX hero.pos, Vec2.getY hero.pos )


initMap : Map
initMap =
    """
11111111111111111111
10000000000000000001
10T00010100000000001
11111110000000000001
11111100000000000001
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


playerAcc =
    2


playerMaxSpeed =
    0.005


bulletSpeed =
    0.018


creepSpeed =
    0.001


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


bulletMaxAge =
    1000


currentCameraPos : Model -> Vec2
currentCameraPos model =
    cameraOnHero model.hero
        |> GameTwoDCamera.getPosition
        |> tupleToVec2


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Tick d ->
            let
                delta =
                    -- set max frame at 0.25 sec
                    min d 500

                newEnemyTowersAndCreeps =
                    model.enemyTowers
                        |> List.map
                            (\enemyTower ->
                                if enemyTower.timeSinceLastSpawn + delta > 800 then
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
            ( { model
                | hero =
                    model.hero
                        |> (\hero ->
                                let
                                    newAcc =
                                        Vec2.scale playerAcc (heroDirInput model)

                                    newVelUncapped =
                                        Vec2.add model.hero.vel (Vec2.scale delta newAcc)

                                    percentBeyondCap =
                                        Vec2.length newVelUncapped / playerMaxSpeed

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
                                in
                                { hero
                                    | pos = newestPos
                                    , vel = newestVel
                                }
                           )
                , bullets =
                    List.concat
                        [ model.bullets
                        , if model.isMouseDown then
                            [ makeBullet PlayerBullet model.hero.pos (mousePosToGamePos model) ]

                          else
                            []
                        , model.turrets
                            |> List.map
                                (\turret ->
                                    model.creeps
                                        |> List.Extra.minimumBy (\closestCreep -> Vec2.distanceSquared (vec2FromCreep closestCreep) (vec2FromTurret turret))
                                        |> Maybe.andThen
                                            (\closestCreep ->
                                                if Vec2.distanceSquared (vec2FromCreep closestCreep) (vec2FromTurret turret) < 5 ^ 2 then
                                                    Just (makeBullet PlantBullet (vec2FromTurret turret) (vec2FromCreep closestCreep))

                                                else
                                                    Nothing
                                            )
                                )
                            |> List.filterMap identity
                        ]
                        |> List.map
                            (\bullet ->
                                { bullet
                                    | pos =
                                        Vec2.add
                                            (tupleToVec2 (fromPolar ( bulletSpeed * delta, bullet.angle )))
                                            bullet.pos
                                    , age = bullet.age + delta
                                }
                            )
                        |> List.filter (\bullet -> bullet.age < bulletMaxAge)
                , selectedTile = Just (mousePosToSelectedTile model)
                , enemyTowers = newEnemyTowers
                , creeps =
                    List.append newCreeps model.creeps
                        |> List.map
                            (\creep ->
                                let
                                    newProgress =
                                        if creep.diagonal then
                                            delta * creepSpeed + creep.progress

                                        else
                                            sqrt 2 * delta * creepSpeed + creep.progress

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
            , Cmd.none
            )

        KeyUp str ->
            ( { model | keysPressed = Set.remove str model.keysPressed }, Cmd.none )

        KeyDown str ->
            ( { model | keysPressed = Set.insert str model.keysPressed }, Cmd.none )

        MouseMove ( x, y ) ->
            let
                cameraPos =
                    currentCameraPos model

                mousePos =
                    Vec2.vec2 x y
            in
            ( { model
                | mousePos = mousePos
                , selectedTile = Just (mousePosToSelectedTile model)
              }
            , Cmd.none
            )

        MouseDown ->
            ( { model
                | isMouseDown = True
              }
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
        AStar.pythagoreanCost
        (possibleMoves model)
        origin
        destination
        |> Maybe.andThen List.head
        |> Maybe.withDefault origin


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


mousePosToGamePos : Model -> Vec2
mousePosToGamePos model =
    model.mousePos
        |> Vec2.toRecord
        |> (\{ x, y } ->
                { x = (x - (canvasWidth / 2)) / (canvasWidth / tilesToShowLengthwise)
                , y = (y - (canvasHeight / 2)) / (-canvasHeight / tilesToShowHeightwise)
                }
           )
        |> Vec2.fromRecord
        |> Vec2.add (currentCameraPos model)


mousePosToSelectedTile : Model -> Pos
mousePosToSelectedTile model =
    model
        |> mousePosToGamePos
        |> Vec2.toRecord
        |> (\{ x, y } ->
                { x = -0.5 + x |> round
                , y = -0.5 + y |> round
                }
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


canvasWidth =
    800


canvasHeight =
    600


tilesToShowLengthwise =
    20


tilesToShowHeightwise =
    tilesToShowLengthwise * (canvasHeight / canvasWidth)


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
                            { position = tilePosToSpritePos pos
                            , size = ( 1, 1 )
                            , texture = Resources.getTexture "images/enemyTower.png" model.resources
                            }
                    )

        turrets =
            model.turrets
                |> List.map
                    (\{ pos } ->
                        GameTwoDRender.sprite
                            { position = tilePosToSpritePos pos
                            , size = ( 1, 1 )
                            , texture = Resources.getTexture "images/turret.png" model.resources
                            }
                    )

        selectedTileOutline =
            case model.selectedTile of
                Just { x, y } ->
                    [ GameTwoDRender.spriteWithOptions
                        { position = ( toFloat x, toFloat y, 0 )
                        , size = ( 1, 1 )
                        , texture = Resources.getTexture "images/selectedTile.png" model.resources
                        , rotation = 0
                        , pivot = ( 0, 0 )
                        , tiling = ( 1, 1 )
                        }
                    ]

                Nothing ->
                    []

        creeps =
            model.creeps
                |> List.map
                    (\creep ->
                        GameTwoDRender.sprite
                            { position =
                                tilePosSub creep.nextPos creep.pos
                                    |> tilePosToSpritePos
                                    |> tupleToVec2
                                    |> Vec2.scale creep.progress
                                    |> Vec2.add (creep.pos |> tilePosToSpritePos |> tupleToVec2)
                                    |> vec2ToTuple
                            , size = ( 1, 1 )
                            , texture = Resources.getTexture "images/creep.png" model.resources
                            }
                    )
    in
    { title = "GAME"
    , body =
        [ Html.div
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
                , size = ( canvasWidth, canvasHeight )
                , camera = cameraOnHero model.hero
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
        ]
    }


vec2FromTurret : Turret -> Vec2
vec2FromTurret turret =
    turret.pos
        |> tilePosToSpritePos
        |> tupleToVec2
        |> Vec2.add (Vec2.vec2 0.5 0.5)


vec2FromCreep : Creep -> Vec2
vec2FromCreep creep =
    tilePosSub creep.nextPos creep.pos
        |> tilePosToSpritePos
        |> tupleToVec2
        |> Vec2.scale creep.progress
        |> Vec2.add (creep.pos |> tilePosToSpritePos |> tupleToVec2)
        |> Vec2.add (Vec2.vec2 0.5 0.5)


tilePosSub : TilePos -> TilePos -> TilePos
tilePosSub ( a, b ) ( c, d ) =
    ( a - c, b - d )


tilePosToSpritePos : TilePos -> ( Float, Float )
tilePosToSpritePos ( col, row ) =
    ( toFloat col, toFloat row )
