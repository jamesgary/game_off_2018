module MapEditor exposing (Model, Msg(..), init, update, view)

import Common exposing (..)
import Dict exposing (Dict)
import Game.Resources as GameResources exposing (Resources)
import Game.TwoD as GameTwoD
import Game.TwoD.Camera as GameTwoDCamera exposing (Camera)
import Game.TwoD.Render as GameTwoDRender
import Html exposing (Html)
import Html.Attributes
import Html.Events.Extra.Mouse as Mouse
import Math.Vector2 as Vec2 exposing (Vec2)


type Msg
    = MouseMove ( Float, Float )
    | MouseDown
    | MouseUp


type alias Model =
    { map : Map }


init : Session -> Model
init session =
    { map = initMap
    }


initMap : Map
initMap =
    """
1111111111111
1000000000001
1000000000001
1000000000001
1000000000001
1000000000001
1111111111111
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

                                _ ->
                                    Poop
                            )
                        )
            )
        |> List.concat
        |> Dict.fromList


update : Msg -> Model -> Model
update msg model =
    model


view : Session -> Model -> Html Msg
view session model =
    let
        center =
            Vec2.vec2 0 0
    in
    Html.div []
        [ Html.div
            [ Html.Attributes.style "border" "1px solid black"
            , Html.Attributes.style "display" "inline-block"
            , Html.Attributes.style "margin" "20px"
            , Html.Attributes.style "font-size" "0"
            , Html.Attributes.style "position" "relative"
            , Mouse.onDown (\_ -> MouseDown)
            , Mouse.onUp (\_ -> MouseUp)
            , Mouse.onMove (\event -> MouseMove event.offsetPos)
            ]
            [ GameTwoD.render
                { time = 0
                , size =
                    ( round (session.c.getFloat "canvasWidth")
                    , round (session.c.getFloat "canvasHeight")
                    )
                , camera =
                    GameTwoDCamera.fixedArea
                        (tilesToShowHeightwise session.c * session.c.getFloat "tilesToShowLengthwise")
                        ( Vec2.getX center, Vec2.getY center )
                }
                (drawMap session model)
            ]
        ]


drawMap : Session -> Model -> List GameTwoDRender.Renderable
drawMap session model =
    let
        center =
            Vec2.vec2 0 0

        left =
            (Vec2.getX center
                - (0.5 * session.c.getFloat "tilesToShowLengthwise")
                |> floor
            )
                - 1

        right =
            (Vec2.getX center
                + (0.5 * session.c.getFloat "tilesToShowLengthwise")
                |> ceiling
            )
                + 1

        bot =
            (Vec2.getY center
                - (0.5 * tilesToShowHeightwise session.c)
                |> floor
            )
                - 1

        top =
            (Vec2.getY center
                + (0.5 * tilesToShowHeightwise session.c)
                |> ceiling
            )
                + 1
    in
    List.range left right
        |> List.map
            (\x ->
                List.range bot top
                    |> List.map
                        (\y ->
                            case Dict.get ( x, y ) model.map of
                                Just Grass ->
                                    Just
                                        (GameTwoDRender.sprite
                                            { position = tilePosToFloats ( x, y )
                                            , size = ( 1, 1 )
                                            , texture = GameResources.getTexture "images/grass.png" session.resources
                                            }
                                        )

                                Just Water ->
                                    Just
                                        (GameTwoDRender.sprite
                                            { position = tilePosToFloats ( x, y )
                                            , size = ( 1, 1 )
                                            , texture = GameResources.getTexture "images/water.png" session.resources
                                            }
                                        )

                                Just Poop ->
                                    Just
                                        (GameTwoDRender.sprite
                                            { position = tilePosToFloats ( x, y )
                                            , size = ( 1, 1 )
                                            , texture = Nothing
                                            }
                                        )

                                Nothing ->
                                    Nothing
                        )
                    |> List.filterMap identity
            )
        |> List.concat
