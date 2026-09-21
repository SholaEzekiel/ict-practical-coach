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

const caseSkillProgression: BusinessAssessmentSkill[][] = [
  ["K", "K", "K", "APP", "APP"],
  ["K", "K", "APP", "APP", "AN"],
  ["K", "APP", "APP", "AN", "EVAL"],
  ["K", "APP", "AN", "AN", "EVAL"],
  ["K", "APP", "AN", "EVAL", "EVAL"],
  ["K", "APP", "AN", "EVAL", "EVAL"]
];

function caseOnlyDetail(seed: CaseSeed, index: number) {
  return `${seed.details[index]} is relevant case evidence, but it needs to be linked clearly to ${seed.focus}.`;
}

function unsupportedAction(seed: CaseSeed) {
  return `${seed.title} should choose the lowest-risk approach, but this needs evidence from the scenario to be convincing.`;
}

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

  if (!draft) {
    throw new Error(`Missing knowledge question ${variant + 1} for ${seed.id}`);
  }

  return draft;
}

function applicationDraft(seed: CaseSeed, variant: number): QuestionDraft {
  if (variant % 2 === 0) {
    return {
      question: `Explain one reason ${seed.focus} is relevant to ${seed.title}.`,
      hint: `Use a named detail from the scenario, such as ${seed.details[0]} or ${seed.details[1]}.`,
      options: [
      seed.appliedPoint,
      seed.genericTheory,
      caseOnlyDetail(seed, 0),
      unsupportedAction(seed)
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
      caseOnlyDetail(seed, 2),
      seed.genericTheory,
      unsupportedAction(seed)
    ] as [string, string, string, string],
    feedback: [
      "Correct: it uses case evidence rather than giving only a textbook statement.",
      "For analysis, students would still need to develop the consequence further."
    ]
  };
}

function analysisDraft(seed: CaseSeed, variant: number): QuestionDraft {
  if (variant % 2 === 0) {
    return {
      question: `Analyse one likely effect of ${seed.focus} on ${seed.title}.`,
      hint: "Choose the answer that moves from the business concept to a case detail and then to a likely consequence.",
      options: [
      seed.analysisChain,
      seed.appliedPoint,
      seed.genericTheory,
      unsupportedAction(seed)
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
      seed.appliedPoint,
      seed.evaluation,
      caseOnlyDetail(seed, 2)
    ] as [string, string, string, string],
    feedback: [
      "Correct: the answer explains a developed effect using the scenario.",
      "A developed answer shows why the point matters to the business, not only that it exists."
    ]
  };
}

function evaluationDraft(seed: CaseSeed, variant: number): QuestionDraft {
  if (variant % 2 === 0) {
    return {
      question: `Recommend whether ${seed.title} should follow the course of action suggested in the scenario. Justify your answer.`,
      hint: `Use ${seed.focus}, at least one detail from the scenario, a consequence, and a reason why the judgement is best for this business.`,
      options: [
      seed.evaluation,
      seed.analysisChain,
      seed.appliedPoint,
      unsupportedAction(seed)
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
      seed.analysisChain,
      seed.genericTheory,
      seed.appliedPoint
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
    title: "Small Bakery Expansion",
    scenario: "Ama owns a small bakery with 8 workers. It sells premium handmade bread and is considering opening a second shop, but finance is limited.",
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
    title: "Phone Repair Start-Up",
    scenario: "Leo wants to start a phone repair kiosk in a busy mall. He has strong technical skills but little experience of managing cash or marketing.",
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
    title: "Furniture Partnership",
    scenario: "Two friends operate a furniture workshop as a partnership. They make custom tables and are worried about personal savings being at risk if debts rise.",
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
    title: "Farm and Food Producer",
    scenario: "A family farm grows tomatoes and now wants to make bottled tomato sauce. It must decide whether to stay in farming or add production work.",
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
    title: "Community Gym Objectives",
    scenario: "A community gym is run as a social enterprise. It wants to keep membership fees low while also making enough surplus to replace old equipment.",
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
    title: "Clothing Brand Franchise",
    scenario: "Nia wants to open a clothing outlet using an established brand's store design, supplier system, and advertising support. She must pay fees and follow rules.",
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
    title: "Hotel Staff Motivation",
    scenario: "A hotel has high labour turnover among reception staff. Guests complain that check-in is slow and service quality is inconsistent.",
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
    title: "Factory Leadership",
    scenario: "A factory producing school bags has missed several delivery deadlines. The manager currently uses a laissez-faire style with inexperienced workers.",
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
    title: "Supermarket Recruitment",
    scenario: "A supermarket needs a new store supervisor quickly. Internal candidates know the store, but none have managed a large team before.",
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
    title: "New Café Training",
    scenario: "A café chain opens a branch with ten new workers. It wants consistent food hygiene, customer service, and use of the till system.",
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
    title: "Call Centre Span of Control",
    scenario: "A call centre has 60 advisers and only two supervisors. Customers wait too long for problems to be resolved.",
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
    title: "Delivery Business Redundancy",
    scenario: "A delivery business introduces route-planning software. Fewer office workers are needed to schedule drivers, but customer demand is still growing.",
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
    title: "Juice Market Research",
    scenario: "A drinks start-up wants to launch mango juice for teenagers. It has limited finance and needs evidence before ordering bottles and labels.",
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
    title: "Sportswear Segment",
    scenario: "A sportswear shop sells to both serious runners and casual gym users. The owner wants to target advertising more accurately.",
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
    title: "Restaurant Pricing",
    scenario: "A family restaurant faces rising ingredient costs. It serves local families who are price sensitive but value fresh meals.",
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
    title: "Online Craft Promotion",
    scenario: "A craft seller uses e-commerce to sell handmade jewellery. Most customers discover products through social media photos.",
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
    title: "Furniture Distribution",
    scenario: "A furniture maker sells bulky tables. It is choosing between selling through local retailers or delivering directly from its workshop.",
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
    title: "Eco Soap Marketing Mix",
    scenario: "An eco soap brand sells higher-priced soap made from natural oils. It wants to enter supermarkets where many cheaper soaps are already sold.",
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
    title: "Toy Factory Production",
    scenario: "A toy factory makes 10 000 identical plastic cars each week. Demand is stable and retailers expect consistent supply.",
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
    title: "Bakery Inventory",
    scenario: "A bakery buys flour in bulk to avoid shortages. Storage space is limited and flour can be damaged if kept too long.",
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
    title: "Laptop Quality Assurance",
    scenario: "A laptop manufacturer receives complaints about faulty screens. It wants to reduce defects before finished laptops reach customers.",
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
    title: "Printing Break-Even",
    scenario: "A print shop is deciding whether to buy a new printer. It expects fixed costs to rise but variable cost per poster to fall.",
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
    title: "Restaurant Location",
    scenario: "A restaurant is choosing between a cheaper side street and an expensive location near offices. Lunchtime customers are its main target.",
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
    title: "Lean Production Workshop",
    scenario: "A bicycle workshop wants to reduce waste. It keeps many spare parts, but cash is tight and some parts become obsolete.",
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
    title: "Salon Finance Choice",
    scenario: "A hair salon needs new chairs costing $3000. It has steady cash inflows but little retained profit.",
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
    title: "Cash Flow Problem",
    scenario: "A school uniform shop sells most products in August, but must pay suppliers in June and July before customers buy uniforms.",
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
    title: "Income Statement Trend",
    scenario: "A clothing retailer's revenue has increased, but advertising and rent costs have risen faster than gross profit.",
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
    title: "Liquidity at a Café",
    scenario: "A café has high inventory of cakes but little cash. It must pay wages and rent next week.",
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
    title: "Share Issue for Expansion",
    scenario: "A private limited company making desks wants to expand into another city. The directors are considering issuing more shares to existing shareholders.",
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
    title: "Ratio Comparison",
    scenario: "Two pharmacies have similar sales. Pharmacy A has a higher gross profit margin, but Pharmacy B has a stronger current ratio.",
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
    title: "Ice Cream and Inflation",
    scenario: "An ice cream producer faces higher milk and electricity prices. Customers are already reducing non-essential spending.",
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
    title: "Exporter and Exchange Rates",
    scenario: "A local coffee exporter sells most output overseas. The local currency appreciates against key customer countries.",
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
    title: "Ethical Clothing Supplier",
    scenario: "A clothing brand can buy cheaper fabric from a supplier accused of poor worker conditions, or pay more for certified ethical fabric.",
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
    title: "Factory Pollution",
    scenario: "A paint factory near a river can install cleaner technology. It is expensive, but local residents complain about pollution.",
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
    title: "Online Retail Globalisation",
    scenario: "An online retailer in country X wants to sell handmade bags internationally. Delivery costs are high but social media interest is growing overseas.",
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
    title: "Government Tax Change",
    scenario: "A bicycle shop faces an increase in sales tax. Many customers compare prices online before buying.",
    details: ["bicycle shop", "higher sales tax", "online price comparison", "price-sensitive customers"],
    focus: "government economic policy",
    genericTheory: "Taxes can increase business costs or prices paid by customers.",
    appliedPoint: "The bicycle shop may have to raise prices after the sales tax increase, but customers compare prices online.",
    analysisChain: "If prices rise, customers may switch to cheaper competitors, reducing sales revenue for the bicycle shop.",
    evaluation: "The shop may need to absorb part of the tax and improve service, because passing on the full increase could lose price-sensitive online shoppers."
  }
];

export const businessCaseStudyModules = [1, 2, 3, 4, 5, 6].map((unitId) => ({
  unitId,
  cases: caseSeeds.filter((caseStudy) => caseStudy.unitId === unitId).map((caseStudy, index) => buildCase(caseStudy, index))
}));
