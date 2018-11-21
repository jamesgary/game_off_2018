module Common exposing (Config, ConfigFloat, Flags, Key, Map, Persistence, Session, Tile(..), TilePos, tilePosToFloats, tilesToShowHeightwise)

import Dict exposing (Dict)
import Game.Resources as Resources exposing (Resources)
import Math.Vector2 as Vec2 exposing (Vec2)
import Random
import Set exposing (Set)


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


type alias ConfigFloat =
    { val : Float
    , min : Float
    , max : Float
    }


type alias Key =
    String



-- Map stuff


type alias Map =
    Dict TilePos Tile


type Tile
    = Grass
    | Water
    | Poop


type alias TilePos =
    ( Int, Int )


tilesToShowHeightwise : Config -> Float
tilesToShowHeightwise c =
    c.getFloat "tilesToShowLengthwise" * (c.getFloat "canvasHeight" / c.getFloat "canvasWidth")


tilePosToFloats : TilePos -> ( Float, Float )
tilePosToFloats ( col, row ) =
    ( toFloat col, toFloat row )
