export type FlowNodeType = "start" | "input" | "process" | "decision" | "output" | "stop";

export type FlowNodeSeed = {
  id: string;
  type: FlowNodeType;
  label: string;
  x: number;
  y: number;
};

export type FlowEdgeSeed = {
  id: string;
  from: string;
  to: string;
  label?: string;
};

export type FlowchartModule = {
  id: string;
  title: string;
  description: string;
  allowedBlocks: FlowNodeType[];
  scenario: string;
  inputs: unknown[];
  expectedOutputs: unknown[];
  steps: string[];
  support: string[];
  starterNodes: FlowNodeSeed[];
  starterEdges: FlowEdgeSeed[];
  solutionNodes: FlowNodeSeed[];
  solutionEdges: FlowEdgeSeed[];
};

export const flowchartModules: FlowchartModule[] = [
  {
    id: "linear-sequence",
    title: "Linear sequence",
    description: "Build a straight flow from input to process to output.",
    allowedBlocks: ["start", "input", "process", "output", "stop"],
    scenario: "Convert Fahrenheit values into Celsius values.",
    inputs: [32, 212, 77],
    expectedOutputs: [0, 100, 25],
    steps: [
      "Place START at the top and STOP at the end.",
      "Add INPUT Fahrenheit before the calculation.",
      "Add PROCESS Celsius = (Fahrenheit - 32) * 5 / 9.",
      "Add OUTPUT Celsius and connect every block in order."
    ],
    support: [
      "A sequence runs one instruction after another.",
      "Input blocks collect data before the calculation.",
      "Process blocks change or calculate values.",
      "Output blocks display the final result."
    ],
    starterNodes: [
      { id: "start", type: "start", label: "START", x: 220, y: 40 },
      { id: "stop", type: "stop", label: "STOP", x: 220, y: 420 }
    ],
    starterEdges: [],
    solutionNodes: [
      { id: "start", type: "start", label: "START", x: 220, y: 40 },
      { id: "input-f", type: "input", label: "INPUT Fahrenheit", x: 190, y: 135 },
      { id: "calc-c", type: "process", label: "Celsius = (Fahrenheit - 32) * 5 / 9", x: 150, y: 230 },
      { id: "output-c", type: "output", label: "OUTPUT Celsius", x: 190, y: 325 },
      { id: "stop", type: "stop", label: "STOP", x: 220, y: 420 }
    ],
    solutionEdges: [
      { id: "e1", from: "start", to: "input-f" },
      { id: "e2", from: "input-f", to: "calc-c" },
      { id: "e3", from: "calc-c", to: "output-c" },
      { id: "e4", from: "output-c", to: "stop" }
    ]
  },
  {
    id: "binary-decision",
    title: "Binary decision",
    description: "Use a decision diamond with YES and NO paths.",
    allowedBlocks: ["start", "input", "decision", "output", "stop"],
    scenario: "Output PASS when Mark is at least 50; otherwise output FAIL.",
    inputs: [45, 82, 50],
    expectedOutputs: ["FAIL", "PASS", "PASS"],
    steps: [
      "Input Mark before the decision.",
      "Use a decision diamond for Mark >= 50.",
      "Label one outgoing connector YES and one NO.",
      "Send YES to OUTPUT PASS and NO to OUTPUT FAIL, then both finish at STOP."
    ],
    support: [
      "A decision block asks a true/false question.",
      "Every decision must have two clear exits.",
      "YES and NO labels make the route unambiguous."
    ],
    starterNodes: [
      { id: "start", type: "start", label: "START", x: 230, y: 35 },
      { id: "input-mark", type: "input", label: "INPUT Mark", x: 200, y: 130 },
      { id: "stop", type: "stop", label: "STOP", x: 230, y: 435 }
    ],
    starterEdges: [{ id: "s1", from: "start", to: "input-mark" }],
    solutionNodes: [
      { id: "start", type: "start", label: "START", x: 230, y: 35 },
      { id: "input-mark", type: "input", label: "INPUT Mark", x: 200, y: 130 },
      { id: "decision-pass", type: "decision", label: "Mark >= 50?", x: 205, y: 225 },
      { id: "output-pass", type: "output", label: "OUTPUT PASS", x: 70, y: 335 },
      { id: "output-fail", type: "output", label: "OUTPUT FAIL", x: 340, y: 335 },
      { id: "stop", type: "stop", label: "STOP", x: 230, y: 455 }
    ],
    solutionEdges: [
      { id: "e1", from: "start", to: "input-mark" },
      { id: "e2", from: "input-mark", to: "decision-pass" },
      { id: "e3", from: "decision-pass", to: "output-pass", label: "YES" },
      { id: "e4", from: "decision-pass", to: "output-fail", label: "NO" },
      { id: "e5", from: "output-pass", to: "stop" },
      { id: "e6", from: "output-fail", to: "stop" }
    ]
  },
  {
    id: "multi-way-selection",
    title: "Multi-way selection",
    description: "Chain decisions to sort data into more than two outcomes.",
    allowedBlocks: ["start", "input", "decision", "output", "stop"],
    scenario: "Classify Temp as Cold, Mild, or Hot.",
    inputs: [12, 19, 31],
    expectedOutputs: ["Cold", "Mild", "Hot"],
    steps: [
      "Input Temp once at the start.",
      "Test Temp < 15 first.",
      "Route NO to a second decision: Temp <= 25.",
      "Output Cold, Mild, or Hot from the correct branch."
    ],
    support: [
      "Multi-way selection uses more than one decision.",
      "The order of tests matters.",
      "The NO branch can lead to another decision."
    ],
    starterNodes: [
      { id: "start", type: "start", label: "START", x: 240, y: 35 },
      { id: "input-temp", type: "input", label: "INPUT Temp", x: 210, y: 120 },
      { id: "stop", type: "stop", label: "STOP", x: 240, y: 500 }
    ],
    starterEdges: [{ id: "s1", from: "start", to: "input-temp" }],
    solutionNodes: [
      { id: "start", type: "start", label: "START", x: 240, y: 35 },
      { id: "input-temp", type: "input", label: "INPUT Temp", x: 210, y: 120 },
      { id: "cold-test", type: "decision", label: "Temp < 15?", x: 215, y: 210 },
      { id: "mild-test", type: "decision", label: "Temp <= 25?", x: 215, y: 320 },
      { id: "cold", type: "output", label: "OUTPUT Cold", x: 50, y: 320 },
      { id: "mild", type: "output", label: "OUTPUT Mild", x: 70, y: 430 },
      { id: "hot", type: "output", label: "OUTPUT Hot", x: 365, y: 430 },
      { id: "stop", type: "stop", label: "STOP", x: 240, y: 535 }
    ],
    solutionEdges: [
      { id: "e1", from: "start", to: "input-temp" },
      { id: "e2", from: "input-temp", to: "cold-test" },
      { id: "e3", from: "cold-test", to: "cold", label: "YES" },
      { id: "e4", from: "cold-test", to: "mild-test", label: "NO" },
      { id: "e5", from: "mild-test", to: "mild", label: "YES" },
      { id: "e6", from: "mild-test", to: "hot", label: "NO" },
      { id: "e7", from: "cold", to: "stop" },
      { id: "e8", from: "mild", to: "stop" },
      { id: "e9", from: "hot", to: "stop" }
    ]
  },
  {
    id: "counter-loop",
    title: "Counter-controlled loop",
    description: "Repeat a process a fixed number of times.",
    allowedBlocks: ["start", "input", "process", "decision", "output", "stop"],
    scenario: "Input five prices and output the total.",
    inputs: [10, 5, 20, 15, 30],
    expectedOutputs: [80],
    steps: [
      "Set Total = 0 and Counter = 0 before the loop.",
      "Use a decision to ask whether Counter == 5.",
      "If NO, input Price, add it to Total, and increase Counter.",
      "Connect the loop back to the decision; if YES, output Total."
    ],
    support: [
      "A counter loop repeats a known number of times.",
      "Initial values must be set before the loop starts.",
      "The loop must change the counter or it will never finish."
    ],
    starterNodes: [
      { id: "start", type: "start", label: "START", x: 250, y: 35 },
      { id: "init", type: "process", label: "Total = 0, Counter = 0", x: 195, y: 120 },
      { id: "stop", type: "stop", label: "STOP", x: 250, y: 535 }
    ],
    starterEdges: [{ id: "s1", from: "start", to: "init" }],
    solutionNodes: [
      { id: "start", type: "start", label: "START", x: 250, y: 35 },
      { id: "init", type: "process", label: "Total = 0, Counter = 0", x: 195, y: 120 },
      { id: "done", type: "decision", label: "Counter == 5?", x: 220, y: 220 },
      { id: "input-price", type: "input", label: "INPUT Price", x: 220, y: 330 },
      { id: "add", type: "process", label: "Total = Total + Price", x: 190, y: 420 },
      { id: "count", type: "process", label: "Counter = Counter + 1", x: 190, y: 510 },
      { id: "output", type: "output", label: "OUTPUT Total", x: 420, y: 325 },
      { id: "stop", type: "stop", label: "STOP", x: 430, y: 430 }
    ],
    solutionEdges: [
      { id: "e1", from: "start", to: "init" },
      { id: "e2", from: "init", to: "done" },
      { id: "e3", from: "done", to: "input-price", label: "NO" },
      { id: "e4", from: "input-price", to: "add" },
      { id: "e5", from: "add", to: "count" },
      { id: "e6", from: "count", to: "done" },
      { id: "e7", from: "done", to: "output", label: "YES" },
      { id: "e8", from: "output", to: "stop" }
    ]
  },
  {
    id: "sentinel-loop",
    title: "Rogue-value loop",
    description: "Repeat until a sentinel value tells the algorithm to stop.",
    allowedBlocks: ["start", "input", "process", "decision", "output", "stop"],
    scenario: "Count positive numbers until -1 is entered.",
    inputs: [4, 18, 9, 23, -1],
    expectedOutputs: [4],
    steps: [
      "Set ItemCount = 0 before reading the first number.",
      "Input Num, then test whether Num == -1.",
      "If NO, add 1 to ItemCount and input the next Num.",
      "If YES, output ItemCount and stop."
    ],
    support: [
      "A rogue value, also called a sentinel, marks the end of input.",
      "The rogue value is not processed as normal data.",
      "The input step must happen again inside the loop."
    ],
    starterNodes: [
      { id: "start", type: "start", label: "START", x: 240, y: 35 },
      { id: "init", type: "process", label: "ItemCount = 0", x: 210, y: 125 },
      { id: "stop", type: "stop", label: "STOP", x: 400, y: 440 }
    ],
    starterEdges: [{ id: "s1", from: "start", to: "init" }],
    solutionNodes: [
      { id: "start", type: "start", label: "START", x: 240, y: 35 },
      { id: "init", type: "process", label: "ItemCount = 0", x: 210, y: 125 },
      { id: "input", type: "input", label: "INPUT Num", x: 220, y: 215 },
      { id: "rogue", type: "decision", label: "Num == -1?", x: 220, y: 310 },
      { id: "count", type: "process", label: "ItemCount = ItemCount + 1", x: 85, y: 430 },
      { id: "output", type: "output", label: "OUTPUT ItemCount", x: 390, y: 360 },
      { id: "stop", type: "stop", label: "STOP", x: 405, y: 455 }
    ],
    solutionEdges: [
      { id: "e1", from: "start", to: "init" },
      { id: "e2", from: "init", to: "input" },
      { id: "e3", from: "input", to: "rogue" },
      { id: "e4", from: "rogue", to: "output", label: "YES" },
      { id: "e5", from: "rogue", to: "count", label: "NO" },
      { id: "e6", from: "count", to: "input" },
      { id: "e7", from: "output", to: "stop" }
    ]
  },
  {
    id: "nested-decisions",
    title: "Nested decisions",
    description: "Route one decision into another decision.",
    allowedBlocks: ["start", "input", "process", "decision", "output", "stop"],
    scenario: "Calculate ticket price from Age and VIP status.",
    inputs: [[14, "NO"], [25, "YES"], [40, "NO"]],
    expectedOutputs: [5, 8, 12],
    steps: [
      "Input both Age and VIP.",
      "Test Age < 18 first.",
      "Route NO to a second decision that tests VIP == YES.",
      "Set the correct Price before outputting it."
    ],
    support: [
      "Nested decisions are useful when a second condition only matters after the first condition.",
      "Each path must lead to a clear output.",
      "Process blocks can assign values before output."
    ],
    starterNodes: [
      { id: "start", type: "start", label: "START", x: 250, y: 35 },
      { id: "input", type: "input", label: "INPUT Age, VIP", x: 205, y: 125 },
      { id: "stop", type: "stop", label: "STOP", x: 250, y: 540 }
    ],
    starterEdges: [{ id: "s1", from: "start", to: "input" }],
    solutionNodes: [
      { id: "start", type: "start", label: "START", x: 250, y: 35 },
      { id: "input", type: "input", label: "INPUT Age, VIP", x: 205, y: 125 },
      { id: "child", type: "decision", label: "Age < 18?", x: 220, y: 220 },
      { id: "vip", type: "decision", label: "VIP == YES?", x: 385, y: 330 },
      { id: "price5", type: "process", label: "Price = 5", x: 70, y: 330 },
      { id: "price8", type: "process", label: "Price = 8", x: 300, y: 455 },
      { id: "price12", type: "process", label: "Price = 12", x: 480, y: 455 },
      { id: "output", type: "output", label: "OUTPUT Price", x: 235, y: 555 },
      { id: "stop", type: "stop", label: "STOP", x: 250, y: 645 }
    ],
    solutionEdges: [
      { id: "e1", from: "start", to: "input" },
      { id: "e2", from: "input", to: "child" },
      { id: "e3", from: "child", to: "price5", label: "YES" },
      { id: "e4", from: "child", to: "vip", label: "NO" },
      { id: "e5", from: "vip", to: "price8", label: "YES" },
      { id: "e6", from: "vip", to: "price12", label: "NO" },
      { id: "e7", from: "price5", to: "output" },
      { id: "e8", from: "price8", to: "output" },
      { id: "e9", from: "price12", to: "output" },
      { id: "e10", from: "output", to: "stop" }
    ]
  },
  {
    id: "maximum-value",
    title: "Maximum value algorithm",
    description: "Track and update the largest value in a list.",
    allowedBlocks: ["start", "input", "process", "decision", "output", "stop"],
    scenario: "Read four numbers and output the highest value.",
    inputs: [14, 89, 43, 72],
    expectedOutputs: [89],
    steps: [
      "Input the first number as MaxVal.",
      "Use a counter to read three more numbers.",
      "Compare each NextNum with MaxVal.",
      "Update MaxVal only when the new number is greater."
    ],
    support: [
      "A running maximum stores the best value found so far.",
      "The first input can initialise MaxVal.",
      "A nested decision decides whether to replace MaxVal."
    ],
    starterNodes: [
      { id: "start", type: "start", label: "START", x: 250, y: 35 },
      { id: "input-first", type: "input", label: "INPUT MaxVal", x: 210, y: 120 },
      { id: "stop", type: "stop", label: "STOP", x: 250, y: 610 }
    ],
    starterEdges: [{ id: "s1", from: "start", to: "input-first" }],
    solutionNodes: [
      { id: "start", type: "start", label: "START", x: 250, y: 35 },
      { id: "input-first", type: "input", label: "INPUT MaxVal", x: 210, y: 120 },
      { id: "init-count", type: "process", label: "LoopCount = 1", x: 210, y: 210 },
      { id: "done", type: "decision", label: "LoopCount == 4?", x: 220, y: 305 },
      { id: "input-next", type: "input", label: "INPUT NextNum", x: 220, y: 410 },
      { id: "greater", type: "decision", label: "NextNum > MaxVal?", x: 220, y: 505 },
      { id: "update", type: "process", label: "MaxVal = NextNum", x: 65, y: 610 },
      { id: "step", type: "process", label: "LoopCount = LoopCount + 1", x: 220, y: 705 },
      { id: "output", type: "output", label: "OUTPUT MaxVal", x: 420, y: 365 },
      { id: "stop", type: "stop", label: "STOP", x: 430, y: 465 }
    ],
    solutionEdges: [
      { id: "e1", from: "start", to: "input-first" },
      { id: "e2", from: "input-first", to: "init-count" },
      { id: "e3", from: "init-count", to: "done" },
      { id: "e4", from: "done", to: "output", label: "YES" },
      { id: "e5", from: "done", to: "input-next", label: "NO" },
      { id: "e6", from: "input-next", to: "greater" },
      { id: "e7", from: "greater", to: "update", label: "YES" },
      { id: "e8", from: "greater", to: "step", label: "NO" },
      { id: "e9", from: "update", to: "step" },
      { id: "e10", from: "step", to: "done" },
      { id: "e11", from: "output", to: "stop" }
    ]
  },
  {
    id: "synthesis-challenge",
    title: "Complete synthesis challenge",
    description: "Combine loop, decision, process, input, and output in one algorithm.",
    allowedBlocks: ["start", "input", "process", "decision", "output", "stop"],
    scenario: "Apply a 10% discount to totals above 100, and repeat until 0 is entered.",
    inputs: [120, 50, 200, 0],
    expectedOutputs: [108, 50, 180],
    steps: [
      "Input Total before the loop test.",
      "Use Total <> 0 as the loop condition.",
      "Inside the loop, test Total > 100.",
      "Set Net to Total * 0.90 or Total, output Net, then input the next Total."
    ],
    support: [
      "This final task combines sequence, selection, and iteration.",
      "The loop stops when Total is 0.",
      "The discount calculation belongs only on the YES branch of Total > 100."
    ],
    starterNodes: [
      { id: "start", type: "start", label: "START", x: 250, y: 35 },
      { id: "input-total", type: "input", label: "INPUT Total", x: 210, y: 120 },
      { id: "stop", type: "stop", label: "STOP", x: 470, y: 345 }
    ],
    starterEdges: [{ id: "s1", from: "start", to: "input-total" }],
    solutionNodes: [
      { id: "start", type: "start", label: "START", x: 250, y: 35 },
      { id: "input-total", type: "input", label: "INPUT Total", x: 210, y: 120 },
      { id: "continue", type: "decision", label: "Total <> 0?", x: 220, y: 215 },
      { id: "discount", type: "decision", label: "Total > 100?", x: 220, y: 325 },
      { id: "net-discount", type: "process", label: "Net = Total * 0.90", x: 65, y: 445 },
      { id: "net-full", type: "process", label: "Net = Total", x: 385, y: 445 },
      { id: "output", type: "output", label: "OUTPUT Net", x: 220, y: 560 },
      { id: "repeat", type: "input", label: "INPUT Total", x: 220, y: 655 },
      { id: "stop", type: "stop", label: "STOP", x: 470, y: 275 }
    ],
    solutionEdges: [
      { id: "e1", from: "start", to: "input-total" },
      { id: "e2", from: "input-total", to: "continue" },
      { id: "e3", from: "continue", to: "discount", label: "YES" },
      { id: "e4", from: "continue", to: "stop", label: "NO" },
      { id: "e5", from: "discount", to: "net-discount", label: "YES" },
      { id: "e6", from: "discount", to: "net-full", label: "NO" },
      { id: "e7", from: "net-discount", to: "output" },
      { id: "e8", from: "net-full", to: "output" },
      { id: "e9", from: "output", to: "repeat" },
      { id: "e10", from: "repeat", to: "continue" }
    ]
  }
];

export function getFlowchartModule(moduleId: string) {
  return flowchartModules.find((module) => module.id === moduleId);
}
