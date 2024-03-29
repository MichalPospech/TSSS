export type Variable = {
  type: "var";
  name: string;
}
export type Negation = {
  var: Variable;
  type: "not";
}

export function createVariable(name: string): Variable {
  return {
    type: "var",
    name: name,
  };
}

export function createNegation(variable: Variable): Negation {
  return {
    type: "not",
    var: variable,
  };
}
