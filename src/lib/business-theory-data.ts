export type BusinessTheoryLesson = {
  id: string;
  title: string;
  definition: string;
  fullDefinition: string;
};

export type BusinessTheoryModule = {
  id: string;
  moduleId: number;
  moduleTitle: string;
  overview: string;
  lessons: BusinessTheoryLesson[];
};

export const businessTheoryModules: BusinessTheoryModule[] = [
  {
    "id": "understanding-business-activity",
    "moduleId": 1,
    "moduleTitle": "Understanding Business Activity",
    "overview": "Concise revision notes and glossary quiz for understanding business activity.",
    "lessons": [
      {
        "id": "bus-1-1",
        "title": "Need",
        "definition": "A good or service that is essential for living.",
        "fullDefinition": "A good or service that is essential for living."
      },
      {
        "id": "bus-1-2",
        "title": "Want",
        "definition": "A good or service that people would like to have but is not necessary for living. People have unlimited wants.",
        "fullDefinition": "A good or service that people would like to have but is not necessary for living. People have unlimited wants."
      },
      {
        "id": "bus-1-3",
        "title": "Economic problem",
        "definition": "There are unlimited wants but limited resources to produce the goods and services to satisfy wants. This creates scarcity.",
        "fullDefinition": "There are unlimited wants but limited resources to produce the goods and services to satisfy wants. This creates scarcity."
      },
      {
        "id": "bus-1-4",
        "title": "Factors of production",
        "definition": "Resources needed to produce goods and services. There are 4 factors of production (land, labour, capital, enterprise) and they are limited in supply.",
        "fullDefinition": "Resources needed to produce goods and services. There are 4 factors of production (land, labour, capital, enterprise) and they are limited in supply."
      },
      {
        "id": "bus-1-5",
        "title": "Scarcity",
        "definition": "The lack of sufficient products to fulfil the total wants of the population.",
        "fullDefinition": "The lack of sufficient products to fulfil the total wants of the population."
      },
      {
        "id": "bus-1-6",
        "title": "Opportunity Cost",
        "definition": "The next best alternative given up by choosing another item.",
        "fullDefinition": "The next best alternative given up by choosing another item."
      },
      {
        "id": "bus-1-7",
        "title": "Specialization",
        "definition": "When people and businesses concentrate on what they are best at.",
        "fullDefinition": "When people and businesses concentrate on what they are best at."
      },
      {
        "id": "bus-1-8",
        "title": "Division of labour",
        "definition": "When the production process is split up into different tasks and each worker performs one of these tasks. It is a form of specialization.",
        "fullDefinition": "When the production process is split up into different tasks and each worker performs one of these tasks. It is a form of specialization."
      },
      {
        "id": "bus-1-9",
        "title": "Business",
        "definition": "Combines factors of production to make products (goods and services) which satisfy people's wants.",
        "fullDefinition": "Combines factors of production to make products (goods and services) which satisfy people's wants."
      },
      {
        "id": "bus-1-10",
        "title": "Added Value",
        "definition": "It is the difference between the selling price of a product and the cost of bought in materials and components.",
        "fullDefinition": "It is the difference between the selling price of a product and the cost of bought in materials and components."
      },
      {
        "id": "bus-1-11",
        "title": "Primary Sector",
        "definition": "Extracts and uses natural resources to produce raw materials used by other businesses.",
        "fullDefinition": "Extracts and uses natural resources to produce raw materials used by other businesses."
      },
      {
        "id": "bus-1-12",
        "title": "Secondary Sector",
        "definition": "Manufactures goods using raw materials provided by Primary Sector.",
        "fullDefinition": "Manufactures goods using raw materials provided by Primary Sector."
      },
      {
        "id": "bus-1-13",
        "title": "Tertiary Sector",
        "definition": "Provides services to customers and other sectors of industry.",
        "fullDefinition": "Provides services to customers and other sectors of industry."
      },
      {
        "id": "bus-1-14",
        "title": "De-industrialization",
        "definition": "There is a decline in the importance of the secondary, manufacturing sector of industry in a country.",
        "fullDefinition": "There is a decline in the importance of the secondary, manufacturing sector of industry in a country."
      },
      {
        "id": "bus-1-15",
        "title": "Mixed Economy",
        "definition": "Has both a private sector and a public sector.",
        "fullDefinition": "Has both a private sector and a public sector."
      },
      {
        "id": "bus-1-16",
        "title": "Private Sector",
        "definition": "Businesses not owned by government. Make their own decision about selling price. Aim to run profitably. Some government control.",
        "fullDefinition": "Businesses not owned by government. Make their own decision about selling price. Aim to run profitably. Some government control."
      },
      {
        "id": "bus-1-17",
        "title": "Public Sector",
        "definition": "Government-owned, controlled businesses and organizations. Decide which price to charge consumers. Different aim from Private Sector.",
        "fullDefinition": "Government-owned, controlled businesses and organizations. Decide which price to charge consumers. Different aim from Private Sector."
      },
      {
        "id": "bus-1-18",
        "title": "Capital",
        "definition": "Money invested into business by owners.",
        "fullDefinition": "Money invested into business by owners."
      },
      {
        "id": "bus-1-19",
        "title": "Entrepreneur",
        "definition": "A person who organizes, operates and takes the risk for a new business venture.",
        "fullDefinition": "A person who organizes, operates and takes the risk for a new business venture."
      },
      {
        "id": "bus-1-20",
        "title": "Business Plan",
        "definition": "Document containing the business objectives and important details about the operations, finance and owners of the new businesses.",
        "fullDefinition": "Document containing the business objectives and important details about the operations, finance and owners of the new businesses."
      },
      {
        "id": "bus-1-21",
        "title": "Capital Employed",
        "definition": "Total value of capital used in the business.",
        "fullDefinition": "Total value of capital used in the business."
      },
      {
        "id": "bus-1-22",
        "title": "Internal Growth",
        "definition": "When a business expands its existing operations.",
        "fullDefinition": "When a business expands its existing operations."
      },
      {
        "id": "bus-1-23",
        "title": "External Growth",
        "definition": "When a business takes over or merges with another business.",
        "fullDefinition": "When a business takes over or merges with another business."
      },
      {
        "id": "bus-1-24",
        "title": "Integrations/Merger",
        "definition": "When two businesses agree to join their firms together to make one business.",
        "fullDefinition": "When two businesses agree to join their firms together to make one business."
      },
      {
        "id": "bus-1-25",
        "title": "Takeover/Acquisition",
        "definition": "One business buys out the owners of another business which then becomes part of the 'predator' business",
        "fullDefinition": "One business buys out the owners of another business which then becomes part of the 'predator' business"
      },
      {
        "id": "bus-1-26",
        "title": "Horizontal Integration",
        "definition": "When one company merges with or takes over another in the same industry in the same stage of production.",
        "fullDefinition": "When one company merges with or takes over another in the same industry in the same stage of production."
      },
      {
        "id": "bus-1-27",
        "title": "Vertical Integration",
        "definition": "When one company merges with or takes over another in the same industry but at a different stage of production.",
        "fullDefinition": "When one company merges with or takes over another in the same industry but at a different stage of production."
      },
      {
        "id": "bus-1-28",
        "title": "Conglomerate Integration/Diversification",
        "definition": "When one company merges with or takes over another in a completely different industry.",
        "fullDefinition": "When one company merges with or takes over another in a completely different industry."
      },
      {
        "id": "bus-1-29",
        "title": "Limited Liability",
        "definition": "The liability of shareholders in a company is only limited to the amount they invested.",
        "fullDefinition": "The liability of shareholders in a company is only limited to the amount they invested."
      },
      {
        "id": "bus-1-30",
        "title": "Unlimited Liability",
        "definition": "The owners of a business can be held responsible for the debts of the business they own. Their liability is not limited to the investment they make.",
        "fullDefinition": "The owners of a business can be held responsible for the debts of the business they own. Their liability is not limited to the investment they make."
      },
      {
        "id": "bus-1-31",
        "title": "Partnership",
        "definition": "A form of business in which two or more people agree to jointly own a business.",
        "fullDefinition": "A form of business in which two or more people agree to jointly own a business."
      },
      {
        "id": "bus-1-32",
        "title": "Partnership Agreement",
        "definition": "The written legal agreement between partners.",
        "fullDefinition": "The written legal agreement between partners."
      },
      {
        "id": "bus-1-33",
        "title": "Unincorporated Business",
        "definition": "One that does not have a separate legal entity. Sole traders and partnerships are unincorporated businesses.",
        "fullDefinition": "One that does not have a separate legal entity. Sole traders and partnerships are unincorporated businesses."
      },
      {
        "id": "bus-1-34",
        "title": "Incorporated Business",
        "definition": "Companies that have a separate legal status from their owners.",
        "fullDefinition": "Companies that have a separate legal status from their owners."
      },
      {
        "id": "bus-1-35",
        "title": "Shareholders",
        "definition": "Owners of a limited company. They buy shares which represent part ownership of a company.",
        "fullDefinition": "Owners of a limited company. They buy shares which represent part ownership of a company."
      },
      {
        "id": "bus-1-36",
        "title": "Annual General Meeting",
        "definition": "A legal requirement for all companies. Shareholders may attend and vote on who they want to be on the Board of Directors for the coming year.",
        "fullDefinition": "A legal requirement for all companies. Shareholders may attend and vote on who they want to be on the Board of Directors for the coming year."
      },
      {
        "id": "bus-1-37",
        "title": "Dividend",
        "definition": "Payments made to shareholders from the profit (after tax) of a company. They are the return to shareholders for their investment in the company.",
        "fullDefinition": "Payments made to shareholders from the profit (after tax) of a company. They are the return to shareholders for their investment in the company."
      },
      {
        "id": "bus-1-38",
        "title": "Franchise",
        "definition": "Business based upon the use of brand names and trading methods of an existing successful business. Franchisees use franchisor's ideas, names.",
        "fullDefinition": "Business based upon the use of brand names and trading methods of an existing successful business. Franchisees use franchisor's ideas, names."
      },
      {
        "id": "bus-1-39",
        "title": "Business Objective",
        "definition": "Aims and targets that a business works towards.",
        "fullDefinition": "Aims and targets that a business works towards."
      },
      {
        "id": "bus-1-40",
        "title": "Market share",
        "definition": "Proportion of total market sales achieved by one business.",
        "fullDefinition": "Proportion of total market sales achieved by one business."
      },
      {
        "id": "bus-1-41",
        "title": "Social Enterprise",
        "definition": "Has social objectives as well as an aim to make profit to reinvest back into the business.",
        "fullDefinition": "Has social objectives as well as an aim to make profit to reinvest back into the business."
      },
      {
        "id": "bus-1-42",
        "title": "Stakeholder",
        "definition": "A person or group with a direct interest in the performance and activities of a business.",
        "fullDefinition": "A person or group with a direct interest in the performance and activities of a business."
      }
    ]
  },
  {
    "id": "people-in-business",
    "moduleId": 2,
    "moduleTitle": "People in Business",
    "overview": "Concise revision notes and glossary quiz for people in business.",
    "lessons": [
      {
        "id": "bus-2-1",
        "title": "Motivation",
        "definition": "The reason why employees want to work hard and effectively for the business",
        "fullDefinition": "The reason why employees want to work hard and effectively for the business"
      },
      {
        "id": "bus-2-2",
        "title": "Wage",
        "definition": "Payment for work, usually paid weekly, can be in cash or in bank account",
        "fullDefinition": "Payment for work, usually paid weekly, can be in cash or in bank account"
      },
      {
        "id": "bus-2-3",
        "title": "Salary",
        "definition": "Payment for work, usually paid monthly, into bank account",
        "fullDefinition": "Payment for work, usually paid monthly, into bank account"
      },
      {
        "id": "bus-2-4",
        "title": "Bonus",
        "definition": "Additional amount of payment above basic pay as reward for good work",
        "fullDefinition": "Additional amount of payment above basic pay as reward for good work"
      },
      {
        "id": "bus-2-5",
        "title": "Performance-related pay",
        "definition": "Pay which is related to effectiveness of employee where output can be measured",
        "fullDefinition": "Pay which is related to effectiveness of employee where output can be measured"
      },
      {
        "id": "bus-2-6",
        "title": "Share ownership",
        "definition": "Shares of company given to employees so they become part owners",
        "fullDefinition": "Shares of company given to employees so they become part owners"
      },
      {
        "id": "bus-2-7",
        "title": "Job satisfaction",
        "definition": "Enjoyment derived from feeling that you have done a good job",
        "fullDefinition": "Enjoyment derived from feeling that you have done a good job"
      },
      {
        "id": "bus-2-8",
        "title": "Job rotation",
        "definition": "Involves workers swapping round and doing a specific task for a specific time the changing again",
        "fullDefinition": "Involves workers swapping round and doing a specific task for a specific time the changing again"
      },
      {
        "id": "bus-2-9",
        "title": "Job enlargement",
        "definition": "Extra tasks of similar level of work are added to worker\u2019s job description",
        "fullDefinition": "Extra tasks of similar level of work are added to worker\u2019s job description"
      },
      {
        "id": "bus-2-10",
        "title": "Job enrichment",
        "definition": "Looking at jobs and adding more tasks that require more skill and/or responsibility",
        "fullDefinition": "Looking at jobs and adding more tasks that require more skill and/or responsibility"
      },
      {
        "id": "bus-2-11",
        "title": "Organizational structure",
        "definition": "Refers to levels of management and division of responsibilities within an organization",
        "fullDefinition": "Refers to levels of management and division of responsibilities within an organization"
      },
      {
        "id": "bus-2-12",
        "title": "Chain of command",
        "definition": "Structure in an organization which allows instructions to be passed down from senior management to lower levels of management",
        "fullDefinition": "Structure in an organization which allows instructions to be passed down from senior management to lower levels of management"
      },
      {
        "id": "bus-2-13",
        "title": "Line managers",
        "definition": "Have direct responsibility over people below them in a hierarchy of and organization",
        "fullDefinition": "Have direct responsibility over people below them in a hierarchy of and organization"
      },
      {
        "id": "bus-2-14",
        "title": "Staff managers",
        "definition": "Specialists who provide support, information and assistance to line managers",
        "fullDefinition": "Specialists who provide support, information and assistance to line managers"
      },
      {
        "id": "bus-2-15",
        "title": "Leadership styles",
        "definition": "Different approaches to dealing with people when in a position of authority - autocratic, laissez-faire or democratic",
        "fullDefinition": "Different approaches to dealing with people when in a position of authority - autocratic, laissez-faire or democratic"
      },
      {
        "id": "bus-2-16",
        "title": "Autocratic leadership",
        "definition": "Where the manager expects to be in charge of the business and to have their orders followed",
        "fullDefinition": "Where the manager expects to be in charge of the business and to have their orders followed"
      },
      {
        "id": "bus-2-17",
        "title": "Laissez-faire leadership",
        "definition": "Makes broad objectives known to workers, they are left to make their own decisions and organize their work",
        "fullDefinition": "Makes broad objectives known to workers, they are left to make their own decisions and organize their work"
      },
      {
        "id": "bus-2-18",
        "title": "Trade union",
        "definition": "Group of workers who have joined together to ensure their interests are protected",
        "fullDefinition": "Group of workers who have joined together to ensure their interests are protected"
      },
      {
        "id": "bus-2-19",
        "title": "Closed shop",
        "definition": "All members must be a member of the same trade union",
        "fullDefinition": "All members must be a member of the same trade union"
      },
      {
        "id": "bus-2-20",
        "title": "Recruitment",
        "definition": ": The process from identifying that the business needs to employ someone up to the point at which applications have arrived at business",
        "fullDefinition": ": The process from identifying that the business needs to employ someone up to the point at which applications have arrived at business"
      },
      {
        "id": "bus-2-21",
        "title": "Job analysis",
        "definition": "Identifies and records the responsibilities and tasks relating to a job",
        "fullDefinition": "Identifies and records the responsibilities and tasks relating to a job"
      },
      {
        "id": "bus-2-22",
        "title": "Job description",
        "definition": "Outlines the responsibilities and duties to be done by employee to do a specific job",
        "fullDefinition": "Outlines the responsibilities and duties to be done by employee to do a specific job"
      },
      {
        "id": "bus-2-23",
        "title": "Job specification",
        "definition": "Outlines requirements, qualifications, expertise, etc. for a specified job",
        "fullDefinition": "Outlines requirements, qualifications, expertise, etc. for a specified job"
      },
      {
        "id": "bus-2-24",
        "title": "Internal recruitment",
        "definition": "Vacancy is filled by someone who is an existing employee of the business",
        "fullDefinition": "Vacancy is filled by someone who is an existing employee of the business"
      },
      {
        "id": "bus-2-25",
        "title": "External recruitment",
        "definition": "Vacancy filled by someone who is not an existing employee and new",
        "fullDefinition": "Vacancy filled by someone who is not an existing employee and new"
      },
      {
        "id": "bus-2-26",
        "title": "Part-time",
        "definition": "Employment that is between 1 and 35 hours a week; less than full time workers",
        "fullDefinition": "Employment that is between 1 and 35 hours a week; less than full time workers"
      },
      {
        "id": "bus-2-27",
        "title": "Full-time",
        "definition": "Employees will work for 35 or more hours per week",
        "fullDefinition": "Employees will work for 35 or more hours per week"
      },
      {
        "id": "bus-2-28",
        "title": "Induction training",
        "definition": "Introduction given to new employee explaining firm\u2019s activities, customs and procedures and introduce to other workers",
        "fullDefinition": "Introduction given to new employee explaining firm\u2019s activities, customs and procedures and introduce to other workers"
      },
      {
        "id": "bus-2-29",
        "title": "On-the-job training",
        "definition": "Person is trained by watching more experienced worker doing the job",
        "fullDefinition": "Person is trained by watching more experienced worker doing the job"
      },
      {
        "id": "bus-2-30",
        "title": "Off-the-job training",
        "definition": "Person being trained away from workplace, by specialist trainers",
        "fullDefinition": "Person being trained away from workplace, by specialist trainers"
      },
      {
        "id": "bus-2-31",
        "title": "Workforce planning",
        "definition": "Establishing the number and skills of workforce needed by business for foreseeable future",
        "fullDefinition": "Establishing the number and skills of workforce needed by business for foreseeable future"
      },
      {
        "id": "bus-2-32",
        "title": "Redundancy",
        "definition": "Employee is no longer needed, so loses his job; not because of unsatisfactory work",
        "fullDefinition": "Employee is no longer needed, so loses his job; not because of unsatisfactory work"
      },
      {
        "id": "bus-2-33",
        "title": "Ethical decision",
        "definition": "Decision taken by manager because of moral code observed by firm",
        "fullDefinition": "Decision taken by manager because of moral code observed by firm"
      },
      {
        "id": "bus-2-34",
        "title": "Industrial tribunal",
        "definition": "Legal meeting considers workers\u2019 complaints: unfair dismissal and discrimination",
        "fullDefinition": "Legal meeting considers workers\u2019 complaints: unfair dismissal and discrimination"
      },
      {
        "id": "bus-2-35",
        "title": "Contract of employment",
        "definition": "Legal agreement between employer and employee listing duties and responsibilities of workers",
        "fullDefinition": "Legal agreement between employer and employee listing duties and responsibilities of workers"
      }
    ]
  },
  {
    "id": "marketing",
    "moduleId": 3,
    "moduleTitle": "Marketing",
    "overview": "Concise revision notes and glossary quiz for marketing.",
    "lessons": [
      {
        "id": "bus-3-1",
        "title": "Market Share",
        "definition": "The percentage of total market sales held by one brand or business",
        "fullDefinition": "The percentage of total market sales held by one brand or business"
      },
      {
        "id": "bus-3-2",
        "title": "Mass Market",
        "definition": "Where there is a very large number of sales of a product",
        "fullDefinition": "Where there is a very large number of sales of a product"
      },
      {
        "id": "bus-3-3",
        "title": "Niche Market",
        "definition": "A small, usually specialized, segment of a much larger market",
        "fullDefinition": "A small, usually specialized, segment of a much larger market"
      },
      {
        "id": "bus-3-4",
        "title": "Market Segment",
        "definition": "An identifiable sub-group of a whole market in which consumers have similar characteristics or preferences",
        "fullDefinition": "An identifiable sub-group of a whole market in which consumers have similar characteristics or preferences"
      },
      {
        "id": "bus-3-5",
        "title": "Product Orientated Business",
        "definition": "A business whose main focus of activity is on the product itself",
        "fullDefinition": "A business whose main focus of activity is on the product itself"
      },
      {
        "id": "bus-3-6",
        "title": "Market Orientated Business",
        "definition": "A business which carries out market research to find out consumer wants before a product is developed and produced",
        "fullDefinition": "A business which carries out market research to find out consumer wants before a product is developed and produced"
      },
      {
        "id": "bus-3-7",
        "title": "Marketing Budget",
        "definition": "A financial plan for the marketing of a product or product range for some specified period of time. It specifies how much money is available to the product or range, so that.",
        "fullDefinition": "A financial plan for the marketing of a product or product range for some specified period of time. It specifies how much money is available to the product or range, so that the Marketing department know how much they may spend"
      },
      {
        "id": "bus-3-8",
        "title": "Market Research",
        "definition": "The process of gathering, analyzing and interpreting information about a market",
        "fullDefinition": "The process of gathering, analyzing and interpreting information about a market"
      },
      {
        "id": "bus-3-9",
        "title": "Primary Research",
        "definition": "The collation of original data via direct contact with potential or existing customer. Also called field research",
        "fullDefinition": "The collation of original data via direct contact with potential or existing customer. Also called field research"
      },
      {
        "id": "bus-3-10",
        "title": "Secondary Research",
        "definition": "Information that has already been collected and made available for use by others. Also called desk research",
        "fullDefinition": "Information that has already been collected and made available for use by others. Also called desk research"
      },
      {
        "id": "bus-3-11",
        "title": "Questionnaire",
        "definition": "A set of questions to be answered as a means of collecting data for market research",
        "fullDefinition": "A set of questions to be answered as a means of collecting data for market research"
      },
      {
        "id": "bus-3-12",
        "title": "Sample",
        "definition": "The group of people who are selected to respond to a market research exercise, such as a questionnaire",
        "fullDefinition": "The group of people who are selected to respond to a market research exercise, such as a questionnaire"
      },
      {
        "id": "bus-3-13",
        "title": "Random Sample",
        "definition": "When people are selected at random as a source of information for market research",
        "fullDefinition": "When people are selected at random as a source of information for market research"
      },
      {
        "id": "bus-3-14",
        "title": "Quota Sample",
        "definition": "When people are selected on the basis of certain characteristics (such as age, gender or income) as a source of information for market research",
        "fullDefinition": "When people are selected on the basis of certain characteristics (such as age, gender or income) as a source of information for market research"
      },
      {
        "id": "bus-3-15",
        "title": "Focus Group",
        "definition": "A group of people who are representative of the target market",
        "fullDefinition": "A group of people who are representative of the target market"
      },
      {
        "id": "bus-3-16",
        "title": "Marketing Mix",
        "definition": "A term which is used to describe all the activities which go into marketing a product or service. These activities are often summarized as the four Ps - product, price, place and.",
        "fullDefinition": "A term which is used to describe all the activities which go into marketing a product or service. These activities are often summarized as the four Ps - product, price, place and promotion"
      },
      {
        "id": "bus-3-17",
        "title": "Unique Selling Point (USP)",
        "definition": "The special feature of a product that differentiates it from the products of competitors",
        "fullDefinition": "The special feature of a product that differentiates it from the products of competitors"
      },
      {
        "id": "bus-3-18",
        "title": "Brand Name",
        "definition": "The unique name of a product that distinguishes it from other brands",
        "fullDefinition": "The unique name of a product that distinguishes it from other brands"
      },
      {
        "id": "bus-3-19",
        "title": "Brand Loyalty",
        "definition": "When consumers keep buying the same brand again and again instead of choosing a competitors brand",
        "fullDefinition": "When consumers keep buying the same brand again and again instead of choosing a competitors brand"
      },
      {
        "id": "bus-3-20",
        "title": "Brand Image",
        "definition": "An image or identity given to a product which gives it a personality of its own and distinguishes it from its competitors' brands",
        "fullDefinition": "An image or identity given to a product which gives it a personality of its own and distinguishes it from its competitors' brands"
      },
      {
        "id": "bus-3-21",
        "title": "Packaging",
        "definition": "The physical container or wrapping for a product. It is also used for promotion and selling appeal",
        "fullDefinition": "The physical container or wrapping for a product. It is also used for promotion and selling appeal"
      },
      {
        "id": "bus-3-22",
        "title": "Product Life Cycle",
        "definition": "Describes the stages a product will pass through from its introduction, through its growth until it is mature and then finally its decline",
        "fullDefinition": "Describes the stages a product will pass through from its introduction, through its growth until it is mature and then finally its decline"
      },
      {
        "id": "bus-3-23",
        "title": "Cost-Plus Pricing",
        "definition": "The cost of manufacturing the product plus a profit mark-up",
        "fullDefinition": "The cost of manufacturing the product plus a profit mark-up"
      },
      {
        "id": "bus-3-24",
        "title": "Competitive Pricing",
        "definition": "When the product is prices in line with or just below competitors' prices to try and capture more of the market",
        "fullDefinition": "When the product is prices in line with or just below competitors' prices to try and capture more of the market"
      },
      {
        "id": "bus-3-25",
        "title": "Penetration Pricing",
        "definition": "When the price is set lower than the competitors' prices in order to be able to enter a new market",
        "fullDefinition": "When the price is set lower than the competitors' prices in order to be able to enter a new market"
      },
      {
        "id": "bus-3-26",
        "title": "Price Skimming",
        "definition": "Where a high price is set for a new product on the market",
        "fullDefinition": "Where a high price is set for a new product on the market"
      },
      {
        "id": "bus-3-27",
        "title": "Promotional Pricing",
        "definition": "When a product is sold at a very low price for a short period of time",
        "fullDefinition": "When a product is sold at a very low price for a short period of time"
      },
      {
        "id": "bus-3-28",
        "title": "Price Elasticity",
        "definition": "A measure of the responsiveness of demand to a change in price",
        "fullDefinition": "A measure of the responsiveness of demand to a change in price"
      },
      {
        "id": "bus-3-29",
        "title": "Informative Advertising",
        "definition": "Where the emphasis of advertising is to give full information about the product",
        "fullDefinition": "Where the emphasis of advertising is to give full information about the product"
      },
      {
        "id": "bus-3-30",
        "title": "Persuasive Advertising",
        "definition": "Advertising or promotion which is trying to persuade the consumer that they really need the product and should buy it",
        "fullDefinition": "Advertising or promotion which is trying to persuade the consumer that they really need the product and should buy it"
      },
      {
        "id": "bus-3-31",
        "title": "Target Audience",
        "definition": "Refers to the people who are potential buyers of a product or service",
        "fullDefinition": "Refers to the people who are potential buyers of a product or service"
      },
      {
        "id": "bus-3-32",
        "title": "Sales Promotion",
        "definition": "Incentives such as special offers or special deals aimed at consumers to achieve short- term increases in sales",
        "fullDefinition": "Incentives such as special offers or special deals aimed at consumers to achieve short- term increases in sales"
      },
      {
        "id": "bus-3-33",
        "title": "Distribution Channel",
        "definition": "The means by which a product is passed from the place of production to the customer or retailer",
        "fullDefinition": "The means by which a product is passed from the place of production to the customer or retailer"
      },
      {
        "id": "bus-3-34",
        "title": "Agent",
        "definition": "An independent person or business that is appointed to deal with the sales and distribution of a product or range of products",
        "fullDefinition": "An independent person or business that is appointed to deal with the sales and distribution of a product or range of products"
      },
      {
        "id": "bus-3-35",
        "title": "E-Commerce",
        "definition": "The buying and selling of goods and services using computer systems linked to the internet",
        "fullDefinition": "The buying and selling of goods and services using computer systems linked to the internet"
      },
      {
        "id": "bus-3-36",
        "title": "Marketing Strategy",
        "definition": "A plan to combine the four elements of the marketing mix for a product or service to achieve a particular marketing objective",
        "fullDefinition": "A plan to combine the four elements of the marketing mix for a product or service to achieve a particular marketing objective"
      }
    ]
  },
  {
    "id": "operations-management",
    "moduleId": 4,
    "moduleTitle": "Operations Management",
    "overview": "Concise revision notes and glossary quiz for operations management.",
    "lessons": [
      {
        "id": "bus-4-1",
        "title": "Productivity",
        "definition": "The output measured against the inputs used to create it",
        "fullDefinition": "The output measured against the inputs used to create it"
      },
      {
        "id": "bus-4-2",
        "title": "Labor Productivity Formula",
        "definition": "Output over a given period of time / number of employees",
        "fullDefinition": "Output over a given period of time / number of employees"
      },
      {
        "id": "bus-4-3",
        "title": "Buffer Inventory Level",
        "definition": "Inventory held to deal with uncertainty in customer demand and deliveries of supplies",
        "fullDefinition": "Inventory held to deal with uncertainty in customer demand and deliveries of supplies"
      },
      {
        "id": "bus-4-4",
        "title": "Lean Production",
        "definition": "techniques used by the business to cut down waste and therefore increase efficiency, for example, by reducing the time it takes for a product to be developed and become available for sale",
        "fullDefinition": "techniques used by the business to cut down waste and therefore increase efficiency, for example, by reducing the time it takes for a product to be developed and become available for sale"
      },
      {
        "id": "bus-4-5",
        "title": "Kaizen",
        "definition": "A Japanese term meaning 'continuous improvement' through the elimination of waste",
        "fullDefinition": "A Japanese term meaning 'continuous improvement' through the elimination of waste"
      },
      {
        "id": "bus-4-6",
        "title": "Just-In-Time (JIT)",
        "definition": "A production method that involves reducing or virtually eliminating the need to hold inventories of the finished product. Supplies arrive just at the time they are needed",
        "fullDefinition": "A production method that involves reducing or virtually eliminating the need to hold inventories of the finished product. Supplies arrive just at the time they are needed"
      },
      {
        "id": "bus-4-7",
        "title": "Job Production",
        "definition": "Where a single product is made at a time",
        "fullDefinition": "Where a single product is made at a time"
      },
      {
        "id": "bus-4-8",
        "title": "Batch Production",
        "definition": "Where a quantity of one product is made, then a quantity of another item will be produced",
        "fullDefinition": "Where a quantity of one product is made, then a quantity of another item will be produced"
      },
      {
        "id": "bus-4-9",
        "title": "Flow Production",
        "definition": "Where large quantities of a product are produced in a continuous process. It is sometimes referred to as mass production",
        "fullDefinition": "Where large quantities of a product are produced in a continuous process. It is sometimes referred to as mass production"
      },
      {
        "id": "bus-4-10",
        "title": "Automation",
        "definition": "Where equipment used in the factory is controlled by a computer to carry out mechanical processes, e.g. spraying paint on a car. The production line will consist mainly of machines and there.",
        "fullDefinition": "Where equipment used in the factory is controlled by a computer to carry out mechanical processes, e.g. spraying paint on a car. The production line will consist mainly of machines and there are only a few people needed to ensure everything runs smoothly"
      },
      {
        "id": "bus-4-11",
        "title": "Mechanization",
        "definition": "Where production is done by machines but operated by people, e.g. printing press.",
        "fullDefinition": "Where production is done by machines but operated by people, e.g. printing press."
      },
      {
        "id": "bus-4-12",
        "title": "Computer Aided Design (CAD)",
        "definition": "A computer software that draws items being designed more quickly and allows them to be rotated to see the item from all sides. It is used for designing new products or re-.",
        "fullDefinition": "A computer software that draws items being designed more quickly and allows them to be rotated to see the item from all sides. It is used for designing new products or re- styling existing ones"
      },
      {
        "id": "bus-4-13",
        "title": "Computer Aided Manufacture (CAM)",
        "definition": "Where computers monitor the production process and control machines or robots on the factory floor",
        "fullDefinition": "Where computers monitor the production process and control machines or robots on the factory floor"
      },
      {
        "id": "bus-4-14",
        "title": "Computer Integrated Manufacturing (CIM)",
        "definition": "The total integration of computer aided design (CAD) and computer aided manufacture (CAM). The computers that design the products are linked directly to the computers that aid the manufacturing process",
        "fullDefinition": "The total integration of computer aided design (CAD) and computer aided manufacture (CAM). The computers that design the products are linked directly to the computers that aid the manufacturing process"
      },
      {
        "id": "bus-4-15",
        "title": "Electronic Point of Sale (EPOS)",
        "definition": "Used at checkouts where the operator scans the bar code of each item.",
        "fullDefinition": "Used at checkouts where the operator scans the bar code of each item."
      },
      {
        "id": "bus-4-16",
        "title": "Electronic Funds Transfer at Point of Sale (EFTPOS)",
        "definition": "Where the electronic cash register is connected to the retailer's main computer and also to banks over a wide area computer network.",
        "fullDefinition": "Where the electronic cash register is connected to the retailer's main computer and also to banks over a wide area computer network."
      },
      {
        "id": "bus-4-17",
        "title": "Fixed Costs",
        "definition": "Costs which do not vary with the number of items sold or produced in the short run. They have to be paid whether the business is making any sales or not. They.",
        "fullDefinition": "Costs which do not vary with the number of items sold or produced in the short run. They have to be paid whether the business is making any sales or not. They are also known as overhead costs"
      },
      {
        "id": "bus-4-18",
        "title": "Variable Costs",
        "definition": "Costs which vary directly with the number of items sold or produced",
        "fullDefinition": "Costs which vary directly with the number of items sold or produced"
      },
      {
        "id": "bus-4-19",
        "title": "Average Cost per Unit",
        "definition": "The total cost of production divided by the total output. Also known as unit cost",
        "fullDefinition": "The total cost of production divided by the total output. Also known as unit cost"
      },
      {
        "id": "bus-4-20",
        "title": "Economies of Scale",
        "definition": "The factors that lead to a reduction in average costs as a business increases in size",
        "fullDefinition": "The factors that lead to a reduction in average costs as a business increases in size"
      },
      {
        "id": "bus-4-21",
        "title": "Diseconomies of Scale",
        "definition": "The factors that lead to an increase in average costs as a business grows beyond a certain size",
        "fullDefinition": "The factors that lead to an increase in average costs as a business grows beyond a certain size"
      },
      {
        "id": "bus-4-22",
        "title": "Break-Even Level of Output",
        "definition": "The quantity that must be produced/sold for total revenue to equal total costs",
        "fullDefinition": "The quantity that must be produced/sold for total revenue to equal total costs"
      },
      {
        "id": "bus-4-23",
        "title": "Break-Even Charts",
        "definition": "Graphs which show how costs and revenues of a business change with sales. They also show the break-even level of output",
        "fullDefinition": "Graphs which show how costs and revenues of a business change with sales. They also show the break-even level of output"
      },
      {
        "id": "bus-4-24",
        "title": "Revenue",
        "definition": "The income during a period of time from the sale of goods and services",
        "fullDefinition": "The income during a period of time from the sale of goods and services"
      },
      {
        "id": "bus-4-25",
        "title": "Break-Even Point",
        "definition": "The level of sales at which total costs = total revenue",
        "fullDefinition": "The level of sales at which total costs = total revenue"
      },
      {
        "id": "bus-4-26",
        "title": "Quality",
        "definition": "To produce a good service which meets customer expectations",
        "fullDefinition": "To produce a good service which meets customer expectations"
      },
      {
        "id": "bus-4-27",
        "title": "Quality Control",
        "definition": "The checking for quality at the end of the production process, whether it is the production of a product or service",
        "fullDefinition": "The checking for quality at the end of the production process, whether it is the production of a product or service"
      },
      {
        "id": "bus-4-28",
        "title": "Quality Assurance",
        "definition": "The checking for the quality standards throughout the production process, whether it is the production of a product or service",
        "fullDefinition": "The checking for the quality standards throughout the production process, whether it is the production of a product or service"
      },
      {
        "id": "bus-4-29",
        "title": "Total Quality Management (TQM)",
        "definition": "The continuous improvement of products and processes by focusing on quality at each stage of production",
        "fullDefinition": "The continuous improvement of products and processes by focusing on quality at each stage of production"
      }
    ]
  },
  {
    "id": "financial-information-and-financial-decisions",
    "moduleId": 5,
    "moduleTitle": "Financial Information and Financial Decisions",
    "overview": "Concise revision notes and glossary quiz for financial information and financial decisions.",
    "lessons": [
      {
        "id": "bus-5-1",
        "title": "Start-Up Capital",
        "definition": "The finance needed by a new business to pay for essential fixed and current assets before it can begin trading",
        "fullDefinition": "The finance needed by a new business to pay for essential fixed and current assets before it can begin trading"
      },
      {
        "id": "bus-5-2",
        "title": "Working Capital",
        "definition": "The finance needed by a business to pay its day to day costs",
        "fullDefinition": "The finance needed by a business to pay its day to day costs"
      },
      {
        "id": "bus-5-3",
        "title": "Capital Expenditure",
        "definition": "Money spent on fixed assets which will last for more than one year",
        "fullDefinition": "Money spent on fixed assets which will last for more than one year"
      },
      {
        "id": "bus-5-4",
        "title": "Revenue Expenditure",
        "definition": "Money spent on day to day expenses which do not involve the purchase of a long-term asset, for example wages or rent",
        "fullDefinition": "Money spent on day to day expenses which do not involve the purchase of a long-term asset, for example wages or rent"
      },
      {
        "id": "bus-5-5",
        "title": "External Finance",
        "definition": "Obtained finance from sources outside of and separate from the business",
        "fullDefinition": "Obtained finance from sources outside of and separate from the business"
      },
      {
        "id": "bus-5-6",
        "title": "Micro-Finance",
        "definition": "Providing financial services - including small loans - to poor people not served by traditional banks",
        "fullDefinition": "Providing financial services - including small loans - to poor people not served by traditional banks"
      },
      {
        "id": "bus-5-7",
        "title": "Cash Flow",
        "definition": "The cash inflows and outflows over a period of time",
        "fullDefinition": "The cash inflows and outflows over a period of time"
      },
      {
        "id": "bus-5-8",
        "title": "Cash Inflows",
        "definition": "The sums of money received by a business during a period of time",
        "fullDefinition": "The sums of money received by a business during a period of time"
      },
      {
        "id": "bus-5-9",
        "title": "Cash Outflows",
        "definition": "The sums of money paid out by a business during a period of time",
        "fullDefinition": "The sums of money paid out by a business during a period of time"
      },
      {
        "id": "bus-5-10",
        "title": "Cash Flow Cycle",
        "definition": "Shows the stages between paying out cash for labour, materials, etc. and receiving cash from the sale of goods",
        "fullDefinition": "Shows the stages between paying out cash for labour, materials, etc. and receiving cash from the sale of goods"
      },
      {
        "id": "bus-5-11",
        "title": "Profit",
        "definition": "The surplus after total costs have been subtracted from sales revenue",
        "fullDefinition": "The surplus after total costs have been subtracted from sales revenue"
      },
      {
        "id": "bus-5-12",
        "title": "Cash Flow Forecast",
        "definition": "An estimate of future cash inflows and outflows of a business, usually on a month by month basis. This then shows the expected cash balance at the end of each month",
        "fullDefinition": "An estimate of future cash inflows and outflows of a business, usually on a month by month basis. This then shows the expected cash balance at the end of each month"
      },
      {
        "id": "bus-5-13",
        "title": "Opening Cash/Bank Balance",
        "definition": "The amount of cash held by the business at the start of the month",
        "fullDefinition": "The amount of cash held by the business at the start of the month"
      },
      {
        "id": "bus-5-14",
        "title": "Closing Cash/Bank Balance",
        "definition": "The amount of cash held by the business at the end of each month. This then becomes next month's opening balance",
        "fullDefinition": "The amount of cash held by the business at the end of each month. This then becomes next month's opening balance"
      },
      {
        "id": "bus-5-15",
        "title": "Accountants",
        "definition": "The professionally qualified people who have responsibility for keeping accurate accounts and for producing the final accounts",
        "fullDefinition": "The professionally qualified people who have responsibility for keeping accurate accounts and for producing the final accounts"
      },
      {
        "id": "bus-5-16",
        "title": "Final Accounts",
        "definition": "They are produced at the end of each year and give details of the profit or loss made over the year and the worth of the business",
        "fullDefinition": "They are produced at the end of each year and give details of the profit or loss made over the year and the worth of the business"
      },
      {
        "id": "bus-5-17",
        "title": "Income Statement",
        "definition": "A document that records the income of a business and all costs incurred to earn that income over a period of time (for example one year). It is also known as a.",
        "fullDefinition": "A document that records the income of a business and all costs incurred to earn that income over a period of time (for example one year). It is also known as a profit and loss account"
      },
      {
        "id": "bus-5-18",
        "title": "Gross Profit",
        "definition": "It\u2019s made when sales revenue if greater than the cost of goods sold",
        "fullDefinition": "It\u2019s made when sales revenue if greater than the cost of goods sold"
      },
      {
        "id": "bus-5-19",
        "title": "Sales Revenue",
        "definition": "The income to a business during a period of time from the sale or goods or services",
        "fullDefinition": "The income to a business during a period of time from the sale or goods or services"
      },
      {
        "id": "bus-5-20",
        "title": "Cost of Goods Sold",
        "definition": "The cost of producing or buying in the goods actually sold by the business during a time period",
        "fullDefinition": "The cost of producing or buying in the goods actually sold by the business during a time period"
      },
      {
        "id": "bus-5-21",
        "title": "Trading Account",
        "definition": "It shows how the gross profit of a business is calculated",
        "fullDefinition": "It shows how the gross profit of a business is calculated"
      },
      {
        "id": "bus-5-22",
        "title": "Net Profit",
        "definition": "The profit made by a business after all costs have been deducted from the sales revenue. It is calculated by subtracting overhead costs from gross profits",
        "fullDefinition": "The profit made by a business after all costs have been deducted from the sales revenue. It is calculated by subtracting overhead costs from gross profits"
      },
      {
        "id": "bus-5-23",
        "title": "Depreciation",
        "definition": "The fall in the value of a fixed asset over time",
        "fullDefinition": "The fall in the value of a fixed asset over time"
      },
      {
        "id": "bus-5-24",
        "title": "Retained Profit",
        "definition": "The net profit reinvested back into a company, after deducting tax and payments to owners, such as dividends",
        "fullDefinition": "The net profit reinvested back into a company, after deducting tax and payments to owners, such as dividends"
      },
      {
        "id": "bus-5-25",
        "title": "Balance Sheet",
        "definition": "Shows the value of a business's assets and liabilities at a particular time. Sometimes referred to as 'statement of financial position'",
        "fullDefinition": "Shows the value of a business's assets and liabilities at a particular time. Sometimes referred to as 'statement of financial position'"
      },
      {
        "id": "bus-5-26",
        "title": "Assets",
        "definition": "Items of value which are owned by the business. They may be fixed (non-current) or short-term current assets",
        "fullDefinition": "Items of value which are owned by the business. They may be fixed (non-current) or short-term current assets"
      },
      {
        "id": "bus-5-27",
        "title": "Non-Current Assets",
        "definition": "Items owned by the business for more than one year",
        "fullDefinition": "Items owned by the business for more than one year"
      },
      {
        "id": "bus-5-28",
        "title": "Current Assets",
        "definition": "Owned by a business and used within one year",
        "fullDefinition": "Owned by a business and used within one year"
      },
      {
        "id": "bus-5-29",
        "title": "Liquidity",
        "definition": "The ability of a business to pay back its short term debts",
        "fullDefinition": "The ability of a business to pay back its short term debts"
      },
      {
        "id": "bus-5-30",
        "title": "Capital Employed",
        "definition": "It shareholder's equity plus non-current liabilities and is the total long-term and permanent capital invested in a business",
        "fullDefinition": "It shareholder's equity plus non-current liabilities and is the total long-term and permanent capital invested in a business"
      },
      {
        "id": "bus-5-31",
        "title": "Illiquid",
        "definition": "Means that assets are not easily convertible into cash",
        "fullDefinition": "Means that assets are not easily convertible into cash"
      }
    ]
  },
  {
    "id": "external-influences-on-business-activity",
    "moduleId": 6,
    "moduleTitle": "External Influences on Business Activity",
    "overview": "Concise revision notes and glossary quiz for external influences on business activity.",
    "lessons": [
      {
        "id": "bus-6-1",
        "title": "Disposable income",
        "definition": "The level of income a taxpayer has after paying income tax",
        "fullDefinition": "The level of income a taxpayer has after paying income tax"
      },
      {
        "id": "bus-6-2",
        "title": "Import quota",
        "definition": "Physical limit to the quantity of a product that can be imported",
        "fullDefinition": "Physical limit to the quantity of a product that can be imported"
      },
      {
        "id": "bus-6-3",
        "title": "Monetary policy",
        "definition": "Change in interest rates by the government or central bank, such as European Central",
        "fullDefinition": "Change in interest rates by the government or central bank, such as European Central"
      },
      {
        "id": "bus-6-4",
        "title": "Exchange rate appreciation",
        "definition": "Rise in value of a currency compared to other currencies",
        "fullDefinition": "Rise in value of a currency compared to other currencies"
      },
      {
        "id": "bus-6-5",
        "title": "Social responsibility",
        "definition": "When a business decision benefits stakeholders other than shareholders, such as to reduce pollution by using 'green' technology",
        "fullDefinition": "When a business decision benefits stakeholders other than shareholders, such as to reduce pollution by using 'green' technology"
      },
      {
        "id": "bus-6-6",
        "title": "Environment",
        "definition": "Natural world including, for example, pure air, clean water and undeveloped countryside",
        "fullDefinition": "Natural world including, for example, pure air, clean water and undeveloped countryside"
      },
      {
        "id": "bus-6-7",
        "title": "External costs",
        "definition": "Costs paid for by society, other than business, as a result of business activity",
        "fullDefinition": "Costs paid for by society, other than business, as a result of business activity"
      },
      {
        "id": "bus-6-8",
        "title": "External benefits",
        "definition": "Gains to society other than business, as a result of business activity",
        "fullDefinition": "Gains to society other than business, as a result of business activity"
      },
      {
        "id": "bus-6-9",
        "title": "Sustainable development",
        "definition": "Development which doesn\u2019t put at risk the living standards of future generations",
        "fullDefinition": "Development which doesn\u2019t put at risk the living standards of future generations"
      },
      {
        "id": "bus-6-10",
        "title": "Pressure group",
        "definition": "Groups who want to change business decisions and they take action such as organizing consumer boycotts",
        "fullDefinition": "Groups who want to change business decisions and they take action such as organizing consumer boycotts"
      },
      {
        "id": "bus-6-11",
        "title": "Consumer boycott",
        "definition": "When consumers decide not to buy products from businesses that do not act in a socially responsible way",
        "fullDefinition": "When consumers decide not to buy products from businesses that do not act in a socially responsible way"
      },
      {
        "id": "bus-6-12",
        "title": "Globalization",
        "definition": "Increases worldwide trade and movement of people and capital between countries",
        "fullDefinition": "Increases worldwide trade and movement of people and capital between countries"
      },
      {
        "id": "bus-6-13",
        "title": "Free trade agreements",
        "definition": "When countries agree to trade imports/exports with no barriers such as tariffs or quotas",
        "fullDefinition": "When countries agree to trade imports/exports with no barriers such as tariffs or quotas"
      },
      {
        "id": "bus-6-14",
        "title": "Protectionism",
        "definition": "Government protects domestic firms from foreign competition using tariffs and quotas",
        "fullDefinition": "Government protects domestic firms from foreign competition using tariffs and quotas"
      },
      {
        "id": "bus-6-15",
        "title": "Multinational business/TNC",
        "definition": "Those with factories, production or service operations in more than one country",
        "fullDefinition": "Those with factories, production or service operations in more than one country"
      },
      {
        "id": "bus-6-16",
        "title": "Currency appreciation",
        "definition": "When the value of a currency rises - it buys more of another currency than before",
        "fullDefinition": "When the value of a currency rises - it buys more of another currency than before"
      },
      {
        "id": "bus-6-17",
        "title": "Currency depreciation",
        "definition": "When the value of a currency falls - it buys less of another currency than before",
        "fullDefinition": "When the value of a currency falls - it buys less of another currency than before"
      }
    ]
  }
];

export const businessGlossaryTerms = businessTheoryModules.flatMap((module) => module.lessons.map((lesson) => ({ ...lesson, moduleTitle: module.moduleTitle })));
