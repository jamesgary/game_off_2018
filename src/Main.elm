module Main exposing (main)

import Browser exposing (Document, document)
import Color
import Game.TwoD as GameTwoD
import Game.TwoD.Camera as GameTwoDCamera
import Game.TwoD.Render as GameTwoDRender
import Html


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
    { title = "GAME"
    , body =
        [ Html.h1 [] [ Html.text "Game" ]
        , GameTwoD.render
            { time = 0
            , size = ( 400, 300 )
            , camera = GameTwoDCamera.fixedArea (16 * 9) ( 160, 90 )
            }
            [ GameTwoDRender.shape
                GameTwoDRender.circle
                { color = Color.lightBlue
                , position = ( 10, 10 )
                , size = ( 200, 100 )
                }
            ]
        ]
    }
