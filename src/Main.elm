module Main exposing (main)

import Browser exposing (Document, document)
import Color
import Game.TwoD as GameTwoD
import Game.TwoD.Camera as GameTwoDCamera
import Game.TwoD.Render as GameTwoDRender
import Html
import Html.Attributes


main =
    document
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type alias Flags =
    ()


type alias Model =
    { hero : Hero
    }


type alias Hero =
    { loc : ( Float, Float )
    }


type Msg
    = NoOp


init : Flags -> ( Model, Cmd msg )
init flags =
    ( { hero = { loc = ( 0, 0 ) }
      }
    , Cmd.none
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


view : Model -> Document Msg
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
                , position = ( -5, 0 )
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
