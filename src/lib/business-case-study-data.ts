export type BusinessAssessmentSkill = "K" | "APP" | "AN" | "EVAL";

export type BusinessCaseStudyQuestion = {
  id: string;
  skill: BusinessAssessmentSkill;
  question: string;
  examHint?: string;
  options: string[];
  correctIndex: number;
  feedback: string[];
};

export type BusinessCaseStudy = {
  id: string;
  unitId: number;
  title: string;
  scenario: string;
  details: string[];
  questions: BusinessCaseStudyQuestion[];
};

type CaseSeed = {
  id: string;
  unitId: number;
  title: string;
  scenario: string;
  details: string[];
  focus: string;
  genericTheory: string;
  appliedPoint: string;
  analysisChain: string;
  evaluation: string;
};

type QuestionDraft = {
  question: string;
  options: [string, string, string, string];
  correctIndex?: number;
  hint: string;
  feedback: string[];
};

type ReasoningDistractors = {
  application: [string, string, string];
  analysis: [string, string, string];
  evaluation: [string, string, string];
};

const caseSkillProgression: BusinessAssessmentSkill[][] = [
  ["K", "K", "APP", "AN", "EVAL"],
  ["K", "K", "APP", "AN", "EVAL"],
  ["K", "K", "APP", "AN", "EVAL"],
  ["K", "K", "APP", "AN", "EVAL"],
  ["K", "K", "APP", "AN", "EVAL"],
  ["K", "K", "APP", "AN", "EVAL"]
];

function rotateOptions(options: [string, string, string, string], id: string): { options: [string, string, string, string]; correctIndex: number } {
  const shift = id.split("").reduce((total, char) => total + char.charCodeAt(0), 0) % options.length;
  const rotated = [...options.slice(shift), ...options.slice(0, shift)] as [string, string, string, string];
  const correctIndex = rotated.indexOf(options[0]);
  return { options: rotated, correctIndex };
}

function makeQuestion(seed: CaseSeed, id: string, skill: BusinessAssessmentSkill, draft: QuestionDraft): BusinessCaseStudyQuestion {
  const ordered = rotateOptions(draft.options, id);
  return {
    id,
    skill,
    question: draft.question,
    examHint: draft.hint,
    options: ordered.options,
    correctIndex: draft.correctIndex ?? ordered.correctIndex,
    feedback: draft.feedback
  };
}

function knowledgeItem(
  question: string,
  hint: string,
  correct: string,
  distractorOne: string,
  distractorTwo: string,
  distractorThree: string,
  explanation: string
): QuestionDraft {
  return {
    question,
    hint,
    options: [correct, distractorOne, distractorTwo, distractorThree],
    feedback: [`Correct: ${explanation}`]
  };
}

const knowledgeBanks: Record<string, QuestionDraft[]> = {
  "bus-case-1-1": [
    knowledgeItem(
      "What type of business organisation is Ama's bakery most likely to be, and which detail supports this?",
      "Use the ownership information in the scenario.",
      "A sole trader, because Ama owns the bakery herself.",
      "A partnership, because the bakery employs eight workers.",
      "A public limited company, because it sells premium products.",
      "A franchise, because Ama wants to open a second shop.",
      "a sole trader is a business owned by one person; employees do not become owners"
    ),
    knowledgeItem(
      "Which production method is most suitable for making quantities of premium bread in separate baking runs?",
      "Think about products made together in groups rather than one continuous flow.",
      "Batch production",
      "Flow production",
      "Job production",
      "Lean production",
      "batch production makes a set quantity of one product before production changes to another batch"
    ),
    knowledgeItem(
      "Which source could provide Ama with long-term external finance for a second shop?",
      "Choose finance borrowed for several years rather than money generated inside the bakery.",
      "A bank loan",
      "Retained profit",
      "Trade credit for flour",
      "Reducing bread inventory",
      "a bank loan is external finance repaid over an agreed period with interest"
    )
  ],
  "bus-case-1-2": [
    knowledgeItem(
      "What is start-up capital?",
      "Identify the finance needed before a new business begins trading.",
      "Money used to establish a new business and buy its initial resources",
      "Revenue earned after the business opens",
      "Profit retained by an established company",
      "The value of goods sold during one year",
      "start-up capital pays for the assets and expenses needed to begin operating"
    ),
    knowledgeItem(
      "Which part of Leo's business plan should estimate demand for phone repairs in the mall?",
      "Choose the section that studies customers and competitors.",
      "Market research and the marketing plan",
      "The organisational chart",
      "The production quality record",
      "The statement of financial position",
      "market research helps a start-up estimate customer demand and understand competitors"
    )
  ],
  "bus-case-1-3": [
    knowledgeItem(
      "Which feature of a partnership explains why the owners' personal savings may be at risk?",
      "Recall the liability normally faced by ordinary partners.",
      "Partners usually have unlimited liability for business debts.",
      "Partners can sell shares to the public.",
      "The government owns the workshop's assets.",
      "The workshop must operate as a social enterprise.",
      "unlimited liability means owners may have to use personal assets to repay business debts"
    )
  ],
  "bus-case-1-4": [
    knowledgeItem(
      "How would the farm's activity be classified after it turns tomatoes into bottled sauce?",
      "Distinguish extracting or growing raw materials from manufacturing goods.",
      "Sauce making is secondary-sector activity because it processes raw materials.",
      "Sauce making is primary-sector activity because it grows tomatoes.",
      "Sauce making is tertiary-sector activity because every product is a service.",
      "Sauce making is public-sector activity because food is essential.",
      "the secondary sector converts raw materials into finished or semi-finished goods"
    )
  ],
  "bus-case-1-5": [
    knowledgeItem(
      "What feature makes the community gym a social enterprise?",
      "Look for the combination of trading income and a social purpose.",
      "It trades to meet a social aim while earning a surplus to continue operating.",
      "It must distribute all surplus to private shareholders.",
      "It is owned and controlled by central government.",
      "It cannot charge customers for using its services.",
      "a social enterprise uses business activity to pursue social objectives and normally reinvests surplus"
    )
  ],
  "bus-case-1-6": [
    knowledgeItem(
      "Which statement correctly describes Nia's role in the franchise?",
      "Distinguish the franchisee from the established brand owner.",
      "Nia is the franchisee who pays to use the franchisor's brand and business system.",
      "Nia is the franchisor because she follows another business's rules.",
      "Nia becomes an employee with no investment or business risk.",
      "Nia can change the brand and operating system without permission.",
      "a franchisee buys the right to operate using the franchisor's established name and methods"
    )
  ],
  "bus-case-2-1": [
    knowledgeItem(
      "What is labour turnover?",
      "Choose the meaning related to employees leaving and being replaced.",
      "The rate at which employees leave a business and are replaced",
      "The value of hotel rooms sold during a period",
      "The number of guests served by each receptionist",
      "The movement of workers between shifts each day",
      "labour turnover measures employees leaving an organisation over a period"
    ),
    knowledgeItem(
      "Which non-financial method could motivate reception staff by giving them more responsibility?",
      "Choose a method that makes the job more challenging and meaningful.",
      "Job enrichment",
      "A piece-rate payment",
      "A wage reduction",
      "Compulsory overtime",
      "job enrichment adds responsibility and more demanding tasks to a role"
    ),
    knowledgeItem(
      "Which payment method gives hotel staff a fixed amount for a year of work?",
      "Distinguish an annual payment from payment per item produced.",
      "A salary",
      "Commission",
      "Piece rate",
      "Profit sharing only",
      "a salary is a fixed annual payment usually paid in regular monthly instalments"
    )
  ],
  "bus-case-2-2": [
    knowledgeItem(
      "What is laissez-faire leadership?",
      "Focus on how much freedom employees receive when making work decisions.",
      "A style in which employees are given substantial freedom to decide how to complete tasks",
      "A style in which the manager makes every decision and gives close instructions",
      "A style in which employees vote to dismiss the manager",
      "A pay system based only on the number of bags made",
      "laissez-faire leaders delegate considerable decision-making freedom to employees"
    ),
    knowledgeItem(
      "Which leadership style involves the manager and employees discussing decisions together?",
      "Choose the participative style.",
      "Democratic leadership",
      "Autocratic leadership",
      "Laissez-faire leadership",
      "Centralised ownership",
      "democratic leadership involves employees in discussion and decision-making"
    )
  ],
  "bus-case-2-3": [
    knowledgeItem(
      "What is internal recruitment?",
      "Identify where candidates already work before applying for the vacancy.",
      "Filling a vacancy with a person who already works for the business",
      "Hiring a candidate through an outside employment agency",
      "Training every employee for a different occupation",
      "Moving the whole supermarket to another location",
      "internal recruitment appoints an existing employee to a vacancy"
    )
  ],
  "bus-case-2-4": [
    knowledgeItem(
      "Which training method teaches new café workers at the workplace while they perform the job?",
      "The workers learn by doing the actual tasks with guidance.",
      "On-the-job training",
      "Off-the-job training",
      "External recruitment",
      "Job rotation without instruction",
      "on-the-job training takes place at work while employees carry out their roles"
    )
  ],
  "bus-case-2-5": [
    knowledgeItem(
      "What does span of control mean in the call centre?",
      "Count the employees directly managed by one supervisor.",
      "The number of subordinates directly responsible to a manager",
      "The number of management levels in the whole organisation",
      "The route through which instructions pass down the hierarchy",
      "The number of customers waiting on the telephone",
      "span of control is the number of employees directly supervised by a manager"
    )
  ],
  "bus-case-2-6": [
    knowledgeItem(
      "What is redundancy in this delivery business?",
      "The software removes some jobs rather than dismissing workers for misconduct.",
      "A job is no longer required, so the employee performing it may be dismissed.",
      "An employee is promoted because demand is growing.",
      "A worker resigns voluntarily to join a competitor.",
      "A driver receives additional training in route planning.",
      "redundancy occurs when a role is no longer needed, often because technology changes operations"
    )
  ],
  "bus-case-3-1": [
    knowledgeItem(
      "Which research method would collect primary data directly from teenage juice customers?",
      "Primary research gathers new information for the business's specific purpose.",
      "A questionnaire completed by teenagers in the target market",
      "A government report on national drink sales",
      "A competitor's published annual report",
      "An article about last year's food trends",
      "questionnaires collect original data directly from respondents"
    ),
    knowledgeItem(
      "What is a sample in market research?",
      "A business usually asks part of the target population rather than everyone.",
      "A smaller group selected to represent the target population",
      "A free bottle given to every potential customer",
      "The total profit expected from the product",
      "A list containing only the business's competitors",
      "a sample is the subset of people chosen to represent the wider population"
    ),
    knowledgeItem(
      "Which result would best indicate potential demand for the mango juice?",
      "Choose evidence about customers' willingness to buy.",
      "The percentage of surveyed teenagers likely to buy at the proposed price",
      "The number of labels the printer can produce each hour",
      "The start-up owner's preferred juice flavour",
      "The historical cost of the bottling equipment",
      "purchase intention at a stated price helps estimate likely market demand"
    )
  ],
  "bus-case-3-2": [
    knowledgeItem(
      "What is market segmentation?",
      "Think about dividing one market into customer groups with shared characteristics.",
      "Dividing a market into groups of customers with similar needs or characteristics",
      "Selling an identical product at the same price in every country",
      "Reducing the number of products held in inventory",
      "Combining two competing businesses into one company",
      "segmentation separates a market into identifiable groups that can be targeted"
    ),
    knowledgeItem(
      "Which basis for segmentation separates serious runners from casual gym users most directly?",
      "The groups use sportswear for different activities and benefits.",
      "Lifestyle or behavioural segmentation",
      "Geographic segmentation by country only",
      "Segmentation by business ownership",
      "Segmentation by factory production cost",
      "behavioural or lifestyle segmentation groups customers by how and why they use a product"
    )
  ],
  "bus-case-3-3": [
    knowledgeItem(
      "What does price-elastic demand mean for the restaurant?",
      "Price-sensitive customers change how much they buy when price changes.",
      "A price change causes a proportionately larger change in quantity demanded.",
      "Demand remains unchanged whenever the restaurant changes price.",
      "The restaurant's fixed costs change whenever demand changes.",
      "Customers buy more only because ingredient costs rise.",
      "elastic demand is highly responsive to a change in price"
    )
  ],
  "bus-case-3-4": [
    knowledgeItem(
      "Which promotional method is the craft seller using when it posts product photos to reach customers online?",
      "Identify the digital communication channel described in the case.",
      "Social media advertising",
      "Personal selling in customers' homes",
      "Trade credit",
      "Cost-plus pricing",
      "social media advertising promotes products through online platforms and visual content"
    )
  ],
  "bus-case-3-5": [
    knowledgeItem(
      "What is a distribution channel?",
      "Think about the route a product follows from producer to customer.",
      "The path through which a product moves from the producer to the final customer",
      "The amount added to cost when setting a price",
      "A customer group with similar buying behaviour",
      "The total number of tables made each week",
      "a distribution channel is the route used to make a product available to customers"
    )
  ],
  "bus-case-3-6": [
    knowledgeItem(
      "Which four elements make up the marketing mix for the eco soap?",
      "Recall the four Ps.",
      "Product, price, place and promotion",
      "People, profit, planning and production",
      "Price, productivity, packaging and profit",
      "Product, payroll, premises and purchasing",
      "the marketing mix consists of product, price, place and promotion"
    )
  ],
  "bus-case-4-1": [
    knowledgeItem(
      "Which production method best suits 10 000 identical toy cars made every week?",
      "Choose the method designed for continuous, standardised, high-volume output.",
      "Flow production",
      "Job production",
      "Batch production",
      "Cell production of one unique order",
      "flow production makes standardised products continuously in large quantities"
    ),
    knowledgeItem(
      "What is productivity in the toy factory?",
      "Relate output to the inputs used to produce it.",
      "The amount of output produced from a given quantity of inputs",
      "The selling price of each toy car",
      "The total fixed cost of the factory",
      "The quantity of unsold cars held in inventory",
      "productivity measures the efficiency with which inputs are converted into output"
    ),
    knowledgeItem(
      "Which cost is most likely to be variable for the toy factory?",
      "Choose a cost that rises as more cars are made.",
      "Plastic used to manufacture each car",
      "Annual factory rent",
      "The purchase price of the factory building",
      "A fixed yearly insurance premium",
      "raw-material cost varies with the number of units produced"
    )
  ],
  "bus-case-4-2": [
    knowledgeItem(
      "What is buffer inventory?",
      "It is held to protect production against an unexpected shortage.",
      "Extra inventory kept in case demand rises or a delivery is delayed",
      "Damaged inventory that must be thrown away",
      "Goods ordered only after every customer has paid",
      "The maximum quantity a warehouse can physically hold",
      "buffer inventory reduces the risk of running out when demand or delivery time changes"
    ),
    knowledgeItem(
      "What is the opportunity cost of storing too much flour?",
      "Consider what else the bakery could do with the cash and storage space tied up in flour.",
      "The next best use of the money and space committed to excess flour",
      "The selling price charged for each loaf of bread",
      "The number of workers needed to unload flour",
      "The total revenue received from bread customers",
      "opportunity cost is the next best alternative forgone when a choice is made"
    )
  ],
  "bus-case-4-3": [
    knowledgeItem(
      "How does quality assurance differ from quality control?",
      "One approach prevents defects throughout production; the other checks output.",
      "Quality assurance builds checks into production to prevent defects.",
      "Quality assurance inspects only finished laptops after production.",
      "Quality assurance means lowering the laptop's selling price.",
      "Quality assurance replaces every worker with machinery.",
      "quality assurance focuses on preventing faults during the production process"
    )
  ],
  "bus-case-4-4": [
    knowledgeItem(
      "What is the break-even level of output?",
      "At this output, the business makes neither profit nor loss.",
      "The output where total revenue equals total cost",
      "The output where variable cost becomes zero",
      "The highest output the printer can produce",
      "The output where sales revenue equals fixed cost only",
      "break-even occurs when total revenue exactly covers fixed and variable costs"
    )
  ],
  "bus-case-4-5": [
    knowledgeItem(
      "Which location factor is especially important because office workers are the restaurant's main lunchtime market?",
      "Choose the factor concerned with being close to likely customers.",
      "Proximity to the target market",
      "Distance from raw material mines",
      "Availability of port facilities",
      "Access to agricultural land",
      "proximity to customers can increase convenience and passing trade"
    )
  ],
  "bus-case-4-6": [
    knowledgeItem(
      "What is lean production?",
      "Focus on reducing activities and resources that do not add customer value.",
      "An approach that reduces waste while maintaining value for customers",
      "A method that keeps the maximum possible inventory at all times",
      "A pricing method that adds a profit margin to cost",
      "A recruitment method for employing fewer managers",
      "lean production aims to minimise waste, delay and unnecessary inventory"
    )
  ],
  "bus-case-5-1": [
    knowledgeItem(
      "Which source of finance lets the salon use the chairs while paying regular instalments?",
      "The asset is used immediately but paid for over an agreed period.",
      "Leasing",
      "Trade credit on shampoo",
      "A new share issue to the public",
      "Debt factoring",
      "leasing gives a business the use of an asset in return for regular payments"
    ),
    knowledgeItem(
      "Why is an overdraft generally unsuitable for financing chairs used for several years?",
      "Match the length of the finance source to the life of the asset.",
      "An overdraft is short-term finance and can be withdrawn by the bank.",
      "An overdraft transfers ownership of the salon to the bank.",
      "An overdraft can only be used by public limited companies.",
      "An overdraft must be repaid before the chairs are delivered.",
      "long-lived non-current assets are normally financed with a more secure medium- or long-term source"
    ),
    knowledgeItem(
      "What is retained profit?",
      "It is an internal source accumulated from earlier trading.",
      "Profit kept in the business rather than distributed to owners",
      "Money borrowed from a bank and repaid with interest",
      "Payment delayed by a supplier until a later date",
      "Cash received by selling customer debts to a factor",
      "retained profit is an internal source created when some profit remains in the business"
    )
  ],
  "bus-case-5-2": [
    knowledgeItem(
      "What is a cash-flow forecast?",
      "It predicts the timing of money entering and leaving the business.",
      "An estimate of future cash inflows, cash outflows and balances",
      "A record of profit earned in previous years only",
      "A list of all non-current assets owned by a business",
      "A calculation of gross profit margin",
      "a cash-flow forecast estimates future cash movements and closing balances"
    ),
    knowledgeItem(
      "Which entry is a cash outflow for the uniform shop?",
      "Choose money leaving the business before the August sales season.",
      "Payment made to uniform suppliers in June",
      "Cash received from customers in August",
      "An increase in the closing bank balance",
      "Revenue recorded from selling uniforms",
      "a supplier payment is cash leaving the business and is therefore an outflow"
    )
  ],
  "bus-case-5-3": [
    knowledgeItem(
      "Which formula calculates the clothing retailer's operating profit?",
      "Start with gross profit and deduct operating expenses such as rent and advertising.",
      "Gross profit minus operating expenses",
      "Revenue minus current liabilities",
      "Current assets minus current liabilities",
      "Sales revenue plus cost of sales",
      "operating profit is the profit remaining after overheads are deducted from gross profit"
    )
  ],
  "bus-case-5-4": [
    knowledgeItem(
      "What is working capital?",
      "It measures short-term funds available after short-term debts are deducted.",
      "Current assets minus current liabilities",
      "Non-current assets minus long-term liabilities",
      "Revenue minus cost of sales",
      "Cash inflows minus fixed costs only",
      "working capital is the difference between current assets and current liabilities"
    )
  ],
  "bus-case-5-5": [
    knowledgeItem(
      "Why can this private limited company not sell its shares to the general public?",
      "Recall the restriction attached to private company shares.",
      "Its shares are privately held and cannot be offered for sale on a public stock exchange.",
      "It has unlimited liability for every business debt.",
      "It is owned by the government and cannot have shareholders.",
      "It must use only short-term sources of finance.",
      "a private limited company's shares are not available for purchase by the general public"
    )
  ],
  "bus-case-5-6": [
    knowledgeItem(
      "What does a higher gross profit margin usually show?",
      "Relate gross profit to sales revenue before overheads are deducted.",
      "A larger proportion of sales revenue remains after cost of sales is deducted.",
      "The business definitely has more cash in its bank account.",
      "Current liabilities are greater than current assets.",
      "Every product has a lower selling price than its variable cost.",
      "gross profit margin shows gross profit as a percentage of revenue"
    )
  ],
  "bus-case-6-1": [
    knowledgeItem(
      "What is inflation?",
      "Focus on the general price level over time, not one product's price.",
      "A sustained increase in the average price level of goods and services",
      "A fall in a country's total population",
      "A rise in the external value of a currency",
      "A temporary increase in one shop's sales revenue",
      "inflation is a continuing rise in the general level of prices"
    ),
    knowledgeItem(
      "Which type of cost is the milk used in each batch of ice cream?",
      "The amount used changes with production output.",
      "A variable cost",
      "A fixed cost",
      "A sunk cost",
      "A dividend payment",
      "milk is a direct input whose total cost rises as more ice cream is produced"
    ),
    knowledgeItem(
      "What is disposable income?",
      "It affects how much customers can spend on non-essential items.",
      "Income remaining after direct taxes have been paid",
      "A business's revenue after cost of sales",
      "The total value of output produced in a country",
      "Money a company keeps after paying dividends",
      "disposable income is the income consumers have available to spend or save after direct tax"
    )
  ],
  "bus-case-6-2": [
    knowledgeItem(
      "What does an appreciation of the local currency mean?",
      "Compare how much foreign currency one unit of local currency can buy.",
      "The local currency rises in value against other currencies.",
      "The local currency is replaced by a foreign currency.",
      "Domestic inflation falls to zero immediately.",
      "The government places a quota on all exports.",
      "appreciation means a currency can buy more of another currency than before"
    ),
    knowledgeItem(
      "What is an export?",
      "The coffee is produced locally and sold to customers abroad.",
      "A good or service sold to a buyer in another country",
      "A good purchased from another country for domestic use",
      "A tax charged by a government on imported goods",
      "A limit on the quantity of foreign goods entering a country",
      "an export is a domestically produced good or service sold overseas"
    )
  ],
  "bus-case-6-3": [
    knowledgeItem(
      "What is an ethical business decision?",
      "Consider the effect on stakeholders as well as whether the action is legal or profitable.",
      "A decision based on moral principles about right and fair behaviour",
      "A decision that always chooses the lowest possible cost",
      "A decision made only to increase short-term sales",
      "A decision that ignores workers if no law is broken",
      "ethical decisions consider moral responsibilities to people, communities and the environment"
    )
  ],
  "bus-case-6-4": [
    knowledgeItem(
      "What is an external cost of the paint factory's production?",
      "Choose a cost imposed on people outside the business transaction.",
      "River pollution suffered by local residents and other river users",
      "The factory's payment for paint ingredients",
      "Wages paid to production workers",
      "The purchase price of cleaner machinery",
      "an external cost is a harmful effect borne by third parties rather than the producer or customer"
    )
  ],
  "bus-case-6-5": [
    knowledgeItem(
      "What is globalisation?",
      "Think about growing connections between national markets and businesses.",
      "The increasing integration and interdependence of countries and markets",
      "A government preventing every business from trading abroad",
      "A retailer selling only to customers in its home town",
      "A fall in the number of communication and transport links",
      "globalisation increases economic links and the movement of goods, services, finance and ideas across borders"
    )
  ],
  "bus-case-6-6": [
    knowledgeItem(
      "What is a sales tax?",
      "It is an indirect tax added to spending on goods and services.",
      "A tax charged on the sale of goods and services",
      "A direct tax charged only on a worker's income",
      "A payment made by government to reduce business costs",
      "Interest charged by a bank on business borrowing",
      "sales tax is an indirect tax applied when goods or services are sold"
    )
  ]
};

function knowledgeDraft(seed: CaseSeed, variant: number): QuestionDraft {
  const bank = knowledgeBanks[seed.id];
  const draft = bank?.[variant];

  if (draft) return draft;

  return {
    question: `Which statement best explains ${seed.focus} in the context of ${seed.title}?`,
    hint: "Choose the statement that gives the relevant business meaning, not merely a case detail or an unsupported recommendation.",
    options: [
      seed.genericTheory,
      `Only businesses without ${seed.details[0]} need to consider ${seed.focus}.`,
      `${seed.focus} means the business should always act on ${seed.details[3]}, regardless of cost or evidence.`,
      `${seed.details[2]} proves that ${seed.focus} cannot influence this business.`
    ],
    feedback: [
      `Correct: ${seed.genericTheory}`,
      "Knowledge identifies the relevant business concept before it is applied to the case."
    ]
  };
}

function applicationDraft(seed: CaseSeed, variant: number): QuestionDraft {
  const distractors = reasoningDistractors[seed.id].application;
  if (variant % 2 === 0) {
    return {
      question: `Explain one reason ${seed.focus} is relevant to ${seed.title}.`,
      hint: `Use a named detail from the scenario, such as ${seed.details[0]} or ${seed.details[1]}.`,
      options: [
      seed.appliedPoint,
      ...distractors
    ] as [string, string, string, string],
      feedback: [
        "Correct: this applies the business idea to a specific detail from the case.",
        "Application earns credit when the answer is clearly about the business in the scenario."
      ]
    };
  }

  return {
    question: `Explain one way the situation at ${seed.title} affects the business issue being studied.`,
    hint: `Look for the detail that connects ${seed.details[2]} or ${seed.details[3]} to ${seed.focus}.`,
      options: [
      seed.appliedPoint,
      ...distractors
    ] as [string, string, string, string],
    feedback: [
      "Correct: it uses case evidence rather than giving only a textbook statement.",
      "For analysis, students would still need to develop the consequence further."
    ]
  };
}

function analysisDraft(seed: CaseSeed, variant: number): QuestionDraft {
  const distractors = reasoningDistractors[seed.id].analysis;
  if (variant % 2 === 0) {
    return {
      question: `Analyse one likely effect of ${seed.focus} on ${seed.title}.`,
      hint: "Choose the answer that moves from the business concept to a case detail and then to a likely consequence.",
      options: [
      seed.analysisChain,
      ...distractors
    ] as [string, string, string, string],
      feedback: [
        "Correct: this develops a cause-and-effect chain linked to the case.",
        "Analysis should explain the consequence for costs, revenue, cash flow, quality, output, motivation, or reputation."
      ]
    };
  }

  return {
    question: `Explain how ${seed.details[2]} could affect ${seed.title}.`,
    hint: `Develop the effect beyond identifying ${seed.details[2]}; show what happens to the business as a result.`,
      options: [
      seed.analysisChain,
      ...distractors
    ] as [string, string, string, string],
    feedback: [
      "Correct: the answer explains a developed effect using the scenario.",
      "A developed answer shows why the point matters to the business, not only that it exists."
    ]
  };
}

function evaluationDraft(seed: CaseSeed, variant: number): QuestionDraft {
  const distractors = reasoningDistractors[seed.id].evaluation;
  if (variant % 2 === 0) {
    return {
      question: `Recommend whether ${seed.title} should follow the course of action suggested in the scenario. Justify your answer.`,
      hint: `Use ${seed.focus}, at least one detail from the scenario, a consequence, and a reason why the judgement is best for this business.`,
      options: [
      seed.evaluation,
      ...distractors
    ] as [string, string, string, string],
      feedback: [
        "Correct: this includes knowledge, application, analysis, and a justified judgement.",
        "Strong evaluation weighs the evidence in the case rather than making a simple opinion."
      ]
    };
  }

  return {
    question: `Justify the best decision for ${seed.title}.`,
    hint: `The strongest answer should explain why one course of action suits ${seed.title} better than the alternative.`,
    options: [
      seed.evaluation,
      ...distractors
    ] as [string, string, string, string],
    feedback: [
      "Correct: the judgement is supported by case evidence and a developed reason.",
      "For 12-mark answers, students should also consider why another option may be less suitable."
    ]
  };
}

function buildCase(seed: CaseSeed, caseNumber: number): BusinessCaseStudy {
  const skillCounts: Record<BusinessAssessmentSkill, number> = { K: 0, APP: 0, AN: 0, EVAL: 0 };
  const questions = (caseSkillProgression[caseNumber] || caseSkillProgression[caseSkillProgression.length - 1]).map((skill, index) => {
    const variant = skillCounts[skill];
    skillCounts[skill] += 1;
    const id = `${seed.id}-q${index + 1}`;
    if (skill === "K") return makeQuestion(seed, id, skill, knowledgeDraft(seed, variant));
    if (skill === "APP") return makeQuestion(seed, id, skill, applicationDraft(seed, variant));
    if (skill === "AN") return makeQuestion(seed, id, skill, analysisDraft(seed, variant));
    return makeQuestion(seed, id, skill, evaluationDraft(seed, variant));
  });

  return {
    id: seed.id,
    unitId: seed.unitId,
    title: seed.title,
    scenario: seed.scenario,
    details: seed.details,
    questions
  };
}

const caseSeeds: CaseSeed[] = [
  {
    id: "bus-case-1-1",
    unitId: 1,
    title: "Ama's Artisan Bakery",
    scenario: "Ama owns a bakery with eight workers and sells premium handmade bread to households and two local cafés. The bakery opens six days a week, uses batch production, and often sells out before closing. Ama is considering a second shop near a busy bus station, but her finance is limited and a nearby supermarket sells cheaper bread. She also plans to replace the staff uniforms next year.",
    details: ["8 workers", "premium handmade products", "limited finance", "possible second shop"],
    focus: "business growth",
    genericTheory: "Business growth can increase sales and market share.",
    appliedPoint: "Opening a second shop could increase sales, but Ama's limited finance makes expansion risky.",
    analysisChain: "If Ama opens a second shop, fixed costs such as rent and wages will rise, so cash outflows may increase before enough premium bread is sold.",
    evaluation: "Ama should expand only if forecast demand covers the extra rent and wages, because the small workforce and limited finance make survival more important than rapid growth."
  },
  {
    id: "bus-case-1-2",
    unitId: 1,
    title: "Leo Mobile Repairs",
    scenario: "Leo wants to open a phone repair kiosk in a busy shopping mall where three phone retailers already trade. He has strong technical skills and owns basic repair tools, but has little experience of cash management or promotion. The landlord requires three months' rent in advance, while customers usually want repairs completed on the same day. Leo prefers a blue shop sign, although this will not determine whether the kiosk succeeds.",
    details: ["new start-up", "technical repair skills", "busy mall", "limited management experience"],
    focus: "enterprise and business plans",
    genericTheory: "A business plan sets out objectives, finance, marketing, and operations.",
    appliedPoint: "A business plan would help Leo estimate kiosk rent, repair equipment costs, and expected customer demand in the mall.",
    analysisChain: "If Leo plans cash needs before opening, he is less likely to run out of money for parts, so repairs can continue and customers are less likely to be lost.",
    evaluation: "A plan will not guarantee success, but it is important because Leo has limited management experience and must judge whether mall rent can be covered by repair sales."
  },
  {
    id: "bus-case-1-3",
    unitId: 1,
    title: "Oak & Pine Workshop",
    scenario: "Mina and Joel operate Oak & Pine Workshop as a partnership and employ four skilled carpenters. The business makes custom dining tables, so each order requires different measurements and finishes. Demand is increasing, but the partners may need a bank loan for new machinery and are worried that personal savings could be at risk if debts rise. Their workshop is painted green, which customers rarely see.",
    details: ["partnership", "custom tables", "two owners", "personal savings at risk"],
    focus: "legal structure",
    genericTheory: "Limited liability means owners do not usually risk personal assets for company debts.",
    appliedPoint: "Becoming a private limited company could protect the friends' personal savings if the furniture workshop builds up debts.",
    analysisChain: "If the workshop becomes incorporated, it may also find it easier to raise capital, allowing it to buy better equipment and complete more custom table orders.",
    evaluation: "A private limited company may suit the workshop if debt risk is increasing, although the friends must accept more legal requirements and possible shared control with shareholders."
  },
  {
    id: "bus-case-1-4",
    unitId: 1,
    title: "Kofi Family Foods",
    scenario: "Kofi Family Foods grows tomatoes and sells most of them to wholesalers at harvest time. The family is considering using part of the crop to make bottled tomato sauce, which would require cooking equipment, packaging, and food-safety training. Sauce could be sold throughout the year at a higher price, but the farm has limited production experience. The family also grows flowers beside the farmhouse for decoration.",
    details: ["primary activity", "tomatoes", "possible sauce production", "family business"],
    focus: "business classification",
    genericTheory: "Primary businesses extract or grow raw materials, while secondary businesses manufacture goods.",
    appliedPoint: "Growing tomatoes is primary activity, but making bottled tomato sauce would move the farm into secondary production.",
    analysisChain: "Adding sauce production could increase added value because the family sells a finished product, which may allow a higher selling price than raw tomatoes.",
    evaluation: "Making sauce could increase added value, but the family should only do it if it can afford equipment and has demand beyond its current tomato buyers."
  },
  {
    id: "bus-case-1-5",
    unitId: 1,
    title: "Riverside Community Gym",
    scenario: "Riverside Community Gym is a social enterprise serving a low-income neighbourhood. It employs five trainers, offers discounted youth sessions, and wants membership fees to remain affordable. Several exercise machines are old, so the gym must generate enough surplus to replace them without abandoning its social objective. Members have also requested brighter changing-room walls.",
    details: ["social enterprise", "low membership fees", "needs surplus", "old equipment"],
    focus: "business objectives",
    genericTheory: "Business objectives can include survival, profit, growth, market share, and social aims.",
    appliedPoint: "The gym has a social aim because it wants affordable fees, but it also needs surplus to replace equipment.",
    analysisChain: "If fees are kept too low, the gym may not generate enough surplus, so equipment may remain poor and members could leave.",
    evaluation: "The gym should balance affordable fees with enough surplus for equipment, because its social purpose will fail if the service becomes poor."
  },
  {
    id: "bus-case-1-6",
    unitId: 1,
    title: "Nia Style Outlet",
    scenario: "Nia is considering opening an outlet of a well-known clothing franchise in her town. The franchisor provides store design, approved suppliers, staff training, and national advertising, but Nia must pay an initial fee and a percentage of sales. Local customers recognise the brand, although Nia would have limited freedom to stock independent designers. The proposed shop has a small staff kitchen at the rear.",
    details: ["established clothing brand", "store design", "supplier system", "fees and rules"],
    focus: "franchising",
    genericTheory: "A franchise lets one business use another business's name, products, and operating methods.",
    appliedPoint: "Nia may benefit from the established clothing brand's advertising and supplier system, but she must pay fees and follow store rules.",
    analysisChain: "Using a known brand may attract customers faster, increasing early sales, but royalty fees reduce Nia's profit from each outlet sale.",
    evaluation: "This arrangement suits Nia if she lacks retail experience, but it is less suitable if she wants full control over clothing ranges, prices, and store decisions."
  },
  {
    id: "bus-case-2-1",
    unitId: 2,
    title: "Harbour View Hotel",
    scenario: "Harbour View Hotel has 80 rooms and employs six receptionists on rotating shifts. Labour turnover at reception is high because pay is close to the legal minimum and staff receive little recognition. Guests increasingly complain about slow check-in and inconsistent information, while experienced staff spend time training replacements. The hotel recently replaced the plants in its entrance.",
    details: ["hotel reception", "high labour turnover", "guest complaints", "slow check-in"],
    focus: "motivation",
    genericTheory: "Motivated employees are more likely to work hard and provide good service.",
    appliedPoint: "Improving motivation could reduce reception staff turnover and make hotel check-in more reliable for guests.",
    analysisChain: "If reception staff feel valued, they may stay longer, so the hotel spends less time recruiting and guests receive more experienced service.",
    evaluation: "The hotel should combine pay with training and recognition, because service complaints suggest both motivation and skill at reception need improvement."
  },
  {
    id: "bus-case-2-2",
    unitId: 2,
    title: "BrightBag Manufacturing",
    scenario: "BrightBag Manufacturing produces school bags for several retailers and has missed three recent delivery deadlines. Its production team includes many inexperienced workers, but the manager uses a laissez-faire leadership style and gives few instructions. Retailers may move future orders elsewhere if delays continue. The factory canteen changed its lunch menu last month.",
    details: ["school bag factory", "missed deadlines", "laissez-faire style", "inexperienced workers"],
    focus: "leadership style",
    genericTheory: "Autocratic leadership involves making decisions without much employee input.",
    appliedPoint: "A more autocratic style may help the inexperienced school bag workers meet delivery deadlines through clearer instructions.",
    analysisChain: "Clearer instructions can reduce mistakes and delays, so orders may be completed on time and customer relationships may improve.",
    evaluation: "A more directive style may be useful short term because workers are inexperienced, but a democratic approach could be added later to improve motivation and ideas."
  },
  {
    id: "bus-case-2-3",
    unitId: 2,
    title: "FreshMart Central",
    scenario: "FreshMart Central needs a store supervisor before the busy holiday period begins in four weeks. Several internal candidates understand its stock system and customers, but none has managed a team of 35 employees. External recruitment may bring stronger leadership skills, although advertising and selection would take time. The store is also planning a new display for imported fruit.",
    details: ["supermarket", "new supervisor", "urgent vacancy", "internal staff lack management experience"],
    focus: "recruitment",
    genericTheory: "Internal recruitment is cheaper and can motivate existing employees.",
    appliedPoint: "Promoting an internal supermarket worker could be quick because they already know store routines.",
    analysisChain: "However, if internal workers lack team-management experience, service standards may fall, causing queues and customer complaints.",
    evaluation: "The supermarket should compare urgency with skill needs; internal recruitment is quick, but external recruitment may be better if no current worker can manage the large team."
  },
  {
    id: "bus-case-2-4",
    unitId: 2,
    title: "Corner Cup Café",
    scenario: "Corner Cup Café is opening a branch with ten newly recruited workers, most of whom have not worked in food service before. The company needs consistent food hygiene, customer service, and correct use of its digital till from the first week. Managers can train employees at the new branch or pay for an external course before opening. The branch will use the same furniture colour as the other cafés.",
    details: ["new café branch", "ten new workers", "food hygiene", "till system"],
    focus: "training",
    genericTheory: "Induction training introduces new employees to the workplace and procedures.",
    appliedPoint: "Induction training should cover the café's hygiene rules, customer service standards, and till system.",
    analysisChain: "If staff are trained before serving customers, mistakes with payments and food handling may fall, protecting the café's reputation.",
    evaluation: "Induction plus on-the-job till practice is likely to suit the café because workers need both safety knowledge and branch-specific routines."
  },
  {
    id: "bus-case-2-5",
    unitId: 2,
    title: "ConnectCare Services",
    scenario: "ConnectCare Services handles customer enquiries for utility companies using 60 advisers and only two supervisors. Advisers need approval for unusual refunds, but supervisors are often unavailable and customer problems remain unresolved. The business is considering adding team leaders or giving advisers more authority. Its office lease still has two years remaining.",
    details: ["60 advisers", "two supervisors", "long customer waits", "service problems"],
    focus: "span of control",
    genericTheory: "Span of control is the number of subordinates directly managed by one manager.",
    appliedPoint: "Each supervisor may have too many call advisers to support, making the span of control very wide.",
    analysisChain: "If supervisors cannot monitor calls or coach advisers, problems take longer to solve and customer satisfaction may fall.",
    evaluation: "Adding supervisors may improve service, but the call centre should weigh this against higher salary costs and whether better training could solve the delays."
  },
  {
    id: "bus-case-2-6",
    unitId: 2,
    title: "SwiftRoute Deliveries",
    scenario: "SwiftRoute Deliveries has introduced software that automatically plans routes for 45 drivers. Fewer office workers are now needed for scheduling, even though customer demand and parcel volumes continue to grow. Management wants to reduce labour costs but is concerned about redundancy payments and the motivation of employees who remain. The company has recently repainted five delivery vans.",
    details: ["route-planning software", "fewer office workers needed", "delivery demand growing", "drivers still needed"],
    focus: "workforce planning",
    genericTheory: "Redundancy occurs when a job is no longer needed.",
    appliedPoint: "Some office scheduling roles may become redundant because software now plans delivery routes.",
    analysisChain: "Reducing office staff may lower labour costs, but poor handling of redundancy could damage morale among remaining employees.",
    evaluation: "The business should consider retraining some office workers for customer service, because demand is growing and losing experienced staff may harm service quality."
  },
  {
    id: "bus-case-3-1",
    unitId: 3,
    title: "ZestUp Drinks",
    scenario: "ZestUp Drinks plans to launch a mango juice aimed at teenagers in a market dominated by fizzy drinks. The start-up has limited finance and must choose a flavour, price, bottle size, and advertising channel before ordering packaging. Its founders have asked friends for opinions, but those responses may not represent the target market. One founder already owns a delivery bicycle.",
    details: ["drinks start-up", "teenage target market", "limited finance", "new mango juice"],
    focus: "market research",
    genericTheory: "Primary market research collects new data for a specific purpose.",
    appliedPoint: "Questionnaires with teenagers could help the start-up check demand for mango juice before spending on bottles and labels.",
    analysisChain: "If research shows teenagers dislike the flavour or price, the business can change the product before launch, reducing the risk of unsold inventory.",
    evaluation: "Low-cost primary research is suitable because finance is limited, but the sample must represent teenagers or the results may mislead the start-up."
  },
  {
    id: "bus-case-3-2",
    unitId: 3,
    title: "StridePoint Sportswear",
    scenario: "StridePoint Sportswear sells specialist running shoes, gym clothing, and low-priced accessories. Its customers include serious runners who value performance and casual gym users who focus more on style and price. The owner has one advertising budget and wants messages to reach each group more accurately. Saturday is the shop's busiest day, partly because a market operates nearby.",
    details: ["sportswear shop", "serious runners", "casual gym users", "targeted advertising"],
    focus: "market segmentation",
    genericTheory: "Market segmentation divides a market into groups with similar characteristics.",
    appliedPoint: "The shop can create different adverts for serious runners and casual gym users instead of using one message for all customers.",
    analysisChain: "Targeted adverts may improve promotion because each group sees products that match its needs, increasing the chance of sales.",
    evaluation: "Segmentation is likely useful because the two customer groups have different needs, but the shop should avoid too many adverts if its budget is small."
  },
  {
    id: "bus-case-3-3",
    unitId: 3,
    title: "Maple Table Restaurant",
    scenario: "Maple Table Restaurant serves fresh meals mainly to local families and competes with two lower-priced fast-food outlets. Ingredient and energy costs have risen, reducing profit on each meal. Customers value freshness but are price sensitive, so a large price increase may reduce demand. The owner is also choosing new music for the dining room.",
    details: ["family restaurant", "rising ingredient costs", "price-sensitive customers", "fresh meals"],
    focus: "pricing",
    genericTheory: "Pricing affects demand, revenue, and how customers view a product.",
    appliedPoint: "Raising prices may cover higher ingredient costs, but local families may reduce visits if meals become too expensive.",
    analysisChain: "If prices rise sharply, demand could fall, so total revenue may not increase and the restaurant may waste fresh ingredients.",
    evaluation: "A small price rise with clear promotion of fresh ingredients may be best, because the restaurant must cover costs without losing price-sensitive families."
  },
  {
    id: "bus-case-3-4",
    unitId: 3,
    title: "LunaCraft Jewellery",
    scenario: "LunaCraft Jewellery sells handmade earrings and necklaces through its own website. Most customers first discover products through social media photographs, but many visitors leave the website without ordering. The owner has limited money and must decide whether to improve product photography, pay influencers, or offer discounts. Packaging is currently silver, although buyers rarely mention it.",
    details: ["handmade jewellery", "e-commerce", "social media photos", "small seller"],
    focus: "promotion",
    genericTheory: "Promotion informs and persuades customers about products.",
    appliedPoint: "Social media promotion suits the jewellery seller because customers already discover products through photos online.",
    analysisChain: "Better product photos may increase interest and website visits, which could increase online orders if the jewellery looks attractive.",
    evaluation: "Social media is suitable because jewellery is visual and sold online, but the seller should track orders to check whether posts convert into sales."
  },
  {
    id: "bus-case-3-5",
    unitId: 3,
    title: "Oakline Furniture",
    scenario: "Oakline Furniture makes bulky dining tables in a workshop outside the city. It currently sells directly, but local retailers have offered to display the tables and manage customer orders in return for a margin. Retailers could increase market coverage, while direct delivery gives Oakline more control over service and custom orders. The workshop roof was repaired last year.",
    details: ["bulky tables", "local retailers", "direct delivery", "workshop"],
    focus: "place and distribution",
    genericTheory: "Distribution is how products move from producer to customer.",
    appliedPoint: "Local retailers could display the bulky tables, but direct delivery gives the workshop more control over customer service.",
    analysisChain: "Using retailers may increase market coverage, but retailer margins can reduce the furniture maker's profit on each table sold.",
    evaluation: "A local retailer may help customers see large tables before buying, but direct delivery may be better for customised orders where customer contact matters."
  },
  {
    id: "bus-case-3-6",
    unitId: 3,
    title: "PureLeaf Soap",
    scenario: "PureLeaf Soap makes higher-priced bars from natural oils and uses recyclable paper packaging. It wants to enter supermarkets where many cheaper soaps already have strong shelf positions. The owners must coordinate product design, price, distribution, and promotion without weakening the premium environmental image. Their office printer is due for replacement.",
    details: ["eco soap", "higher price", "natural oils", "supermarket competition"],
    focus: "marketing mix",
    genericTheory: "The marketing mix combines product, price, place, and promotion.",
    appliedPoint: "The soap's natural oils should be part of the product and promotion because it competes against cheaper supermarket soaps.",
    analysisChain: "If customers understand the natural-oil benefit, they may accept the higher price, helping the brand maintain margins despite competition.",
    evaluation: "The brand should keep a premium image but use supermarket promotions carefully, because too much discounting may weaken the natural, high-quality positioning."
  },
  {
    id: "bus-case-4-1",
    unitId: 4,
    title: "PlayMotion Toys",
    scenario: "PlayMotion Toys employs 80 workers and makes 10 000 identical plastic cars each week on a machinery-based production line. A national retailer has placed regular monthly orders and expects consistent quality and delivery, so demand is stable. A smaller customer has asked for personalised colours, but changing the line would interrupt production. The factory also stores an older puzzle product that is unrelated to the car order.",
    details: ["10 000 identical cars", "weekly output", "stable demand", "retailer supply"],
    focus: "production method",
    genericTheory: "Flow production is used for large quantities of standardised products.",
    appliedPoint: "Flow production suits the toy factory because it makes thousands of identical plastic cars every week.",
    analysisChain: "Using flow production can lower unit costs through specialisation and machinery, helping the factory meet stable retailer demand.",
    evaluation: "Flow production is suitable because demand is stable and output is standardised, but it would be less flexible if toy designs changed often."
  },
  {
    id: "bus-case-4-2",
    unitId: 4,
    title: "Sunrise Bakes",
    scenario: "Sunrise Bakes produces bread, cakes, and pastries for its own shop and three cafés. Its flour supplier offers a discount for large orders, and managers want enough inventory to avoid stopping production. Storage space is limited, flour can be damaged if kept too long, and cash is needed for weekly wages. The bakery is also considering a new design for its wedding-cake boxes.",
    details: ["bulk flour", "avoid shortages", "limited storage", "risk of damage"],
    focus: "inventory control",
    genericTheory: "Inventory is materials, work in progress, or finished goods held by a business.",
    appliedPoint: "Holding more flour may prevent bakery production stopping, but limited storage makes high inventory risky.",
    analysisChain: "If too much flour is stored, storage costs rise and damaged flour may increase waste, reducing profit.",
    evaluation: "The bakery should keep enough flour for reliable production but avoid excessive stock because storage is limited and damaged flour would waste cash."
  },
  {
    id: "bus-case-4-3",
    unitId: 4,
    title: "NovaBook Technologies",
    scenario: "NovaBook Technologies assembles 12 000 laptops each month for electronics retailers. Customer complaints about faulty screens have increased, and returned laptops create repair, delivery, and reputation costs. Managers are considering quality checks at each stage of assembly rather than relying mainly on final inspection. A separate team is redesigning the cardboard packaging.",
    details: ["laptop manufacturer", "faulty screens", "customer complaints", "prevent defects"],
    focus: "quality assurance",
    genericTheory: "Quality assurance checks quality throughout production rather than only at the end.",
    appliedPoint: "Quality assurance could help identify screen faults during laptop assembly before customers receive defective products.",
    analysisChain: "Finding faults earlier may reduce returns and repair costs, protecting the manufacturer's reputation for reliable laptops.",
    evaluation: "Quality assurance is suitable because faults are reaching customers, but it must be supported by worker training and clear screen-testing procedures."
  },
  {
    id: "bus-case-4-4",
    unitId: 4,
    title: "InkWorks Studio",
    scenario: "InkWorks Studio prints posters for schools, events, and small businesses using two ageing printers. A faster printer would raise annual fixed costs but reduce ink and labour cost per poster, and it could increase maximum output. Demand is high during festival months but uncertain during the rest of the year, so the owner is calculating a new break-even level before buying. The studio's current lease ends in eighteen months.",
    details: ["print shop", "new printer", "higher fixed costs", "lower variable cost per poster"],
    focus: "break-even",
    genericTheory: "Break-even is where total revenue equals total costs.",
    appliedPoint: "The printer may raise the print shop's fixed costs, so it must sell enough posters to cover the new machine cost.",
    analysisChain: "If variable cost per poster falls, profit on each poster may increase after break-even, improving profit when demand is high.",
    evaluation: "The printer is worthwhile only if expected poster demand is high enough to pass the new break-even point and benefit from lower variable costs."
  },
  {
    id: "bus-case-4-5",
    unitId: 4,
    title: "CityLunch Kitchen",
    scenario: "CityLunch Kitchen is choosing between a low-rent side street and a more expensive site beside several large offices. Office workers are its main target and most sales are expected between noon and 2 p.m. The office site has much higher footfall but limited parking, while the side street has space for evening deliveries. Both premises have recently fitted kitchens.",
    details: ["restaurant", "cheaper side street", "expensive office area", "lunchtime customers"],
    focus: "location",
    genericTheory: "Location decisions can depend on customers, labour, suppliers, competitors, rent, and transport.",
    appliedPoint: "The office-area location gives access to lunchtime customers, but rent will be higher.",
    analysisChain: "If the restaurant is near offices, customer footfall may rise at lunch, increasing revenue enough to cover higher rent.",
    evaluation: "The office location is likely better if lunchtime sales cover the extra rent; otherwise the cheaper side street may reduce risk while the restaurant builds demand."
  },
  {
    id: "bus-case-4-6",
    unitId: 4,
    title: "CycleFix Workshop",
    scenario: "CycleFix Workshop repairs bicycles and keeps a large range of spare parts so common jobs can be completed quickly. Cash is tight, several specialist parts have become obsolete, and shelves are crowded with items rarely requested. The owner is considering lean inventory methods but suppliers sometimes take five days to deliver. A new cycle path near the workshop may increase future demand.",
    details: ["bicycle workshop", "many spare parts", "cash is tight", "obsolete parts"],
    focus: "lean production",
    genericTheory: "Lean production aims to reduce waste and improve efficiency.",
    appliedPoint: "Lean production could help the bicycle workshop reduce obsolete spare parts and release cash.",
    analysisChain: "If fewer unnecessary parts are stored, less cash is tied up in inventory, improving working capital for the workshop.",
    evaluation: "Lean methods may help because cash is tight, but the workshop must still keep enough common spare parts to avoid delaying bicycle repairs."
  },
  {
    id: "bus-case-5-1",
    unitId: 5,
    title: "Glow Hair Studio",
    scenario: "Glow Hair Studio needs four replacement chairs costing $3000 in total because customers complain that the current chairs are uncomfortable. The salon receives steady weekly cash inflows and has regular clients, but little retained profit after refurbishing its reception area. A bank has offered a small loan with monthly repayments. The owner also wants to change the staff aprons later in the year.",
    details: ["hair salon", "$3000 chairs", "steady cash inflows", "little retained profit"],
    focus: "source of finance",
    genericTheory: "A bank loan provides finance that is repaid with interest over time.",
    appliedPoint: "A bank loan could let the salon buy the $3000 chairs immediately, even though retained profit is low.",
    analysisChain: "New chairs may improve customer comfort and sales, but loan repayments increase monthly cash outflows.",
    evaluation: "A small loan may be suitable if steady cash inflows cover repayments, but delaying purchase may be safer if the salon already has high debts."
  },
  {
    id: "bus-case-5-2",
    unitId: 5,
    title: "SmartStart Uniforms",
    scenario: "SmartStart Uniforms earns most of its annual sales in August before the school year begins. It must order and pay suppliers in June and July, before most customers buy, and still pay rent and wages during those months. Last year several popular sizes sold out, so ordering too little may also lose sales. The shop window is decorated differently each season.",
    details: ["school uniform shop", "seasonal sales", "supplier payments before sales", "August revenue"],
    focus: "cash flow",
    genericTheory: "Cash flow is the movement of money into and out of a business.",
    appliedPoint: "The shop may have a cash shortage in June and July because suppliers are paid before August uniform sales arrive.",
    analysisChain: "If the shop cannot pay suppliers, it may not receive enough uniforms, causing lost sales during its busiest month.",
    evaluation: "An overdraft may suit the temporary shortage because August sales should bring cash in, but the shop should compare interest costs with negotiating later supplier payments."
  },
  {
    id: "bus-case-5-3",
    unitId: 5,
    title: "Threadline Clothing",
    scenario: "Threadline Clothing operates three stores and reports higher revenue than last year. However, rent and online advertising costs have risen faster than gross profit, while managers have also discounted old inventory. The owners are deciding whether the revenue growth represents improved performance or hides weaker operating profit. Employee uniforms remained unchanged this year.",
    details: ["clothing retailer", "higher revenue", "advertising costs", "rent costs"],
    focus: "profit",
    genericTheory: "Operating profit is gross profit minus overheads.",
    appliedPoint: "The retailer's operating profit may fall if advertising and rent rise faster than gross profit.",
    analysisChain: "Higher revenue alone does not prove success because rising overheads can reduce operating profit and retained profit.",
    evaluation: "The retailer should review whether advertising is generating enough sales, because cutting all promotion may reduce revenue while high rent still remains."
  },
  {
    id: "bus-case-5-4",
    unitId: 5,
    title: "Bean & Crumb Café",
    scenario: "Bean & Crumb Café has display cases full of cakes and ingredients in storage but very little cash in its bank account. Wages, rent, and a supplier invoice are due next week, and some cakes may become unsellable within two days. A weekend promotion could turn inventory into cash, although heavy discounts may reduce margins. The café recently bought new menu boards using cash.",
    details: ["café", "high cake inventory", "little cash", "wages and rent due"],
    focus: "liquidity",
    genericTheory: "Liquidity is the ability to pay short-term debts.",
    appliedPoint: "The café may have poor liquidity because cakes are not cash and wages and rent are due soon.",
    analysisChain: "If the café cannot turn inventory into cash quickly, it may miss payments, damaging relationships with workers and the landlord.",
    evaluation: "Discounting some cakes may improve cash quickly, but the café should avoid making customers expect permanent low prices."
  },
  {
    id: "bus-case-5-5",
    unitId: 5,
    title: "MetroDesk Ltd",
    scenario: "MetroDesk Ltd is a private limited company that manufactures office desks and wants a second factory in another city. The expansion requires long-term finance for premises and machinery before additional sales begin. Directors are considering issuing shares to existing shareholders instead of taking a large loan, but they want to retain control. The company has already chosen a logo for the new factory.",
    details: ["private limited company", "desk manufacturer", "new city", "existing shareholders"],
    focus: "equity finance",
    genericTheory: "Issuing shares raises capital without regular interest payments.",
    appliedPoint: "Issuing shares to existing shareholders could fund the desk company's new city expansion without loan interest.",
    analysisChain: "Avoiding interest helps cash flow during expansion, but existing owners may lose some control if more shares are issued.",
    evaluation: "Share issue may suit expansion if shareholders are willing, but a loan may be preferable if directors want to avoid diluting control."
  },
  {
    id: "bus-case-5-6",
    unitId: 5,
    title: "HealthChoice Pharmacies",
    scenario: "HealthChoice is considering buying one of two independent pharmacies with similar annual sales. Pharmacy A has a higher gross profit margin but holds little cash, while Pharmacy B has a stronger current ratio and slower inventory turnover. The buyer must compare profitability and liquidity rather than relying on one figure. Both pharmacies close at the same time each evening.",
    details: ["two pharmacies", "similar sales", "different gross margins", "different liquidity"],
    focus: "ratio analysis",
    genericTheory: "Profitability ratios measure profit performance; liquidity ratios measure ability to pay short-term debts.",
    appliedPoint: "Pharmacy A appears more profitable, while Pharmacy B may be better able to pay short-term debts.",
    analysisChain: "A high gross margin may show strong pricing or low purchase costs, but weak liquidity could still cause payment problems.",
    evaluation: "The stronger business depends on the objective: investors may prefer Pharmacy A's margin, while suppliers may prefer Pharmacy B's ability to pay."
  },
  {
    id: "bus-case-6-1",
    unitId: 6,
    title: "Frosty Fields",
    scenario: "Frosty Fields produces ice cream for supermarkets and independent cafés. Milk, sugar, packaging, and electricity prices have risen during a period of inflation, while households are reducing non-essential spending. The business must decide whether to raise prices, reduce pack size, or accept a lower margin. Its delivery vans are already fully owned.",
    details: ["ice cream producer", "higher milk prices", "higher electricity prices", "lower non-essential spending"],
    focus: "inflation",
    genericTheory: "Inflation is a sustained rise in the general price level.",
    appliedPoint: "Inflation raises the producer's milk and electricity costs while customers may buy fewer ice creams.",
    analysisChain: "If costs rise and demand falls, profit margins may narrow, making it harder to fund production or marketing.",
    evaluation: "A small price rise plus cost control may be best, because large increases could lose customers already cutting non-essential spending."
  },
  {
    id: "bus-case-6-2",
    unitId: 6,
    title: "Highland Coffee Exports",
    scenario: "Highland Coffee Exports buys beans from local farmers and sells 75% of its output to overseas cafés. The local currency has appreciated against currencies used by its main customers, while contracts are priced in the local currency. Overseas buyers can switch to suppliers in two other countries, although Highland has a reputation for quality. Its warehouse uses solar lighting.",
    details: ["coffee exporter", "overseas customers", "currency appreciation", "export prices"],
    focus: "exchange rates",
    genericTheory: "Currency appreciation means one currency rises in value compared with another.",
    appliedPoint: "Appreciation may make the coffee exporter more expensive for overseas customers.",
    analysisChain: "If overseas buyers face higher prices, export demand may fall, reducing revenue for the coffee exporter.",
    evaluation: "Appreciation is a threat because most coffee is exported, but the impact may be lower if customers value its quality and cannot easily switch suppliers."
  },
  {
    id: "bus-case-6-3",
    unitId: 6,
    title: "FairThread Clothing",
    scenario: "FairThread Clothing sells garments to customers who often ask about sustainable production. A new supplier offers cheaper fabric but has been accused of unsafe worker conditions; a certified supplier charges more and publishes independent audit results. Choosing the cheaper source could improve short-term margins but may attract customer and pressure-group criticism. Both suppliers offer the same fabric colours.",
    details: ["clothing brand", "cheaper fabric", "worker conditions concern", "ethical fabric"],
    focus: "ethical decisions",
    genericTheory: "Ethical decisions consider what is morally right, not just what is legal or profitable.",
    appliedPoint: "Using certified ethical fabric may protect the clothing brand's reputation but increase material costs.",
    analysisChain: "Higher fabric costs may reduce profit margins, but avoiding poor worker conditions can strengthen customer trust and reduce pressure-group criticism.",
    evaluation: "The ethical supplier is likely better if customers care about worker treatment, because reputation damage could cost more than the saving from cheaper fabric."
  },
  {
    id: "bus-case-6-4",
    unitId: 6,
    title: "RiverTone Paints",
    scenario: "RiverTone Paints operates beside a river and employs 120 people from the local area. Residents report unpleasant smells and possible water pollution, while regulators are reviewing the factory's permit. Cleaner technology is expensive and may interrupt production during installation, but it could reduce waste and complaints. The company sponsors a local football team.",
    details: ["paint factory", "river location", "cleaner technology", "resident complaints"],
    focus: "environmental pressure",
    genericTheory: "Business activity can create external costs such as pollution.",
    appliedPoint: "Cleaner technology may reduce pollution from the paint factory and improve relations with local residents.",
    analysisChain: "Although the equipment increases costs, fewer complaints may reduce pressure for fines or restrictions and protect the factory's reputation.",
    evaluation: "Cleaner technology is likely justified if pollution complaints risk legal action or lost reputation, but the factory must ensure it can finance the investment."
  },
  {
    id: "bus-case-6-5",
    unitId: 6,
    title: "Mara Bags Online",
    scenario: "Mara Bags Online sells handmade bags through an e-commerce site and receives growing social media interest from overseas users. International sales could enlarge its market, but delivery charges, customs delays, currency changes, and returns may increase costs. The owner is considering testing two countries before offering worldwide delivery. Domestic customers receive bags in recycled boxes.",
    details: ["online retailer", "handmade bags", "international customers", "high delivery costs"],
    focus: "globalisation",
    genericTheory: "Globalisation increases connections and trade between countries.",
    appliedPoint: "Selling overseas could help the handmade bag retailer reach customers who already show interest on social media.",
    analysisChain: "International sales may increase revenue, but high delivery costs could make final prices less competitive.",
    evaluation: "The retailer should test a few overseas markets first, because social media interest is promising but high delivery costs could reduce demand."
  },
  {
    id: "bus-case-6-6",
    unitId: 6,
    title: "CityCycle Shop",
    scenario: "CityCycle Shop sells bicycles and accessories in a market where customers compare prices online before visiting stores. The government has increased sales tax, which may raise final prices or reduce the shop's margin if it absorbs some of the change. Larger online competitors may be able to spread costs across more sales. The shop also provides free tyre-pressure checks.",
    details: ["bicycle shop", "higher sales tax", "online price comparison", "price-sensitive customers"],
    focus: "government economic policy",
    genericTheory: "Taxes can increase business costs or prices paid by customers.",
    appliedPoint: "The bicycle shop may have to raise prices after the sales tax increase, but customers compare prices online.",
    analysisChain: "If prices rise, customers may switch to cheaper competitors, reducing sales revenue for the bicycle shop.",
    evaluation: "The shop may need to absorb part of the tax and improve service, because passing on the full increase could lose price-sensitive online shoppers."
  }
];

const reasoningDistractors: Record<string, ReasoningDistractors> = {
  "bus-case-1-1": {
    application: ["Employing eight workers makes the bakery a large company, so finance cannot restrict growth.", "Premium handmade bread means customers will accept any price at a second shop.", "Selling out before closing proves a second location will have identical demand."],
    analysis: ["A second shop would reduce total fixed costs because rent would be shared across two locations.", "Competition from cheaper supermarket bread would automatically increase Ama's profit margin.", "Replacing staff uniforms would create enough capacity to supply both shops."],
    evaluation: ["Ama should open immediately because selling out guarantees that every future shop will succeed.", "Ama should reject expansion because a small business should never increase its number of outlets.", "Ama should decide mainly by comparing the colour and cost of next year's uniforms."],
  },
  "bus-case-1-2": {
    application: ["Leo's repair skills guarantee that he will manage cash and promotion effectively.", "The presence of three phone retailers proves there is no demand for repairs in the mall.", "Choosing a blue sign is the main purpose of Leo's business plan."],
    analysis: ["Paying three months' rent in advance would increase the kiosk's available cash.", "Same-day repairs mean Leo will never need to buy or hold replacement parts.", "Competing retailers will automatically send all repair customers to Leo."],
    evaluation: ["Leo should open without forecasting because technical ability is the only requirement for success.", "Leo should abandon the idea solely because other phone businesses operate in the mall.", "Leo should base the final decision on whether the landlord approves the blue sign."],
  },
  "bus-case-1-3": {
    application: ["Employing carpenters means the workers automatically own shares in the partnership.", "Custom production removes the partners' responsibility for business debts.", "Painting the workshop green protects Mina and Joel's personal savings."],
    analysis: ["Taking a larger bank loan would reduce the amount of debt the partners must repay.", "Limited liability would make every custom table cheaper to manufacture.", "Changing legal structure would remove the need for skilled carpenters."],
    evaluation: ["The partners should incorporate because limited companies can never fail or owe money.", "They should remain a partnership because growing demand makes personal liability harmless.", "They should choose the legal structure that requires the least paperwork, regardless of debt risk."],
  },
  "bus-case-1-4": {
    application: ["Growing tomatoes and making sauce are both primary-sector activities.", "Selling sauce at a higher price guarantees it will be profitable.", "The decorative flowers are the strongest evidence for processing the tomato crop."],
    analysis: ["Buying cooking equipment would immediately reduce the farm's fixed costs.", "Food-safety training would shorten the tomato-growing season.", "Year-round sauce sales would make packaging and distribution costs disappear."],
    evaluation: ["The family should process the entire crop because added value always guarantees higher profit.", "The family should reject sauce production because farms must operate only in the primary sector.", "The decision should depend mainly on whether the flowers beside the farmhouse grow well."],
  },
  "bus-case-1-5": {
    application: ["Discounted youth sessions show that profit maximisation is the gym's only objective.", "Old exercise machines mean a social enterprise is not allowed to charge membership fees.", "Brighter changing-room walls would remove the need to earn a surplus."],
    analysis: ["Reducing every membership fee would automatically provide more cash for replacement equipment.", "Replacing machines would prevent the gym from delivering any social benefit.", "A larger surplus would always make low-income members better able to afford fees."],
    evaluation: ["The gym should maximise prices because social enterprises have no responsibility to their users.", "It should keep all fees unchanged even if unsafe machines can no longer be replaced.", "It should prioritise wall colour over affordability and equipment condition."],
  },
  "bus-case-1-6": {
    application: ["National advertising means Nia would have complete freedom over products and pricing.", "Paying a franchise fee makes Nia an employee rather than a business owner.", "The staff kitchen is the main benefit supplied by the franchisor."],
    analysis: ["Using an established brand would prevent Nia from paying any start-up costs.", "Approved suppliers would allow her to stock any independent designer she chooses.", "A percentage-of-sales fee would increase Nia's profit on every item sold."],
    evaluation: ["Nia should buy the franchise because a recognised brand guarantees profit in every town.", "She should reject it simply because all franchise agreements remove every business decision.", "She should decide according to the size of the staff kitchen rather than projected sales and fees."],
  },
  "bus-case-2-1": {
    application: ["Rotating shifts prove receptionists are highly motivated and unlikely to leave.", "Replacing entrance plants addresses the causes of slow check-in.", "Low pay cannot affect service because guests, not employees, use the hotel rooms."],
    analysis: ["Higher labour turnover would reduce recruitment and training costs for the hotel.", "Giving recognition would make experienced receptionists less able to answer guests.", "Slow check-in would increase repeat bookings because guests spend longer at reception."],
    evaluation: ["The hotel should raise pay immediately without checking costs or the reasons employees leave.", "It should ignore turnover because replacement workers always provide identical service at once.", "It should spend the motivation budget on more entrance plants instead of reception staff."],
  },
  "bus-case-2-2": {
    application: ["Laissez-faire leadership guarantees clear guidance for inexperienced production workers.", "Missed deadlines show that retailers are satisfied with BrightBag's performance.", "The factory lunch menu determines whether school bags reach retailers on time."],
    analysis: ["Giving fewer instructions would make inexperienced workers complete orders more consistently.", "Missing further deadlines would increase retailer loyalty and future orders.", "Changing leadership style would remove all production capacity constraints immediately."],
    evaluation: ["The manager should remain laissez-faire because workers never need guidance in manufacturing.", "The manager should become autocratic permanently, regardless of staff experience or ideas.", "The best leadership decision should be based on which lunch menu workers prefer."],
  },
  "bus-case-2-3": {
    application: ["Internal candidates' stock knowledge proves they already have strong team-leadership skills.", "External recruitment would always be completed before an internal appointment.", "The imported-fruit display is evidence that the supervisor must be recruited externally."],
    analysis: ["Advertising externally would reduce recruitment time to zero before the holiday period.", "Promoting internally would make the successful candidate forget the store's systems and customers.", "Hiring a more experienced outsider would guarantee existing employees remain motivated."],
    evaluation: ["FreshMart should recruit externally because outside candidates are always better managers.", "It should promote internally solely because this option requires no assessment of leadership ability.", "It should delay the appointment until after the holiday period so the vacancy has no effect."],
  },
  "bus-case-2-4": {
    application: ["Using the same furniture colour will teach new workers food hygiene.", "External training is automatically cheaper than training at the branch.", "Ten new recruits mean induction is unnecessary because they can train one another."],
    analysis: ["Training before opening would increase till errors because workers become overconfident.", "On-the-job training would prevent the café serving customers during every future shift.", "Consistent hygiene procedures would make customer service and food quality less reliable."],
    evaluation: ["The café should choose external training because courses always suit every workplace exactly.", "It should provide no training until mistakes occur, since correction is cheaper than preparation.", "It should select the method according to furniture colour rather than cost and practical relevance."],
  },
  "bus-case-2-5": {
    application: ["Sixty advisers and two supervisors create a narrow span of control.", "The office lease explains why unusual refunds remain unresolved.", "Giving advisers authority would increase the number of approvals each supervisor must make."],
    analysis: ["Adding team leaders would increase each existing supervisor's number of direct reports.", "Delegating refund authority would guarantee that no adviser ever makes an incorrect decision.", "Longer customer delays would improve satisfaction because complaints receive more attention."],
    evaluation: ["ConnectCare should delegate every refund decision without limits or training.", "It should retain the structure because unresolved problems cannot affect utility clients.", "It should choose the structure with the fewest job titles, regardless of service quality."],
  },
  "bus-case-2-6": {
    application: ["Growing parcel demand means automation cannot make any scheduling role redundant.", "Repainting vans is the main workforce-planning response to route software.", "Redundancy payments are revenue earned when employees leave."],
    analysis: ["Removing scheduling jobs would immediately increase the motivation of all remaining staff.", "Automatic route planning would reduce parcel demand because deliveries become more efficient.", "Paying redundancy compensation would lower SwiftRoute's short-term cash outflow."],
    evaluation: ["SwiftRoute should dismiss every office worker immediately because software never requires oversight.", "It should abandon useful software solely to avoid discussing changes with employees.", "It should base staffing numbers on the number of newly painted vans."],
  },
  "bus-case-3-1": {
    application: ["Friends' opinions are representative because every teenager has the same preferences.", "Owning a delivery bicycle identifies the best mango flavour and bottle size.", "A market dominated by fizzy drinks proves teenagers will not buy juice."],
    analysis: ["Using an unrepresentative sample would guarantee accurate national demand forecasts.", "Ordering packaging before research would reduce the risk of unsold stock.", "Better target-market data would make the start-up's limited finance less important."],
    evaluation: ["ZestUp should launch the flavour preferred by the founders' friends without further research.", "It should abandon mango juice because existing fizzy drinks make entry impossible.", "It should spend most research funds studying how often the delivery bicycle is used."],
  },
  "bus-case-3-2": {
    application: ["Serious runners and casual gym users form one segment because both enter the same shop.", "Saturday footfall proves every customer values performance above price.", "Market segmentation requires StridePoint to stop selling low-priced accessories."],
    analysis: ["Sending the same message to both groups would always increase advertising relevance.", "Targeting performance benefits at serious runners would make the advertising budget larger automatically.", "Segmenting customers would prevent casual users from buying specialist shoes."],
    evaluation: ["StridePoint should advertise only to serious runners because they are necessarily more profitable.", "It should avoid segmentation because one general advert always persuades every customer equally.", "It should choose its target segment according to Saturday market opening hours alone."],
  },
  "bus-case-3-3": {
    application: ["Rising ingredient costs mean customers will accept any price increase.", "Fresh meals make competitor prices irrelevant to local families.", "Changing dining-room music is a cost-plus pricing calculation."],
    analysis: ["A large price increase would guarantee higher revenue even if family demand falls sharply.", "Keeping prices unchanged would make rising energy and ingredient costs disappear.", "Lower-priced competitors would lose customers whenever Maple Table charges more."],
    evaluation: ["The restaurant should pass on every cost increase because demand never responds to price.", "It should cut prices below costs permanently to match fast-food competitors.", "It should choose meal prices according to the dining-room music rather than margins and demand."],
  },
  "bus-case-3-4": {
    application: ["Website visitors who leave without ordering prove product promotion is already effective.", "Silver packaging is the only factor that determines online conversion.", "Paying an influencer guarantees that every follower will buy handmade jewellery."],
    analysis: ["Improved photographs would reduce customers' ability to judge products online.", "Offering large discounts would always increase profit per necklace.", "More social-media views would guarantee orders even if the website remains difficult to use."],
    evaluation: ["LunaCraft should spend all available money on influencers because reach always becomes sales.", "It should offer permanent deep discounts without considering its handmade production costs.", "It should replace packaging first because buyers rarely mention it."],
  },
  "bus-case-3-5": {
    application: ["Using retailers would give Oakline complete control over customer service and custom orders.", "Bulky tables can be distributed digitally without storage or delivery.", "The repaired workshop roof determines the best channel of distribution."],
    analysis: ["Paying retailer margins would increase the revenue Oakline keeps from each table.", "Selling directly would guarantee nationwide market coverage without extra promotion or delivery capacity.", "Retail displays would prevent customers from seeing tables before ordering."],
    evaluation: ["Oakline should use every retailer offered because wider coverage always produces higher profit.", "It should sell only directly because intermediaries can never add value.", "It should select a channel according to last year's roof repair cost."],
  },
  "bus-case-3-6": {
    application: ["A premium environmental image means PureLeaf can ignore price and distribution decisions.", "Replacing the office printer is part of the soap's marketing mix.", "Entering supermarkets guarantees prominent shelf space beside cheaper brands."],
    analysis: ["Lowering price sharply would strengthen the premium image without affecting margins.", "Using non-recyclable promotion would automatically improve environmental credibility.", "Coordinating the four Ps would remove all supermarket competition."],
    evaluation: ["PureLeaf should copy the cheapest soap because differentiation never affects buying decisions.", "It should enter every supermarket immediately without checking margins or shelf position.", "It should make the office printer replacement the main marketing priority."],
  },
  "bus-case-4-1": {
    application: ["Personalised colours are best produced by an unchanged continuous production line.", "Stable monthly orders make one-off job production the most efficient method.", "The older puzzle inventory determines how plastic cars should be manufactured."],
    analysis: ["Stopping the line for frequent colour changes would increase output of standard cars.", "Flow production would make each identical car require more individual skilled labour.", "Regular retailer orders would raise the risk that a high-output line remains unused."],
    evaluation: ["PlayMotion should accept every personalised order because customer choice never disrupts flow production.", "It should replace the production line with job production even though most demand is for identical cars.", "It should choose the method according to its unrelated puzzle inventory."],
  },
  "bus-case-4-2": {
    application: ["Buying the largest possible flour order is always efficient because inventory has no carrying cost.", "Limited storage means Sunrise should hold enough flour for several years.", "Wedding-cake box design determines the bakery's reorder level for flour."],
    analysis: ["Holding more flour would release cash immediately for weekly wages.", "Reducing inventory to zero would prevent production delays when suppliers are late.", "Flour damage would increase the quantity available for sale to cafés."],
    evaluation: ["Sunrise should always accept the bulk discount regardless of storage capacity or spoilage.", "It should hold no flour because suppliers can never delay a delivery.", "It should base flour orders on the design of wedding-cake boxes."],
  },
  "bus-case-4-3": {
    application: ["Final inspection alone is quality assurance because it prevents defects at every assembly stage.", "More customer complaints show that current quality procedures are successful.", "Redesigning cardboard packaging will correct faulty screens during assembly."],
    analysis: ["Checking quality during assembly would increase the number of defective laptops reaching retailers.", "Reducing returns would raise repair and redelivery costs for NovaBook.", "Preventing screen faults would necessarily reduce monthly production to zero."],
    evaluation: ["NovaBook should inspect only finished laptops because prevention is always more expensive than failure.", "It should replace every assembly worker before identifying where screen faults arise.", "It should prioritise packaging design even if faulty screens continue damaging its reputation."],
  },
  "bus-case-4-4": {
    application: ["A faster printer's higher fixed cost will reduce InkWorks' break-even output automatically.", "Seasonal demand is irrelevant when assessing whether expected sales cover break-even.", "The lease end date is the same calculation as contribution per poster."],
    analysis: ["A lower variable cost per poster would reduce contribution and raise break-even output.", "Higher maximum output guarantees enough annual demand to cover the new fixed costs.", "Buying the printer would turn every fixed cost into a variable cost."],
    evaluation: ["InkWorks should buy because faster machinery is profitable at every possible sales level.", "It should reject the printer solely because fixed costs rise, ignoring variable-cost savings and capacity.", "It should decide from festival demand alone without forecasting quieter months."],
  },
  "bus-case-4-5": {
    application: ["The side-street site best reaches office workers because it has lower lunchtime footfall.", "Limited parking proves the office location has no access advantage for walking customers.", "Recently fitted kitchens make both locations equally suitable in every respect."],
    analysis: ["Choosing the office site would reduce rent and customer exposure at the same time.", "Higher lunchtime footfall would automatically reduce CityLunch's sales revenue.", "Extra evening-delivery space would guarantee demand from office workers at noon."],
    evaluation: ["CityLunch should choose the office site because the busiest location is profitable at any rent.", "It should choose the side street only because lower rent is always more important than sales potential.", "It should ignore target customers because both premises already contain kitchens."],
  },
  "bus-case-4-6": {
    application: ["Lean inventory means keeping every specialist part in stock in case it is requested.", "Obsolete parts improve cash flow because they remain on crowded shelves.", "A new cycle path guarantees suppliers will deliver every part immediately."],
    analysis: ["Reducing spare-parts inventory would increase cash tied up in unused stock.", "Holding no safety stock would prevent delays when suppliers take five days.", "Removing obsolete items would reduce the workshop's available shelf space."],
    evaluation: ["CycleFix should adopt zero inventory immediately because lean methods eliminate supplier delays.", "It should retain every old part because inventory can never become obsolete.", "It should order for forecast cycle-path demand without considering lead times or current cash."],
  },
  "bus-case-5-1": {
    application: ["Changing staff aprons is the strongest reason for borrowing $3000.", "Steady cash inflows mean the salon already has unlimited retained profit.", "A bank loan is internal finance generated by regular clients."],
    analysis: ["Monthly loan repayments would increase Glow's available cash every month.", "Replacing uncomfortable chairs would necessarily reduce customer satisfaction.", "Borrowing would remove the need to compare interest with expected benefits."],
    evaluation: ["Glow should accept any loan because regular clients guarantee every repayment.", "It should avoid all external finance even if unsafe or uncomfortable chairs harm service.", "It should finance aprons first because appearance always produces a higher return than essential equipment."],
  },
  "bus-case-5-2": {
    application: ["Strong August sales remove the need to plan cash payments in June and July.", "Ordering fewer popular sizes always increases revenue during the school season.", "Seasonal window decoration is the cause of the shop's supplier-payment gap."],
    analysis: ["Paying suppliers before customer sales would create a cash surplus automatically.", "An overdraft would reduce the timing gap by eliminating rent and wages.", "Running out of popular sizes would increase sales because scarcity replaces inventory."],
    evaluation: ["SmartStart should order unlimited stock because August demand can never be overestimated.", "It should order nothing until customers have paid, even if this loses the seasonal sales opportunity.", "It should choose finance according to the window display rather than the duration and size of the cash gap."],
  },
  "bus-case-5-3": {
    application: ["Higher revenue proves operating profit has increased by the same percentage.", "Discounting old inventory has no effect on profit or gross margin.", "Unchanged employee uniforms explain the rise in advertising costs."],
    analysis: ["If rent rises faster than gross profit, operating profit must increase.", "More online advertising spending guarantees that every additional sale is profitable.", "Discounting inventory would increase the gross profit earned per item."],
    evaluation: ["Threadline should judge performance from revenue alone because costs do not affect profit.", "It should stop all advertising solely because its cost has risen, without measuring generated sales.", "It should use employee-uniform changes as its main profitability indicator."],
  },
  "bus-case-5-4": {
    application: ["Full cake displays prove Bean & Crumb has enough cash to pay next week's bills.", "Perishable inventory is more liquid than money in the bank in every circumstance.", "New menu boards will convert supplier invoices into current assets."],
    analysis: ["Keeping unsold cakes longer would increase their resale value and improve liquidity.", "A heavy discount would increase the profit margin on each cake sold.", "Failing to pay wages and suppliers would improve the café's ability to continue trading."],
    evaluation: ["The café should discount every product immediately because sales volume is the only objective.", "It should refuse all promotions even if cakes become unsellable before bills are due.", "It should buy more menu boards with cash before dealing with wages and supplier payments."],
  },
  "bus-case-5-5": {
    application: ["A second factory should be financed with short-term trade credit for office supplies.", "Issuing shares requires MetroDesk to repay the capital with monthly interest.", "The chosen logo determines whether equity finance is affordable."],
    analysis: ["Issuing shares would increase MetroDesk's loan repayments and interest costs.", "Using only debt would guarantee directors retain control without increasing financial risk.", "Long-term factory assets would generate all required sales before any finance is needed."],
    evaluation: ["MetroDesk should issue as many shares as possible because ownership dilution has no consequence.", "It should use a large loan because repayment risk is irrelevant to long-term expansion.", "It should choose finance according to the new factory logo rather than cost, control, and cash flow."],
  },
  "bus-case-5-6": {
    application: ["Pharmacy A's higher gross margin proves it can pay every short-term debt on time.", "Pharmacy B's current ratio directly measures profit earned on each sale.", "Identical closing times make both pharmacies financially identical."],
    analysis: ["Slow inventory turnover would release cash more quickly for Pharmacy B.", "A high gross margin would guarantee strong liquidity even when little cash is held.", "Comparing one ratio would reveal every cause of performance without further information."],
    evaluation: ["HealthChoice should buy Pharmacy A using gross margin alone.", "It should buy Pharmacy B using current ratio alone and ignore profitability.", "It should treat both businesses as equal because they close at the same time."],
  },
  "bus-case-6-1": {
    application: ["Owning delivery vans protects Frosty Fields from all inflationary cost increases.", "Households reducing non-essential spending means demand for ice cream must rise.", "Inflation lowers the prices of milk, sugar, packaging, and electricity simultaneously."],
    analysis: ["Raising prices would always increase sales volume during weaker household demand.", "Reducing pack size would increase the quantity of ingredients used per pack.", "Absorbing every cost increase would raise the profit margin on each tub."],
    evaluation: ["Frosty Fields should pass on every cost increase because customers never compare prices.", "It should absorb all inflation indefinitely even if margins become unsustainable.", "It should base its response on van ownership rather than demand, costs, and competitor prices."],
  },
  "bus-case-6-2": {
    application: ["Currency appreciation makes Highland's locally priced coffee cheaper for overseas buyers.", "Solar warehouse lighting prevents exchange rates from affecting export demand.", "Selling 75% overseas means competitors cannot attract Highland's customers."],
    analysis: ["A stronger local currency would automatically increase the foreign-currency affordability of its coffee.", "Higher export prices would prevent buyers from switching to suppliers in other countries.", "Quality reputation would eliminate every effect of exchange-rate movements on demand."],
    evaluation: ["Highland should keep all prices unchanged because quality guarantees overseas loyalty.", "It should stop exporting immediately whenever the currency appreciates.", "It should choose its response according to warehouse lighting rather than margins and customer sensitivity."],
  },
  "bus-case-6-3": {
    application: ["Equal fabric colours mean the two suppliers have identical ethical performance.", "Unsafe working conditions are an internal production cost paid only by FairThread.", "Customer interest in sustainability makes supplier audits unnecessary."],
    analysis: ["Using the accused supplier would guarantee stronger customer trust and reputation.", "The certified supplier's higher price would automatically reduce total profit regardless of customer response.", "Pressure-group criticism would lower awareness of FairThread's sourcing choices."],
    evaluation: ["FairThread should always choose the cheapest supplier because ethics cannot affect sales.", "It should choose the certified supplier at any price without assessing quality, demand, or margins.", "It should decide from fabric colour because both suppliers offer the same range."],
  },
  "bus-case-6-4": {
    application: ["Sponsoring a football team removes the external cost of possible river pollution.", "Smells experienced by residents are a private cost recorded only in RiverTone's accounts.", "Employing local people gives the factory permission to ignore its environmental impact."],
    analysis: ["Cleaner technology would increase waste and resident complaints by definition.", "Losing the operating permit would allow RiverTone to produce more paint.", "Ignoring pollution concerns would strengthen relations with regulators and the community."],
    evaluation: ["RiverTone should avoid cleaner technology because installation cost is the only relevant factor.", "It should stop production permanently without comparing compliance options and long-term benefits.", "It should treat sports sponsorship as a substitute for meeting environmental requirements."],
  },
  "bus-case-6-5": {
    application: ["Growing overseas social-media interest guarantees profitable orders in every country.", "Recycled domestic packaging removes customs and currency risks abroad.", "Globalisation means delivery charges and returns cannot affect international sales."],
    analysis: ["Higher delivery charges would make Mara's final overseas price more competitive.", "Customs delays would always increase repeat purchases from international customers.", "Offering worldwide delivery immediately would reduce the complexity of returns and currencies."],
    evaluation: ["Mara should launch worldwide at once because online interest always converts into demand.", "She should reject all exports because international delivery can never be managed by a small business.", "She should choose markets according to recycled-box use rather than demand, delivery cost, and customs risk."],
  },
  "bus-case-6-6": {
    application: ["Free tyre-pressure checks prevent sales tax from affecting bicycle prices or margins.", "Online price comparison means customers will not notice a tax-related price increase.", "Larger competitors always pay a higher sales-tax rate than CityCycle."],
    analysis: ["Passing on the full tax would reduce final prices and attract price-sensitive customers.", "Absorbing the tax would increase the profit margin on each bicycle sold.", "A higher price would guarantee more sales because customers compare alternatives online."],
    evaluation: ["CityCycle should pass on the whole tax because customer demand never responds to price.", "It should absorb every tax increase indefinitely even if the business becomes unprofitable.", "It should rely on free tyre checks alone without calculating the effect on price and margin."],
  },
};

function validateCaseOptions(caseStudy: BusinessCaseStudy) {
  const seen = new Set<string>();

  caseStudy.questions.forEach((question) => {
    if (new Set(question.options).size !== question.options.length) {
      throw new Error(`Duplicate options in ${question.id}`);
    }

    question.options.forEach((option) => {
      const normalized = option.trim().toLowerCase();
      if (seen.has(normalized)) throw new Error(`Repeated option in ${caseStudy.id}: ${option}`);
      seen.add(normalized);
    });
  });
}

export const businessCaseStudyModules = [1, 2, 3, 4, 5, 6].map((unitId) => ({
  unitId,
  cases: caseSeeds.filter((caseStudy) => caseStudy.unitId === unitId).map((caseStudy, index) => {
    if (!reasoningDistractors[caseStudy.id]) throw new Error(`Missing reasoning options for ${caseStudy.id}`);
    const builtCase = buildCase(caseStudy, index);
    validateCaseOptions(builtCase);
    return builtCase;
  })
}));
