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

export const parser = P.createLanguage({
  comment: () => P.any.many().wrap(P.string("c"), P.newline),
  desc: () => P.any.many().wrap(P.string("p"), P.newline),
  variable: () => P.regex(RegExp("[1-9][0-9]*")).map<Variable>((s) => <Variable>{ name: s }),
  negatedVariable: (r) => P.seqObj<NegatedVariable>(P.string("-"), ["variable", r.variable]),
  clause: (r) =>
    P.seqObj<Clause>(
      ["variables", P.alt(r.variable, r.negatedVariable).sepBy(P.whitespace)],
      P.whitespace,
      P.string("0")
    ),
  formula: (r) => P.seqObj<CNFFormula>(["clauses", r.clause]),
  file: (r) => r.comment.many().then(r.desc).then<CNFFormula>(r.formula),
});
