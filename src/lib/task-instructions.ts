const hiddenSupportPatterns = [
  /^support document\s*:/i,
  /^checked requirements\s*:/i,
  /\b(?:simulator|checker|peak)\s+validates\b/i
];

export function visibleSupportLines(lines: string[]) {
  return lines
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !hiddenSupportPatterns.some((pattern) => pattern.test(line)));
}

export function compactSupportLines(lines: string[], exactLines: string[] = []) {
  const exact = Array.from(new Set(exactLines.map((line) => line.trim()).filter(Boolean)));
  return exact.length ? exact : visibleSupportLines(lines);
}
