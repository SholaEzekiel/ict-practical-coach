"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpenCheck, CheckCircle2, ChevronLeft, ChevronRight, FileText, ListChecks, XCircle } from "lucide-react";
import { businessNoteModules } from "@/lib/business-note-data";
import type { BusinessNoteLesson } from "@/lib/business-note-data";
import { businessGlossaryTerms } from "@/lib/business-theory-data";
import type { BusinessTheoryLesson } from "@/lib/business-theory-data";
import { Card, Pill, ProgressBar } from "@/components/ui";

type ContentTarget = string | "module-glossary" | "module-quiz";
type BusinessKnowledgeQuestion = {
  id: string;
  prompt: string;
  correct: BusinessTheoryLesson;
  options: BusinessTheoryLesson[];
};
type BusinessQuizScore = { correct: number; attempted: number };
type BusinessQuizSelections = Record<string, Record<string, string>>;

const forbiddenLine = /(creativecommons|https?:\/\/|Grupp20fiskar|studyvaults?|studeyvaults?)/i;
const businessQuizScoreStorageKey = "peak-business-quiz-scoreboard";
const businessMinimumQuizCount = 60;

const businessExamNoteAdditions: Record<string, string> = {
  "bus-note-1-3": "\nExam focus - growth and business size\nDo not just say a business is large or small; link the measure to the case. Number of employees suits labour-intensive businesses, output value can mislead when products have different prices, and capital employed suits businesses that use expensive assets.\nGrowth may bring economies of scale and market share, but overexpansion can create cash shortages, communication problems, and loss of control.",
  "bus-note-1-4": "\nExam focus - ownership decisions\nA strong answer compares control, finance, continuity, liability, legal requirements, and the owner's objectives.\nFor franchises, application must use the brand support, fees, rules, supplies, or local market in the case; do not simply repeat the word franchise.",
  "bus-note-1-5": "\nExam focus - objectives and stakeholders\nStakeholder conflict questions need both sides. For example, shareholders may want higher profit, while workers may want higher pay and the local community may want less noise or pollution.\nA justified conclusion should explain which objective matters most in the situation, such as survival for a new business or growth for an established one.",
  "bus-note-2-1": "\nExam focus - motivation answers\nUse the business context when choosing a method of motivation. Piece rate may suit measurable output, commission may suit sales staff, and job enrichment may suit skilled employees needing responsibility.\nFor higher marks, explain how motivation affects productivity, labour turnover, absenteeism, quality, and customer service.",
  "bus-note-2-2": "\nExam focus - management and structure\nA tall structure can improve supervision but slow communication; a wide span may speed decisions but reduce control.\nLeadership style depends on worker skill, urgency, task risk, and the need for ideas. Avoid saying one style is always best.",
  "bus-note-2-3": "\nExam focus - recruitment and training\nApplication means using the vacancy and business situation. A shop supervisor, factory worker, and finance manager may need different selection methods and training.\nInduction introduces the workplace, on-the-job is practical and specific, and off-the-job may bring specialist skills but can be expensive.",
  "bus-note-3-1": "\nExam focus - market research\nPrimary research is current and specific, but may be expensive or biased if the sample is poor. Secondary research is quicker and cheaper, but may be outdated or not fit the business's exact need.\nAccuracy can be affected by sample size, question wording, timing, bias, and whether respondents tell the truth.",
  "bus-note-3-2": "\nExam focus - market and customers\nSegmentation should identify a useful group, such as age, income, lifestyle, location, or buying behaviour.\nA strong answer explains how knowing the segment helps the business adapt product, price, place, and promotion.",
  "bus-note-3-3": "\nExam focus - marketing mix\nFor 8-mark and 12-mark questions, compare the marketing mix elements rather than listing them. A price change may need matching promotion, and a new product may need suitable distribution.\nA good judgement depends on target market, competition, costs, product image, and business objective.",
  "bus-note-4-1": "\nExam focus - production methods\nJob production suits one-off or customised products, batch production suits groups of similar products, and flow production suits high-volume standardised output.\nThe best method depends on demand, variety, skill needs, machinery cost, flexibility, and quality requirements.",
  "bus-note-4-2": "\nExam focus - inventory and break-even\nHigh inventory can prevent production stopping and meet sudden demand, but increases storage cost, risk of damage, and cash tied up in stock.\nBreak-even answers should link fixed costs, variable costs, selling price, contribution, break-even output, and margin of safety.",
  "bus-note-4-3": "\nExam focus - quality\nQuality control checks finished output and can reject faulty products. Quality assurance builds checks into the process to prevent faults.\nQuality matters because it affects reputation, repeat purchases, waste, returns, and competitiveness.",
  "bus-note-5-1": "\nExam focus - choosing finance\nThe best source of finance depends on amount required, purpose, repayment period, cost, business size, legal structure, risk, existing debts, and control.\nDebt keeps ownership but needs repayment and interest; equity avoids interest but may reduce control and share future profits.",
  "bus-note-5-2": "\nExam focus - cash flow\nProfit is not the same as cash. A profitable business can fail if cash inflows arrive after wages, rent, suppliers, or loan payments are due.\nShort-term cash problems may be improved by overdrafts, delaying payments, encouraging faster customer payment, reducing inventory, or selling unused assets.",
  "bus-note-5-5": "\nExam focus - accounts analysis\nRatios must be interpreted, not just calculated. Profitability shows how well profit is made from sales or capital; liquidity shows ability to pay short-term debts.\nCompare with previous years, competitors, and business objectives before making a judgement.",
  "bus-note-6-1": "\nExam focus - economic change\nInflation can raise costs and reduce purchasing power. Higher interest rates can increase loan costs and reduce consumer spending.\nExchange rate appreciation makes imports cheaper and exports more expensive; depreciation usually has the opposite effect.",
  "bus-note-6-2": "\nExam focus - ethics and environment\nEthical or environmental choices can raise costs in the short term but improve reputation, customer loyalty, and relationships with workers or communities.\nA balanced answer weighs profit impact against pressure groups, legal risks, brand image, and stakeholder expectations.",
  "bus-note-6-3": "\nExam focus - international business\nGlobalisation can give access to larger markets, cheaper resources, and spreading risk, but may create transport costs, exchange-rate risk, cultural differences, and stronger competition.\nTariffs and quotas protect local businesses but may raise prices and reduce consumer choice."
};

const tableCards: Record<string, { headers: string[]; rows: string[][]; skip: number }> = {
  "Primary Secondary Tertiary": {
    headers: ["Primary", "Secondary", "Tertiary"],
    rows: [["Industries that extract raw materials from the Earth", "The industry that convert raw materials into finished goods", "The industry that provides services"]],
    skip: 4,
  },
  "Hygiene Motivating": {
    headers: ["Hygiene", "Motivating"],
    rows: [
      ["Good work environment/conditions", "Acknowledgment by superiors"],
      ["Job security", "Promotion"],
      ["Good relationship with superiors", "Enjoyment in the work given"],
      ["Salary", "Achievement"],
    ],
    skip: 4,
  },
  "Planning Organising Commanding Coordinating Controlling": {
    headers: ["Planning", "Organising", "Commanding", "Coordinating", "Controlling"],
    rows: [["Create plans to work towards the business goal", "Creating tasks to put the plan into work, and delegating these tasks", "Giving direction to employees so that the tasks are done well", "Managing multiple employees so work is done efficiently", "Creating deadlines and monitoring progress to meet targets."]],
    skip: 5,
  },
  "Autocratic Democratic Laissez-faire": {
    headers: ["Autocratic", "Democratic", "Laissez-faire"],
    rows: [
      ["Decisions are made by the manager, and employees must follow instructions from the manager without question.", "Managers and employees share and discuss ideas to come up with the best decision.", "The manager shares the objectives and lets the employees do what they see fit with the given task."],
      ["Decisions are made fast. Employees are clear with instructions.", "Decisions made may be the best option, so better decisions made. Employee skills and relationships improve.", "Employees may feel motivated as they have freedom. They can develop their own skills."],
      ["No employee contribution, leading to demotivation and dissatisfaction.", "Decision making is slow. Conflicts may arise; unproductive and slow.", "No clear instructions given. This could be unproductive."],
    ],
    skip: 14,
  },
};

function shuffle<T>(items: T[]) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function cleanLines(content: string) {
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !forbiddenLine.test(line));
}

function definitionParts(line: string) {
  const match = line.match(/^([^:–-]{2,58})\s*[:\-]\s+(.+)$/);
  if (!match) return null;
  const [, term, definition] = match;
  if (term.toLowerCase().startsWith("to ")) return null;
  return { term, definition };
}

function isSoftHeading(line: string) {
  if (line.endsWith(":")) return true;
  if (/^(key definitions|methods of|types of|reasons for|importance of|benefits of|purpose of|role of|leadership styles|communication barriers|private sector|public sector|social enterprises|stakeholders|objectives|financial|non financial|making work less boring)/i.test(line)) return true;
  if (/^(Maslow|Taylor|Herzberg|Internal recruitment|External recruitment|Part time|Full time|Trade unions)/i.test(line)) return true;
  return false;
}

function isBulletLine(line: string) {
  if (definitionParts(line) || tableCards[line] || isSoftHeading(line)) return false;
  if (/^\d+\./.test(line)) return true;
  return line.length <= 95 && !/[.;:]$/.test(line);
}

function NoteTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="my-5 overflow-hidden rounded-lg border border-line">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-ink text-white">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 font-bold">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-white">
            {rows.map((row, rowIndex) => (
              <tr key={`${row.join("-")}-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`${cell}-${cellIndex}`} className="max-w-sm align-top px-4 py-3 leading-6 text-slate-700">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DefinitionLine({ line }: { line: string }) {
  const parts = definitionParts(line);
  if (!parts) return <p className="leading-7 text-slate-800">{line}</p>;
  return (
    <p className="leading-7 text-slate-800">
      <strong className="font-bold text-ink">{parts.term}:</strong> {parts.definition}
    </p>
  );
}

function BusinessNoteRenderer({ lesson }: { lesson: BusinessNoteLesson }) {
  const lines = cleanLines(`${lesson.content}${businessExamNoteAdditions[lesson.id] || ""}`);
  const elements = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const table = tableCards[line];

    if (table) {
      elements.push(<NoteTable key={`${lesson.id}-table-${index}`} headers={table.headers} rows={table.rows} />);
      index += table.skip + 1;
      continue;
    }

    if (isSoftHeading(line)) {
      elements.push(
        <h4 key={`${lesson.id}-heading-${index}`} className="mt-6 border-l-4 border-gold pl-3 text-lg font-bold text-ink first:mt-0">
          {line.replace(/:$/, "")}
        </h4>,
      );
      index += 1;
      continue;
    }

    if (isBulletLine(line)) {
      const bullets = [];
      while (index < lines.length && isBulletLine(lines[index]) && !tableCards[lines[index]]) {
        bullets.push(lines[index].replace(/^\d+\.\s*/, ""));
        index += 1;
      }
      elements.push(
        <ul key={`${lesson.id}-list-${index}`} className="my-4 space-y-2 pl-2">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3 leading-7 text-slate-800">
              <span className="mt-3 h-2 w-2 flex-none bg-gold" aria-hidden="true" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    elements.push(<DefinitionLine key={`${lesson.id}-line-${index}`} line={line} />);
    index += 1;
  }

  return <div className="space-y-3 text-base">{elements}</div>;
}

function buildOptionSet(correct: BusinessTheoryLesson | undefined, pool: BusinessTheoryLesson[]) {
  if (!correct) return [];
  const source = pool.length >= 4 ? pool : businessGlossaryTerms;
  const distractors = shuffle(source.filter((term) => term.id !== correct.id)).slice(0, 3);
  return shuffle([correct, ...distractors]);
}

function cleanQuizPrompt(term: BusinessTheoryLesson) {
  const customPrompts: Record<string, string> = {
    Need: "Clean drinking water, basic food, shelter, and medical care are examples of items required for survival.",
    Want: "A good or service that people would like to have but is not essential for living.",
    "Economic problem": "Society cannot produce everything people would like because resources are limited.",
    "Factors of production": "Land, labour, capital, and enterprise are grouped together as resources used to make goods and services.",
    Scarcity: "There are not enough resources or products to satisfy every possible human want.",
    "Opportunity Cost": "A business chooses one option and gives up the next best alternative.",
    Specialization: "A worker or business concentrates on a narrow activity it can do well.",
    "Division of labour": "Production is split into separate tasks, with different workers repeatedly doing particular parts of the process.",
    Business: "An organisation combines resources to produce goods or services that satisfy customer wants.",
    "Primary Sector": "A fishing, farming, mining, or forestry activity belongs to the industry stage that obtains natural resources.",
    "Secondary Sector": "A factory turns raw materials into finished or semi-finished goods.",
    "Tertiary Sector": "A hairdresser, bank, school, or transport firm provides a service rather than extracting or manufacturing goods.",
    "Mixed Economy": "Both privately owned firms and government-run organisations operate in the same economy.",
    "Private Sector": "A shop owned by individuals aims to make profit and is not owned by the state.",
    "Public Sector": "A government-run hospital or state school is controlled by the state and usually aims to provide a service.",
    "Capital Employed": "A business compares its long-term finance invested in the business with the return it earns.",
    "Internal Growth": "A firm expands by opening more of its own branches or increasing its own sales.",
    "External Growth": "A firm expands by joining with or buying another firm.",
    "Integrations/Merger": "Two firms agree to combine and continue as one larger organisation.",
    "Takeover/Acquisition": "One firm buys enough of another firm to control it.",
    "Horizontal Integration": "A bakery joins with another bakery at the same production stage.",
    "Vertical Integration": "A manufacturer takes control of a supplier or a retailer in its chain of production.",
    "Conglomerate Integration/Diversification": "A firm joins with another firm in a completely different industry to spread risk.",
    "Limited Liability": "Shareholders in a company risk only the amount they put into the company if it fails.",
    "Unlimited Liability": "A sole trader may have to use personal assets to pay business debts if the business cannot pay them.",
    Partnership: "Two or more owners run the same business and share responsibility for its decisions.",
    "Partnership Agreement": "Partners use a written document to set out profit sharing, duties, and what happens if one partner leaves.",
    "Unincorporated Business": "A sole trader or ordinary partnership has no separate legal identity from its owner or owners.",
    "Incorporated Business": "A company has its own legal identity, separate from the people who own it.",
    Shareholders: "People who own parts of a limited company may vote and receive dividends.",
    Dividend: "Company owners may receive a share of profit after tax.",
    Franchise: "Business arrangement where one business uses another successful business's brand name, products, support, and trading methods in return for fees.",
    Franchisor: "The original business that allows another operator to use its established brand, products, and trading system.",
    Franchisee: "The operator who pays to use an established business name, products, and trading method.",
    Stakeholder: "A person or group with an interest in, or affected by, a business and its decisions.",
    "Added Value": "The difference between the selling price of a product and the cost of bought-in materials and components.",
    "Market share": "One firm's sales are compared with the total sales in the whole market.",
    "Social Enterprise": "A firm tries to earn profit while also pursuing aims such as helping the community or protecting the environment.",
    Motivation: "Workers are willing to work hard and effectively for the business.",
    Wages: "A worker is paid each week, often based on hours worked.",
    Salary: "A worker receives a fixed amount each month.",
    Bonus: "A worker receives extra pay as a reward for good performance.",
    "Performance-related pay": "A worker's pay rises when measurable results improve.",
    "Share ownership": "Employees receive part ownership of the company as a reward or incentive.",
    "Job satisfaction": "A worker feels pleased because the work itself or the achievement from it is rewarding.",
    "Job rotation": "Employees move between different tasks for set periods to reduce boredom and increase flexibility.",
    "Job enlargement": "A job is widened by adding more tasks at the same level of responsibility.",
    "Job enrichment": "A job is made more challenging by adding greater responsibility or more skilled work.",
    "Organizational structure": "A diagram or arrangement shows levels of responsibility and authority inside a business.",
    "Chain of command": "Instructions pass down from senior managers through layers of authority.",
    "Line managers": "Managers have direct authority over workers below them.",
    "Staff managers": "Specialist managers advise and support other managers but may not directly command their teams.",
    "Autocratic leadership": "The manager makes decisions with little or no employee involvement.",
    "Democratic leadership": "Employees are involved in discussion before decisions are made.",
    "Laissez-faire leadership": "Employees are given freedom to make many decisions about how work is done.",
    "Trade union": "Workers join together in an organisation to protect their interests at work.",
    Recruitment: "A business attracts suitable applicants for a vacancy.",
    Selection: "A business chooses the most suitable applicant from those who applied.",
    "Job description": "A vacancy document lists duties, responsibilities, pay, and working hours.",
    "Person specification": "A vacancy document lists the qualifications, skills, and qualities needed from the applicant.",
    "Internal recruitment": "A vacancy is filled by someone already working in the organisation.",
    "External recruitment": "A vacancy is advertised to people outside the organisation.",
    "Induction training": "A new employee learns workplace rules, procedures, and basic information about the organisation.",
    "On-the-job training": "An employee learns while doing the work, often helped by an experienced colleague.",
    "Off-the-job training": "An employee learns away from the normal workplace, often with specialist trainers.",
    "Part-time": "An employee works fewer hours than a full-time worker, such as evenings or selected days each week.",
    "Workforce planning": "A business estimates how many employees and what skills it will need in the future.",
    Redundancy: "A worker loses a job because the business no longer needs that role.",
    Dismissal: "A worker is removed from employment because of poor conduct or failure to meet requirements.",
    "Market Share": "A firm's sales are shown as a percentage of total sales in the market.",
    "Niche Market": "A small specialist part of a wider market is targeted.",
    "Market Segment": "Customers are grouped by features such as age, income, location, or lifestyle.",
    "Product Orientated Business": "A firm concentrates mainly on the good or service it can make before considering customer research.",
    "Market Orientated Business": "A firm researches customer needs before developing what it sells.",
    "Marketing Budget": "A firm sets aside a planned amount of money for promotion and other marketing activities.",
    "Market Research": "A business gathers and analyses information about customers, competitors, and demand.",
    "Primary Research": "A business collects new information directly from people such as customers or potential customers.",
    "Secondary Research": "A business uses information that already exists, such as reports, websites, or government data.",
    "Random Sample": "People are chosen by chance so each member of the population has an equal chance of being selected.",
    "Focus Group": "A small group from the target market discusses a product, advert, or idea in detail.",
    "Marketing Mix": "A business combines product, price, place, and promotion to meet customer needs.",
    "Brand Name": "A product has a unique identity so customers can recognise it and distinguish it from competitors.",
    "Brand Loyalty": "Customers repeatedly buy from the same brand instead of switching to competitors.",
    "Brand Image": "Customers associate a product with a particular identity, reputation, or personality.",
    "Product Life Cycle": "A product moves through introduction, growth, maturity, and decline.",
    "Cost-Plus Pricing": "A business adds a mark-up to production cost when setting price.",
    "Price Skimming": "A high launch price is used, often before competitors enter or before the price is lowered.",
    "Price Elasticity": "A business measures how strongly demand responds when price changes.",
    "Informative Advertising": "Promotion gives customers facts about the product rather than mainly creating desire.",
    "Persuasive Advertising": "Promotion tries to convince customers to buy by appealing to needs, emotions, or preferences.",
    "Sales Promotion": "Short-term incentives such as discounts, free gifts, or competitions encourage purchases.",
    "Marketing Strategy": "A planned approach uses the marketing mix to meet a marketing objective.",
    "Buffer Inventory Level": "Extra stock is held to deal with uncertain demand or delays from suppliers.",
    "Just-In-Time (JIT)": "Supplies arrive only when needed, so the business avoids holding large inventories.",
    "Flow Production": "Large quantities of a standardised product are made continuously, often on an assembly line.",
    "Computer Aided Design (CAD)": "Software is used to create and amend product drawings before production.",
    "Computer Aided Manufacture (CAM)": "Computers control machinery or robots during production.",
    "Computer Integrated Manufacturing (CIM)": "Design data is sent directly to computer-controlled production equipment.",
    "Electronic Point of Sale (EPOS)": "At checkout, product details are scanned and sales records are updated.",
    "Electronic Funds Transfer at Point of Sale (EFTPOS)": "A checkout system sends card payment details through a network for authorisation.",
    "Fixed Costs": "Rent and salaries may stay the same in the short run even if output changes.",
    "Variable Costs": "Raw materials and direct labour may rise as more units are produced.",
    "Average Cost per Unit": "Total production cost is divided by the number of units made.",
    "Economies of Scale": "As a business grows, each unit may become cheaper to produce.",
    "Diseconomies of Scale": "After growing too large, a business may face higher unit costs because control and communication become harder.",
    "Break-Even Level of Output": "The firm calculates the output where total revenue would exactly cover total cost.",
    "Break-Even Charts": "A graph plots revenue and cost lines so managers can see whether a planned output is profitable.",
    "Break-Even Point": "At this sales level, the business makes neither profit nor loss.",
    "Quality Control": "Finished items are inspected so faulty products can be found before reaching customers.",
    "Quality Assurance": "Checks are built into the production process to prevent faults before the final stage.",
    "Total Quality Management (TQM)": "Everyone in the organisation is responsible for continuous improvement and preventing mistakes.",
    "External Finance": "Money is raised from outside the business, such as from banks, investors, or suppliers.",
    "Cash Flow": "Money moving into and out of the business is tracked over time.",
    "Cash Flow Cycle": "The business pays for inputs before receiving money from selling finished goods.",
    "Cash Flow Forecast": "Future inflows, outflows, and balances are estimated month by month.",
    "Opening Cash/Bank Balance": "The business starts the month with this amount available.",
    "Closing Cash/Bank Balance": "The end-of-month amount becomes the starting figure for the next month.",
    "Income Statement": "A financial statement records revenue and costs to show profit or loss over a period.",
    "Cost of Goods Sold": "The business identifies the direct cost of the goods actually sold during the period.",
    "Net Profit": "All costs are deducted from revenue to find the final profit before distribution or tax treatment.",
    "Retained Profit": "Some profit is kept inside the company instead of being paid out to owners.",
    Assets: "Items of value owned by a business can be used in its operations or converted into money.",
    "Disposable income": "Households have money left to spend or save after income tax has been paid.",
    "Import quota": "A government sets a physical limit on how much of a product may enter the country.",
    "Ethical decision": "A manager chooses an action because it is morally right, even if it may increase costs.",
    "External costs": "A factory's pollution may harm nearby residents even though the firm does not pay that full cost.",
    "Sustainable development": "Current economic activity should not damage the ability of future generations to meet their needs.",
    "Pressure group": "People organise campaigns, petitions, or boycotts to influence business decisions.",
    "Consumer boycott": "Customers deliberately stop buying from a firm to protest against its behaviour.",
    "Free trade agreements": "Countries remove or reduce barriers so goods can move between them more easily.",
    "Currency appreciation": "A country's money buys more foreign currency than before.",
    "Currency depreciation": "A country's money buys less foreign currency than before."
  };
  if (customPrompts[term.title]) return customPrompts[term.title];

  return term.fullDefinition;
}

function buildKnowledgeQuestions(moduleGlossary: BusinessTheoryLesson[]) {
  if (!moduleGlossary.length) return [];
  const questions: BusinessKnowledgeQuestion[] = [];
  let index = 0;

  while (questions.length < Math.max(businessMinimumQuizCount, moduleGlossary.length)) {
    const term = moduleGlossary[index % moduleGlossary.length];
    const options = buildOptionSet(term, moduleGlossary);
    questions.push({
      id: `${term.id}-knowledge-${Math.floor(index / moduleGlossary.length) + 1}`,
      prompt: cleanQuizPrompt(term),
      correct: term,
      options
    });
    index += 1;
  }

  return questions;
}

export function BusinessTheoryHub() {
  const [activeModuleId, setActiveModuleId] = useState(businessNoteModules[0]?.id || "");
  const [activeLessonId, setActiveLessonId] = useState<ContentTarget>(businessNoteModules[0]?.lessons[0]?.id || "");
  const [quizOrder, setQuizOrder] = useState<number[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelections, setQuizSelections] = useState<BusinessQuizSelections>({});
  const [quizAttempts, setQuizAttempts] = useState<Record<string, BusinessQuizScore>>({});

  const activeModule = businessNoteModules.find((module) => module.id === activeModuleId) || businessNoteModules[0];
  const moduleGlossary = useMemo(
    () => businessGlossaryTerms.filter((term) => term.id.startsWith(`bus-${activeModule?.moduleId}-`)),
    [activeModule?.moduleId],
  );
  const knowledgeQuestions = useMemo(() => buildKnowledgeQuestions(moduleGlossary), [moduleGlossary]);
  const activeLesson = activeModule?.lessons.find((lesson) => lesson.id === activeLessonId);

  useEffect(() => {
    setQuizOrder(shuffle(knowledgeQuestions.map((_, index) => index)));
    setQuizIndex(0);
  }, [knowledgeQuestions]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(businessQuizScoreStorageKey);
      if (!saved) return;
      const parsed = JSON.parse(saved) as Record<string, BusinessQuizScore>;
      if (parsed && typeof parsed === "object") setQuizAttempts(parsed);
    } catch {
      window.localStorage.removeItem(businessQuizScoreStorageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(businessQuizScoreStorageKey, JSON.stringify(quizAttempts));
  }, [quizAttempts]);

  const orderedIndex = quizOrder.length ? quizOrder[quizIndex % quizOrder.length] : 0;
  const quizQuestion = knowledgeQuestions[orderedIndex] || knowledgeQuestions[0];
  const quizTerm = quizQuestion?.correct;
  const options = quizQuestion?.options || [];
  const selectedAnswer = activeModule && quizQuestion ? quizSelections[activeModule.id]?.[quizQuestion.id] || null : null;
  const isCorrect = selectedAnswer === quizTerm?.title;
  const moduleScore = quizAttempts[activeModule.id] || { correct: 0, attempted: 0 };
  const quizPoints = moduleScore.correct * 10;
  const answeredInModule = moduleScore.attempted;
  const quizProgress = knowledgeQuestions.length ? (answeredInModule / knowledgeQuestions.length) * 100 : 0;

  function chooseModule(moduleId: string) {
    const nextModule = businessNoteModules.find((module) => module.id === moduleId);
    setActiveModuleId(moduleId);
    setActiveLessonId(nextModule?.lessons[0]?.id || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function chooseContent(moduleId: string, target: ContentTarget) {
    if (moduleId !== activeModuleId) {
      setActiveModuleId(moduleId);
    }
    setActiveLessonId(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function nextQuestion() {
    setQuizIndex((index) => index + 1);
  }

  function previousQuestion() {
    setQuizIndex((index) => Math.max(index - 1, 0));
  }

  function chooseAnswer(answer: string) {
    if (selectedAnswer !== null) return;
    if (!quizQuestion) return;
    setQuizSelections((current) => ({
      ...current,
      [activeModule.id]: {
        ...(current[activeModule.id] || {}),
        [quizQuestion.id]: answer
      }
    }));
    setQuizAttempts((current) => {
      const moduleScore = current[activeModule.id] || { correct: 0, attempted: 0 };
      return {
        ...current,
        [activeModule.id]: {
          attempted: moduleScore.attempted + 1,
          correct: moduleScore.correct + (answer === quizTerm?.title ? 1 : 0)
        }
      };
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[440px_minmax(0,1fr)]">
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpenCheck size={22} className="text-ocean" aria-hidden="true" />
          <h2 className="text-2xl font-bold">Business modules</h2>
        </div>
        {businessNoteModules.map((module) => {
          const open = activeModule?.id === module.id;
          return (
            <Card key={module.id} className={`transition ${open ? "border-ocean ring-2 ring-ocean/10" : ""}`}>
              <button type="button" onClick={() => chooseModule(module.id)} className="flex w-full items-center justify-between gap-4 text-left">
                <span>
                  <span className="text-sm font-semibold text-slate-500">{module.lessons.length} lessons</span>
                  <span className="mt-2 block break-words text-xl font-bold text-ink">Unit {module.moduleId} {module.moduleTitle}</span>
                </span>
                <ChevronRight className={`flex-none text-ocean transition ${open ? "rotate-90" : ""}`} size={20} aria-hidden="true" />
              </button>

              {open && (
                <div className="mt-5 border-t border-line pt-4">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Course Content</h3>
                  <div className="mt-3 space-y-2">
                    {module.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => chooseContent(module.id, lesson.id)}
                        className={`flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition ${
                          activeLessonId === lesson.id ? "border-ocean bg-mist text-ocean" : "border-line bg-white text-ink hover:border-ocean"
                        }`}
                      >
                        <span className="min-w-0 break-words font-bold">{lesson.number} {lesson.title}</span>
                        <ChevronRight size={17} className="flex-none" aria-hidden="true" />
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => chooseContent(module.id, "module-glossary")}
                      className={`flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition ${
                        activeLessonId === "module-glossary" ? "border-ocean bg-mist text-ocean" : "border-line bg-white text-ink hover:border-ocean"
                      }`}
                    >
                      <span className="min-w-0 break-words font-bold">Module glossary</span>
                      <ChevronRight size={17} className="flex-none" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => chooseContent(module.id, "module-quiz")}
                      className={`flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition ${
                        activeLessonId === "module-quiz" ? "border-ocean bg-mist text-ocean" : "border-line bg-white text-ink hover:border-ocean"
                      }`}
                    >
                      <span className="min-w-0 break-words font-bold">Multiple choice questions</span>
                      <ChevronRight size={17} className="flex-none" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </section>

      <div className="min-w-0 space-y-5">
        <Card>
          <Pill>Unit {activeModule?.moduleId}</Pill>
          <h2 className="mt-4 text-3xl font-bold">{activeModule?.moduleTitle}</h2>
          <p className="mt-3 text-slate-600">Open a lesson, then revise the exact topic notes, glossary, and multiple-choice practice for this unit.</p>
        </Card>

        {activeLesson && (
          <Card>
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 flex-none place-items-center rounded-lg bg-mist text-ocean">
                <FileText size={20} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-ocean">{activeLesson.number}</p>
                <h3 className="mt-1 break-words text-2xl font-bold">{activeLesson.title}</h3>
              </div>
            </div>
            <div className="mt-6 rounded-lg border border-line bg-white p-5 md:p-7">
              <BusinessNoteRenderer lesson={activeLesson} />
            </div>
          </Card>
        )}

        {activeLessonId === "module-glossary" && (
          <Card>
            <Pill>Glossary</Pill>
            <h3 className="mt-4 text-2xl font-bold">{activeModule?.moduleTitle} glossary</h3>
            <div className="mt-5 divide-y divide-line overflow-hidden rounded-lg border border-line bg-white">
              {moduleGlossary.map((term) => (
                <div key={term.id} className="grid gap-2 p-4 md:grid-cols-[220px_minmax(0,1fr)]">
                  <p className="break-words font-bold text-ink">{term.title}</p>
                  <p className="text-sm leading-6 text-slate-700">{term.fullDefinition}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeLessonId === "module-quiz" && quizQuestion && (
          <Card>
            <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-start">
              <div>
                <div className="flex items-center gap-2">
                  <ListChecks size={20} className="text-ocean" aria-hidden="true" />
                  <h2 className="text-2xl font-bold">Multiple choice questions</h2>
                </div>
                <p className="mt-3 leading-7 text-slate-600">Read the clue, then choose the correct business term. Question order is shuffled for this attempt.</p>
                <div className="mt-4 rounded-lg border border-line bg-white p-4">
                  <p className="text-sm font-bold text-ink">Scoreboard</p>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="rounded-lg bg-mist p-3">
                      <p className="font-bold text-ocean">{moduleScore.correct}</p>
                      <p className="text-xs text-slate-600">Correct</p>
                    </div>
                    <div className="rounded-lg bg-mist p-3">
                      <p className="font-bold text-ink">{moduleScore.attempted}</p>
                      <p className="text-xs text-slate-600">Answered</p>
                    </div>
                    <div className="rounded-lg bg-mist p-3">
                      <p className="font-bold text-ink">
                        {moduleScore.attempted ? Math.round((moduleScore.correct / moduleScore.attempted) * 100) : 0}%
                      </p>
                      <p className="text-xs text-slate-600">Accuracy</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-mist px-3 py-1 text-xs font-bold text-ocean">{quizPoints} points</span>
                    <button
                      type="button"
                      onClick={() => {
                        setQuizAttempts((current) => ({ ...current, [activeModule.id]: { correct: 0, attempted: 0 } }));
                        setQuizSelections((current) => {
                          const next = { ...current };
                          delete next[activeModule.id];
                          return next;
                        });
                        setQuizIndex(0);
                      }}
                      className="text-xs font-bold text-ocean hover:underline"
                    >
                      Reset module score
                    </button>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-sm font-medium">
                    <span>{activeModule?.moduleTitle}</span>
                    <span>{answeredInModule}/{knowledgeQuestions.length || 1}</span>
                  </div>
                  <ProgressBar value={quizProgress} />
                </div>
              </div>

              <div className="rounded-lg border border-line bg-mist p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-ocean">Business clue</p>
                <p className="mt-3 text-lg font-semibold leading-8 text-ink">{quizQuestion.prompt}</p>
                <div className="mt-5 grid gap-3">
                  {options.map((option) => {
                    const chosen = selectedAnswer === option.title;
                    const correct = quizTerm?.title === option.title;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => chooseAnswer(option.title)}
                        className={`flex items-center justify-between rounded-lg border bg-white px-4 py-3 text-left font-bold transition ${
                          chosen ? (correct ? "border-emerald-300 text-emerald-700" : "border-amber-300 text-amber-700") : "border-line text-ink hover:border-ocean"
                        }`}
                      >
                        <span>{option.title}</span>
                        {chosen && (correct ? <CheckCircle2 size={18} aria-hidden="true" /> : <XCircle size={18} aria-hidden="true" />)}
                      </button>
                    );
                  })}
                </div>
                {selectedAnswer && (
                  <div className={`mt-4 rounded-lg border p-4 ${isCorrect ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
                    <p className="font-bold">{isCorrect ? "Correct" : `Correct answer: ${quizTerm.title}`}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">{quizTerm.definition}</p>
                  </div>
                )}
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    onClick={previousQuestion}
                    disabled={quizIndex === 0}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 py-3 font-bold text-ink hover:border-ocean disabled:cursor-not-allowed disabled:text-slate-400"
                  >
                    <ChevronLeft size={17} aria-hidden="true" />
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={nextQuestion}
                    disabled={!selectedAnswer}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300 sm:min-w-[124px]"
                  >
                    Next
                    <ChevronRight size={17} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        )}

      </div>
    </div>
  );
}
