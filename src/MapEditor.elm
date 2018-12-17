module MapEditor exposing (Effect(..), Model, Msg(..), init, update, view)

import Common exposing (..)
import Dict exposing (Dict)
import Dict.Extra
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
    | ChooseTile (Maybe Tile)
    | Tick Float
    | Zoom Wheel.Event
    | LoadMap String
    | SaveMap
    | PlayMap


type alias Model =
    { editingMap : SavedMap
    , center : Vec2
    , hoveringTile : Maybe TilePos
    , tileSize : Float
    , isMouseDown : Bool
    , currentTool : Tool
    , currentTile : Maybe Tile
    , zoomLevels : Zipper Float
    , maybeRectOrigin : Maybe TilePos
    }


zoomedTileSize : Model -> Float
zoomedTileSize model =
    model.tileSize * (1 / Zipper.current model.zoomLevels)


defaultZoomLevels : Zipper Float
defaultZoomLevels =
    [ 1 / 4
    , 1 / 2
    , 1
    , 2
    , 4
    , 8
    ]
        |> Zipper.fromList
        |> Zipper.withDefault 99
        |> Zipper.findFirst (\lvl -> lvl == 1)
        |> Zipper.withDefault 99


type Tool
    = PencilTool
    | RectTool
    | HeroTool
    | BaseTool
    | EnemyTowerTool
    | ClearTool


init : Session -> Model
init session =
    { editingMap =
        session.savedMaps
            |> List.head
            |> Maybe.withDefault initMap
    , center = Vec2.vec2 0 0
    , hoveringTile = Nothing
    , tileSize = 32
    , isMouseDown = False
    , currentTool = PencilTool
    , currentTile = Just Grass
    , zoomLevels = defaultZoomLevels
    , maybeRectOrigin = Nothing
    }


initMap : SavedMap
initMap =
    { name = "New Map"
    , map =
        """
1111
1101
1001
1111
"""
            |> mapFromAscii
    , hero = ( 1, 1 )
    , enemyTowers = Set.empty
    , base = ( 2, 2 )
    , size = ( 4, 4 )
    }


rectSprites : Model -> List Sprite
rectSprites model =
    case ( model.maybeRectOrigin, model.hoveringTile ) of
        ( Just ( x1, y1 ), Just ( x2, y2 ) ) ->
            List.range (min x1 x2) (max x1 x2)
                |> List.map
                    (\x ->
                        List.range (min y1 y2) (max y1 y2)
                            |> List.map
                                (\y ->
                                    { x = x |> toFloat
                                    , y = y |> toFloat
                                    , texture =
                                        case model.currentTile of
                                            Just tile ->
                                                tileToStr tile

                                            Nothing ->
                                                "x"
                                    }
                                )
                    )
                |> List.concat

        _ ->
            []


update : Msg -> Session -> Model -> ( Model, Session, List Effect )
update msg session model =
    case msg of
        Tick ms ->
            let
                delta =
                    ms / 1000

                newCenter =
                    Vec2.add
                        model.center
                        (Vec2.scale (delta * 20) (heroDirInput session.keysPressed))
            in
            ( { model
                | center = newCenter
              }
            , session
            , [ MoveCamera newCenter
              , DrawSprites (getSprites session model)
              ]
            )

        MouseMove ( x, y ) ->
            let
                hoveringTile =
                    ( x, y )
                        |> tupleToVec2
                        |> Vec2.add
                            -- camera offset
                            (model.center
                                |> Vec2.scale (zoomedTileSize model)
                                |> Vec2.add
                                    (Vec2.vec2
                                        (session.windowWidth * -0.5)
                                        (session.windowHeight * -0.5)
                                    )
                            )
                        |> Vec2.scale (1 / zoomedTileSize model)
                        |> vec2ToTuple
                        |> Tuple.mapBoth floor floor
                        |> Just

                editingMap =
                    case ( model.isMouseDown, model.hoveringTile ) of
                        ( True, Just tilePos ) ->
                            let
                                em =
                                    model.editingMap
                            in
                            case model.currentTool of
                                PencilTool ->
                                    { em
                                        | map =
                                            case model.currentTile of
                                                Just tile ->
                                                    Dict.insert
                                                        tilePos
                                                        tile
                                                        model.editingMap.map

                                                Nothing ->
                                                    Dict.remove
                                                        tilePos
                                                        model.editingMap.map
                                    }

                                ClearTool ->
                                    { em
                                        | enemyTowers =
                                            Set.remove tilePos model.editingMap.enemyTowers
                                    }

                                _ ->
                                    model.editingMap

                        _ ->
                            model.editingMap
            in
            ( { model
                | hoveringTile = hoveringTile
                , editingMap = editingMap
              }
            , session
            , []
            )

        MouseDown ->
            ( { model
                | isMouseDown = True
                , maybeRectOrigin =
                    case model.currentTool of
                        PencilTool ->
                            Nothing

                        RectTool ->
                            model.hoveringTile

                        _ ->
                            Nothing
                , editingMap =
                    case model.hoveringTile of
                        Just tilePos ->
                            let
                                em =
                                    model.editingMap
                            in
                            case model.currentTool of
                                ClearTool ->
                                    { em
                                        | enemyTowers =
                                            Set.remove tilePos model.editingMap.enemyTowers
                                    }

                                _ ->
                                    model.editingMap

                        Nothing ->
                            model.editingMap
              }
                |> applyPencil session
            , session
            , []
            )

        MouseUp ->
            ( applyRect session model
                |> (\m ->
                        let
                            editingMap =
                                m.editingMap
                        in
                        { m
                            | isMouseDown = False
                            , maybeRectOrigin = Nothing
                            , editingMap =
                                { editingMap
                                    | hero =
                                        case ( m.currentTool, m.hoveringTile ) of
                                            ( HeroTool, Just tilePos ) ->
                                                tilePos

                                            _ ->
                                                m.editingMap.hero
                                    , base =
                                        case ( m.currentTool, m.hoveringTile ) of
                                            ( BaseTool, Just tilePos ) ->
                                                tilePos

                                            _ ->
                                                m.editingMap.base
                                    , enemyTowers =
                                        case ( m.currentTool, m.hoveringTile ) of
                                            ( EnemyTowerTool, Just tilePos ) ->
                                                Set.insert tilePos m.editingMap.enemyTowers

                                            _ ->
                                                m.editingMap.enemyTowers
                                }
                        }
                   )
            , session
            , []
            )

        ChooseTool tool ->
            ( { model | currentTool = tool }
            , session
            , []
            )

        ChooseTile tile ->
            ( { model | currentTile = tile }
            , session
            , []
            )

        Zoom wheelEvent ->
            let
                zoomLevels =
                    if wheelEvent.deltaY > 0 then
                        model.zoomLevels
                            |> Zipper.next
                            |> Maybe.withDefault model.zoomLevels

                    else if wheelEvent.deltaY < 0 then
                        model.zoomLevels
                            |> Zipper.previous
                            |> Maybe.withDefault model.zoomLevels

                    else
                        model.zoomLevels
            in
            ( { model | zoomLevels = zoomLevels }
            , session
            , [ ZoomEffect (Zipper.current zoomLevels) ]
            )

        LoadMap mapName ->
            ( case List.Extra.find (\map -> map.name == mapName) session.savedMaps of
                Just savedMap ->
                    { model | editingMap = savedMap }

                Nothing ->
                    --Debug.todo "bad saved map :("
                    model
            , session
            , []
            )

        SaveMap ->
            ( model
            , { session
                --TODO should move savedMaps to persistence, then use function?
                | savedMaps =
                    session.savedMaps
                        |> List.map
                            (\savedMap ->
                                if savedMap.name == model.editingMap.name then
                                    model.editingMap

                                else
                                    savedMap
                            )
              }
            , [ SaveMapEffect model.editingMap ]
            )

        PlayMap ->
            ( model
            , session
            , [ PlayMapEffect model.editingMap ]
            )


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
            -1

        else if
            Set.member "ArrowDown" keysPressed
                || Set.member "s" keysPressed
        then
            1

        else
            0
    }
        |> Vec2.fromRecord


getSprites : Session -> Model -> List SpriteLayer
getSprites session model =
    let
        mapLayer =
            { name = "map"
            , sprites =
                model.editingMap.map
                    |> Dict.toList
                    |> List.map
                        (\( ( x, y ), tile ) ->
                            { x = x |> toFloat
                            , y = y |> toFloat
                            , texture = tileToStr tile
                            }
                        )
            , graphics = []
            }

        rectLayer =
            { name = "rect"
            , sprites = rectSprites model
            , graphics = []
            }

        cursorLayer =
            { name = "cursor"
            , sprites =
                case model.hoveringTile of
                    Just ( x, y ) ->
                        [ { x = x |> toFloat
                          , y = y |> toFloat
                          , texture = "selectedTile"
                          }
                        ]

                    Nothing ->
                        []
            , graphics = []
            }

        heroLayer =
            { name = "hero"
            , sprites =
                case model.editingMap.hero of
                    ( x, y ) ->
                        [ { x = toFloat x + 0.25
                          , y = toFloat y + 0.25
                          , texture = "hero/sprites/down_01"
                          }
                        ]
            , graphics =
                let
                    ( healthX, healthY ) =
                        case model.editingMap.hero of
                            ( x, y ) ->
                                ( toFloat x + 0.5 - (width / 2)
                                , toFloat y + 1.2
                                )

                    width =
                        1.2

                    height =
                        0.2

                    outlineRatio =
                        0.05

                    offset =
                        outlineRatio * width
                in
                [ { x = healthX - offset
                  , y = healthY - offset
                  , width = width + (offset * 2)
                  , height = height + (offset * 2)
                  , bgColor = "#000000"
                  , lineStyleWidth = 0
                  , lineStyleColor = "#000000"
                  , lineStyleAlpha = 1
                  , alpha = 1
                  , shape = Rect
                  }
                , { x = healthX
                  , y = healthY
                  , width = width
                  , height = height
                  , bgColor = "#00ff00"
                  , lineStyleWidth = 0
                  , lineStyleColor = "#000000"
                  , lineStyleAlpha = 1
                  , alpha = 1
                  , shape = Rect
                  }
                ]
            }

        buildingsLayer =
            { name = "buildings"
            , sprites =
                [ case model.editingMap.base of
                    ( x, y ) ->
                        [ { x = x |> toFloat
                          , y = y |> toFloat
                          , texture = "tower"
                          }
                        ]
                , model.editingMap.enemyTowers
                    |> Set.toList
                    |> List.map
                        (\( etX, etY ) ->
                            { x = etX |> toFloat
                            , y = etY |> toFloat
                            , texture = "enemyTower"
                            }
                        )
                ]
                    |> List.concat
            , graphics = []
            }
    in
    [ mapLayer
    , rectLayer
    , buildingsLayer
    , heroLayer
    , cursorLayer
    ]
        |> List.indexedMap
            (\i layer ->
                { name = layer.name
                , sprites = layer.sprites
                , zOrder = i -- not used yet
                , graphics = layer.graphics
                }
            )


view : Session -> Model -> Html Msg
view session model =
    Html.div
        [ Html.Attributes.style "width" "100%"
        , Html.Attributes.style "height" "100%"
        ]
        [ drawGlass session model
        , drawSavedMaps session model
        , drawToolbox session model
        ]


drawGlass : Session -> Model -> Html Msg
drawGlass session model =
    Html.div
        [ Html.Attributes.style "display" "inline-block"
        , Html.Attributes.style "position" "relative"
        , Html.Attributes.style "margin" "0"
        , Html.Attributes.style "font-size" "0"
        , Html.Attributes.style "width" "100%"
        , Html.Attributes.style "height" "100%"
        , Html.Attributes.style "cursor" "default"
        , Mouse.onDown (\_ -> MouseDown)
        , Mouse.onUp (\_ -> MouseUp)
        , Mouse.onMove (\event -> MouseMove event.offsetPos)
        , Wheel.onWheel Zoom
        ]
        []


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
                            , Html.div [] <|
                                if isActive then
                                    [ Html.button
                                        [ Html.Events.onClick SaveMap
                                        , Html.Attributes.style "background" "#afa"
                                        , Html.Attributes.style "font-size" "16px"
                                        , Html.Attributes.style "cursor" "pointer"
                                        ]
                                        [ Html.text "Save" ]
                                    , Html.text " "
                                    , Html.button
                                        [ Html.Events.onClick PlayMap
                                        , Html.Attributes.style "background" "orange"
                                        , Html.Attributes.style "font-size" "16px"
                                        , Html.Attributes.style "cursor" "pointer"
                                        ]
                                        [ Html.text "Play" ]
                                    ]

                                else
                                    [ Html.button
                                        [ Html.Events.onClick (LoadMap savedMap.name)
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
        , Html.Attributes.style "top" "50px"
        , Html.Attributes.style "padding" "20px"
        , Html.Attributes.style "margin" "5px"
        , Html.Attributes.style "background" "#eee"
        , Html.Attributes.style "border" "2px outset white"
        ]
        [ toolBtn model.currentTool PencilTool "Pencil"
        , Html.br [] []
        , toolBtn model.currentTool RectTool "Rect"
        , Html.hr [] []
        , tileBtn model.currentTile (Just Water) "Water"
        , Html.br [] []
        , tileBtn model.currentTile (Just Grass) "Grass"
        , Html.br [] []
        , tileBtn model.currentTile Nothing "Erase Tile"
        , Html.hr [] []
        , Html.hr [] []
        , toolBtn model.currentTool HeroTool "Hero"
        , Html.br [] []
        , toolBtn model.currentTool BaseTool "Base"
        , Html.br [] []
        , toolBtn model.currentTool EnemyTowerTool "Enemy Tower"
        , Html.br [] []
        , toolBtn model.currentTool ClearTool "(clear)"
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


tileBtn : Maybe Tile -> Maybe Tile -> String -> Html Msg
tileBtn currentTile maybeTile label =
    Html.button
        [ Html.Events.onClick (ChooseTile maybeTile)
        , Html.Attributes.style "outline" "none"
        , if currentTile == maybeTile then
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
            { model
                | editingMap =
                    { editingMap
                        | map =
                            case model.currentTile of
                                Just tile ->
                                    Dict.insert tilePos tile model.editingMap.map

                                Nothing ->
                                    Dict.remove tilePos model.editingMap.map
                    }
            }

        Nothing ->
            model


applyRect : Session -> Model -> Model
applyRect session model =
    case ( model.maybeRectOrigin, model.hoveringTile ) of
        ( Just ( x1, y1 ), Just ( x2, y2 ) ) ->
            case model.currentTile of
                Just tile ->
                    List.range (min x1 x2) (max x1 x2)
                        |> List.map
                            (\x ->
                                List.range (min y1 y2) (max y1 y2)
                                    |> List.map
                                        (\y ->
                                            ( ( x, y ), tile )
                                        )
                            )
                        |> List.concat
                        |> Dict.fromList
                        |> (\newTileDict ->
                                let
                                    editingMap =
                                        model.editingMap
                                in
                                { model
                                    | editingMap =
                                        { editingMap
                                            | map =
                                                Dict.union newTileDict model.editingMap.map
                                        }
                                }
                           )

                Nothing ->
                    List.range (min x1 x2) (max x1 x2)
                        |> List.map
                            (\x ->
                                List.range (min y1 y2) (max y1 y2)
                                    |> List.map
                                        (\y ->
                                            ( x, y )
                                        )
                            )
                        |> List.concat
                        |> Set.fromList
                        |> (\tilesToRemove ->
                                let
                                    editingMap =
                                        model.editingMap
                                in
                                { model
                                    | editingMap =
                                        { editingMap
                                            | map =
                                                Dict.Extra.removeMany tilesToRemove editingMap.map
                                        }
                                }
                           )

        _ ->
            model


type
    Effect
    -- maybe should carry json?
    = SaveMapEffect SavedMap
    | PlayMapEffect SavedMap
    | MoveCamera Vec2
    | DrawSprites (List SpriteLayer)
    | ZoomEffect Float
