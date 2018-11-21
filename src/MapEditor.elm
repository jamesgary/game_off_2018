module MapEditor exposing (Model, Msg(..), init, update, view)

import Common exposing (..)
import Html exposing (Html)
import Html.Attributes


type Msg
    = NoOp


type alias Model =
    {}


init : Session -> Model
init session =
    {}


update : Msg -> Model -> Model
update msg model =
    model


view : Session -> Model -> Html Msg
view session model =
    Html.text "oh hai :)"
