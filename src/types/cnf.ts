import { Negation, Variable } from "./common";

export type Literal = Negation | Variable

export type Clause = {
  literals: Array<Literal>;
}

export type CNFFormula = {
  clauses: Array<Clause>;
}

export function createClause(...literals: (Literal)[]): Clause {
  return {
    literals: Array.from(literals),
  };
}
export function createCNFFormula(...clauses: Clause[]): CNFFormula {
  return {
    clauses: Array.from(clauses),
  };
}

