module Main exposing (main)

import Browser
import Browser.Events
import Color exposing (Color)
import Game.TwoD as GameTwoD
import Game.TwoD.Camera as GameTwoDCamera
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
    }


type alias Hero =
    { loc : Vec2
    }


type alias Bullet =
    { loc : Vec2
    }


type alias Key =
    String


type Msg
    = KeyDown String
    | KeyUp String
    | MouseDownAt ( Float, Float )
    | Tick Float


init : Flags -> ( Model, Cmd msg )
init flags =
    ( { hero =
            { loc = Vec2.fromRecord { x = -2, y = 0 }
            }
      , bullets =
            [ { loc = Vec2.fromRecord { x = 3, y = 3 }
              }
            ]
      , keysPressed = Set.empty
      }
    , Cmd.none
    )


vec2ToTuple : Vec2 -> ( Float, Float )
vec2ToTuple vec2 =
    vec2
        |> Vec2.toRecord
        |> (\{ x, y } -> ( x, y ))


speed =
    0.008


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


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Tick delta ->
            ( { model
                | hero =
                    model.hero
                        |> (\hero ->
                                { hero
                                    | loc =
                                        Vec2.add (Vec2.scale (speed * delta) (heroDirInput model)) hero.loc
                                }
                           )
              }
            , Cmd.none
            )

        KeyUp str ->
            ( { model | keysPressed = Set.remove str model.keysPressed }, Cmd.none )

        KeyDown str ->
            ( { model | keysPressed = Set.insert str model.keysPressed }, Cmd.none )

        MouseDownAt ( x, y ) ->
            ( { model
                | bullets =
                    { loc =
                        Vec2.fromRecord
                            { x = (x - (canvasWidth / 2)) / (canvasWidth / tilesToShowLengthwise)
                            , y = (y - (canvasHeight / 2)) / (-canvasHeight / tilesToShowHeightwise)
                            }
                    }
                        :: model.bullets
              }
            , Cmd.none
            )


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


view : Model -> Browser.Document Msg
view model =
    let
        background =
            GameTwoDRender.shape
                GameTwoDRender.rectangle
                { color = Color.lightGreen
                , position = ( -100, -100 )
                , size = ( 200, 200 )
                }

        hero =
            GameTwoDRender.shape
                GameTwoDRender.rectangle
                { color = Color.black
                , position = model.hero.loc |> vec2ToTuple
                , size = ( 1, 1 )
                }

        lake =
            GameTwoDRender.shape
                GameTwoDRender.rectangle
                { color = Color.lightBlue
                , position = ( 0, 0 )
                , size = ( 2, 4 )
                }
    in
    { title = "GAME"
    , body =
        [ Html.div
            [ Html.Attributes.style "border" "1px solid black"
            , Html.Attributes.style "display" "inline-block"
            , Html.Attributes.style "margin" "20px"
            , Html.Attributes.style "font-size" "0"
            , Mouse.onDown (\event -> MouseDownAt event.offsetPos)
            ]
            [ GameTwoD.render
                { time = 0
                , size = ( canvasWidth, canvasHeight )
                , camera =
                    GameTwoDCamera.fixedArea
                        (tilesToShowHeightwise * tilesToShowLengthwise)
                        ( 0, 0 )
                }
                (List.concat
                    [ [ background ]
                    , [ lake ]
                    , [ hero ]
                    , model.bullets
                        |> List.map (\bullet -> drawCircle Color.red bullet.loc 0.5)
                    ]
                )
            ]
        ]
    }
