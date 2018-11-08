module Main exposing (main)

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
    }


type alias Hero =
    { pos : Vec2
    , vel : Vec2
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


init : Flags -> ( Model, Cmd Msg )
init flags =
    let
        hero =
            { pos = Vec2.fromRecord { x = 8, y = -6 }
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
      }
    , Resources.loadTextures
        [ "images/grass.png"
        , "images/water.png"
        , "images/selectedTile.png"
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
10000000000000000001
10000000000000000001
11111100000000000001
11111100000000000001
10001110000000000001
10001110000000000001
10001110000000000001
10001110000000000001
10001111111111000001
10000011111111000001
10000011111111000001
10000011111111000001
10000011111111111111
10000000000001111111
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
    0.01


bulletSpeed =
    0.018


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
                                in
                                { hero
                                    | pos = newPos
                                    , vel = newVel
                                }
                           )
                , bullets =
                    (if model.isMouseDown then
                        makeBullet model.hero.pos model.mousePos :: model.bullets

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

                newMousePos =
                    { x = (x - (canvasWidth / 2)) / (canvasWidth / tilesToShowLengthwise)
                    , y = (y - (canvasHeight / 2)) / (-canvasHeight / tilesToShowHeightwise)
                    }
                        |> Vec2.fromRecord
                        |> Vec2.add cameraPos
            in
            ( { model
                | mousePos = newMousePos
                , selectedTile =
                    Just
                        { x = -0.5 + Vec2.getX newMousePos |> round
                        , y = -0.5 + Vec2.getY newMousePos |> round
                        }
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
                model.hero.pos
                (Vec2.vec2 1 1)
            , drawRect
                Color.darkGray
                model.hero.pos
                (Vec2.vec2 0.9 0.9)
            ]

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
                    , hero
                    , model.bullets
                        |> List.map (\bullet -> drawCircle Color.red bullet.pos 0.5)
                    , selectedTileOutline
                    ]
                )
            ]
        ]
    }
