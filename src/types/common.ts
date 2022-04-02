export interface Variable {
  type: "var";
  name: string;
}
export interface Negation {
  var: Variable;
  type: "not";
}
