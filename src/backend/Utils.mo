import Text "mo:base/Text";
import Prim "mo:prim";

module {
  public func toLowerString(t: Text): Text {
      var lowerCaseString = "";
      for (char in t.chars()){
          lowerCaseString #= Text.fromChar(Prim.charToLower(char));
      };

      return lowerCaseString;
  };
}
