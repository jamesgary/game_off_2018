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
import Set exposing (Set)


type Msg
    = MouseMove ( Float, Float )
      --| MouseDown
      --| MouseUp
    | Tick Float


type alias Model =
    { map : Map
    , center : Vec2
    , hoveringTile : Maybe TilePos
    , tileSize : Float
    }


init : Session -> Model
init session =
    { map = initMap
    , center = Vec2.vec2 3 -3
    , hoveringTile = Nothing
    , tileSize = 32
    }


initMap : Map
initMap =
    """
1111111111111111111111111111111111111111111111111111
1000000000001100000000000110000000000011000000000001
1010100000001101010000000110101000000011010100000001
1000000000001100000000000110000000000011000000000001
1010101010101101010101010110101010101011010101010101
1000000000001100000000000110000000000011000000000001
1111111111111111111111111111111111111111111111111111
1111111111111111111111111111111111111111111111111111
1000000000001100000000000110000000000011000000000001
1010100000001101010000000110101000000011010100000001
1000000000001100000000000110000000000011000000000001
1010101010101101010101010110101010101011010101010101
1000000000001100000000000110000000000011000000000001
1111111111111111111111111111111111111111111111111111
1111111111111111111111111111111111111111111111111111
1000000000001100000000000110000000000011000000000001
1010100000001101010000000110101000000011010100000001
1000000000001100000000000110000000000011000000000001
1010101010101101010101010110101010101011010101010101
1000000000001100000000000110000000000011000000000001
1111111111111111111111111111111111111111111111111111
1111111111111111111111111111111111111111111111111111
1000000000001100000000000110000000000011000000000001
1010100000001101010000000110101000000011010100000001
1000000000001100000000000110000000000011000000000001
1010101010101101010101010110101010101011010101010101
1000000000001100000000000110000000000011000000000001
1111111111111111111111111111111111111111111111111111
1111111111111111111111111111111111111111111111111111
1000000000001100000000000110000000000011000000000001
1010100000001101010000000110101000000011010100000001
1000000000001100000000000110000000000011000000000001
1010101010101101010101010110101010101011010101010101
1000000000001100000000000110000000000011000000000001
1111111111111111111111111111111111111111111111111111
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


update : Msg -> Session -> Model -> Model
update msg session model =
    case msg of
        Tick delta ->
            { model
                | center =
                    Vec2.add
                        model.center
                        (Vec2.scale 0.2 (heroDirInput session.keysPressed))
            }

        MouseMove ( x, y ) ->
            let
                viewportWidth =
                    session.windowWidth

                viewportHeight =
                    session.windowHeight

                tilesAcross =
                    viewportWidth / model.tileSize

                tilesVert =
                    viewportHeight / model.tileSize
            in
            { model
                | hoveringTile =
                    GameTwoDCamera.viewportToGameCoordinates
                        (getCamera session model)
                        ( round session.windowWidth, round session.windowHeight )
                        (model.center
                            |> Vec2.add (Vec2.vec2 x y)
                            |> vec2ToTuple
                            |> Tuple.mapBoth round round
                        )
                        |> (\( xx, yy ) -> ( xx - 0.5, yy - 0.5 ))
                        |> Tuple.mapBoth round round
                        |> Just
            }


getCamera : Session -> Model -> GameTwoDCamera.Camera
getCamera session model =
    let
        viewportWidth =
            session.windowWidth

        viewportHeight =
            session.windowHeight

        tilesAcross =
            viewportWidth / model.tileSize

        tilesVert =
            viewportHeight / model.tileSize
    in
    GameTwoDCamera.fixedArea
        (tilesAcross * tilesVert)
        ( Vec2.getX model.center, Vec2.getY model.center )


heroDirInput : Set Key -> Vec2
heroDirInput keysPressed =
    { x =
        if
            Set.member "ArrowLeft" keysPressed
                || Set.member "a" keysPressed
        then
            -1

        else if
            Set.member "ArrowRight" keysPressed
                || Set.member "d" keysPressed
        then
            1

        else
            0
    , y =
        if
            Set.member "ArrowUp" keysPressed
                || Set.member "w" keysPressed
        then
            1

        else if
            Set.member "ArrowDown" keysPressed
                || Set.member "s" keysPressed
        then
            -1

        else
            0
    }
        |> Vec2.fromRecord


view : Session -> Model -> Html Msg
view session model =
    let
        viewportWidth =
            session.windowWidth

        viewportHeight =
            session.windowHeight

        tilesAcross =
            viewportWidth / model.tileSize

        tilesVert =
            viewportHeight / model.tileSize
    in
    Html.div []
        [ Html.div
            [ Html.Attributes.style "display" "inline-block"
            , Html.Attributes.style "position" "relative"
            , Html.Attributes.style "margin" "0"
            , Html.Attributes.style "font-size" "0"

            --, Mouse.onDown (\_ -> MouseDown)
            --, Mouse.onUp (\_ -> MouseUp)
            , Mouse.onMove (\event -> MouseMove event.offsetPos)
            ]
            [ GameTwoD.render
                { time = 0
                , size =
                    ( round viewportWidth
                    , round viewportHeight
                    )
                , camera =
                    GameTwoDCamera.fixedArea
                        (tilesAcross * tilesVert)
                        ( Vec2.getX model.center, Vec2.getY model.center )
                }
                (List.concat
                    [ drawMap model.center ( tilesAcross, tilesVert ) session model
                    , drawSelectedTileOutline session model
                    ]
                )
            ]
        ]


getGameCoordinates : GameTwoDCamera.Camera -> ( Int, Int ) -> ( Int, Int ) -> ( Float, Float )
getGameCoordinates camera ( elementWidth, elementHeight ) ( x, y ) =
    ( 1, 2 )


drawMap : Vec2 -> ( Float, Float ) -> Session -> Model -> List GameTwoDRender.Renderable
drawMap center ( numTilesLengthwise, numTilesHeightwise ) session model =
    let
        left =
            (Vec2.getX center
                - (0.5 * numTilesLengthwise)
                |> floor
            )
                - 1

        right =
            (Vec2.getX center
                + (0.5 * numTilesLengthwise)
                |> ceiling
            )
                + 1

        bot =
            (Vec2.getY center
                - (0.5 * numTilesHeightwise)
                |> floor
            )
                - 1

        top =
            (Vec2.getY center
                + (0.5 * numTilesHeightwise)
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


drawSelectedTileOutline : Session -> Model -> List GameTwoDRender.Renderable
drawSelectedTileOutline session model =
    case model.hoveringTile of
        Just ( x, y ) ->
            [ GameTwoDRender.spriteWithOptions
                { position = ( toFloat x, toFloat y, 0 )
                , size = ( 1, 1 )
                , texture = GameResources.getTexture "images/selectedTile.png" session.resources
                , rotation = 0
                , pivot = ( 0, 0 )
                , tiling = ( 1, 1 )
                }
            ]

        Nothing ->
            []
