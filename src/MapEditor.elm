module MapEditor exposing (Model, Msg(..), init, update, view)

import Common exposing (..)
import Dict exposing (Dict)
import Game.Resources as GameResources exposing (Resources)
import Game.TwoD as GameTwoD
import Game.TwoD.Camera as GameTwoDCamera exposing (Camera)
import Game.TwoD.Render as GameTwoDRender
import Html exposing (Html)
import Html.Attributes
import Html.Events
import Html.Events.Extra.Mouse as Mouse
import Html.Events.Extra.Wheel as Wheel
import List.Extra
import List.Zipper as Zipper exposing (Zipper)
import Math.Vector2 as Vec2 exposing (Vec2)
import Set exposing (Set)


type Msg
    = MouseMove ( Float, Float )
    | MouseDown
    | MouseUp
    | ChooseTool Tool
    | ChooseTile Tile
    | Tick Float
    | Zoom Wheel.Event
    | LoadMap String


type alias Model =
    { editingMap : SavedMap
    , center : Vec2
    , hoveringTile : Maybe TilePos
    , tileSize : Float
    , isMouseDown : Bool
    , currentTool : Tool
    , currentTile : Tile
    , zoomLevels : Zipper Float
    , maybeRectOrigin : Maybe TilePos
    }


zoomedTileSize : Model -> Float
zoomedTileSize model =
    model.tileSize * Zipper.current model.zoomLevels


defaultZoomLevels : Zipper Float
defaultZoomLevels =
    [ 1 / 4, 1 / 2, 1, 2 ]
        |> Zipper.fromList
        |> Zipper.withDefault 99
        |> Zipper.findFirst (\lvl -> lvl == 1)
        |> Zipper.withDefault 99


type Tool
    = Pencil
    | Rect


init : Session -> Model
init session =
    { editingMap =
        session.savedMaps
            |> List.head
            |> Maybe.withDefault initMap
    , center = Vec2.vec2 3 -3
    , hoveringTile = Nothing
    , tileSize = 32
    , isMouseDown = False
    , currentTool = Pencil
    , currentTile = Grass
    , zoomLevels = defaultZoomLevels
    , maybeRectOrigin = Nothing
    }


initMap : SavedMap
initMap =
    { name = "New Map"
    , map =
        """
1111
1001
1001
1111
"""
            |> mapFromAscii
    , hero = ( 1, 1 )
    , enemyTowers = []
    , base = ( 2, 2 )
    , size = ( 4, 4 )
    }


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
                hoveringTile =
                    GameTwoDCamera.viewportToGameCoordinates
                        (getCamera session model)
                        ( round session.windowWidth, round session.windowHeight )
                        ( round x, round y )
                        |> (\( xx, yy ) -> ( round <| xx - 0.5, round <| yy - 0.5 ))
                        |> Just

                editingMap =
                    case ( model.isMouseDown, model.hoveringTile ) of
                        ( True, Just tilePos ) ->
                            case model.currentTool of
                                Pencil ->
                                    let
                                        em =
                                            model.editingMap
                                    in
                                    { em | map = Dict.insert tilePos model.currentTile model.editingMap.map }

                                Rect ->
                                    model.editingMap

                        _ ->
                            model.editingMap
            in
            { model
                | hoveringTile = hoveringTile
                , editingMap = editingMap
            }

        MouseDown ->
            { model
                | isMouseDown = True
                , maybeRectOrigin =
                    case model.currentTool of
                        Pencil ->
                            Nothing

                        Rect ->
                            model.hoveringTile
            }
                |> applyPencil session

        MouseUp ->
            applyRect session model
                |> (\m ->
                        { m
                            | isMouseDown = False
                            , maybeRectOrigin = Nothing
                        }
                   )

        ChooseTool tool ->
            { model | currentTool = tool }

        ChooseTile tile ->
            { model | currentTile = tile }

        Zoom wheelEvent ->
            if wheelEvent.deltaY < 0 then
                { model
                    | zoomLevels =
                        model.zoomLevels
                            |> Zipper.next
                            |> Maybe.withDefault model.zoomLevels
                }

            else if wheelEvent.deltaY > 0 then
                { model
                    | zoomLevels =
                        model.zoomLevels
                            |> Zipper.previous
                            |> Maybe.withDefault model.zoomLevels
                }

            else
                model

        LoadMap mapName ->
            case List.Extra.find (\map -> map.name == mapName) session.savedMaps of
                Just savedMap ->
                    { model | editingMap = savedMap }

                Nothing ->
                    Debug.todo "bad saved map :("


getCamera : Session -> Model -> GameTwoDCamera.Camera
getCamera session model =
    let
        tilesAcross =
            session.windowWidth / zoomedTileSize model

        tilesVert =
            session.windowHeight / zoomedTileSize model
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
    Html.div []
        [ Html.div
            [ Html.Attributes.style "display" "inline-block"
            , Html.Attributes.style "position" "relative"
            , Html.Attributes.style "margin" "0"
            , Html.Attributes.style "font-size" "0"
            , Mouse.onDown (\_ -> MouseDown)
            , Mouse.onUp (\_ -> MouseUp)
            , Mouse.onMove (\event -> MouseMove event.offsetPos)
            , Wheel.onWheel Zoom
            ]
            [ GameTwoD.render
                { time = 0
                , size =
                    ( round session.windowWidth
                    , round session.windowHeight
                    )
                , camera = getCamera session model
                }
                (List.concat
                    [ drawMap model.center session model
                    , drawRect session model
                    , drawSelectedTileOutline session model
                    ]
                )
            ]
        , drawSavedMaps session model
        , drawToolbox session model
        ]


drawSavedMaps : Session -> Model -> Html Msg
drawSavedMaps session model =
    Html.div
        [ Html.Attributes.style "font-size" "16px"
        , Html.Attributes.style "position" "fixed"
        , Html.Attributes.style "left" "0"
        , Html.Attributes.style "top" "0"
        , Html.Attributes.style "padding" "10px"
        , Html.Attributes.style "margin" "5px"
        , Html.Attributes.style "background" "#eee"
        , Html.Attributes.style "border" "2px outset white"
        , Html.Attributes.style "font-family" "sans-serif"
        ]
        [ Html.div
            [ Html.Attributes.style "display" "flex"
            , Html.Attributes.style "flex-direction" "column"
            , Html.Attributes.style "justify-content" "space-between"
            , Html.Attributes.style "align-items" "stretch"
            ]
            (session.savedMaps
                |> List.map
                    (\savedMap ->
                        let
                            isActive =
                                model.editingMap.name == savedMap.name
                        in
                        Html.div
                            (List.append
                                [ Html.Attributes.style "display" "flex"
                                , Html.Attributes.style "border" "2px solid #ccc"
                                , Html.Attributes.style "margin" "2px"
                                , Html.Attributes.style "padding" "8px 15px"
                                , Html.Attributes.style "align-items" "stretch"
                                , Html.Attributes.style "justify-content" "space-between"
                                ]
                                (if isActive then
                                    [ Html.Attributes.style "background" "#07f"
                                    , Html.Attributes.style "color" "white"
                                    ]

                                 else
                                    [ Html.Attributes.style "background" "#ddd" ]
                                )
                            )
                            [ Html.div
                                [ Html.Attributes.style "margin-right" "10px"
                                ]
                                [ Html.text savedMap.name ]
                            , Html.div []
                                [ Html.button
                                    [ Html.Events.onClick (LoadMap savedMap.name)
                                    , Html.Attributes.style "font-size" "16px"
                                    , Html.Attributes.style "font-size" "16px"
                                    , Html.Attributes.style "cursor" "pointer"
                                    ]
                                    [ Html.text "Load" ]
                                ]
                            ]
                    )
            )
        ]


drawToolbox : Session -> Model -> Html Msg
drawToolbox session model =
    Html.div
        [ Html.Attributes.style "font-size" "16px"
        , Html.Attributes.style "position" "fixed"
        , Html.Attributes.style "right" "0"
        , Html.Attributes.style "top" "0"
        , Html.Attributes.style "padding" "20px"
        , Html.Attributes.style "margin" "5px"
        , Html.Attributes.style "background" "#eee"
        , Html.Attributes.style "border" "2px outset white"
        ]
        [ toolBtn model.currentTool Pencil "Pencil"
        , Html.br [] []
        , toolBtn model.currentTool Rect "Rect"
        , Html.hr [] []
        , tileBtn model.currentTile Water "Water"
        , Html.br [] []
        , tileBtn model.currentTile Grass "Grass"
        ]


toolBtn : Tool -> Tool -> String -> Html Msg
toolBtn currentTool tool label =
    Html.button
        [ Html.Events.onClick (ChooseTool tool)
        , Html.Attributes.style "outline" "none"
        , if currentTool == tool then
            Html.Attributes.style "background" "#ccc"

          else
            Html.Attributes.style "background" "#fff"
        ]
        [ Html.text label ]


tileBtn : Tile -> Tile -> String -> Html Msg
tileBtn currentTile tile label =
    Html.button
        [ Html.Events.onClick (ChooseTile tile)
        , Html.Attributes.style "outline" "none"
        , if currentTile == tile then
            Html.Attributes.style "background" "#ccc"

          else
            Html.Attributes.style "background" "#fff"
        ]
        [ Html.text label ]


applyPencil : Session -> Model -> Model
applyPencil session model =
    case model.hoveringTile of
        Just tilePos ->
            let
                editingMap =
                    model.editingMap
            in
            { model | editingMap = { editingMap | map = Dict.insert tilePos model.currentTile model.editingMap.map } }

        Nothing ->
            model


applyRect : Session -> Model -> Model
applyRect session model =
    case ( model.maybeRectOrigin, model.hoveringTile ) of
        ( Just ( x1, y1 ), Just ( x2, y2 ) ) ->
            List.range (min x1 x2) (max x1 x2)
                |> List.map
                    (\x ->
                        List.range (min y1 y2) (max y1 y2)
                            |> List.map
                                (\y ->
                                    ( ( x, y ), model.currentTile )
                                )
                    )
                |> List.concat
                |> Dict.fromList
                |> (\newTileDict ->
                        let
                            editingMap =
                                model.editingMap
                        in
                        { model | editingMap = { editingMap | map = Dict.union newTileDict model.editingMap.map } }
                   )

        _ ->
            model


drawRect : Session -> Model -> List GameTwoDRender.Renderable
drawRect session model =
    case ( model.maybeRectOrigin, model.hoveringTile ) of
        ( Just ( x1, y1 ), Just ( x2, y2 ) ) ->
            List.range (min x1 x2) (max x1 x2)
                |> List.map
                    (\x ->
                        List.range (min y1 y2) (max y1 y2)
                            |> List.map
                                (\y ->
                                    drawTile session ( x, y ) model.currentTile
                                )
                    )
                |> List.concat

        _ ->
            []


drawTile : Session -> TilePos -> Tile -> GameTwoDRender.Renderable
drawTile session tilePos tile =
    case tile of
        Grass ->
            GameTwoDRender.sprite
                { position = tilePosToFloats tilePos
                , size = ( 1, 1 )
                , texture = GameResources.getTexture "images/grass.png" session.resources
                }

        Water ->
            GameTwoDRender.sprite
                { position = tilePosToFloats tilePos
                , size = ( 1, 1 )
                , texture = GameResources.getTexture "images/water.png" session.resources
                }

        Poop ->
            GameTwoDRender.sprite
                { position = tilePosToFloats tilePos
                , size = ( 1, 1 )
                , texture = Nothing
                }


drawMap : Vec2 -> Session -> Model -> List GameTwoDRender.Renderable
drawMap center session model =
    let
        tilesAcross =
            session.windowWidth / zoomedTileSize model

        tilesVert =
            session.windowHeight / zoomedTileSize model

        left =
            (Vec2.getX center
                - (0.5 * tilesAcross)
                |> floor
            )
                - 1

        right =
            (Vec2.getX center
                + (0.5 * tilesAcross)
                |> ceiling
            )
                + 1

        bot =
            (Vec2.getY center
                - (0.5 * tilesVert)
                |> floor
            )
                - 1

        top =
            (Vec2.getY center
                + (0.5 * tilesVert)
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
                            case Dict.get ( x, y ) model.editingMap.map of
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
            [ GameTwoDRender.sprite
                { position = ( toFloat x, toFloat y )
                , size = ( 1, 1 )
                , texture = GameResources.getTexture "images/selectedTile.png" session.resources
                }
            ]

        Nothing ->
            []
