import { Negation, Variable } from "./common";

export interface Clause<TVar extends Variable, TNeg extends Negation<TVar>> {
  variables: Array<TVar | TNeg>;
}

export interface CNFFormula<TVar extends Variable, TNeg extends Negation<TVar>> {
  clauses: Array<Clause<TVar, TNeg>>;
}
