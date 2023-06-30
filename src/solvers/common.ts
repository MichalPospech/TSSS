import { Clause, CNFFormula, Literal } from "../types/cnf.js";
import deepEqual from 'deep-equal';
import { createNegation } from "../types/common.js";

export function applyAssignment(formula: CNFFormula, assignment: Literal): CNFFormula {
    const notSatisfiedClauses = formula.clauses.filter(
        c => c.literals.filter(
            l => deepEqual(l, assignment)
        ).length == 0
    );

    const negatedAssignment = negateLiteral(assignment);
    const finalFormula = <CNFFormula>{
        clauses:
            notSatisfiedClauses.map(
                c => <Clause>{
                    literals: c.literals.filter(
                        l => !deepEqual(l, negatedAssignment)
                    )
                }
            )
    };
    return finalFormula;
}

function negateLiteral(literal: Literal): Literal {
    switch (literal.type) {
        case 'not':
            return literal.var

        case 'var':
            createNegation(literal)
    }
}