let upstream = https://github.com/dfinity/vessel-package-set/releases/download/mo-0.6.21-20220215/package-set.dhall sha256:b46f30e811fe5085741be01e126629c2a55d4c3d6ebf49408fb3b4a98e37589b
let Package =
    { name : Text, version : Text, repo : Text, dependencies : List Text }

let
  additions = [
    { name = "accountid"
    , repo = "https://github.com/stephenandrews/motoko-accountid"
    , version = "main"
    , dependencies = ["base"] : List Text
    },
    { name = "hex"
    , repo = "https://github.com/letmejustputthishere/motoko-hex"
    , version = "master"
    , dependencies = ["base"] : List Text
    }
  ] : List Package

let overrides = [] : List Package

in  upstream # additions # overrides
