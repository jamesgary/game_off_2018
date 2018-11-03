module Main exposing (main)

import Browser
import Browser.Events
import Color
import Game.TwoD as GameTwoD
import Game.TwoD.Camera as GameTwoDCamera
import Game.TwoD.Render as GameTwoDRender
import Html
import Html.Attributes
import Json.Decode as Decode
import Set exposing (Set)


main =
    Browser.document
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type alias Vec2 =
    { x : Float
    , y : Float
    }


type alias Flags =
    ()


type alias Model =
    { hero : Hero
    , keysPressed : Set Key
    }


type alias Hero =
    { loc : Vec2
    }


type alias Key =
    String


type Msg
    = KeyDown String
    | KeyUp String
    | Tick Float


init : Flags -> ( Model, Cmd msg )
init flags =
    ( { hero =
            { loc = { x = -2, y = 0 }
            }
      , keysPressed = Set.empty
      }
    , Cmd.none
    )


vec2ToTuple : Vec2 -> ( Float, Float )
vec2ToTuple { x, y } =
    ( x, y )


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
                                        { x =
                                            if
                                                Set.member "ArrowLeft" model.keysPressed
                                                    || Set.member "a" model.keysPressed
                                            then
                                                hero.loc.x - 1

                                            else if
                                                Set.member "ArrowRight" model.keysPressed
                                                    || Set.member "d" model.keysPressed
                                            then
                                                hero.loc.x + 1

                                            else
                                                hero.loc.x
                                        , y =
                                            if
                                                Set.member "ArrowUp" model.keysPressed
                                                    || Set.member "w" model.keysPressed
                                            then
                                                hero.loc.y + 1

                                            else if
                                                Set.member "ArrowDown" model.keysPressed
                                                    || Set.member "s" model.keysPressed
                                            then
                                                hero.loc.y - 1

                                            else
                                                hero.loc.y
                                        }
                                }
                           )
              }
            , Cmd.none
            )

        KeyUp str ->
            ( { model | keysPressed = Set.remove str model.keysPressed }, Cmd.none )

        KeyDown str ->
            ( { model | keysPressed = Set.insert str model.keysPressed }, Cmd.none )
                |> Debug.log str


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Browser.Events.onKeyDown (Decode.map KeyDown (Decode.field "key" Decode.string))
        , Browser.Events.onKeyUp (Decode.map KeyUp (Decode.field "key" Decode.string))
        , Browser.Events.onAnimationFrameDelta Tick
        ]


view : Model -> Browser.Document Msg
view model =
    let
        canvasWidth =
            400

        canvasHeight =
            300

        tilesToShowLengthwise =
            20

        tilesToShowHeightwise =
            tilesToShowLengthwise * (canvasHeight / canvasWidth)

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
    in
    { title = "GAME"
    , body =
        [ Html.div
            [ Html.Attributes.style "border" "1px solid black"
            , Html.Attributes.style "display" "inline-block"
            , Html.Attributes.style "margin" "20px"
            , Html.Attributes.style "font-size" "0"
            ]
            [ GameTwoD.render
                { time = 0
                , size = ( canvasWidth, canvasHeight )
                , camera =
                    GameTwoDCamera.fixedArea
                        (tilesToShowHeightwise * tilesToShowLengthwise)
                        ( 0, 0 )
                }
                [ background
                , GameTwoDRender.shape
                    GameTwoDRender.rectangle
                    { color = Color.lightBlue
                    , position = ( 0, 0 )
                    , size = ( 2, 4 )
                    }
                , hero
                ]
            ]
        ]
    }
