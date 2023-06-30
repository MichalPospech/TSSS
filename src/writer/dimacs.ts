import { EOL } from "os";
import { Clause, CNFFormula, extractVariableNames } from "../types/cnf.js";

export function convertToString(formula: CNFFormula, comments: string[]): string {
  const variableCount = extractVariableNames(formula).length;
  const clauseCount = formula.clauses.length;
  const desc = `p cnf ${variableCount} ${clauseCount}`;
  const commentLines = comments.map(c => `c ${c}`).join(EOL);
  return [commentLines, desc].concat(formula.clauses.map(convertClauseToString)).join(EOL);
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
