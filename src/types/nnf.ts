import { Negation, Variable } from "./common";

export interface Operator {
  f1: NNFFormula;
  f2: NNFFormula;
  type: "or" | "and";
}

export type NNFFormula = Negation | Operator | Variable;
