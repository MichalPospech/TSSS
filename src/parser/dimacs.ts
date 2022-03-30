import * as P from "parsimmon";

interface Variable {
  name: string;
}

interface NegatedVariable {
  variable: Variable;
}
interface Clause {
  variables: Array<Variable | NegatedVariable>;
}

interface CNFFormula {
  clauses: Array<Clause>;
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
    P.seqObj(["variables", P.alt(r.variable, r.negatedVariable).sepBy(P.whitespace)], P.whitespace, P.string("0")),
  formula: (r) => P.seqObj(["clauses", r.clause.many()]),
  file: (r) => r.comment.many().then(r.desc).then(r.formula),
});
