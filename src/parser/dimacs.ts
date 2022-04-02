import * as P from "parsimmon";
import { Variable, Negation } from "../types/common";
import { CNFFormula, Clause } from "../types/cnf";

export const parser = P.createLanguage<{
  comment: string;
  desc: string;
  variable: Variable;
  negatedVariable: Negation;
  clause: Clause;
  formula: CNFFormula;
}>({
  comment: () => P.any.many().wrap(P.string("c"), P.newline).tieWith("\r\n"),
  desc: () => P.any.many().wrap(P.string("p"), P.newline).tieWith(""),
  variable: () => P.regex(RegExp("[1-9][0-9]*")).map((s) => <Variable>{ name: s }),
  negatedVariable: (r) =>
    P.string("-")
      .chain((_) => r.variable)
      .map((v) => <Negation>{ var: v, type: "not" }),
  clause: (r) =>
    P.seqObj(["variables", P.alt(r.variable, r.negatedVariable).sepBy(P.whitespace)], P.whitespace, P.string("0")),
  formula: (r) =>
    r.comment
      .many()
      .then(r.desc)
      .then(
        P.seqMap(
          r.clause.many(),
          (clauses) =>
            <CNFFormula>{
              clauses: Array.from(clauses),
            }
        )
      ),
});
