export type BusinessGlossaryAddition = {
  id: string;
  title: string;
  definition: string;
  fullDefinition: string;
};

function term(id: string, title: string, definition: string): BusinessGlossaryAddition {
  return { id, title, definition, fullDefinition: definition };
}

export const businessCoursebookGlossaryAdditions: Record<number, BusinessGlossaryAddition[]> = {
  1: [
    term("bus-1-43", "Joint Venture", "Two or more businesses work together on a project and create a separate operation, sharing resources, risks, and returns."),
    term("bus-1-44", "Private Limited Company", "An incorporated business whose shares are held privately and cannot be offered for sale to the general public."),
    term("bus-1-45", "Public Limited Company", "An incorporated business that may offer its shares for sale to the general public through a stock exchange."),
    term("bus-1-46", "Sole Trader", "A business owned and controlled by one person, who receives the profit and has unlimited liability for its debts."),
  ],
  2: [
    term("bus-2-36", "Commission", "Payment to an employee based on the value or quantity of sales they make."),
    term("bus-2-37", "Communication Barrier", "Anything that prevents a message from being sent, received, or understood clearly."),
    term("bus-2-38", "Curriculum Vitae (CV)", "A document summarising an applicant's education, qualifications, skills, and work experience."),
    term("bus-2-39", "Delegation", "When a manager gives a subordinate authority to complete specified tasks and make related decisions."),
    term("bus-2-40", "Democratic Leadership", "A leadership style in which employees contribute to the decision-making process."),
    term("bus-2-41", "Employee of the Month", "A recognition scheme that rewards an employee for strong performance during a particular period."),
    term("bus-2-42", "Flexible Hours", "An arrangement allowing employees some choice over when they start and finish work."),
    term("bus-2-43", "Flexible Working", "An agreement that allows an employee to vary when, where, or how long they work."),
    term("bus-2-44", "Fringe Benefits", "Non-cash rewards provided in addition to wages or salary, such as insurance or a company car."),
    term("bus-2-45", "Hierarchy", "The levels of authority and responsibility within an organisational structure."),
    term("bus-2-46", "Homeworking", "An arrangement that allows employees to carry out their work from home instead of the business premises."),
    term("bus-2-47", "Hygiene Factors", "Workplace conditions that reduce dissatisfaction but do not necessarily create long-term motivation."),
    term("bus-2-48", "Labour Turnover", "The rate at which employees leave a business during a stated period."),
    term("bus-2-49", "Motivators", "Factors such as achievement, recognition, and responsibility that encourage employees to increase their effort."),
    term("bus-2-50", "Piece-Rate", "A payment method in which an employee is paid for each unit of output produced."),
    term("bus-2-51", "Profit Sharing", "Additional employee payment linked to the profit earned by the business."),
    term("bus-2-52", "Reference", "A recommendation from a trusted person describing a job applicant's suitability, skills, or previous performance."),
    term("bus-2-53", "Span of Control", "The number of subordinates directly supervised by a manager."),
    term("bus-2-54", "Time-Based Pay", "Payment calculated from the number of hours an employee works."),
  ],
  3: [
    term("bus-3-37", "Advertising", "Paid communication used to inform customers about products or persuade them to buy."),
    term("bus-3-38", "Direct to Consumers", "A distribution route in which the producer sells straight to the final customer without an intermediary."),
    term("bus-3-39", "Dynamic Pricing", "Changing the price of the same product at different times in response to demand or market conditions."),
    term("bus-3-40", "Extension Strategies", "Actions used to keep a product in the maturity stage of its life cycle and maintain sales."),
    term("bus-3-41", "Market Segmentation", "Dividing a market into groups of customers with similar characteristics, needs, or buying behaviour."),
    term("bus-3-42", "Marketing", "Identifying, anticipating, and satisfying customer needs profitably."),
    term("bus-3-43", "Promotion", "Activities used to inform, remind, or persuade customers about a product or business."),
    term("bus-3-44", "Retailer", "A business that sells goods or services to the final consumer."),
    term("bus-3-45", "Sampling", "Selecting a smaller group from a target market to represent the wider population in research."),
    term("bus-3-46", "Wholesaler", "A business that buys products in bulk from producers and resells them in smaller quantities to retailers."),
  ],
  4: [
    term("bus-4-30", "Inventory", "Raw materials, work in progress, and finished goods stored by a business."),
    term("bus-4-31", "Margin of Safety", "The amount by which current or forecast output exceeds the break-even level of output."),
    term("bus-4-32", "Production", "The process of combining inputs such as labour, materials, and machinery to create goods or services."),
    term("bus-4-33", "Total Cost", "The complete cost of production, calculated by adding total fixed costs and total variable costs."),
    term("bus-4-34", "Total Fixed Costs", "All costs that remain unchanged as output rises or falls over the relevant period."),
    term("bus-4-35", "Total Variable Cost", "The combined variable cost of producing the business's total output."),
  ],
  5: [
    term("bus-5-32", "Bank Loan", "Finance borrowed from a bank and repaid with interest over an agreed period."),
    term("bus-5-33", "Crowdfunding", "Raising small amounts of finance from many people, usually through an online platform."),
    term("bus-5-34", "Current Liabilities", "Debts that a business expects to pay within one year."),
    term("bus-5-35", "Expenses", "Business costs that are not directly included in the cost of the goods sold."),
    term("bus-5-36", "Hire Purchase", "Buying an asset through instalments, with ownership transferring after the final payment."),
    term("bus-5-37", "Leasing", "Paying to use an asset for a period while ownership remains with the leasing company."),
    term("bus-5-38", "Liabilities", "Amounts owed by a business that must be paid in the future."),
    term("bus-5-39", "Long-Term Finance", "Finance intended for needs lasting more than one year, such as expansion or purchasing non-current assets."),
    term("bus-5-40", "Mortgage", "A long-term loan secured on land or buildings."),
    term("bus-5-41", "Net Cash Flow", "The difference between total cash inflows and total cash outflows during a period."),
    term("bus-5-42", "Non-Current Liabilities", "Debts that are due for repayment after more than one year."),
    term("bus-5-43", "Overdraft", "A bank agreement allowing a business to withdraw more money than it has in its account, up to an agreed limit."),
    term("bus-5-44", "Owner's Equity", "The owners' financial interest in a business after liabilities are deducted from assets."),
    term("bus-5-45", "Share Issue", "Raising finance by selling new shares in a limited company."),
    term("bus-5-46", "Shareholders' Equity", "The value belonging to a company's shareholders after its liabilities are deducted from its assets."),
    term("bus-5-47", "Short-Term Finance", "Finance expected to be repaid within one year and used for temporary cash or working-capital needs."),
    term("bus-5-48", "Trade Payables", "Amounts a business owes suppliers for goods or services bought on credit."),
    term("bus-5-49", "Trade Receivables", "Amounts owed to a business by customers who bought goods or services on credit."),
    term("bus-5-50", "Venture Capital", "Equity finance provided to a high-risk business with strong growth potential."),
  ],
  6: [
    term("bus-6-18", "Economic Growth", "An increase in the value of goods and services produced by an economy over time."),
    term("bus-6-19", "Exchange Rate", "The price of one currency expressed in terms of another currency."),
    term("bus-6-20", "Import Tariff", "A tax placed on imported goods to raise their price and protect domestic producers."),
    term("bus-6-21", "Inflation", "A sustained increase in the average price level of goods and services."),
    term("bus-6-22", "Interest Rate", "The cost of borrowing money or the return earned on savings, expressed as a percentage."),
    term("bus-6-23", "Level of Unemployment", "The percentage of people who are willing and able to work but cannot find employment."),
    term("bus-6-24", "Tax", "A compulsory payment to government that can affect business costs, prices, profits, and consumer spending."),
  ],
};
