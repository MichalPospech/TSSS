import * as P from "parsimmon";
import { Negation, Variable } from "../types/common";
import { Conjunction, Disjunction, NNFFormula } from "../types/nnf";

export const language = P.createLanguage<{
  formula: NNFFormula<Variable, Negation<Variable>>;
  and: Conjunction<Variable, Negation<Variable>>;
  or: Disjunction<Variable, Negation<Variable>>;
  variable: Variable;
  negation: Negation<Variable>;
  lParen: string;
  rParen: string;
}>({
  formula: (r) => P.alt(r.and, r.or, r.variable, r.negation),
  and: (r) =>
    P.seqObj(
      r.lParen,
      P.whitespace,
      P.string("and"),
      ["f1", r.formula],
      P.whitespace,
      ["f2", r.formula],
      P.whitespace,
      r.rParen
    ),
  or: (r) =>
    P.seqObj(
      r.lParen,
      P.whitespace,
      P.string("or"),
      ["f1", r.formula],
      P.whitespace,
      ["f2", r.formula],
      P.whitespace,
      r.rParen
    ),
  variable: () =>
    P.regex(RegExp("[a-zA-Z][a-zA-Z0-9]*")).map(
      (s) =>
        <Variable>{
          name: s,
        }
    ),
  negation: (r) =>
    P.seqObj(r.lParen, P.whitespace, P.string("not"), P.whitespace, ["var", r.variable], P.whitespace, r.rParen),
  lParen: () => P.string("("),
  rParen: () => P.string(")"),
});
