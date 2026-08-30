export type IctTheoryLesson = {
  id: string;
  number: string;
  title: string;
  summary: string;
  keyPoints: string[];
  compare?: {
    headers: string[];
    rows: string[][];
  };
  image?: {
    url: string;
    alt: string;
  };
};

export type IctTheoryQuiz = {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  feedback: string;
};

export type IctTheoryModule = {
  id: string;
  moduleId: number;
  moduleTitle: string;
  overview: string;
  lessons: IctTheoryLesson[];
  quiz: IctTheoryQuiz[];
  glossary: Array<{ term: string; definition: string }>;
};

export const ictTheoryModules: IctTheoryModule[] = [
  {
    id: "computer-systems",
    moduleId: 1,
    moduleTitle: "Types and Components of Computer Systems",
    overview: "Hardware, software, operating systems, and how users interact with computer systems.",
    lessons: [
      {
        id: "ict-1-hardware-software",
        number: "1.1",
        title: "Hardware and Software",
        summary: "Computer systems need both physical components and instructions.",
        keyPoints: [
          "Hardware means the physical, touchable electronic parts of a computer system.",
          "Software means the programs and instructions that tell hardware what to do.",
          "Hardware cannot complete useful work without software, and software cannot run without hardware."
        ],
        compare: {
          headers: ["Hardware", "Software"],
          rows: [["Keyboard, monitor, CPU, storage drive", "Operating system, browser, spreadsheet, presentation software"]]
        }
      },
      {
        id: "ict-1-interfaces",
        number: "1.2",
        title: "CLI and GUI",
        summary: "Different interfaces suit different users and tasks.",
        keyPoints: [
          "A Command Line Interface needs typed commands and is efficient for expert users.",
          "A Graphical User Interface uses windows, icons, menus, and pointers.",
          "CLI can use fewer resources, while GUI is usually easier for beginners."
        ],
        compare: {
          headers: ["CLI", "GUI"],
          rows: [
            ["Typed commands", "Visual controls"],
            ["Fast for experts and scripts", "Easier for beginners"],
            ["Errors can happen from small typing mistakes", "Needs more memory and graphics resources"]
          ]
        },
        image: {
          url: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=900",
          alt: "Computer screen showing source code"
        }
      }
    ],
    quiz: [
      {
        id: "ict-1-q1",
        topic: "User interfaces",
        question: "Which advantage can a command line interface have over a graphical user interface?",
        options: ["It needs no training", "It can use fewer memory and processor resources", "It always prevents typing errors", "It is based only on icons"],
        correctIndex: 1,
        feedback: "Correct. A CLI can be lighter because it does not need a full visual interface."
      }
    ],
    glossary: [
      { term: "Hardware", definition: "Physical parts of a computer system." },
      { term: "Software", definition: "Programs and instructions used by the computer." },
      { term: "CLI", definition: "A command line interface controlled by typed commands." },
      { term: "GUI", definition: "A graphical user interface based on visual controls." }
    ]
  },
  {
    id: "input-output",
    moduleId: 2,
    moduleTitle: "Input and Output Devices",
    overview: "Manual input, direct data entry, output methods, and choosing devices for a scenario.",
    lessons: [
      {
        id: "ict-2-manual-input",
        number: "2.1",
        title: "Manual Input Devices",
        summary: "Manual input devices let users enter data directly.",
        keyPoints: [
          "Keyboards are suitable for text, commands, and data entry.",
          "Mice and touchpads are useful for selecting, dragging, and navigating.",
          "Manual input is flexible but can be slower and more error-prone than automated capture."
        ],
        image: {
          url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=900",
          alt: "Computer keyboard close-up"
        }
      },
      {
        id: "ict-2-direct-entry",
        number: "2.2",
        title: "Direct Data Entry",
        summary: "Direct data entry captures data with less manual typing.",
        keyPoints: [
          "Barcode readers need optical line-of-sight to scan printed codes.",
          "RFID uses radio signals and can read tags without direct line-of-sight.",
          "RFID can scan multiple tags quickly but costs more to install."
        ],
        compare: {
          headers: ["Barcode", "RFID"],
          rows: [
            ["Needs line-of-sight", "Can work without line-of-sight"],
            ["Low cost", "Higher setup cost"],
            ["Often scans one item at a time", "Can scan several tags quickly"]
          ]
        }
      }
    ],
    quiz: [
      {
        id: "ict-2-q1",
        topic: "Direct input methods",
        question: "What is a key advantage of RFID compared with barcode scanning?",
        options: ["It is always cheaper", "It needs a printed optical code", "It can read tags without direct line-of-sight", "It stores only paper records"],
        correctIndex: 2,
        feedback: "Correct. RFID uses radio signals, so tags can be read without direct optical alignment."
      }
    ],
    glossary: [
      { term: "Input device", definition: "Hardware used to enter data or commands." },
      { term: "Barcode reader", definition: "A device that scans printed codes using light." },
      { term: "RFID", definition: "A radio-frequency method for reading data from tags." }
    ]
  },
  {
    id: "storage",
    moduleId: 3,
    moduleTitle: "Storage Devices and Media",
    overview: "Magnetic, optical, solid-state, and cloud storage choices.",
    lessons: [
      {
        id: "ict-3-hdd-ssd",
        number: "3.1",
        title: "Magnetic and Solid-State Storage",
        summary: "Different storage media vary in speed, durability, capacity, and cost.",
        keyPoints: [
          "Hard disk drives use magnetic platters and moving parts.",
          "Solid-state drives use flash memory with no moving parts.",
          "SSDs are usually faster and more shock-resistant, while HDDs often cost less per gigabyte."
        ],
        compare: {
          headers: ["HDD", "SSD"],
          rows: [
            ["Large capacity at low cost", "Fast access and boot times"],
            ["Moving parts can be damaged by shock", "No moving parts"],
            ["Often slower", "Usually more expensive per gigabyte"]
          ]
        },
        image: {
          url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=900",
          alt: "Solid state storage circuit board"
        }
      }
    ],
    quiz: [
      {
        id: "ict-3-q1",
        topic: "Storage media",
        question: "Why are SSDs often preferred for portable laptops?",
        options: ["They are always the cheapest storage", "They have no moving mechanical parts", "They need magnetic tape backup", "They lose data when switched off"],
        correctIndex: 1,
        feedback: "Correct. SSDs have no moving parts, so they cope better with movement and shock."
      }
    ],
    glossary: [
      { term: "HDD", definition: "Magnetic storage using spinning platters." },
      { term: "SSD", definition: "Solid-state storage using flash memory." },
      { term: "Cloud storage", definition: "Storage accessed through networked online services." }
    ]
  },
  {
    id: "networks",
    moduleId: 4,
    moduleTitle: "Networks and Communication Systems",
    overview: "Network hardware, wired and wireless communication, and routing.",
    lessons: [
      {
        id: "ict-4-routing",
        number: "4.1",
        title: "Routers and Network Connections",
        summary: "Network devices move data between users, devices, and networks.",
        keyPoints: [
          "A router forwards data packets between networks using destination addresses.",
          "Ethernet gives stable wired communication with less interference.",
          "Wi-Fi gives mobile access but can be affected by walls, distance, and interference."
        ],
        compare: {
          headers: ["Ethernet", "Wi-Fi"],
          rows: [
            ["Wired connection", "Wireless connection"],
            ["Stable and less affected by interference", "Flexible and mobile"],
            ["Needs cables", "Can weaken through walls or distance"]
          ]
        },
        image: {
          url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=900",
          alt: "Network server rack and cables"
        }
      }
    ],
    quiz: [
      {
        id: "ict-4-q1",
        topic: "Routing",
        question: "What is the main function of a router?",
        options: ["Print spreadsheet formulas", "Forward data packets between networks", "Store optical discs", "Display a GUI"],
        correctIndex: 1,
        feedback: "Correct. Routers use addressing information to forward data between networks."
      }
    ],
    glossary: [
      { term: "Router", definition: "A device that forwards data between networks." },
      { term: "Ethernet", definition: "A wired network connection standard." },
      { term: "Wi-Fi", definition: "Wireless network communication." }
    ]
  },
  {
    id: "social-economic",
    moduleId: 5,
    moduleTitle: "Social and Economic Effects of ICT",
    overview: "How digital systems affect employment, work patterns, access, and society.",
    lessons: [
      {
        id: "ict-5-automation",
        number: "5.1",
        title: "Automation and Employment",
        summary: "Automation can replace some jobs while creating demand for technical skills.",
        keyPoints: [
          "Automated processing can reduce repetitive clerical and manual roles.",
          "New roles can appear in support, programming, maintenance, and analysis.",
          "Workers may need training to adapt to new digital systems."
        ]
      },
      {
        id: "ict-5-teleworking",
        number: "5.2",
        title: "Teleworking",
        summary: "Teleworking means working away from a central office using digital communication.",
        keyPoints: [
          "Advantages include less travel time and lower office costs.",
          "Disadvantages include possible isolation and reliance on reliable internet.",
          "Security, communication, and work-life balance must be managed carefully."
        ]
      }
    ],
    quiz: [
      {
        id: "ict-5-q1",
        topic: "Teleworking",
        question: "What is a business benefit of teleworking?",
        options: ["Guaranteed zero security risk", "Lower office space costs", "No need for communication", "No internet required"],
        correctIndex: 1,
        feedback: "Correct. Teleworking can reduce the need for physical office space."
      }
    ],
    glossary: [
      { term: "Automation", definition: "Using technology to perform tasks with little human input." },
      { term: "Teleworking", definition: "Working away from the office using ICT." }
    ]
  },
  {
    id: "applications",
    moduleId: 6,
    moduleTitle: "Real-World ICT Applications",
    overview: "Expert systems and everyday ICT applications in organisations.",
    lessons: [
      {
        id: "ict-6-expert-systems",
        number: "6.1",
        title: "Expert Systems",
        summary: "Expert systems use stored knowledge and rules to suggest decisions.",
        keyPoints: [
          "A knowledge base stores facts and rules.",
          "An inference engine applies rules to user answers or known facts.",
          "An explanation facility can show why advice was given."
        ],
        compare: {
          headers: ["Component", "Purpose"],
          rows: [
            ["User interface", "Collects answers from the user"],
            ["Knowledge base", "Stores expert facts and rules"],
            ["Inference engine", "Applies logic to reach conclusions"],
            ["Explanation facility", "Explains the advice"]
          ]
        }
      }
    ],
    quiz: [
      {
        id: "ict-6-q1",
        topic: "Expert systems",
        question: "Which expert system component applies rules to reach a conclusion?",
        options: ["Inference engine", "Keyboard", "Page footer", "Barcode label"],
        correctIndex: 0,
        feedback: "Correct. The inference engine processes facts and rules."
      }
    ],
    glossary: [
      { term: "Expert system", definition: "Software that imitates expert decision-making in a narrow field." },
      { term: "Inference engine", definition: "The part that applies logical rules to data." },
      { term: "Knowledge base", definition: "Stored facts and rules used by the expert system." }
    ]
  },
  {
    id: "systems-life-cycle",
    moduleId: 7,
    moduleTitle: "Systems Life Cycle",
    overview: "Analysis, design, testing, implementation, and evaluation of systems.",
    lessons: [
      {
        id: "ict-7-implementation",
        number: "7.1",
        title: "Implementation Methods",
        summary: "Different changeover methods balance risk, cost, and disruption.",
        keyPoints: [
          "Direct changeover switches from the old system to the new system immediately.",
          "Parallel running uses old and new systems together for a time.",
          "Parallel running is safer but costs more and increases workload."
        ],
        compare: {
          headers: ["Direct changeover", "Parallel running"],
          rows: [
            ["Fast and cheaper", "Safer because the old system remains available"],
            ["High risk if the new system fails", "More expensive and more work during changeover"]
          ]
        }
      }
    ],
    quiz: [
      {
        id: "ict-7-q1",
        topic: "Implementation",
        question: "Why might an organisation choose parallel running?",
        options: ["It deletes all old files immediately", "It gives a working backup if the new system fails", "It removes all testing", "It halves all staff workload"],
        correctIndex: 1,
        feedback: "Correct. Parallel running reduces risk because the old system is still available."
      }
    ],
    glossary: [
      { term: "Direct changeover", definition: "Replacing the old system with the new one immediately." },
      { term: "Parallel running", definition: "Using old and new systems together for a period." },
      { term: "Evaluation", definition: "Reviewing whether a system meets its objectives." }
    ]
  },
  {
    id: "safety-security",
    moduleId: 8,
    moduleTitle: "Safety and Security Protocols",
    overview: "Threats, protection methods, and safe ICT practice.",
    lessons: [
      {
        id: "ict-8-threats",
        number: "8.1",
        title: "Threats and Protection",
        summary: "Security questions often ask for a threat and a suitable protection method.",
        keyPoints: [
          "Phishing tricks users into revealing private information.",
          "Pharming redirects users to fake websites by changing routing or name records.",
          "Firewalls filter network traffic using rules."
        ],
        compare: {
          headers: ["Threat", "Meaning"],
          rows: [
            ["Phishing", "Fraudulent messages that trick users"],
            ["Pharming", "Silent redirection to a fake site"],
            ["Malware", "Harmful software"]
          ]
        },
        image: {
          url: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=900",
          alt: "Cyber security padlock on a digital screen"
        }
      }
    ],
    quiz: [
      {
        id: "ict-8-q1",
        topic: "Cyber threats",
        question: "Which description best defines pharming?",
        options: ["Sending paper adverts", "Redirecting users to fake websites without their awareness", "Physically stealing a monitor", "Formatting a spreadsheet"],
        correctIndex: 1,
        feedback: "Correct. Pharming redirects users to fraudulent sites by altering routing or name records."
      }
    ],
    glossary: [
      { term: "Phishing", definition: "A scam message designed to steal information." },
      { term: "Pharming", definition: "Redirecting users to fake websites without obvious warning." },
      { term: "Firewall", definition: "Hardware or software that filters network traffic." }
    ]
  },
  {
    id: "communication",
    moduleId: 9,
    moduleTitle: "Audience Awareness and Digital Communication",
    overview: "Choosing suitable tone, format, layout, and communication behaviour.",
    lessons: [
      {
        id: "ict-9-audience",
        number: "9.1",
        title: "Audience and Netiquette",
        summary: "Good digital communication is planned for the audience and purpose.",
        keyPoints: [
          "Audience affects vocabulary, detail, layout, colours, and tone.",
          "Netiquette means using respectful and suitable behaviour in digital communication.",
          "All-caps messages can look like shouting and may be unsuitable for formal communication."
        ]
      }
    ],
    quiz: [
      {
        id: "ict-9-q1",
        topic: "Communication standards",
        question: "Why should digital documents be designed with the target audience in mind?",
        options: ["To match tone, language, layout, and detail to the reader", "To encrypt every network packet", "To remove database records", "To force landscape printing"],
        correctIndex: 0,
        feedback: "Correct. Audience awareness helps the communication fit the reader and purpose."
      }
    ],
    glossary: [
      { term: "Target audience", definition: "The intended users or readers of a communication." },
      { term: "Netiquette", definition: "Acceptable behaviour when communicating online." },
      { term: "Purpose", definition: "The reason a communication is created." }
    ]
  }
];
