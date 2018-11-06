module Main exposing (main)

import Browser
import Browser.Events
import Color exposing (Color)
import Game.TwoD as GameTwoD
import Game.TwoD.Camera as GameTwoDCamera
import Game.TwoD.Render as GameTwoDRender
import Html
import Html.Attributes
import Html.Events.Extra.Mouse as Mouse
import Json.Decode as Decode
import Math.Vector2 as Vec2 exposing (Vec2)
import Set exposing (Set)


main =
    Browser.document
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type alias Flags =
    ()


type alias Model =
    { hero : Hero
    , bullets : List Bullet
    , keysPressed : Set Key
    , mouseLoc : Vec2
    , isMouseDown : Bool
    }


type alias Hero =
    { loc : Vec2
    , vel : Vec2
    }


type alias Bullet =
    { loc : Vec2
    , angle : Float
    , age : Float
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


init : Flags -> ( Model, Cmd msg )
init flags =
    ( { hero =
            { loc = Vec2.fromRecord { x = -2, y = 0 }
            , vel = Vec2.vec2 0 0
            }
      , bullets = []
      , keysPressed = Set.empty
      , mouseLoc = Vec2.vec2 0 0
      , isMouseDown = False
      }
    , Cmd.none
    )


vec2ToTuple : Vec2 -> ( Float, Float )
vec2ToTuple vec2 =
    vec2
        |> Vec2.toRecord
        |> (\{ x, y } -> ( x, y ))


tupleToVec2 : ( Float, Float ) -> Vec2
tupleToVec2 ( x, y ) =
    { x = x, y = y }
        |> Vec2.fromRecord


playerAcc =
    2


playerMaxSpeed =
    0.01


bulletSpeed =
    0.018


heroDirInput : Model -> Vec2
heroDirInput model =
    { x =
        if
            Set.member "ArrowLeft" model.keysPressed
                || Set.member "a" model.keysPressed
        then
            -1

        else if
            Set.member "ArrowRight" model.keysPressed
                || Set.member "d" model.keysPressed
        then
            1

        else
            0
    , y =
        if
            Set.member "ArrowUp" model.keysPressed
                || Set.member "w" model.keysPressed
        then
            1

        else if
            Set.member "ArrowDown" model.keysPressed
                || Set.member "s" model.keysPressed
        then
            -1

        else
            0
    }
        |> Vec2.fromRecord


bulletMaxAge =
    1000


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Tick delta ->
            ( { model
                | hero =
                    model.hero
                        |> (\hero ->
                                let
                                    newAcc =
                                        Vec2.scale playerAcc (heroDirInput model)

                                    newVelUncapped =
                                        Vec2.add model.hero.vel (Vec2.scale delta newAcc)

                                    percentBeyondCap =
                                        Vec2.length newVelUncapped / playerMaxSpeed

                                    newVel =
                                        (if percentBeyondCap > 1.0 then
                                            Vec2.scale (1 / percentBeyondCap) newVelUncapped

                                         else
                                            newVelUncapped
                                        )
                                            |> Vec2.scale 0.8

                                    newLoc =
                                        Vec2.add model.hero.loc (Vec2.scale delta newVel)
                                in
                                { hero
                                    | loc = newLoc
                                    , vel = newVel
                                }
                           )
                , bullets =
                    (if model.isMouseDown then
                        makeBullet model.hero.loc model.mouseLoc :: model.bullets

                     else
                        model.bullets
                    )
                        |> List.map
                            (\bullet ->
                                { bullet
                                    | loc =
                                        Vec2.add
                                            (tupleToVec2 (fromPolar ( bulletSpeed * delta, bullet.angle )))
                                            bullet.loc
                                    , age = bullet.age + delta
                                }
                            )
                        |> List.filter (\bullet -> bullet.age < bulletMaxAge)
              }
            , Cmd.none
            )

        KeyUp str ->
            ( { model | keysPressed = Set.remove str model.keysPressed }, Cmd.none )

        KeyDown str ->
            ( { model | keysPressed = Set.insert str model.keysPressed }, Cmd.none )

        MouseMove ( x, y ) ->
            ( { model
                | mouseLoc =
                    { x = (x - (canvasWidth / 2)) / (canvasWidth / tilesToShowLengthwise)
                    , y = (y - (canvasHeight / 2)) / (-canvasHeight / tilesToShowHeightwise)
                    }
                        |> Vec2.fromRecord
              }
            , Cmd.none
            )

        MouseDown ->
            ( { model
                | isMouseDown = True
              }
            , Cmd.none
            )

        MouseUp ->
            ( { model
                | isMouseDown = False
              }
            , Cmd.none
            )


makeBullet : Vec2 -> Vec2 -> Bullet
makeBullet heroLoc aimLoc =
    { loc = heroLoc
    , angle =
        toPolar
            (Vec2.sub aimLoc heroLoc |> vec2ToTuple)
            |> Tuple.second
    , age = 0
    }


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Browser.Events.onKeyDown (Decode.map KeyDown (Decode.field "key" Decode.string))
        , Browser.Events.onKeyUp (Decode.map KeyUp (Decode.field "key" Decode.string))
        , Browser.Events.onAnimationFrameDelta Tick
        ]


canvasWidth =
    800


canvasHeight =
    600


tilesToShowLengthwise =
    20


tilesToShowHeightwise =
    tilesToShowLengthwise * (canvasHeight / canvasWidth)


drawCircle : Color -> Vec2 -> Float -> GameTwoDRender.Renderable
drawCircle color pos rad =
    GameTwoDRender.shape
        GameTwoDRender.circle
        { color = color
        , position = Vec2.add (Vec2.vec2 (rad / -2) (rad / -2)) pos |> vec2ToTuple
        , size = Vec2.vec2 rad rad |> vec2ToTuple
        }


drawRect : Color -> Vec2 -> Vec2 -> GameTwoDRender.Renderable
drawRect color pos size =
    GameTwoDRender.shape
        GameTwoDRender.rectangle
        { color = color
        , position = Vec2.add (Vec2.scale -0.5 size) pos |> vec2ToTuple
        , size = size |> vec2ToTuple
        }


view : Model -> Browser.Document Msg
view model =
    let
        background =
            drawRect
                Color.lightGreen
                (Vec2.vec2 0 0)
                (Vec2.vec2 tilesToShowLengthwise tilesToShowHeightwise)

        hero =
            drawRect
                Color.black
                model.hero.loc
                (Vec2.vec2 1 1)

        lake =
            drawRect
                Color.lightBlue
                (Vec2.vec2 2 2)
                (Vec2.vec2 2 4)
    in
    { title = "GAME"
    , body =
        [ Html.div
            [ Html.Attributes.style "border" "1px solid black"
            , Html.Attributes.style "display" "inline-block"
            , Html.Attributes.style "margin" "20px"
            , Html.Attributes.style "font-size" "0"
            , Mouse.onDown (\_ -> MouseDown)
            , Mouse.onUp (\_ -> MouseUp)
            , Mouse.onMove (\event -> MouseMove event.offsetPos)
            ]
            [ GameTwoD.render
                { time = 0
                , size = ( canvasWidth, canvasHeight )
                , camera =
                    GameTwoDCamera.fixedArea
                        (tilesToShowHeightwise * tilesToShowLengthwise)
                        ( 0, 0 )
                }
                (List.concat
                    [ [ background ]
                    , [ lake ]
                    , [ hero ]
                    , model.bullets
                        |> List.map (\bullet -> drawCircle Color.red bullet.loc 0.5)
                    ]
                )
            ]
        ]
    }
