import arrayUnique from "array-unique";
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

export function extractVariableNames(formula: CNFFormula): string[] {
  return arrayUnique(formula.clauses.map(extractVariablesFromClause).flat());
}

function extractVariablesFromClause(formula: Clause): string[] {
  return arrayUnique(
    formula.literals.map((l) => {
      switch (l.type) {
        case "not":
          return l.var.name;
        case "var":
          return l.name;
      }
    })
  );
}
