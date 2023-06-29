import P from "parsimmon";
import { Negation, Variable } from "../types/common";
import { Operator, NNFFormula } from "../types/nnf";

const lParenParser = P.string("(");
const rParenParser = P.string(")");

export const language = P.createLanguage<{
  formula: NNFFormula;
  operator: Operator;
  variable: Variable;
  negation: Negation;
}>({
  formula: (r) => P.alt(r.operator, r.variable, r.negation),
  variable: () => P.regex(new RegExp("[a-zA-Z][a-zA-Z0-9]*")).map((v) => <Variable>{ name: v, type: "var" }),
  negation: (r) =>
    P.seqMap(P.string("not").skip(P.whitespace), r.variable, (s: string, v: Variable) => <Negation>{ var: v, type: s })
      .trim(P.optWhitespace)
      .wrap(lParenParser, rParenParser),
  operator: (r) =>
    P.seqMap(
      P.regex(new RegExp("or|and")).skip(P.optWhitespace),
      r.formula.skip(P.optWhitespace),
      r.formula,
      (op: string, f1: NNFFormula, f2: NNFFormula) => <Operator>{ type: op, f1: f1, f2: f2 }
    )
      .trim(P.optWhitespace)
      .wrap(lParenParser, rParenParser),
});
