import * as P from "parsimmon";

export interface Variable {
  name: string;
}

export interface NegatedVariable {
  variable: Variable;
}
export interface Clause {
  variables: Set<Variable | NegatedVariable>;
}

export interface CNFFormula {
  clauses: Set<Clause>;
}

export const parser = P.createLanguage<{
  comment: string;
  desc: string;
  variable: Variable;
  negatedVariable: NegatedVariable;
  clause: Clause;
  formula: CNFFormula;
  file: CNFFormula;
}>({
  comment: () => P.any.many().wrap(P.string("c"), P.newline).tieWith(""),
  desc: () => P.any.many().wrap(P.string("p"), P.newline).tieWith(""),
  variable: () => P.regex(RegExp("[1-9][0-9]*")).map((s) => <Variable>{ name: s }),
  negatedVariable: (r) => P.seqObj(P.string("-"), ["variable", r.variable]),
  clause: (r) =>
    P.seqObj(
      [
        "variables",
        P.alt(r.variable, r.negatedVariable)
          .sepBy(P.whitespace)
          .map((v) => new Set(v)),
      ],
      P.whitespace,
      P.string("0")
    ),
  formula: (r) => P.seqObj(["clauses", r.clause.many().map((c) => new Set(c))]),
  file: (r) => r.comment.many().then(r.desc).then(r.formula),
});
