import { cn } from "./utils";

describe("cn", () => {
  it("should return 'a b c' when given 'a', 'b', and 'c'", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("should return an empty string when no arguments are given", () => {
    expect(cn()).toBe("");
  });
});