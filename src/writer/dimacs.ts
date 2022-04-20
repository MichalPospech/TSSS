import { EOL } from "os";
import { Clause, CNFFormula, extractVariableNames } from "../types/cnf";

export function convertToString(formula: CNFFormula): string {
  const variableCount = extractVariableNames(formula).length;
  const clauseCount = formula.clauses.length;
  const desc = `p cnf ${variableCount} ${clauseCount}`;
  return [desc].concat(formula.clauses.map(convertClauseToString)).join(EOL);
}

function convertClauseToString(clause: Clause): string {
  return clause.literals
    .map((l) => {
      switch (l.type) {
        case "not":
          return `-${l.var.name}`;
        case "var":
          return l.name;
      }
    })
    .join(" ")
    .concat(" 0");
}
