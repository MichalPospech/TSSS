import { language, Variable, Negation } from "../../src/parser/smtlib";

test("Parse variable", () => {
  expect(language.formula.tryParse("abc")).toStrictEqual(<Variable>{ name: "abc" });
});

test("Don't parse anything starting with a digit", () => {
  expect(language.formula.parse("1abc").status).toBeFalsy();
});

test("Parse negation", () => {
  expect(language.formula.tryParse("( not abc )")).toStrictEqual(<Negation>{ var: <Variable>{ name: "abc" } });
});

test("Don't parse non-matched parentheses - negation", () => {
  expect(language.formula.parse("( not abc").status).toBeFalsy();
});