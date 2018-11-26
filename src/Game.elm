port module Game exposing (GameState(..), Model, initTryOut)

import AStar
import Browser
import Browser.Events
import Collision
import Color exposing (Color)
import Common exposing (..)
import Dict exposing (Dict)
import Html exposing (Html)
import Html.Attributes
import Html.Events
import Html.Events.Extra.Mouse as Mouse
import Json.Decode as Decode
import List.Extra
import Math.Vector2 as Vec2 exposing (Vec2)
import Random
import Round
import Set exposing (Set)
import WebGL


initTryOut : Session -> SavedMap -> ( Model, Cmd Msg )
initTryOut session savedMap =
    let
        c =
            session.c
    in
    ( { hero =
            { pos = tilePosToFloats savedMap.hero |> tupleToVec2
            , vel = Vec2.vec2 0 0
            , healthAmt = c.getFloat "heroHealthMax"
            , healthMax = c.getFloat "heroHealthMax"
            }
      , bullets = []
      , composts = []
      , particles = []
      , creeps = []
      , enemyTowers =
            [ { pos = ( 12, -8 )
              , timeSinceLastSpawn = 9999
              , healthAmt = c.getFloat "towerHealthMax"
              , healthMax = c.getFloat "towerHealthMax"
              }

            --, { pos = ( 11, -15 )
            --  , timeSinceLastSpawn = 9999
            --  , healthAmt = c.getFloat "towerHealthMax"
            --  , healthMax = c.getFloat "towerHealthMax"
            --  }
            --, { pos = ( 14, -11 )
            --  , timeSinceLastSpawn = 9999
            --  , healthAmt = c.getFloat "towerHealthMax"
            --  , healthMax = c.getFloat "towerHealthMax"
            --  }
            ]
      , turrets = []
      , moneyCrops = []
      , base =
            { pos = ( 13, -13 )
            , healthAmt = c.getFloat "towerHealthMax"
            , healthMax = c.getFloat "towerHealthMax"
            }
      , timeSinceLastFire = 0
      , waterAmt = 75
      , waterMax = 100
      , equipped = Gun
      , map = Dict.empty
      , inv =
            { compost = 0
            }
      , gameState = Playing
      }
    , Cmd.none
    )


port saveFlags : Persistence -> Cmd msg


port hardReset : () -> Cmd msg


defaultPesistence : Persistence
defaultPesistence =
    { isConfigOpen = False
    , config =
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



--main =
--    Browser.element
--        { init = init
--        , view = \_ -> Html.text ""
--        , update = \_ -> update
--        , subscriptions = subscriptions
--        }


type alias Flags =
    { timestamp : Float
    , persistence : Maybe Persistence
    }


type alias Persistence =
    { isConfigOpen : Bool
    , config : List ( String, ConfigVal )
    }


type alias Model =
    { -- fluid things
      hero : Hero
    , bullets : List Bullet
    , composts : List Compost

    -- fluid bldgs?
    , particles : List Particle
    , creeps : List Creep

    -- bldgs
    , enemyTowers : List EnemyTower
    , turrets : List Turret
    , moneyCrops : List MoneyCrop
    , base : Base

    -- hero things
    , timeSinceLastFire : Float
    , waterAmt : Float
    , waterMax : Float
    , equipped : Equippable

    -- map
    , map : Map
    , inv : Inv

    -- state
    , gameState : GameState
    }


type GameState
    = Playing
    | GameOver
    | Win


type alias Inv =
    { compost : Int
    }


type alias Compost =
    { pos : Vec2
    , age : Float
    }


type Particle
    = BulletHitCreep Vec2 Float Float


type alias Config =
    { getFloat : String -> Float
    }


type alias Base =
    { pos : TilePos
    , healthAmt : Float
    , healthMax : Float
    }


type Equippable
    = Gun
    | TurretSeed
    | MoneyCropSeed


type alias Creep =
    { pos : TilePos
    , nextPos : TilePos
    , progress : Float
    , diagonal : Bool
    , healthAmt : Float
    , healthMax : Float
    , offset : Vec2
    }


type alias Cache =
    {}


type alias HeroPos =
    Vec2


type alias Hero =
    { pos : HeroPos
    , vel : Vec2
    , healthAmt : Float
    , healthMax : Float
    }


type alias EnemyTower =
    { pos : TilePos
    , timeSinceLastSpawn : Float
    , healthAmt : Float
    , healthMax : Float
    }


type alias Turret =
    { pos : TilePos
    , timeSinceLastFire : Float
    , age : Float
    , healthAmt : Float
    , healthMax : Float
    }


type alias MoneyCrop =
    { pos : TilePos
    , timeSinceLastGenerate : Float
    , age : Float
    , healthAmt : Float
    , healthMax : Float
    }


type alias Bullet =
    { kind : BulletKind
    , pos : Vec2
    , angle : Float
    , age : Float
    }


type BulletKind
    = PlayerBullet
    | PlantBullet


type alias Key =
    String


type Msg
    = KeyDown String
    | KeyUp String
    | MouseDown
    | MouseUp
    | MouseMove ( Float, Float )
    | Tick Float
    | ChangeConfig String String
    | ToggleConfig Bool
    | HardReset


dlog : String -> a -> a
dlog str val =
    --Debug.log str val
    val


makeC : Dict String ConfigVal -> Config
makeC config =
    { getFloat =
        \n ->
            case
                config
                    |> Dict.get n
                    |> Maybe.map .val
            of
                Just val ->
                    val

                Nothing ->
                    -1
                        |> dlog ("YOU FOOOOL: " ++ n)
    }


type alias ConfigVal =
    { val : Float
    , min : Float
    , max : Float
    }


vec2ToTuple : Vec2 -> ( Float, Float )
vec2ToTuple vec2 =
    vec2
        |> Vec2.toRecord
        |> (\{ x, y } -> ( x, y ))


tupleToVec2 : ( Float, Float ) -> Vec2
tupleToVec2 ( x, y ) =
    { x = x, y = y }
        |> Vec2.fromRecord
