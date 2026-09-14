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

const unitKnowledgeAngles: Record<number, [string, string, string]> = {
  1: ["definition", "purpose", "ownership or size decision"],
  2: ["definition", "people-management reason", "possible limitation"],
  3: ["definition", "market decision", "risk or limitation"],
  4: ["definition", "operations reason", "cost or quality issue"],
  5: ["definition", "finance reason", "cash or ratio limitation"],
  6: ["definition", "external influence", "business response"]
};

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

function knowledgeDraft(seed: CaseSeed, variant: number): QuestionDraft {
  const angles = unitKnowledgeAngles[seed.unitId] || unitKnowledgeAngles[1];
  const knowledgeOptions: [string, string, string, string] = [
    seed.genericTheory,
    seed.appliedPoint,
    seed.analysisChain,
    seed.evaluation
  ];

  if (variant === 0) {
    return {
      question: `What is meant by ${seed.focus}?`,
      hint: `Know the business term before adding details from ${seed.title}.`,
      options: knowledgeOptions,
      feedback: [
        `Correct: this gives accurate knowledge of ${seed.focus}.`,
        "In longer answers, this knowledge should be followed by relevant application and explanation."
      ]
    };
  }

  if (variant === 1) {
    return {
      question: `Identify a valid ${angles[1]} linked to ${seed.focus}.`,
      hint: `Think about the business reason before deciding how it applies to ${seed.title}.`,
      options: [
      seed.genericTheory,
      caseOnlyDetail(seed, 0),
      seed.analysisChain,
      unsupportedAction(seed)
    ] as [string, string, string, string],
      feedback: [
        "Correct: this is valid business knowledge from the unit.",
        "Knowledge questions test whether the concept is understood before it is applied to a business."
      ]
    };
  }

  return {
    question: `Which statement is most useful when answering a question about ${angles[2]}?`,
    hint: `Think about the syllabus idea behind ${seed.focus}, not only the facts in the scenario.`,
    options: [
      seed.genericTheory,
      seed.analysisChain,
      seed.appliedPoint,
      unsupportedAction(seed)
    ] as [string, string, string, string],
    feedback: [
      `Correct: it gives the core business knowledge needed for ${seed.focus}.`,
      "Case details and consequences can then be added for higher-skill answers."
    ]
  };
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
