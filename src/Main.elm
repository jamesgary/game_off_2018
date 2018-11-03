module Main exposing (main)

import Browser exposing (Document, document)
import Html



--main :
--    { init : flags -> ( model, Cmd msg )
--    , view : model -> Document msg
--    , update : msg -> model -> ( model, Cmd msg )
--    , subscriptions : model -> Sub msg
--    }


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
    { foo : Int
    }


type Msg
    = NoOp


init : Flags -> ( Model, Cmd msg )
init flags =
    ( { foo = 0
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
    , body = [ Html.text "Game" ]
    }
