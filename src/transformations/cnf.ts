import { CNFFormula, createClause, createCNFFormula } from "../types/cnf";
import { createNegation, createVariable, Negation, Variable } from "../types/common";
import { NNFFormula } from "../types/nnf";

type Literal = Negation | Variable;

export function fromNNF(formula: NNFFormula, variableNamesGenerator: Generator<string>): [CNFFormula, Literal] {
  switch (formula.type) {
    case "not": {
      const cnf = createCNFFormula(createClause(formula));
      return [cnf, formula];
    }
    case "var": {
      const cnf = createCNFFormula(createClause(formula));
      return [cnf, formula];
    }
    case "and": {
      const variable = createVariable(variableNamesGenerator.next().value);
      const [cnfL, litL] = fromNNF(formula.f1, variableNamesGenerator);
      const [cnfR, litR] = fromNNF(formula.f2, variableNamesGenerator);
      const cnf = createCNFFormula(
        createClause(negateLiteral(litL), negateLiteral(litR), variable),
        createClause(litL, negateLiteral(variable)),
        createClause(litR, negateLiteral(variable))
      );
      const mergedCNF = mergeCNFs(cnf, cnfL, cnfR);
      return [mergedCNF, variable];
    }
    case "or": {
      const variable = createVariable(variableNamesGenerator.next().value);
      const [cnfL, litL] = fromNNF(formula.f1, variableNamesGenerator);
      const [cnfR, litR] = fromNNF(formula.f2, variableNamesGenerator);
      const cnf = createCNFFormula(
        createClause(litL, litR, negateLiteral(variable)),
        createClause(negateLiteral(litL), variable),
        createClause(negateLiteral(litR), variable)
      );
      const mergedCNF = mergeCNFs(cnf, cnfL, cnfR);
      return [mergedCNF, variable];
    }
  }
}

function mergeCNFs(...cnfs: CNFFormula[]): CNFFormula {
  return {
    clauses: Array.from(cnfs.flatMap((f) => f.clauses)),
  };
}

function negateLiteral(literal: Literal): Literal {
  switch (literal.type) {
    case "var":
      return createNegation(literal);

    case "not":
      return literal.var;
  }
}
