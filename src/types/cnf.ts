import { Negation, Variable } from "./common";

export interface Clause {
  variables: Array<Negation | Variable>;
}

export interface CNFFormula {
  clauses: Array<Clause>;
}
