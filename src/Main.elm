module Main exposing (main)

import AStar
import Browser
import Browser.Events
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


type HeroPos
    = IntFloat Int Float
    | IntInt Int Int
    | FloatInt Float Int
    | FloatFloat Float Float


type alias Hero =
    { pos : HeroPos
    , vel : Vec2
    }


heroPosToVec2 : HeroPos -> Vec2
heroPosToVec2 pos =
    case pos of
        IntFloat x y ->
            Vec2.vec2 (toFloat x) -y

        IntInt x y ->
            Vec2.vec2 (toFloat x) (toFloat -y)

        FloatInt x y ->
            Vec2.vec2 x (toFloat -y)

        FloatFloat x y ->
            Vec2.vec2 x -y


type alias EnemyTower =
    { pos : TilePos
    , timeSinceLastSpawn : Float
    }


type alias Bullet =
    { pos : Vec2
    , angle : Float
    , age : Float
    }


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
            { pos = FloatFloat 8 6
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
            { heroTowerPos = ( 2, 2 )
            }
      , enemyTowers =
            [ { pos = ( 2, 8 ), timeSinceLastSpawn = 0 }
            , { pos = ( 13, 1 ), timeSinceLastSpawn = 0 }
            ]
      }
    , Resources.loadTextures
        [ "images/grass.png"
        , "images/water.png"
        , "images/selectedTile.png"
        , "images/enemyTower.png"
        , "images/creep.png"
        , "images/tower.png"
        ]
        |> Cmd.map Resources
    )


cameraOnHero : Hero -> Camera
cameraOnHero hero =
    GameTwoDCamera.fixedArea
        (tilesToShowHeightwise * tilesToShowLengthwise)
        ( Vec2.getX (heroPosToVec2 hero.pos), Vec2.getY (heroPosToVec2 hero.pos) )


initMap : Map
initMap =
    """
11111111111111111111
10000000000000000001
10T00000000000000001
10000000000000000001
11111100000000000001
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
                            ( ( col, row )
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
        Tick delta ->
            let
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
                                        Vec2.add (heroPosToVec2 model.hero.pos) (Vec2.scale delta newVel)

                                    newestPos =
                                        snapAgainstWall model.map newVel model.hero.pos newPos
                                in
                                { hero
                                    | pos = newestPos
                                    , vel =
                                        case newestPos of
                                            FloatFloat _ _ ->
                                                newVel

                                            IntFloat _ _ ->
                                                Vec2.setX 0 newVel

                                            FloatInt _ _ ->
                                                Vec2.setY 0 newVel

                                            IntInt _ _ ->
                                                Vec2.vec2 0 0
                                }
                           )
                , bullets =
                    (if model.isMouseDown then
                        makeBullet (heroPosToVec2 model.hero.pos) (mousePosToGamePos model) :: model.bullets

                     else
                        model.bullets
                    )
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


snapAgainstWall : Map -> Vec2 -> HeroPos -> Vec2 -> HeroPos
snapAgainstWall map vel heroPos nextPos =
    -- first, get the tiles it's got to go to
    -- try vert movement first
    case heroPos of
        FloatFloat x y ->
            -- just floating around? lets see if it crossed a line and hit anything
            let
                ( heroTopLeftCornerFloatX, heroTopLeftCornerFloatY ) =
                    ( x - 0.5, y - 0.5 )

                ( nextHeroTopLeftCornerFloatX, nextHeroTopLeftCornerFloatY ) =
                    ( Vec2.getX nextPos - 0.5, Vec2.getY nextPos - 0.5 )

                col =
                    floor heroTopLeftCornerFloatX + 1

                row =
                    floor -heroTopLeftCornerFloatY

                nextCol =
                    floor nextHeroTopLeftCornerFloatX + 1

                nextRow =
                    floor -nextHeroTopLeftCornerFloatY

                colDiff =
                    nextCol - col

                rowDiff =
                    nextRow + row

                _ =
                    if colDiff == 1 then
                        Debug.log "crossingRight" ""

                    else if colDiff == -1 then
                        Debug.log "crossingLeft" ""

                    else
                        ""

                _ =
                    if rowDiff == 1 then
                        Debug.log "crossingBot" ""

                    else if rowDiff == -1 then
                        Debug.log "crossingTop" ""

                    else
                        ""
            in
            FloatFloat (Vec2.getX nextPos) -(Vec2.getY nextPos)

        _ ->
            FloatFloat 4.5 -3.5


snapAgainstWall2 map vel pos nextPos =
    let
        -- all top left corner stuff
        ( heroTopLeftCornerFloatX, heroTopLeftCornerFloatY ) =
            ( Vec2.getX pos - 0.5, Vec2.getY pos - 0.5 )

        ( nextHeroTopLeftCornerFloatX, nextHeroTopLeftCornerFloatY ) =
            ( Vec2.getX nextPos - 0.5, Vec2.getY nextPos - 0.5 )

        col =
            floor heroTopLeftCornerFloatX + 1

        row =
            floor -heroTopLeftCornerFloatY + 1

        nextCol =
            floor nextHeroTopLeftCornerFloatX + 1

        nextRow =
            floor -nextHeroTopLeftCornerFloatY + 1

        isCrossingRight =
            col - nextCol == -1

        isCrossingLeft =
            col - nextCol == 1

        isCrossingTop =
            row - nextRow == 1

        isCrossingDown =
            row - nextRow == -1

        ( newX, newY ) =
            ( if
                (isCrossingRight || isCrossingLeft)
                    && ((isCrossingTop
                            && not
                                (List.all
                                    (isPassable map)
                                    [ ( col, nextRow )
                                    , ( nextCol, row )
                                    , ( nextCol, nextRow )
                                    ]
                                )
                        )
                            || (isCrossingDown
                                    && not
                                        (List.all (isPassable map)
                                            [ ( col, nextRow )
                                            , ( nextCol, row )
                                            , ( nextCol, nextRow )
                                            ]
                                        )
                               )
                            || not
                                (List.all (isPassable map)
                                    [ ( nextCol, row )
                                    , ( nextCol, row - 1 )
                                    ]
                                )
                       )
              then
                (col |> toFloat)
                    - 0.01
                    |> Debug.log "BLOCKED H"
                -- float fix

              else
                nextHeroTopLeftCornerFloatX
            , -- and the y
              if
                (isCrossingTop || isCrossingDown)
                    && ((isCrossingLeft
                            && not
                                (List.all (isPassable map)
                                    [ ( col, nextRow )
                                    , ( nextCol, row )
                                    , ( nextCol, nextRow )
                                    ]
                                )
                        )
                            || (isCrossingRight
                                    && not
                                        (List.all (isPassable map)
                                            [ ( col, nextRow )
                                            , ( nextCol, row )
                                            , ( nextCol, nextRow )
                                            ]
                                        )
                               )
                            || not
                                (List.all (isPassable map)
                                    [ ( col, nextRow )
                                    , ( col - 1, nextRow )
                                    ]
                                )
                       )
              then
                (-row |> toFloat)
                    + 0.01
                    |> Debug.log "BLOCKED V"
                -- float fix

              else
                nextHeroTopLeftCornerFloatY
            )
    in
    --( Vec2.vec2 (newX + 0.5) (newY + 0.5)
    ( FloatFloat (newX + 0.5) (newY + 0.5)
    , False
    , False
    )


isPassable : Map -> TilePos -> Bool
isPassable map pos =
    case Dict.get pos map of
        Just Water ->
            False

        --|> Debug.log "water!"
        Just Grass ->
            True

        Just Poop ->
            False

        --|> Debug.log "poop!"
        Just Tower ->
            False

        --|> Debug.log "tower!"
        Nothing ->
            False



--|> Debug.log "NOTHING!!!!!!!!!!!!"


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


makeBullet : Vec2 -> Vec2 -> Bullet
makeBullet heroPos aimPos =
    { pos = heroPos
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
                                    { position = ( toFloat col, toFloat -row )
                                    , size = ( 1, 1 )
                                    , texture = Resources.getTexture "images/grass.png" model.resources
                                    }

                            Water ->
                                GameTwoDRender.sprite
                                    { position = ( toFloat col, toFloat -row )
                                    , size = ( 1, 1 )
                                    , texture = Resources.getTexture "images/water.png" model.resources
                                    }

                            Tower ->
                                GameTwoDRender.sprite
                                    { position = ( toFloat col, toFloat -row )
                                    , size = ( 1, 1 )
                                    , texture = Resources.getTexture "images/tower.png" model.resources
                                    }

                            Poop ->
                                GameTwoDRender.sprite
                                    { position = ( toFloat col, toFloat -row )
                                    , size = ( 1, 1 )
                                    , texture = Nothing
                                    }
                    )

        hero =
            [ drawRect
                Color.black
                (heroPosToVec2 model.hero.pos)
                (Vec2.vec2 1 1)
            , drawRect
                Color.darkGray
                (heroPosToVec2 model.hero.pos)
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


tilePosSub : TilePos -> TilePos -> TilePos
tilePosSub ( a, b ) ( c, d ) =
    ( a - c, b - d )


tilePosToSpritePos : TilePos -> ( Float, Float )
tilePosToSpritePos ( col, row ) =
    ( toFloat col, toFloat -row )
