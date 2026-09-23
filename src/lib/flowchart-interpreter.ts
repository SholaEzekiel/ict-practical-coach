import type { FlowEdgeSeed, FlowNodeSeed } from "./flowchart-instruction-cards";

export type FlowValue = string | number | boolean;

export type FlowRunResult = {
  outputs: FlowValue[];
  variables: Record<string, FlowValue>;
  steps: number;
};

type Token =
  | { type: "number"; value: number }
  | { type: "string"; value: string }
  | { type: "identifier"; value: string }
  | { type: "operator"; value: string }
  | { type: "left" | "right" };

const MAX_STEPS = 500;

function keyOf(value: string) {
  return value.trim().toLowerCase();
}

function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;

  while (index < expression.length) {
    const character = expression[index];
    if (/\s/.test(character)) {
      index += 1;
      continue;
    }

    if (character === '"' || character === "'") {
      const quote = character;
      let value = "";
      index += 1;
      while (index < expression.length && expression[index] !== quote) {
        if (expression[index] === "\\" && index + 1 < expression.length) {
          index += 1;
        }
        value += expression[index];
        index += 1;
      }
      if (expression[index] !== quote) throw new Error("A text value has a missing closing quote.");
      tokens.push({ type: "string", value });
      index += 1;
      continue;
    }

    const numberMatch = expression.slice(index).match(/^\d+(?:\.\d+)?/);
    if (numberMatch) {
      tokens.push({ type: "number", value: Number(numberMatch[0]) });
      index += numberMatch[0].length;
      continue;
    }

    const identifierMatch = expression.slice(index).match(/^[A-Za-z_][A-Za-z0-9_]*/);
    if (identifierMatch) {
      tokens.push({ type: "identifier", value: identifierMatch[0] });
      index += identifierMatch[0].length;
      continue;
    }

    const pair = expression.slice(index, index + 2);
    if ([">=", "<=", "==", "!=", "<>"].includes(pair)) {
      tokens.push({ type: "operator", value: pair === "<>" ? "!=" : pair });
      index += 2;
      continue;
    }

    if (["+", "-", "*", "/", ">", "<", "="].includes(character)) {
      tokens.push({ type: "operator", value: character === "=" ? "==" : character });
      index += 1;
      continue;
    }

    if (character === "(") tokens.push({ type: "left" });
    else if (character === ")") tokens.push({ type: "right" });
    else throw new Error(`Unsupported symbol "${character}".`);
    index += 1;
  }

  return tokens;
}

function asNumber(value: FlowValue, operator: string) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) throw new Error(`${operator} needs numeric values.`);
  return number;
}

function evaluateExpression(expression: string, variables: Map<string, FlowValue>): FlowValue {
  const tokens = tokenize(expression.trim().replace(/\?$/, ""));
  let position = 0;

  function primary(): FlowValue {
    const token = tokens[position];
    if (!token) throw new Error("An expression is incomplete.");
    position += 1;

    if (token.type === "number" || token.type === "string") return token.value;
    if (token.type === "identifier") {
      const key = keyOf(token.value);
      if (variables.has(key)) return variables.get(key)!;
      if (key === "true") return true;
      if (key === "false") return false;
      return token.value;
    }
    if (token.type === "left") {
      const value = comparison();
      if (tokens[position]?.type !== "right") throw new Error("An expression has an unmatched bracket.");
      position += 1;
      return value;
    }
    if (token.type === "operator" && token.value === "-") return -asNumber(primary(), "-");
    throw new Error("An expression starts with an invalid value.");
  }

  function multiply(): FlowValue {
    let value = primary();
    while (true) {
      const token = tokens[position];
      if (token?.type !== "operator" || !["*", "/"].includes(token.value)) break;
      const operator = token.value;
      position += 1;
      const right = primary();
      value = operator === "*" ? asNumber(value, operator) * asNumber(right, operator) : asNumber(value, operator) / asNumber(right, operator);
    }
    return value;
  }

  function add(): FlowValue {
    let value = multiply();
    while (true) {
      const token = tokens[position];
      if (token?.type !== "operator" || !["+", "-"].includes(token.value)) break;
      const operator = token.value;
      position += 1;
      const right = multiply();
      if (operator === "+" && (typeof value === "string" || typeof right === "string")) value = String(value) + String(right);
      else value = operator === "+" ? asNumber(value, operator) + asNumber(right, operator) : asNumber(value, operator) - asNumber(right, operator);
    }
    return value;
  }

  function comparison(): FlowValue {
    let value = add();
    const token = tokens[position];
    if (token?.type === "operator" && [">=", "<=", "==", "!=", ">", "<"].includes(token.value)) {
      position += 1;
      const right = add();
      switch (token.value) {
        case ">=": value = asNumber(value, token.value) >= asNumber(right, token.value); break;
        case "<=": value = asNumber(value, token.value) <= asNumber(right, token.value); break;
        case ">": value = asNumber(value, token.value) > asNumber(right, token.value); break;
        case "<": value = asNumber(value, token.value) < asNumber(right, token.value); break;
        case "==": value = String(value).toLowerCase() === String(right).toLowerCase(); break;
        case "!=": value = String(value).toLowerCase() !== String(right).toLowerCase(); break;
      }
    }
    return value;
  }

  const value = comparison();
  if (position !== tokens.length) throw new Error("An expression contains extra or misplaced text.");
  return value;
}

function splitAssignments(value: string) {
  const parts: string[] = [];
  let current = "";
  let depth = 0;
  let quote = "";
  for (const character of value) {
    if (quote) {
      current += character;
      if (character === quote) quote = "";
    } else if (character === '"' || character === "'") {
      quote = character;
      current += character;
    } else if (character === "(") {
      depth += 1;
      current += character;
    } else if (character === ")") {
      depth -= 1;
      current += character;
    } else if (character === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
    } else current += character;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

function nextEdge(node: FlowNodeSeed, edges: FlowEdgeSeed[], condition?: boolean) {
  const outgoing = edges.filter((edge) => edge.from === node.id);
  if (node.type === "stop") return undefined;
  if (node.type === "decision") {
    const wanted = condition ? ["yes", "true"] : ["no", "false"];
    const match = outgoing.find((edge) => wanted.includes(keyOf(edge.label || "")));
    if (!match) throw new Error(`${node.label} needs a ${condition ? "YES" : "NO"} connector.`);
    return match;
  }
  if (outgoing.length !== 1) throw new Error(`${node.label} must have exactly one outgoing connector.`);
  return outgoing[0];
}

function outputExpression(label: string, variables: Map<string, FlowValue>) {
  const expression = label.replace(/^\s*(output|display)\s*/i, "").trim();
  if (!expression) throw new Error("An OUTPUT block needs a value to display.");
  const variable = variables.get(keyOf(expression));
  if (variable !== undefined) return variable;
  try {
    return evaluateExpression(expression, variables);
  } catch {
    return expression;
  }
}

export function runFlowchart(nodes: FlowNodeSeed[], edges: FlowEdgeSeed[], inputs: FlowValue[]): FlowRunResult {
  const starts = nodes.filter((node) => node.type === "start");
  if (starts.length !== 1) throw new Error("The flowchart needs exactly one START block.");

  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const variables = new Map<string, FlowValue>();
  const outputs: FlowValue[] = [];
  let inputIndex = 0;
  let current: FlowNodeSeed | undefined = starts[0];
  let steps = 0;

  while (current) {
    steps += 1;
    if (steps > MAX_STEPS) throw new Error("The flowchart exceeded 500 steps. Check for a loop that never ends.");

    let condition: boolean | undefined;
    if (current.type === "input") {
      const names = current.label.replace(/^\s*input\s*/i, "").split(",").map((name) => name.trim()).filter(Boolean);
      if (!names.length) throw new Error("An INPUT block needs a variable name.");
      for (const name of names) {
        if (inputIndex >= inputs.length) throw new Error(`${current.label} needs another test input.`);
        variables.set(keyOf(name), inputs[inputIndex]);
        inputIndex += 1;
      }
    } else if (current.type === "process") {
      const process = current.label.replace(/^\s*process\s*/i, "").trim();
      if (process.includes("=")) {
        for (const assignment of splitAssignments(process)) {
          const match = assignment.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/);
          if (!match) throw new Error(`${current.label} is not a valid assignment.`);
          variables.set(keyOf(match[1]), evaluateExpression(match[2], variables));
        }
      }
    } else if (current.type === "decision") {
      condition = Boolean(evaluateExpression(current.label, variables));
    } else if (current.type === "output") {
      outputs.push(outputExpression(current.label, variables));
    } else if (current.type === "stop") {
      return { outputs, variables: Object.fromEntries(variables), steps };
    }

    const edge = nextEdge(current, edges, condition);
    if (!edge) break;
    current = nodeById.get(edge.to);
    if (!current) throw new Error("A connector points to a block that no longer exists.");
  }

  throw new Error("The flowchart ended without reaching STOP.");
}

export function parseFlowchartInputs(value: string): FlowValue[] {
  const trimmed = value.trim();
  if (!trimmed) return [];
  try {
    const parsed: unknown = JSON.parse(trimmed);
    const values = Array.isArray(parsed) ? parsed : [parsed];
    if (values.some((item) => !["string", "number", "boolean"].includes(typeof item))) {
      throw new Error("Use text, numbers, true, or false as test values.");
    }
    return values as FlowValue[];
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Use text")) throw error;
    return [trimmed];
  }
}

export function valuesMatch(actual: FlowValue[], expected: unknown[]) {
  if (actual.length !== expected.length) return false;
  return actual.every((value, index) => {
    const target = expected[index];
    if (typeof value === "number" && typeof target === "number") return Math.abs(value - target) < 0.000001;
    return String(value).trim().toLowerCase() === String(target).trim().toLowerCase();
  });
}
