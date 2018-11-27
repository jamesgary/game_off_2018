module Common exposing (Config, ConfigFloat, Graphic, Key, Map, PlacementAvailability(..), SavedMap, Session, Shape(..), Sprite, SpriteLayer, Texture(..), Tile(..), TilePos, drawHealth, heroDirInput, mapFromAscii, textureToStr, tilePosToFloats, tileToStr, tilesToShowHeightwise, tupleToVec2, vec2ToTuple)

import Dict exposing (Dict)
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
    , enemyTowers : Set TilePos
    , base : TilePos
    , size : ( Int, Int )
    }


mapFromAscii : String -> Map
mapFromAscii str =
    str
        |> String.trim
        |> String.lines
        |> List.indexedMap
            (\row line ->
                line
                    |> String.toList
                    |> List.indexedMap
                        (\col char ->
                            ( ( col, row )
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


type Texture
    = GrassTexture
    | WaterTexture
    | HoveringTexture
    | XTexture


textureToStr : Texture -> String
textureToStr texture =
    case texture of
        GrassTexture ->
            "grass"

        WaterTexture ->
            "water"

        HoveringTexture ->
            "hovering"

        XTexture ->
            "x"


tileToStr : Tile -> String
tileToStr tile =
    case tile of
        Grass ->
            "grass"

        Water ->
            "water"

        Poop ->
            "poop"


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


type alias SpriteLayer =
    { name : String
    , zOrder : Int
    , sprites : List Sprite
    , graphics : List Graphic
    }


type alias Sprite =
    { x : Float
    , y : Float
    , texture : String
    }


type alias Graphic =
    { x : Float
    , y : Float
    , width : Float
    , height : Float
    , bgColor : String
    , lineStyleWidth : Float
    , lineStyleColor : String
    , lineStyleAlpha : Float
    , shape : Shape
    }


type Shape
    = Rect


drawHealth : Vec2 -> Float -> Float -> Float -> List Graphic
drawHealth pos width amt max =
    let
        ( healthX, healthY ) =
            ( Vec2.getX pos - (width / 2)
            , Vec2.getY pos + 0.7
            )

        height =
            0.1 * width

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
      , shape = Rect
      }
    , { x = healthX
      , y = healthY
      , width = width * (amt / max)
      , height = height
      , bgColor = "#00ff00"
      , lineStyleWidth = 0
      , lineStyleColor = "#000000"
      , lineStyleAlpha = 1
      , shape = Rect
      }
    ]
