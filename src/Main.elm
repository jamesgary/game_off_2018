port module Main exposing (main)

import Browser
import Browser.Events
import Common exposing (..)
import Dict exposing (Dict)
import Game
import Html exposing (Html)
import Html.Attributes
import Html.Events
import Html.Events.Extra.Mouse as Mouse
import Json.Decode
import Json.Encode
import MapEditor
import Math.Vector2 as Vec2 exposing (Vec2)
import Random
import Set exposing (Set)


port performEffects : List Json.Decode.Value -> Cmd msg


type alias Flags =
    { timestamp : Int
    , windowWidth : Float
    , windowHeight : Float
    , persistence : Maybe Persistence
    }


type alias Persistence =
    { isConfigOpen : Bool
    , configFloats : Dict String ConfigFloat
    , savedMaps : List SavedMap
    }


defaultPersistence : Persistence
defaultPersistence =
    { isConfigOpen = False
    , configFloats =
        [ ( "bulletDmg", { val = 15, min = 0, max = 20 } )
        , ( "bulletMaxAge", { val = 2, min = 0, max = 5 } )
        , ( "bulletSpeed", { val = 10, min = 5, max = 50 } )
        , ( "canvasHeight", { val = 600, min = 300, max = 1200 } )
        , ( "canvasWidth", { val = 800, min = 400, max = 1600 } )
        , ( "creepDps", { val = 10, min = 0, max = 200 } )
        , ( "creepHealth", { val = 100, min = 1, max = 200 } )
        , ( "creepSpeed", { val = 1, min = 0, max = 2 } )
        , ( "heroAcc", { val = 70, min = 10, max = 200 } )
        , ( "heroHealthMax", { val = 100, min = 1, max = 10000 } )
        , ( "heroMaxSpeed", { val = 20, min = 10, max = 100 } )
        , ( "meterWidth", { val = 450, min = 10, max = 800 } )
        , ( "refillRate", { val = 20, min = 0, max = 1000 } )
        , ( "tilesToShowLengthwise", { val = 20, min = 10, max = 200 } )
        , ( "towerHealthMax", { val = 1000, min = 100, max = 5000 } )
        , ( "turretTimeToSprout", { val = 5, min = 0, max = 30 } )
        , ( "waterBulletCost", { val = 5, min = 0, max = 25 } )
        ]
            |> Dict.fromList
    , savedMaps =
        [ { name = "New Map"
          , map =
                mapFromAscii
                    """
0000000
0011110
0111110
0111110
0000000
"""
          , hero = ( 1, 1 )
          , enemyTowers = Set.fromList [ ( 1, 5 ), ( 2, 4 ) ]
          , base = ( 2, 2 )
          , size = ( 6, 5 )
          }
        ]
    }


main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type alias Model =
    { state : AppState
    , session : Session
    }


type AppState
    = Game Game.Model
    | MapEditor MapEditor.Model


type Msg
    = KeyDown String
    | KeyUp String
    | Tick Float
    | ChangeConfig String String
    | ToggleConfig Bool
    | HardReset
      -- app msgs
    | MapEditorMsg MapEditor.Msg
    | GameMsg Game.Msg


makeC : Dict String ConfigFloat -> Config
makeC configFloats =
    { getFloat =
        \n ->
            case
                configFloats
                    |> Dict.get n
                    |> Maybe.map .val
            of
                Just val ->
                    val

                Nothing ->
                    -1
                        |> dlog ("YOU FOOOOL: " ++ n)
    }


dlog : String -> a -> a
dlog str val =
    --Debug.log str val
    val


sessionFromFlags : Flags -> Session
sessionFromFlags flags =
    let
        persistence =
            flags.persistence
                |> Maybe.withDefault defaultPersistence
    in
    { configFloats = persistence.configFloats
    , c = makeC persistence.configFloats
    , isConfigOpen = persistence.isConfigOpen

    -- input
    , keysPressed = Set.empty

    --browser
    , windowWidth = flags.windowWidth
    , windowHeight = flags.windowHeight

    -- map editorish
    , savedMaps = persistence.savedMaps

    -- misc
    , seed = Random.initialSeed flags.timestamp
    }


init : Json.Decode.Value -> ( Model, Cmd Msg )
init =
    --initMapEditor
    initGame


initMapEditor : Json.Decode.Value -> ( Model, Cmd Msg )
initMapEditor jsonFlags =
    let
        flags =
            jsonToFlags jsonFlags

        session =
            sessionFromFlags flags
    in
    ( { state = MapEditor (MapEditor.init session)
      , session = session
      }
    , Cmd.none
    )


initGame : Json.Decode.Value -> ( Model, Cmd Msg )
initGame jsonFlags =
    let
        flags =
            jsonToFlags jsonFlags

        session =
            sessionFromFlags flags
    in
    ( { state = Game (Game.init session)
      , session = session
      }
    , Cmd.none
    )


updateStateAndSession : Model -> ( AppState, Session ) -> Model
updateStateAndSession model ( appState, session ) =
    { model
        | state = appState
        , session = session
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        session =
            model.session
    in
    case msg of
        KeyUp str ->
            ( { model | session = { session | keysPressed = Set.remove str session.keysPressed } }
            , Cmd.none
            )

        KeyDown str ->
            ( { model
                | session =
                    { session
                        | keysPressed = Set.insert str session.keysPressed
                    }
                , state =
                    case model.state of
                        Game gameModel ->
                            Game.update (Game.KeyDown str) session gameModel
                                |> (\( m, es ) -> Game m)

                        MapEditor _ ->
                            model.state
              }
            , Cmd.none
            )

        ChangeConfig name inputStr ->
            let
                newConfigFloats =
                    session.configFloats
                        |> (\configFloats ->
                                case String.toFloat inputStr of
                                    Just val ->
                                        Dict.update name (Maybe.map (\cv -> { cv | val = val })) configFloats

                                    Nothing ->
                                        configFloats
                           )

                newModel =
                    { model
                        | session =
                            { session
                                | configFloats = newConfigFloats
                                , c = makeC newConfigFloats
                            }
                    }
            in
            ( newModel
            , performEffects
                [ Json.Encode.object
                    [ ( "id", Json.Encode.string "SAVE" )
                    , ( "persistence", modelToPersistence newModel |> encodePersistence )
                    ]
                ]
            )

        ToggleConfig shouldOpen ->
            let
                newModel =
                    { model | session = { session | isConfigOpen = shouldOpen } }
            in
            --( newModel, performEffects (modelToPersistence newModel |> encodePersistence) )
            ( newModel
            , performEffects [ Json.Encode.object [ ( "id", Json.Encode.string "SAVE" ) ] ]
            )

        HardReset ->
            ( { model
                | session =
                    { session
                        | isConfigOpen = True
                        , configFloats = defaultPersistence.configFloats
                        , c = makeC defaultPersistence.configFloats
                    }
              }
            , performEffects [ Json.Encode.object [ ( "id", Json.Encode.string "HARD_RESET" ) ] ]
            )

        Tick delta ->
            case model.state of
                MapEditor mapEditorModel ->
                    let
                        ( newModel, newSession, effects ) =
                            MapEditor.update (MapEditor.Tick delta) session mapEditorModel
                    in
                    { model
                        | state = MapEditor newModel
                        , session = newSession
                    }
                        |> performMapEffects newSession effects

                Game gameModel ->
                    let
                        ( newModel, effects ) =
                            Game.update (Game.Tick delta) session gameModel
                    in
                    { model | state = Game newModel }
                        |> performGameEffects session effects

        MapEditorMsg mapEditorMsg ->
            case model.state of
                MapEditor mapEditorModel ->
                    let
                        ( newModel, newSession, effects ) =
                            MapEditor.update mapEditorMsg session mapEditorModel
                    in
                    { model
                        | state = MapEditor newModel
                        , session = newSession
                    }
                        |> performMapEffects newSession effects

                _ ->
                    ( model, Cmd.none )

        GameMsg gameMsg ->
            case model.state of
                Game gameModel ->
                    let
                        ( newModel, effects ) =
                            Game.update gameMsg session gameModel
                    in
                    ( { model
                        | state = Game newModel

                        --, session = newSession
                      }
                    , Cmd.none
                    )

                --|> performMapEffects newSession effects
                --|> performMapEffects session effects
                _ ->
                    ( model, Cmd.none )


performGameEffects : Session -> List Game.Effect -> Model -> ( Model, Cmd Msg )
performGameEffects session effects model =
    effects
        |> List.foldl
            (\effect ( updatingModel, updatingCmds ) ->
                case effect of
                    Game.DrawSprites layers ->
                        ( updatingModel
                        , performEffects
                            [ Json.Encode.object
                                [ ( "id", Json.Encode.string "DRAW" )
                                , ( "layers"
                                  , layers
                                        |> Json.Encode.list encodeSpriteLayer
                                  )
                                ]
                            ]
                            :: updatingCmds
                        )

                    Game.MoveCamera pos ->
                        ( updatingModel
                        , performEffects
                            [ Json.Encode.object
                                [ ( "id", Json.Encode.string "MOVE_CAMERA" )
                                , ( "x", Json.Encode.float (Vec2.getX pos * 32) )
                                , ( "y", Json.Encode.float (Vec2.getY pos * 32) )
                                ]
                            ]
                            :: updatingCmds
                        )
            )
            ( model, [] )
        |> Tuple.mapSecond Cmd.batch


encodeSpriteLayer : SpriteLayer -> Json.Decode.Value
encodeSpriteLayer layer =
    Json.Encode.object
        [ ( "name", Json.Encode.string layer.name )
        , ( "zOrder", Json.Encode.int layer.zOrder ) -- not used yet
        , ( "sprites"
          , layer.sprites
                |> List.map
                    (\sprite ->
                        { x = sprite.x * 32
                        , y = sprite.y * 32
                        , texture = sprite.texture
                        }
                    )
                |> Json.Encode.list
                    (\{ x, y, texture } ->
                        Json.Encode.object
                            [ ( "x", Json.Encode.float x )
                            , ( "y", Json.Encode.float y )
                            , ( "texture", Json.Encode.string texture )
                            ]
                    )
          )
        , ( "graphics"
          , layer.graphics
                |> List.map
                    (\graphic ->
                        { x = graphic.x * 32
                        , y = graphic.y * 32
                        , width = graphic.width * 32
                        , height = graphic.height * 32
                        , bgColor = graphic.bgColor
                        , lineStyleWidth = graphic.lineStyleWidth * 32
                        , lineStyleColor = graphic.lineStyleColor
                        , lineStyleAlpha = graphic.lineStyleAlpha
                        , shape = graphic.shape
                        }
                    )
                |> Json.Encode.list
                    (\graphic ->
                        Json.Encode.object
                            [ ( "x", Json.Encode.float graphic.x )
                            , ( "y", Json.Encode.float graphic.y )
                            , ( "width", Json.Encode.float graphic.width )
                            , ( "height", Json.Encode.float graphic.height )
                            , ( "bgColor", Json.Encode.string graphic.bgColor )
                            , ( "lineStyleWidth", Json.Encode.float graphic.lineStyleWidth )
                            , ( "lineStyleColor", Json.Encode.string graphic.lineStyleColor )
                            , ( "lineStyleAlpha", Json.Encode.float graphic.lineStyleAlpha )
                            , ( "shape", encodeShape graphic.shape )
                            ]
                    )
          )
        ]


encodeShape : Shape -> Json.Decode.Value
encodeShape shape =
    case shape of
        Rect ->
            Json.Encode.string "rect"


performMapEffects : Session -> List MapEditor.Effect -> Model -> ( Model, Cmd Msg )
performMapEffects session effects model =
    effects
        |> List.foldl
            (\effect ( updatingModel, updatingCmds ) ->
                case effect of
                    MapEditor.SaveMapEffect editingMap ->
                        ( updatingModel
                        , performEffects
                            [ Json.Encode.object
                                [ ( "id", Json.Encode.string "SAVE" )
                                , ( "persistence", modelToPersistence updatingModel |> encodePersistence )
                                ]
                            ]
                            :: updatingCmds
                        )

                    MapEditor.PlayMapEffect editingMap ->
                        let
                            ( newestModel, _ ) =
                                Game.initTryOut session editingMap
                        in
                        ( { updatingModel | state = Game newestModel }
                        , updatingCmds
                        )

                    MapEditor.ZoomEffect zoomLevel ->
                        ( updatingModel
                        , performEffects
                            [ Json.Encode.object
                                [ ( "id", Json.Encode.string "ZOOM" )
                                , ( "zoomLevel", Json.Encode.float zoomLevel )
                                ]
                            ]
                            :: updatingCmds
                        )

                    MapEditor.MoveCamera pos ->
                        ( updatingModel
                        , performEffects
                            [ Json.Encode.object
                                [ ( "id", Json.Encode.string "MOVE_CAMERA" )
                                , ( "x", Json.Encode.float (Vec2.getX pos * 32) )
                                , ( "y", Json.Encode.float (Vec2.getY pos * 32) )
                                ]
                            ]
                            :: updatingCmds
                        )

                    MapEditor.DrawSprites layers ->
                        ( updatingModel
                        , performEffects
                            [ Json.Encode.object
                                [ ( "id", Json.Encode.string "DRAW" )
                                , ( "layers"
                                  , layers
                                        |> Json.Encode.list encodeSpriteLayer
                                  )
                                ]
                            ]
                            :: updatingCmds
                        )
            )
            ( model, [] )
        |> Tuple.mapSecond Cmd.batch


modelToPersistence : Model -> Persistence
modelToPersistence model =
    { isConfigOpen = model.session.isConfigOpen
    , configFloats = model.session.configFloats
    , savedMaps = model.session.savedMaps
    }


jsonToFlags : Json.Decode.Value -> Flags
jsonToFlags json =
    case Json.Decode.decodeValue flagsDecoder json of
        Ok flags ->
            flags

        Err err ->
            Debug.todo ("flags bad man: " ++ Json.Decode.errorToString err)


flagsDecoder : Json.Decode.Decoder Flags
flagsDecoder =
    Json.Decode.map4 Flags
        (Json.Decode.field "timestamp" Json.Decode.int)
        (Json.Decode.field "windowWidth" Json.Decode.float)
        (Json.Decode.field "windowHeight" Json.Decode.float)
        (Json.Decode.field "persistence"
            (Json.Decode.nullable
                (Json.Decode.map3 Persistence
                    (Json.Decode.field "isConfigOpen" Json.Decode.bool)
                    (Json.Decode.field "configFloats" (Json.Decode.dict configFloatDecoder))
                    (Json.Decode.field "savedMaps" (Json.Decode.list savedMapDecoder))
                )
            )
        )


configFloatDecoder : Json.Decode.Decoder ConfigFloat
configFloatDecoder =
    Json.Decode.map3 ConfigFloat
        (Json.Decode.field "val" Json.Decode.float)
        (Json.Decode.field "min" Json.Decode.float)
        (Json.Decode.field "max" Json.Decode.float)


savedMapDecoder : Json.Decode.Decoder SavedMap
savedMapDecoder =
    Json.Decode.map6 SavedMap
        (Json.Decode.field "name" Json.Decode.string)
        (Json.Decode.field "map" mapDecoder)
        (Json.Decode.field "hero" tilePosDecoder)
        (Json.Decode.field "enemyTowers" (Json.Decode.list tilePosDecoder)
            |> Json.Decode.map Set.fromList
        )
        (Json.Decode.field "base" tilePosDecoder)
        (Json.Decode.field "size" tilePosDecoder)


tilePosDecoder : Json.Decode.Decoder TilePos
tilePosDecoder =
    Json.Decode.map2 (\x y -> ( x, y ))
        (Json.Decode.field "x" Json.Decode.int)
        (Json.Decode.field "y" Json.Decode.int)



--tilePosDecoder : Json.Decode.Decoder TilePos
--tilePosDecoder =
--    Json.Decode.map2 (\x y -> ( x, y ))
--        (Json.Decode.index 0 Json.Decode.int)
--        (Json.Decode.index 1 Json.Decode.int)


mapDecoder : Json.Decode.Decoder Map
mapDecoder =
    Json.Decode.dict tileDecoder
        |> Json.Decode.map
            (\tilePosStrTileDict ->
                tilePosStrTileDict
                    |> Dict.toList
                    |> List.map
                        (\( tilePosStr, tile ) ->
                            case String.split "," tilePosStr of
                                [ x, y ] ->
                                    ( ( String.toInt x |> Maybe.withDefault 0
                                      , String.toInt y |> Maybe.withDefault 0
                                      )
                                    , tile
                                    )

                                _ ->
                                    ( ( 0, 0 ), tile )
                        )
                    |> Dict.fromList
            )


tileDecoder : Json.Decode.Decoder Tile
tileDecoder =
    Json.Decode.string
        |> Json.Decode.map
            (\tile ->
                case tile of
                    "grass" ->
                        Grass

                    "water" ->
                        Water

                    _ ->
                        Poop
            )


encodePersistence : Persistence -> Json.Decode.Value
encodePersistence persistence =
    Json.Encode.object
        [ ( "isConfigOpen", Json.Encode.bool persistence.isConfigOpen )
        , ( "configFloats"
          , Json.Encode.dict
                identity
                encodeConfigFloat
                persistence.configFloats
          )
        , ( "savedMaps"
          , Json.Encode.list
                encodeSavedMap
                persistence.savedMaps
          )
        ]


encodeSavedMap : SavedMap -> Json.Decode.Value
encodeSavedMap savedMap =
    Json.Encode.object
        [ ( "name", Json.Encode.string savedMap.name )
        , ( "map", encodeMap savedMap.map )
        , ( "hero", encodeTilePos savedMap.hero )
        , ( "enemyTowers"
          , savedMap.enemyTowers
                |> Set.toList
                |> Json.Encode.list encodeTilePos
          )
        , ( "base", encodeTilePos savedMap.base )
        , ( "size", encodeTilePos savedMap.size )
        ]


encodeTilePos : TilePos -> Json.Decode.Value
encodeTilePos ( x, y ) =
    Json.Encode.object
        [ ( "x", Json.Encode.int x )
        , ( "y", Json.Encode.int y )
        ]


encodeMap : Map -> Json.Decode.Value
encodeMap map =
    map
        |> Dict.toList
        |> List.map
            (\( tilePos, tile ) ->
                ( stringifyTilePos tilePos
                , encodeTile tile
                )
            )
        |> Dict.fromList
        |> Json.Encode.dict identity identity


stringifyTilePos : TilePos -> String
stringifyTilePos ( x, y ) =
    String.fromInt x ++ "," ++ String.fromInt y


encodeTile : Tile -> Json.Decode.Value
encodeTile tile =
    (case tile of
        Grass ->
            "grass"

        Water ->
            "water"

        Poop ->
            "poop"
    )
        |> Json.Encode.string


encodeConfigFloat : ConfigFloat -> Json.Decode.Value
encodeConfigFloat configFloat =
    Json.Encode.object
        [ ( "val", Json.Encode.float configFloat.val )
        , ( "min", Json.Encode.float configFloat.min )
        , ( "max", Json.Encode.float configFloat.max )
        ]


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Browser.Events.onKeyDown (Json.Decode.map KeyDown (Json.Decode.field "key" Json.Decode.string))
        , Browser.Events.onKeyUp (Json.Decode.map KeyUp (Json.Decode.field "key" Json.Decode.string))
        , Sub.batch
            (case model.state of
                Game gameModel ->
                    case gameModel.gameState of
                        Game.Playing ->
                            [ Browser.Events.onAnimationFrameDelta Tick
                            ]

                        Game.GameOver ->
                            []

                        Game.Win ->
                            []

                MapEditor mapEditorModel ->
                    [ Browser.Events.onAnimationFrameDelta Tick
                    ]
            )
        ]


view : Model -> Html Msg
view model =
    case model.state of
        Game gameModel ->
            Game.view model.session gameModel
                |> Html.map GameMsg

        MapEditor mapModel ->
            MapEditor.view model.session mapModel
                |> Html.map MapEditorMsg



--, Html.div
--    [ Html.Attributes.style "position" "absolute"
--    , Html.Attributes.style "top" "10px"
--    , Html.Attributes.style "right" "10px"
--    , Html.Attributes.style "background" "#eee"
--    , Html.Attributes.style "border" "1px solid #333"
--    , Html.Attributes.style "font-family" "sans-serif"
--    , Html.Attributes.style "font-size" "18px"
--    , Html.Attributes.style "padding" "8px"
--    ]
--   (if model.isConfigOpen then
--       Html.button
--           [ Html.Attributes.style "float" "left"
--           , Html.Events.onClick HardReset
--           ]
--           [ Html.text "Hard Reset" ]
--           :: Html.a
--               [ Html.Events.onClick (ToggleConfig False)
--               , Html.Attributes.style "float" "right"
--               , Html.Attributes.style "display" "inline-block"
--               ]
--               [ Html.text "Collapse Config" ]
--           :: Html.br [] []
--           :: (model.config
--                   |> Dict.toList
--                   |> List.map
--                       (\( name, { val, min, max } ) ->
--                           Html.div
--                               [ Html.Attributes.style "display" "flex"
--                               , Html.Attributes.style "justify-content" "space-between"
--                               , Html.Attributes.style "margin" "10px 10px"
--                               ]
--                               [ Html.div
--                                   []
--                                   [ Html.text name
--                                   ]
--                               , Html.div
--                                   []
--                                   [ Html.span [ Html.Attributes.style "margin" "0 10px" ] [ Html.text (formatConfigFloat val) ]
--                                   , Html.input
--                                       [ Html.Attributes.style "width" "40px"
--                                       , Html.Attributes.value (formatConfigFloat min)
--                                       ]
--                                       []
--                                   , Html.input
--                                       [ Html.Attributes.type_ "range"
--                                       , Html.Attributes.value (formatConfigFloat val)
--                                       , Html.Attributes.min (formatConfigFloat min)
--                                       , Html.Attributes.max (formatConfigFloat max)
--                                       , Html.Attributes.step "any"
--                                       , Html.Events.onInput (ChangeConfig name)
--                                       ]
--                                       []
--                                   , Html.input
--                                       [ Html.Attributes.style "width" "40px"
--                                       , Html.Attributes.value (formatConfigFloat max)
--                                       ]
--                                       []
--                                   ]
--                               ]
--                       )
--              )
--    else
--       [ Html.a [ Html.Events.onClick (ToggleConfig True) ] [ Html.text "Expand Config" ] ]
--   )
--
