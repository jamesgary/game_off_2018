port module Main exposing (main)

import Browser
import Browser.Events
import Dict exposing (Dict)
import Game
import Game.Resources as Resources exposing (Resources)
import Html exposing (Html)
import Html.Attributes
import Html.Events
import Html.Events.Extra.Mouse as Mouse
import Json.Decode as Decode
import Math.Vector2 as Vec2 exposing (Vec2)
import Random
import Set exposing (Set)


port saveFlags : Persistence -> Cmd msg


port hardReset : () -> Cmd msg


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
    | MapEditor


type alias Session =
    { configFloats : Dict String ConfigFloat
    , c : Config
    , isConfigOpen : Bool

    -- input
    , keysPressed : Set Key
    , mousePos : Vec2
    , isMouseDown : Bool

    -- misc
    , resources : Resources
    , seed : Random.Seed
    }


type alias Config =
    { getFloat : String -> Float
    }


type alias Flags =
    { timestamp : Int
    , persistence : Maybe Persistence
    }


type alias Persistence =
    { isConfigOpen : Bool
    , configFloats : List ( String, ConfigFloat )
    }


type alias Key =
    String


type Msg
    = KeyDown String
    | KeyUp String
    | MouseDown
    | MouseUp
    | MouseMove ( Float, Float )
    | Tick Float
    | Resources Resources.Msg
    | ChangeConfig String String
    | ToggleConfig Bool
    | HardReset


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
        ( configFloats, isConfigOpen ) =
            case flags.persistence of
                Just persistence ->
                    ( Dict.fromList persistence.configFloats
                    , persistence.isConfigOpen
                    )

                Nothing ->
                    ( Dict.fromList defaultPesistence.configFloats
                    , defaultPesistence.isConfigOpen
                    )
    in
    { configFloats = configFloats
    , c = makeC configFloats
    , isConfigOpen = isConfigOpen

    -- input
    , keysPressed = Set.empty
    , mousePos = Vec2.vec2 0 0
    , isMouseDown = False

    -- misc
    , resources = Resources.init
    , seed = Random.initialSeed flags.timestamp
    }


init : Flags -> ( Model, Cmd Msg )
init flags =
    let
        session =
            sessionFromFlags flags
    in
    ( { state = MapEditor --Game.init session
      , session = session
      }
    , Resources.loadTextures
        [ "images/grass.png"
        , "images/water.png"
        , "images/selectedTile.png"
        , "images/selectedTile-inactive.png"
        , "images/enemyTower.png"
        , "images/turret.png"
        , "images/moneyCrop.png"
        , "images/creep.png"
        , "images/tower.png"
        , "images/seedling.png"
        , "images/compost.png"
        ]
        |> Cmd.map Resources
    )


type alias ConfigFloat =
    { val : Float
    , min : Float
    , max : Float
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

        MouseMove ( mouseX, mouseY ) ->
            let
                mousePos =
                    Vec2.vec2 mouseX mouseY
            in
            ( { model | session = { session | mousePos = mousePos } }
            , Cmd.none
            )

        MouseDown ->
            ( { model | session = { session | isMouseDown = True } }
            , Cmd.none
            )

        MouseUp ->
            ( { model | session = { session | isMouseDown = False } }
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
            ( newModel, saveFlags (modelToPersistence newModel) )

        ToggleConfig shouldOpen ->
            let
                newModel =
                    { model | session = { session | isConfigOpen = shouldOpen } }
            in
            ( newModel, saveFlags (modelToPersistence newModel) )

        HardReset ->
            ( { model
                | session =
                    { session
                        | isConfigOpen = True
                        , configFloats = Dict.fromList defaultPesistence.configFloats
                        , c = makeC (Dict.fromList defaultPesistence.configFloats)
                    }
              }
            , hardReset ()
            )

        Tick delta ->
            ( model, Cmd.none )


modelToPersistence : Model -> Persistence
modelToPersistence model =
    { isConfigOpen = model.session.isConfigOpen
    , configFloats = Dict.toList model.session.configFloats
    }


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Browser.Events.onKeyDown (Decode.map KeyDown (Decode.field "key" Decode.string))
        , Browser.Events.onKeyUp (Decode.map KeyUp (Decode.field "key" Decode.string))
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

                MapEditor ->
                    []
            )
        ]


view : Model -> Html Msg
view model =
    case model.state of
        Game gameData ->
            Html.text "game!"

        MapEditor ->
            Html.text "Map Editor"
