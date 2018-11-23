module Common exposing (Config, ConfigFloat, Key, Map, PlacementAvailability(..), SavedMap, Session, Tile(..), TilePos, tilePosToFloats, tilesToShowHeightwise, tupleToVec2, vec2ToTuple)

import Dict exposing (Dict)
import Game.Resources as GameResources exposing (Resources)
import Math.Vector2 as Vec2 exposing (Vec2)
import Random
import Set exposing (Set)


type alias Session =
    { configFloats : Dict String ConfigFloat
    , c : Config
    , isConfigOpen : Bool

    -- input
    , keysPressed : Set Key

    -- map editorish
    , savedMaps : List SavedMap

    -- browser
    , windowWidth : Float
    , windowHeight : Float

    -- misc
    , resources : Resources
    , seed : Random.Seed
    }


type alias Config =
    { getFloat : String -> Float
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


type PlacementAvailability
    = Shouldnt
    | Cant
    | Can


tupleToVec2 : ( Float, Float ) -> Vec2
tupleToVec2 ( x, y ) =
    { x = x, y = y }
        |> Vec2.fromRecord


vec2ToTuple : Vec2 -> ( Float, Float )
vec2ToTuple vec2 =
    vec2
        |> Vec2.toRecord
        |> (\{ x, y } -> ( x, y ))


type alias SavedMap =
    { name : String
    , map : Map
    , hero : TilePos
    , enemyTowers : List TilePos
    , base : TilePos
    , size : ( Int, Int )
    }
