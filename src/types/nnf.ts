import { Negation, Variable } from "./common";

export interface Conjunction<TVar extends Variable, TNeg extends Negation<TVar>> {
  f1: NNFFormula<TVar, TNeg>;
  f2: NNFFormula<TVar, TNeg>;
}

export interface Disjunction<TVar extends Variable, TNeg extends Negation<TVar>> {
  f1: NNFFormula<TVar, TNeg>;
  f2: NNFFormula<TVar, TNeg>;
}

export type NNFFormula<TVar extends Variable, TNeg extends Negation<TVar>> =
  | TNeg
  | Disjunction<TVar, TNeg>
  | Conjunction<TVar, TNeg>
  | TVar;
