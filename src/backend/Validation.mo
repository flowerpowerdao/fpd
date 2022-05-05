import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Prim "mo:prim";
import Result "mo:base/Result";
import Set "mo:base/TrieSet";
import Text "mo:base/Text";

import Types "./Types";
import Utils "./Utils";

module {
  type Result<Ok,Err> = Result.Result<Ok,Err>;
  type ValidationErrors = Types.ValidationErrors;

  // thanks to Ori for this implementation!
  class Validator() {
    // new validators start with empty errors
    var _allErrors: [Text] = [];

    func getErrors<T>(field: T, predicateErrorPairs: [(T->Bool, Text)] ) : [Text] {
      // Take a field and an array of (predicate, "error string") pairs, fold through the 
      // pairs and return a list of all error strings where the predicate failed
      let errorsFound = Array.foldLeft<(T->Bool, Text), [Text]>(
        predicateErrorPairs, 
        [], 
        func (acc: [Text], predicateErrorPair: (T->Bool, Text)) : [Text] {
          if (predicateErrorPair.0(field)) {
            return Array.append<Text>(acc, [predicateErrorPair.1]);
          };
          return acc
        } 
      );
      return errorsFound
    };

    // public
    
    public func validate<T>(field: T, predicateErrorPairs: [(T->Bool, Text)] ) : T {
      // Pass the field through all the given predicates, appending the matching error 
      // strings that are returned to _allErrors.
      // Return the field untouched, the validation can be checked by calling isValid() below.
      _allErrors := Array.append(_allErrors, getErrors<T>(field, predicateErrorPairs));
      return field;  
    };

    public func validateOptional<T>(field: ?T, predicateErrorPairs: [(T->Bool, Text)] ) : ?T {
      // For fields of Optional type.
      // As validate above, but skips checks and appends no errors if the field is null
      switch(field) {
        case(?exists) { 
          _allErrors := Array.append(_allErrors, getErrors<T>(exists, predicateErrorPairs));
        };
        case(null) { /* continue */ };
      };
      return field;
    };

    public func isValid() : Bool {
      _allErrors.size() == 0
    };

    public func getAllErrors() : [Text] {
      _allErrors
    };

  };

  // general functions to validate field inputs

  func stringLengthIsNotBetween(t: Text, min: Nat, max: Nat) : Bool {
    if (t.size() < min or t.size() > max) {
      return true;
    };
    return false
  };

  func arrayLengthIsNotBetween(a: [Text], min: Nat, max: Nat) : Bool {
    if (a.size() < min or a.size() > max) {
        return true;
    };
    return false
  };


  // validate proposals
  public func validateProposal(proposal: Types.ProposalPublic) : Result<(), ValidationErrors> {
    let validator = Validator();

    let x : Types.ProposalPublic = {

      title = validator.validate<Text>(proposal.title, [
        (func (field) {stringLengthIsNotBetween(field, 20, 100)}, 
          "Title must be between 20 and 100 characters")
      ]);

      description = validator.validate<Text>(proposal.description, [
        (func (field) {stringLengthIsNotBetween(field, 200, 50000)},
          "Description must be between 200 and 50000 characters")
      ]);

      options = validator.validate<[Text]>(proposal.options, [
        (func (field) {arrayLengthIsNotBetween(field, 1, 10)},
          "Options must be between 1 and 10"),
        (func (field) {
          for (option in Iter.fromArray(field)) {
            if (stringLengthIsNotBetween(option, 1, 50)) {
              return true;
            };
          };
          return false;
        },
          "Options must be between 1 and 50 characters")
      ]);
    };

    if (validator.isValid()) {
      return #ok
    };
    return #err(validator.getAllErrors())
  };

}