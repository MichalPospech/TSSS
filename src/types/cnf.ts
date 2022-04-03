import { Negation, Variable } from "./common";

export interface Clause {
  literals: Array<Negation | Variable>;
}

export interface CNFFormula {
  clauses: Array<Clause>;
}

export function createClause(...literals: (Negation | Variable)[]): Clause {
  return {
    literals: Array.from(literals),
  };
}
export function createCNFFormula(...clauses: Clause[]): CNFFormula {
  return {
    clauses: Array.from(clauses),
  };
}
