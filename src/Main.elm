port module Main exposing (main)

import Browser
import Browser.Events
import Common exposing (..)
import Dict exposing (Dict)
import Game
import Game.Resources as Resources exposing (Resources)
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


defaultPesistence : Persistence
defaultPesistence =
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
    | Resources Resources.Msg
    | ChangeConfig String String
    | ToggleConfig Bool
    | HardReset
      -- app msgs
    | MapEditorMsg MapEditor.Msg


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
                |> Maybe.withDefault defaultPesistence
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
    , resources = Resources.init
    , seed = Random.initialSeed flags.timestamp
    }


init : Json.Decode.Value -> ( Model, Cmd Msg )
init jsonFlags =
    let
        flags =
            jsonToFlags jsonFlags

        session =
            sessionFromFlags flags
    in
    ( { state = MapEditor (MapEditor.init session) --Game.init session
      , session = session
      }
    , Resources.loadTextures
        [--[ "images/grass.png"
         --, "images/water.png"
         --, "images/selectedTile.png"
         --, "images/selectedTile-inactive.png"
         --, "images/enemyTower.png"
         --, "images/turret.png"
         --, "images/moneyCrop.png"
         --, "images/creep.png"
         --, "images/tower.png"
         --, "images/seedling.png"
         --, "images/compost.png"
         --, "images/hero.png"
        ]
        |> Cmd.map Resources
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
            ( { model | session = { session | keysPressed = Set.insert str session.keysPressed } }
            , Cmd.none
            )

        Resources resourcesMsg ->
            ( { model
                | session =
                    { session
                        | resources =
                            Resources.update resourcesMsg session.resources
                    }
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
                        , configFloats = defaultPesistence.configFloats
                        , c = makeC defaultPesistence.configFloats
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
                        |> performMapEffects effects

                _ ->
                    ( model, Cmd.none )

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
                        |> performMapEffects effects

                _ ->
                    ( model, Cmd.none )


performMapEffects : List MapEditor.Effect -> Model -> ( Model, Cmd Msg )
performMapEffects effects model =
    ( model
    , effects
        |> List.map
            (\effect ->
                case effect of
                    MapEditor.SaveMapEffect editingMap ->
                        performEffects
                            [ Json.Encode.object
                                [ ( "id", Json.Encode.string "SAVE" )
                                , ( "persistence", modelToPersistence model |> encodePersistence )
                                ]
                            ]

                    MapEditor.MoveCamera pos ->
                        performEffects
                            [ Json.Encode.object
                                [ ( "id", Json.Encode.string "MOVE_CAMERA" )
                                , ( "x", Json.Encode.float (Vec2.getX pos * 32) )
                                , ( "y", Json.Encode.float (Vec2.getY pos * 32) )
                                ]
                            ]

                    MapEditor.DrawSprites sprites ->
                        performEffects
                            [ Json.Encode.object
                                [ ( "id", Json.Encode.string "DRAW" )
                                , ( "sprites"
                                  , sprites
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
                                ]
                            ]
            )
        |> Cmd.batch
    )


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
            Html.text "game!"

        MapEditor mapModel ->
            MapEditor.view model.session mapModel
                |> Html.map MapEditorMsg
