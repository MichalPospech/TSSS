import * as P from "parsimmon";

interface Variable {
  name: string;
}

interface Conjunction {
  f1: NNFFormula;
  f2: NNFFormula;
}

interface Negation {
  var: Variable;
}

interface Disjunction {
  f1: NNFFormula;
  f2: NNFFormula;
}

type NNFFormula = Negation | Disjunction | Conjunction | Variable;

export const language = P.createLanguage<{
  formula: NNFFormula;
  and: Conjunction;
  or: Disjunction;
  variable: Variable;
  negation: Negation;
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
