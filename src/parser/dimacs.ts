import * as P from "parsimmon";
import { Variable, Negation } from "../types/common";
import { CNFFormula, Clause } from "../types/cnf";

export const parser = P.createLanguage<{
  comment: string;
  desc: string;
  variable: Variable;
  negatedVariable: Negation<Variable>;
  clause: Clause<Variable, Negation<Variable>>;
  formula: CNFFormula<Variable, Negation<Variable>>;
  file: CNFFormula<Variable, Negation<Variable>>;
}>({
  comment: () => P.any.many().wrap(P.string("c"), P.newline).tieWith(""),
  desc: () => P.any.many().wrap(P.string("p"), P.newline).tieWith(""),
  variable: () => P.regex(RegExp("[1-9][0-9]*")).map((s) => <Variable>{ name: s }),
  negatedVariable: (r) => P.seqObj(P.string("-"), ["var", r.variable]),
  clause: (r) =>
    P.seqObj(["variables", P.alt(r.variable, r.negatedVariable).sepBy(P.whitespace)], P.whitespace, P.string("0")),
  formula: (r) => P.seqObj(["clauses", r.clause.many()]),
  file: (r) => r.comment.many().then(r.desc).then(r.formula),
});
