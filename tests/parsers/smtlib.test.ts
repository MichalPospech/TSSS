import { language } from "../../src/parser/smtlib";

test("Parse variable", () => {
  expect(language.formula.tryParse("abc")).toStrictEqual({ type: "var", name: "abc" });
});

test("Don't parse anything starting with a digit", () => {
  expect(language.formula.parse("1abc").status).toBeFalsy();
});

test("Parse negation", () => {
  expect(language.formula.tryParse("(not abc)")).toStrictEqual({ type: "not", var: { type: "var", name: "abc" } });
});

test("Don't parse non-matched parentheses - negation", () => {
  expect(language.formula.parse("(not abc").status).toBeFalsy();
});

test("Parse disjunction", () => {
  expect(language.formula.tryParse("(or a b)")).toStrictEqual({
    type: "or",
    f1: { type: "var", name: "a" },
    f2: { type: "var", name: "b" },
  });
});

test("Parse conjunction", () => {
  expect(language.formula.tryParse("(and a b)")).toStrictEqual({
    type: "and",
    f1: { type: "var", name: "a" },
    f2: { type: "var", name: "b" },
  });
});
