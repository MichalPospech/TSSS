import { genSequence, Sequence } from "gensequence";
import { CNFFormula, createClause, createCNFFormula } from "../types/cnf.js";
import { createNegation, createVariable, Negation, Variable } from "../types/common.js";
import { createOperator, NNFFormula } from "../types/nnf.js";
import union from "arr-union";

type Literal = Negation | Variable;

export function fromNNF(formula: NNFFormula, bidirectional = true): [CNFFormula, string[]] {
  const vars = collectVariables(formula);
  const nameGenerator = genSequence(function* () {
    let i = 1;
    while (true) {
      yield i.toString();
      i++;
    }
  });
  const mapping = createVariableMaping(vars, nameGenerator);
  const renamedFormula = renameVariables(formula, (s) => mapping.get(s));
  const [cnf, topLevelVar] = fromNNFInternal(renamedFormula, nameGenerator.skip(mapping.size), bidirectional);
  const completeCNF = mergeCNFs(createCNFFormula(createClause(topLevelVar)), cnf);
  const originalVariablesNotes = Array.from(mapping.entries()).map(
    ([originalVar, newVar]) => `${originalVar} → ${newVar}`
  );
  const topVarName = topLevelVar.type === "var" ? topLevelVar.name : topLevelVar.var.name;
  const notes = [
    "Original variables mappings",
    ...originalVariablesNotes,
    `Root variable from Tseitin encoding: ${topVarName}`,
  ];
  return [completeCNF, notes];
}

function fromNNFInternal(
  formula: NNFFormula,
  variableNamesGenerator: Sequence<string>,
  bidirectional = true
): [CNFFormula, Literal] {
  switch (formula.type) {
    case "not": {
      const cnf = createCNFFormula();
      return [cnf, negateLiteral(formula)];
    }
    case "var": {
      const cnf = createCNFFormula();
      return [cnf, formula];
    }
    case "and": {
      const variable = createVariable(variableNamesGenerator.next().value);
      const [cnfL, litL] = fromNNFInternal(formula.f1, variableNamesGenerator, bidirectional);
      const [cnfR, litR] = fromNNFInternal(formula.f2, variableNamesGenerator, bidirectional);
      const cnf = bidirectional
        ? createCNFFormula(
          createClause(negateLiteral(litL), negateLiteral(litR), variable),
          createClause(litL, negateLiteral(variable)),
          createClause(litR, negateLiteral(variable))
        )
        : createCNFFormula(createClause(litL, negateLiteral(variable)), createClause(litR, negateLiteral(variable)));
      const mergedCNF = mergeCNFs(cnf, cnfL, cnfR);
      return [mergedCNF, variable];
    }
    case "or": {
      const variable = createVariable(variableNamesGenerator.next().value);
      const [cnfL, litL] = fromNNFInternal(formula.f1, variableNamesGenerator, bidirectional);
      const [cnfR, litR] = fromNNFInternal(formula.f2, variableNamesGenerator, bidirectional);
      const cnf = bidirectional
        ? createCNFFormula(
          createClause(litL, litR, negateLiteral(variable)),
          createClause(negateLiteral(litL), variable),
          createClause(negateLiteral(litR), variable)
        )
        : createCNFFormula(createClause(litL, litR, negateLiteral(variable)));
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

function createVariableMaping(variables: string[], nameGenerator: Sequence<string>): Map<string, string> {
  const numbers = nameGenerator.take(variables.length).toArray();
  return new Map<string, string>(variables.map((e, i) => [e, numbers[i]]));
}

function renameVariables(formula: NNFFormula, newName: (s: string) => string): NNFFormula {
  switch (formula.type) {
    case "or":
    case "and": {
      const left = renameVariables(formula.f1, newName);
      const right = renameVariables(formula.f2, newName);
      return createOperator(formula.type, left, right);
    }
    case "not": {
      const variable = createVariable(newName(formula.var.name));
      const negated = createNegation(variable);
      return negated;
    }
    case "var": {
      return createVariable(newName(formula.name));
    }
  }
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
