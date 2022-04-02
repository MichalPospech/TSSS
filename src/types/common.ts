export interface Variable {
  name: string;
}
export interface Negation<T extends Variable> {
  var: T;
}
