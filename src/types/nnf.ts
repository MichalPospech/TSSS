import { Negation, Variable } from "./common";

export type Operator = {
  f1: NNFFormula;
  f2: NNFFormula;
  type: "or" | "and";
}

export type NNFFormula = Negation | Operator | Variable;

export function createOperator(operator: "or" | "and", left: NNFFormula, right: NNFFormula): NNFFormula {
  return {
    type: operator,
    f1: left,
    f2: right,
  };
}

