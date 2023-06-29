import union from "arr-union";
import { Negation, Variable } from "./common";

export interface Operator {
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

export function collectVariables(formula: NNFFormula): string[] {
  switch (formula.type) {
    case "var":
      return [formula.name];
    case "not":
      return collectVariables(formula.var);
    case 'or':
    case "and": {
      return union(collectVariables(formula.f1), collectVariables(formula.f2));
    }
  }
}
