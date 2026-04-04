/**
 * Returns a Tailwind CSS class string for the given cell state.
 * @param {'empty'|'wall'|'start'|'end'|'visited'|'path'} state
 * @returns {string}
 */
export function getCellClass(state) {
  switch (state) {
    case "start":
      return "bg-green-500";
    case "end":
      return "bg-red-500";
    case "wall":
      return "bg-gray-900";
    case "visited":
      return "bg-blue-400";
    case "path":
      return "bg-yellow-400";
    case "empty":
    default:
      return "bg-gray-800";
  }
}
