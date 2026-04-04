// Feature: maze-solver-visualizer
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { getCellClass } from "../utils/colorMapping.js";

const CELL_STATES = ["empty", "wall", "start", "end", "visited", "path"];

// Property 2: Cell state color mapping is total and correct
// Validates: Requirements 1.2, 1.4
describe("Property 2: Cell state color mapping is total and correct", () => {
  it("getCellClass returns a non-empty string for every valid cell state", () => {
    fc.assert(
      fc.property(fc.constantFrom(...CELL_STATES), (state) => {
        const cls = getCellClass(state);
        expect(typeof cls).toBe("string");
        expect(cls.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 },
    );
  });

  it("each cell state maps to a distinct class", () => {
    const classes = CELL_STATES.map(getCellClass);
    const unique = new Set(classes);
    expect(unique.size).toBe(CELL_STATES.length);
  });

  it("start maps to a green class", () => {
    expect(getCellClass("start")).toMatch(/green/);
  });

  it("end maps to a red class", () => {
    expect(getCellClass("end")).toMatch(/red/);
  });

  it("wall maps to a dark/black class", () => {
    expect(getCellClass("wall")).toMatch(/gray-9/);
  });

  it("visited maps to a blue class", () => {
    expect(getCellClass("visited")).toMatch(/blue/);
  });

  it("path maps to a yellow class", () => {
    expect(getCellClass("path")).toMatch(/yellow/);
  });

  it("empty maps to a default background class", () => {
    const cls = getCellClass("empty");
    expect(cls.length).toBeGreaterThan(0);
  });

  it("all valid states return distinct non-empty strings (property)", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...CELL_STATES),
        fc.constantFrom(...CELL_STATES),
        (stateA, stateB) => {
          if (stateA === stateB) {
            expect(getCellClass(stateA)).toBe(getCellClass(stateB));
          } else {
            expect(getCellClass(stateA)).not.toBe(getCellClass(stateB));
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
