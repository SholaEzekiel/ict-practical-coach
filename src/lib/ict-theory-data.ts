export type IctTheoryLesson = {
  id: string;
  number: string;
  title: string;
  summary: string;
  keyPoints: string[];
  studyBlocks?: Array<{
    heading: string;
    points: string[];
  }>;
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
    overview: "Study the main parts of a computer system, how hardware and software work together, and how users interact with operating systems.",
    lessons: [
      {
        id: "ict-1-hardware-software",
        number: "1.1",
        title: "Hardware and Software",
        summary: "A computer system is useful only when physical hardware and software instructions work together.",
        keyPoints: [
          "Hardware is any physical part of a computer system that can be touched, such as the CPU, keyboard, monitor, memory, storage drive, or network card.",
          "Software is the set of instructions, programs, and data that tells the hardware what to do.",
          "System software manages the computer itself, while application software helps users complete tasks such as writing, browsing, calculating, designing, or communicating."
        ],
        studyBlocks: [
          {
            heading: "What Students Must Understand",
            points: [
              "Hardware cannot solve a useful user problem on its own because it needs instructions.",
              "Software cannot run unless a processor, memory, storage, and input/output hardware are available.",
              "A complete answer should identify the item, classify it as hardware or software, and explain what it does in context."
            ]
          },
          {
            heading: "Exam Focus",
            points: [
              "Questions may ask for examples, differences, advantages, or why both hardware and software are needed.",
              "Avoid vague answers such as hardware is inside the computer; external devices such as keyboards and printers are also hardware.",
              "Use precise examples: operating system, spreadsheet, browser, antivirus, CPU, RAM, SSD, monitor."
            ]
          }
        ],
        compare: {
          headers: ["Hardware", "Software"],
          rows: [
            ["Physical electronic or mechanical parts", "Instructions and programs"],
            ["Can wear out, break, or be replaced physically", "Can be installed, updated, corrupted, or deleted"],
            ["CPU, RAM, keyboard, monitor, SSD", "Operating system, browser, spreadsheet, antivirus"]
          ]
        },
        image: {
          url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=900",
          alt: "Close-up of a computer motherboard and electronic circuitry"
        }
      },
      {
        id: "ict-1-cpu-memory",
        number: "1.2",
        title: "CPU, Memory, and Processing",
        summary: "The CPU processes instructions, while memory and storage hold the data needed before, during, and after processing.",
        keyPoints: [
          "The CPU is the main processing component and repeatedly fetches, decodes, and executes instructions.",
          "The Arithmetic Logic Unit performs calculations and logical comparisons.",
          "RAM temporarily stores programs and data currently in use; it is volatile, so contents are lost when power is removed."
        ],
        studyBlocks: [
          {
            heading: "CPU Parts",
            points: [
              "The Control Unit coordinates the movement of instructions and data around the processor.",
              "The Arithmetic Logic Unit handles arithmetic such as addition and comparisons such as greater than or equal to.",
              "Cache is small, very fast memory close to the CPU that stores frequently used instructions and data."
            ]
          },
          {
            heading: "Memory and Storage",
            points: [
              "RAM is working memory used while software is running.",
              "ROM stores permanent start-up instructions and is non-volatile.",
              "Secondary storage such as SSD or HDD keeps files and programs after the computer is switched off."
            ]
          },
          {
            heading: "How to Answer Well",
            points: [
              "If asked about performance, explain that more RAM can allow more programs or larger files to be handled at once.",
              "If asked about CPU speed, mention that faster processing can improve response time but may increase heat and power use.",
              "Do not confuse RAM with storage: RAM is temporary working memory; storage keeps files long term."
            ]
          }
        ],
        compare: {
          headers: ["Component", "Main Purpose"],
          rows: [
            ["CPU", "Executes instructions and controls processing"],
            ["RAM", "Temporarily stores active programs and data"],
            ["ROM", "Stores permanent start-up instructions"],
            ["Cache", "Provides very fast access to frequently used data"]
          ]
        },
        image: {
          url: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?q=80&w=900",
          alt: "Close-up of a processor chip"
        }
      },
      {
        id: "ict-1-interfaces",
        number: "1.3",
        title: "Operating Systems, CLI, and GUI",
        summary: "Operating systems manage hardware and software resources, while interfaces let users control the system.",
        keyPoints: [
          "An operating system manages files, memory, input/output devices, security, users, and running programs.",
          "A Command Line Interface requires typed commands and is powerful for trained users.",
          "A Graphical User Interface uses windows, icons, menus, and pointers, making common tasks easier for beginners."
        ],
        studyBlocks: [
          {
            heading: "CLI Strengths and Limits",
            points: [
              "CLI can be fast for repetitive tasks, scripting, remote administration, and expert troubleshooting.",
              "CLI uses fewer graphical resources than a full visual desktop.",
              "It has a steep learning curve, and small typing errors can stop a command from working."
            ]
          },
          {
            heading: "GUI Strengths and Limits",
            points: [
              "GUI is easier for most users because commands are represented visually.",
              "It gives immediate visual feedback and supports drag-and-drop actions.",
              "It usually needs more memory, processing power, and screen resources than a CLI."
            ]
          }
        ],
        compare: {
          headers: ["CLI", "GUI"],
          rows: [
            ["Typed commands", "Windows, icons, menus, pointers"],
            ["Efficient for experts and scripts", "Accessible for beginners"],
            ["Low resource use", "Higher resource use"],
            ["Mistakes in syntax can fail", "Visual controls reduce the need to memorise commands"]
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
        topic: "CPU components",
        question: "Which CPU component performs arithmetic operations and logical comparisons?",
        options: ["Control Unit", "Arithmetic Logic Unit", "Hard disk drive", "Output buffer"],
        correctIndex: 1,
        feedback: "Correct. The Arithmetic Logic Unit performs calculations and logical comparisons."
      },
      {
        id: "ict-1-q2",
        topic: "Memory",
        question: "Why is RAM described as volatile?",
        options: ["It stores data permanently", "It loses contents when power is removed", "It is an input device", "It prints output"],
        correctIndex: 1,
        feedback: "Correct. RAM is temporary working memory and loses data when the device is switched off."
      },
      {
        id: "ict-1-q3",
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
      { term: "CPU", definition: "The central processing unit that executes instructions." },
      { term: "ALU", definition: "The CPU component that performs calculations and logical comparisons." },
      { term: "RAM", definition: "Volatile working memory used by active programs and data." },
      { term: "ROM", definition: "Non-volatile memory that stores permanent start-up instructions." },
      { term: "CLI", definition: "A command line interface controlled by typed commands." },
      { term: "GUI", definition: "A graphical user interface based on visual controls." }
    ]
  },
  {
    id: "input-output",
    moduleId: 2,
    moduleTitle: "Input and Output Devices",
    overview: "Learn how data enters a system, how output is produced, and how to choose suitable devices for real situations.",
    lessons: [
      {
        id: "ict-2-manual-input",
        number: "2.1",
        title: "Manual Input Devices",
        summary: "Manual input devices depend on a person entering data or commands.",
        keyPoints: [
          "Keyboards are suitable for entering text, commands, shortcuts, codes, and structured data.",
          "Mice, touchpads, and trackerballs are pointing devices used for selection, navigation, drawing, and dragging.",
          "Manual input is flexible, but speed and accuracy depend heavily on the user."
        ],
        studyBlocks: [
          {
            heading: "Advantages",
            points: [
              "Keyboards are familiar, widely available, and efficient for long text entry.",
              "Pointing devices are easy for selecting icons, menus, cells, objects, and on-screen controls.",
              "Specialist input devices can improve accessibility for users with different needs."
            ]
          },
          {
            heading: "Disadvantages",
            points: [
              "Typing errors can produce inaccurate data.",
              "Manual entry can be slow for large volumes of data.",
              "Repeated use can contribute to strain or discomfort if the workstation is poorly designed."
            ]
          }
        ],
        image: {
          url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=900",
          alt: "Close-up of a computer keyboard"
        }
      },
      {
        id: "ict-2-direct-entry",
        number: "2.2",
        title: "Direct Data Entry",
        summary: "Direct data entry captures data from a source with less manual typing.",
        keyPoints: [
          "Barcode readers scan printed codes and are common in shops, libraries, and warehouses.",
          "RFID uses radio waves to read tags without needing direct line-of-sight.",
          "MICR reads magnetic characters, often on bank documents, where reliability and fraud reduction matter."
        ],
        studyBlocks: [
          {
            heading: "Why Direct Entry Is Used",
            points: [
              "It reduces transcription errors because users do not retype data manually.",
              "It speeds up repeated transactions such as scanning items at checkout.",
              "It can support automatic stock control, identification, tracking, and authentication."
            ]
          },
          {
            heading: "Choosing the Device",
            points: [
              "Use barcode scanning when printed labels are cheap and easy to see.",
              "Use RFID when items may be inside boxes, moving quickly, or scanned in groups.",
              "Use MICR where documents need magnetic security characters that are harder to alter."
            ]
          }
        ],
        compare: {
          headers: ["Method", "Best Use", "Limitation"],
          rows: [
            ["Barcode", "Retail and library item codes", "Needs a readable printed code"],
            ["RFID", "Tracking many tagged items", "Higher setup cost"],
            ["MICR", "Banking documents", "Special ink and reader required"],
            ["NFC", "Short-range contactless payment or identification", "Very short range"]
          ]
        }
      },
      {
        id: "ict-2-output",
        number: "2.3",
        title: "Output Devices",
        summary: "Output devices present processed data in a form people or other systems can use.",
        keyPoints: [
          "Monitors and projectors display visual output.",
          "Printers create hard-copy output such as reports, labels, forms, or photographs.",
          "Speakers, actuators, and control devices output sound or physical action."
        ],
        studyBlocks: [
          {
            heading: "Printer Selection",
            points: [
              "Inkjet printers are useful for colour images and lower-volume home or school printing.",
              "Laser printers are suitable for fast, high-volume, sharp text output.",
              "3D printers create physical models layer by layer and are useful for prototypes."
            ]
          },
          {
            heading: "Exam Focus",
            points: [
              "A strong answer links the output device to the purpose, volume, quality, speed, cost, and environment.",
              "Avoid saying one device is always best; suitability depends on the scenario.",
              "Include disadvantages such as running cost, maintenance, noise, size, and specialist materials."
            ]
          }
        ],
        compare: {
          headers: ["Output Device", "Suitable Use"],
          rows: [
            ["Monitor", "Interactive screen output"],
            ["Laser printer", "Fast text reports"],
            ["Inkjet printer", "Colour photos and mixed documents"],
            ["Speaker", "Sound alerts, music, narration"],
            ["Actuator", "Physical movement in control systems"]
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
      },
      {
        id: "ict-2-q2",
        topic: "Output devices",
        question: "Which printer is usually most suitable for fast high-volume text reports?",
        options: ["Laser printer", "3D printer", "Plotter", "Touchscreen"],
        correctIndex: 0,
        feedback: "Correct. Laser printers are usually fast and economical for large quantities of text output."
      }
    ],
    glossary: [
      { term: "Input device", definition: "Hardware used to enter data or commands." },
      { term: "Output device", definition: "Hardware used to present processed data." },
      { term: "Barcode reader", definition: "A device that scans printed codes using light." },
      { term: "RFID", definition: "A radio-frequency method for reading data from tags." },
      { term: "MICR", definition: "Magnetic ink character recognition, commonly used for banking documents." },
      { term: "Actuator", definition: "A device that converts a control signal into physical movement." }
    ]
  },
  {
    id: "storage",
    moduleId: 3,
    moduleTitle: "Storage Devices and Media",
    overview: "Compare storage technologies by capacity, speed, portability, durability, cost, and use.",
    lessons: [
      {
        id: "ict-3-magnetic",
        number: "3.1",
        title: "Magnetic Storage",
        summary: "Magnetic storage stores data using magnetised areas on a surface.",
        keyPoints: [
          "Hard disk drives contain spinning platters and moving read/write heads.",
          "They usually offer large capacity at a low cost per gigabyte.",
          "They are vulnerable to physical shock because moving parts can be damaged."
        ],
        studyBlocks: [
          {
            heading: "Where It Is Useful",
            points: [
              "Desktop computers and servers can use HDDs for large, low-cost file storage.",
              "Backup systems can use magnetic storage where speed is less important than capacity.",
              "Network storage may use many drives together to hold shared files."
            ]
          },
          {
            heading: "Limitations",
            points: [
              "Access time is affected by platter rotation and head movement.",
              "HDDs are not ideal for devices likely to be moved while running.",
              "Noise, heat, and power use can be higher than solid-state storage."
            ]
          }
        ],
        compare: {
          headers: ["Advantage", "Disadvantage"],
          rows: [
            ["Large capacity for the price", "Slower than SSD"],
            ["Good for bulk storage", "Mechanical parts can fail"],
            ["Common and widely supported", "Can be damaged by shock"]
          ]
        }
      },
      {
        id: "ict-3-solid-state",
        number: "3.2",
        title: "Solid-State Storage",
        summary: "Solid-state storage uses flash memory chips and has no moving parts.",
        keyPoints: [
          "SSDs, USB flash drives, and memory cards are examples of solid-state storage.",
          "Solid-state storage is fast, silent, and more shock-resistant than magnetic drives.",
          "It usually costs more per gigabyte and has a limited number of write cycles."
        ],
        studyBlocks: [
          {
            heading: "Why It Is Fast",
            points: [
              "There is no waiting for a platter to spin to the correct position.",
              "The device can access memory cells electronically.",
              "This helps with fast boot times, quick app loading, and responsive file access."
            ]
          },
          {
            heading: "Best Uses",
            points: [
              "Laptops benefit from SSD durability and lower power use.",
              "Phones, cameras, and tablets use flash storage because it is compact.",
              "High-performance systems often use SSDs for the operating system and active project files."
            ]
          }
        ],
        compare: {
          headers: ["HDD", "SSD"],
          rows: [
            ["Lower cost per gigabyte", "Faster read/write speeds"],
            ["Moving parts", "No moving parts"],
            ["Good for bulk storage", "Good for speed and portability"],
            ["More affected by shock", "More shock-resistant"]
          ]
        },
        image: {
          url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=900",
          alt: "Solid-state storage circuit board with memory chips"
        }
      },
      {
        id: "ict-3-optical-cloud",
        number: "3.3",
        title: "Optical and Cloud Storage",
        summary: "Optical and cloud storage are useful in specific situations, especially distribution, archiving, and remote access.",
        keyPoints: [
          "Optical media such as CDs, DVDs, and Blu-ray discs use lasers to read or write data.",
          "Cloud storage keeps data on remote servers accessed through the internet.",
          "Cloud storage supports sharing and access from many devices but depends on network availability and account security."
        ],
        studyBlocks: [
          {
            heading: "Optical Storage",
            points: [
              "Useful for distributing media or archived files where low cost matters.",
              "Can be write-once or rewritable depending on the disc type.",
              "Has lower capacity and slower access than many modern storage options."
            ]
          },
          {
            heading: "Cloud Storage",
            points: [
              "Files can be synchronised across devices and shared with other users.",
              "Backups can protect users if a local device is lost or damaged.",
              "Risks include hacking, weak passwords, subscription costs, and loss of access if internet is unavailable."
            ]
          }
        ]
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
      },
      {
        id: "ict-3-q2",
        topic: "Cloud storage",
        question: "Which is a disadvantage of cloud storage?",
        options: ["Files can never be shared", "It depends on internet access and account security", "It cannot be used for backups", "It only works with optical discs"],
        correctIndex: 1,
        feedback: "Correct. Cloud storage is useful, but access and security depend on networks and accounts."
      }
    ],
    glossary: [
      { term: "HDD", definition: "Magnetic storage using spinning platters." },
      { term: "SSD", definition: "Solid-state storage using flash memory." },
      { term: "Optical storage", definition: "Storage read or written using laser light." },
      { term: "Cloud storage", definition: "Storage accessed through online services and remote servers." },
      { term: "Volatile", definition: "Data is lost when power is removed." },
      { term: "Non-volatile", definition: "Data remains when power is removed." }
    ]
  },
  {
    id: "networks",
    moduleId: 4,
    moduleTitle: "Networks and Communication Systems",
    overview: "Study network types, hardware, transmission methods, and the reasons organisations connect devices.",
    lessons: [
      {
        id: "ict-4-network-types",
        number: "4.1",
        title: "Network Types and Benefits",
        summary: "Networks connect devices so users can share data, hardware, software, and communication services.",
        keyPoints: [
          "A LAN covers a small area such as a school, office, or home.",
          "A WAN covers a large geographical area and may connect sites in different cities or countries.",
          "Networks support resource sharing, centralised backups, communication, and shared internet access."
        ],
        studyBlocks: [
          {
            heading: "Advantages of Networks",
            points: [
              "Users can share files, printers, software, and internet connections.",
              "Administrators can manage users, permissions, backups, and security centrally.",
              "Communication becomes faster through email, messaging, shared calendars, and collaboration tools."
            ]
          },
          {
            heading: "Disadvantages of Networks",
            points: [
              "If the network fails, many users may be affected at once.",
              "Security risks increase because malware or unauthorised access can spread.",
              "Networks need skilled setup, maintenance, cabling, wireless planning, and monitoring."
            ]
          }
        ],
        compare: {
          headers: ["LAN", "WAN"],
          rows: [
            ["Small geographical area", "Large geographical area"],
            ["Often owned by one organisation", "May use telecoms or internet providers"],
            ["Usually faster and easier to manage locally", "Connects distant sites but can be more complex"]
          ]
        }
      },
      {
        id: "ict-4-hardware",
        number: "4.2",
        title: "Routers, Switches, and Network Adapters",
        summary: "Network hardware moves data between devices and across networks.",
        keyPoints: [
          "A router forwards data packets between networks using destination addresses.",
          "A switch connects devices within a LAN and forwards data to the correct device.",
          "A network adapter gives a device the hardware needed to connect to a wired or wireless network."
        ],
        studyBlocks: [
          {
            heading: "Router",
            points: [
              "Used to connect a local network to another network, often the internet.",
              "Can direct packets based on addressing information.",
              "May include wireless access, firewall rules, and network address translation in home or school equipment."
            ]
          },
          {
            heading: "Switch",
            points: [
              "Used inside a LAN to connect computers, printers, servers, and access points.",
              "Reduces unnecessary traffic by sending frames towards the intended device.",
              "Unlike a hub, a switch is more intelligent about where data should go."
            ]
          }
        ],
        image: {
          url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=900",
          alt: "Network server rack with connected cables"
        }
      },
      {
        id: "ict-4-wired-wireless",
        number: "4.3",
        title: "Wired and Wireless Communication",
        summary: "Connection methods are chosen according to speed, mobility, reliability, cost, and environment.",
        keyPoints: [
          "Ethernet uses cables and is usually stable, secure, and less affected by interference.",
          "Wi-Fi is wireless and convenient for mobile devices but can be affected by distance, walls, and interference.",
          "Bluetooth is short-range and useful for peripherals such as keyboards, headphones, and sensors."
        ],
        studyBlocks: [
          {
            heading: "Choosing a Connection",
            points: [
              "Use Ethernet for devices that need reliable high-speed access, such as servers or desktop workstations.",
              "Use Wi-Fi where mobility and convenience are more important than maximum stability.",
              "Use Bluetooth for short-range device-to-device connections with low power requirements."
            ]
          }
        ],
        compare: {
          headers: ["Ethernet", "Wi-Fi", "Bluetooth"],
          rows: [
            ["Wired LAN connection", "Wireless LAN connection", "Short-range wireless connection"],
            ["Reliable and fast", "Mobile and flexible", "Low power for nearby devices"],
            ["Needs cables", "Can suffer interference", "Short range and lower speed"]
          ]
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
      },
      {
        id: "ict-4-q2",
        topic: "Network types",
        question: "Which network type usually covers a school building or small office?",
        options: ["LAN", "WAN", "Bluetooth pair only", "Optical archive"],
        correctIndex: 0,
        feedback: "Correct. A LAN covers a limited local area."
      }
    ],
    glossary: [
      { term: "LAN", definition: "A local area network covering a small area." },
      { term: "WAN", definition: "A wide area network covering a large geographical area." },
      { term: "Router", definition: "A device that forwards data between networks." },
      { term: "Switch", definition: "A device that connects devices within a LAN." },
      { term: "Network adapter", definition: "Hardware that allows a device to connect to a network." },
      { term: "Ethernet", definition: "A wired network connection standard." },
      { term: "Wi-Fi", definition: "Wireless network communication." }
    ]
  },
  {
    id: "social-economic",
    moduleId: 5,
    moduleTitle: "Social and Economic Effects of ICT",
    overview: "Understand how ICT changes work, communication, access, health, society, and business activity.",
    lessons: [
      {
        id: "ict-5-employment",
        number: "5.1",
        title: "Automation and Employment",
        summary: "ICT can replace repetitive work while creating demand for new digital skills.",
        keyPoints: [
          "Automation can reduce the need for low-skilled repetitive roles in offices, factories, and services.",
          "New jobs can appear in programming, data analysis, technical support, cybersecurity, maintenance, and digital design.",
          "Workers may need retraining so they can use or manage new systems."
        ],
        studyBlocks: [
          {
            heading: "Positive Effects",
            points: [
              "Machines and software can complete repetitive tasks quickly and consistently.",
              "Dangerous tasks can be automated, reducing risk to workers.",
              "Businesses can increase productivity and operate for longer hours."
            ]
          },
          {
            heading: "Negative Effects",
            points: [
              "Some workers may lose jobs if their tasks are replaced.",
              "Communities can be affected if local industries reduce staff.",
              "Training costs can be high, and older systems may need careful replacement."
            ]
          }
        ]
      },
      {
        id: "ict-5-teleworking",
        number: "5.2",
        title: "Teleworking and Digital Communication",
        summary: "Teleworking allows people to work away from a central workplace using ICT tools.",
        keyPoints: [
          "Teleworking can reduce travel time, office costs, and environmental impact.",
          "Employees may gain flexibility, but can feel isolated or distracted at home.",
          "Employers must manage communication, performance, data security, and reliable remote access."
        ],
        studyBlocks: [
          {
            heading: "Benefits for Workers",
            points: [
              "Less commuting can save time and money.",
              "Flexible working can help with family responsibilities or personal schedules.",
              "Some workers may be more productive in a quiet environment."
            ]
          },
          {
            heading: "Risks and Limits",
            points: [
              "Home networks may be less secure than office networks.",
              "Poor internet can interrupt meetings or cloud access.",
              "Team communication can become weaker if systems and expectations are not clear."
            ]
          }
        ]
      },
      {
        id: "ict-5-health",
        number: "5.3",
        title: "Health, Safety, and Access",
        summary: "ICT use must consider physical health, safe working, and equal access.",
        keyPoints: [
          "Poor workstation design can contribute to eye strain, back pain, neck pain, or repetitive strain injuries.",
          "Good practice includes adjustable seating, suitable screen height, breaks, lighting, and safe cable management.",
          "The digital divide means some people have less access to devices, internet, training, or support."
        ],
        studyBlocks: [
          {
            heading: "Preventing Health Problems",
            points: [
              "Use an adjustable chair and keep feet supported.",
              "Position the screen to reduce glare and neck strain.",
              "Take regular breaks from keyboard and mouse use."
            ]
          },
          {
            heading: "Digital Divide",
            points: [
              "People without reliable devices or internet may struggle to access education, jobs, banking, or public services.",
              "Cost, geography, disability, age, and lack of training can all affect access.",
              "Solutions include public access points, training, accessible design, and affordable connectivity."
            ]
          }
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
      },
      {
        id: "ict-5-q2",
        topic: "Automation",
        question: "Which is a possible negative effect of automation?",
        options: ["Some repetitive jobs may be lost", "All workers become managers", "Computers stop needing electricity", "Manual errors always increase"],
        correctIndex: 0,
        feedback: "Correct. Automation can replace some repetitive work, so retraining may be needed."
      }
    ],
    glossary: [
      { term: "Automation", definition: "Using technology to perform tasks with little human input." },
      { term: "Teleworking", definition: "Working away from the office using ICT." },
      { term: "Digital divide", definition: "The gap between people who have good ICT access and those who do not." },
      { term: "RSI", definition: "Repetitive strain injury caused by repeated movement or poor posture." }
    ]
  },
  {
    id: "applications",
    moduleId: 6,
    moduleTitle: "Real-World ICT Applications",
    overview: "Study how ICT is used in expert systems, booking systems, banking, retail, education, health, and control systems.",
    lessons: [
      {
        id: "ict-6-expert-systems",
        number: "6.1",
        title: "Expert Systems",
        summary: "Expert systems imitate expert decision-making in a narrow subject area.",
        keyPoints: [
          "A user enters facts through a user interface.",
          "The knowledge base stores expert facts and rules.",
          "The inference engine applies rules to the facts and produces advice or a conclusion."
        ],
        studyBlocks: [
          {
            heading: "Where Expert Systems Are Used",
            points: [
              "Medical diagnosis support can suggest possible conditions from symptoms.",
              "Mineral or oil exploration can analyse geological data.",
              "Fault diagnosis can help technicians identify problems in equipment."
            ]
          },
          {
            heading: "Advantages and Disadvantages",
            points: [
              "They can provide consistent advice and work without fatigue.",
              "They can preserve specialist knowledge and help non-experts.",
              "They can be expensive to build and may fail outside the knowledge they were designed for."
            ]
          }
        ],
        compare: {
          headers: ["Component", "Purpose"],
          rows: [
            ["User interface", "Collects answers from the user"],
            ["Knowledge base", "Stores expert facts and rules"],
            ["Inference engine", "Applies logic to reach conclusions"],
            ["Explanation facility", "Explains why advice was given"]
          ]
        },
        image: {
          url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=900",
          alt: "Medical technology screen used for diagnosis support"
        }
      },
      {
        id: "ict-6-transaction-systems",
        number: "6.2",
        title: "Transaction and Booking Systems",
        summary: "Transaction systems process repeated events such as purchases, reservations, and account updates.",
        keyPoints: [
          "Retail systems use barcode scans, product databases, stock updates, receipts, and payment processing.",
          "Booking systems check availability, reserve places, prevent double-booking, and send confirmations.",
          "Banking systems process withdrawals, transfers, deposits, fraud checks, and account balances."
        ],
        studyBlocks: [
          {
            heading: "Typical Inputs, Processing, and Outputs",
            points: [
              "Inputs may include product code, customer details, booking date, payment card, or account number.",
              "Processing may include validation, searching records, calculating totals, and updating stock or balances.",
              "Outputs may include receipts, confirmation emails, tickets, alerts, or updated records."
            ]
          }
        ]
      },
      {
        id: "ict-6-control-systems",
        number: "6.3",
        title: "Monitoring and Control Systems",
        summary: "Monitoring systems measure conditions, while control systems respond automatically.",
        keyPoints: [
          "Sensors collect data such as temperature, pressure, light, movement, or moisture.",
          "A processor compares sensor readings with stored values.",
          "Actuators can switch devices on or off, open valves, move motors, or sound alarms."
        ],
        studyBlocks: [
          {
            heading: "Control Loop",
            points: [
              "Input comes from sensors.",
              "Processing compares readings with target values.",
              "Output is sent to an actuator if action is needed.",
              "The system repeats the loop to keep monitoring conditions."
            ]
          },
          {
            heading: "Examples",
            points: [
              "A greenhouse can control heaters, fans, and watering systems.",
              "A burglar alarm can detect movement and trigger a siren.",
              "A washing machine can monitor water level and control valves and motors."
            ]
          }
        ]
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
      },
      {
        id: "ict-6-q2",
        topic: "Control systems",
        question: "What does an actuator do in a control system?",
        options: ["Stores the knowledge base", "Converts a control signal into physical action", "Prints a spreadsheet", "Defines a password"],
        correctIndex: 1,
        feedback: "Correct. An actuator carries out physical action such as moving, opening, switching, or sounding."
      }
    ],
    glossary: [
      { term: "Expert system", definition: "Software that imitates expert decision-making in a narrow field." },
      { term: "Inference engine", definition: "The part that applies logical rules to data." },
      { term: "Knowledge base", definition: "Stored facts and rules used by the expert system." },
      { term: "Sensor", definition: "A device that detects a physical condition." },
      { term: "Actuator", definition: "A device that converts a signal into physical action." },
      { term: "Transaction processing", definition: "Processing repeated business events such as sales or bookings." }
    ]
  },
  {
    id: "systems-life-cycle",
    moduleId: 7,
    moduleTitle: "Systems Life Cycle",
    overview: "Follow how systems are analysed, designed, developed, tested, implemented, documented, and evaluated.",
    lessons: [
      {
        id: "ict-7-analysis",
        number: "7.1",
        title: "Analysis and Data Collection",
        summary: "Analysis investigates the existing system and identifies what the new system must do.",
        keyPoints: [
          "Analysts collect information using interviews, questionnaires, observation, and document inspection.",
          "The purpose is to find problems, requirements, inputs, outputs, processes, and constraints.",
          "Clear analysis reduces the risk of building a system that does not solve the real problem."
        ],
        studyBlocks: [
          {
            heading: "Methods",
            points: [
              "Interviews allow detailed answers and follow-up questions but take time.",
              "Questionnaires reach many people quickly but may produce limited answers.",
              "Observation shows real work but staff may behave differently when watched.",
              "Document inspection reveals current forms, reports, files, and data flows."
            ]
          }
        ],
        compare: {
          headers: ["Method", "Strength", "Weakness"],
          rows: [
            ["Interview", "Detailed responses", "Time-consuming"],
            ["Questionnaire", "Reaches many users", "Low detail if questions are poor"],
            ["Observation", "Shows actual workflow", "People may change behaviour"],
            ["Document inspection", "Shows current evidence", "Documents may be outdated"]
          ]
        }
      },
      {
        id: "ict-7-design-testing",
        number: "7.2",
        title: "Design, Testing, and Documentation",
        summary: "Design plans the solution, testing proves it works, and documentation supports users and technicians.",
        keyPoints: [
          "Design includes inputs, outputs, screen layouts, data structures, validation rules, and processing logic.",
          "Testing uses normal, abnormal, and extreme data to check whether the system behaves correctly.",
          "User documentation explains how to use the system; technical documentation explains how it works and is maintained."
        ],
        studyBlocks: [
          {
            heading: "Testing Data",
            points: [
              "Normal data is valid and should be accepted.",
              "Abnormal data is invalid and should be rejected.",
              "Extreme data is at the boundary of what should be accepted."
            ]
          },
          {
            heading: "Documentation",
            points: [
              "User documentation may include installation steps, screenshots, FAQs, and troubleshooting.",
              "Technical documentation may include file structures, data dictionaries, algorithms, and system requirements.",
              "Good documentation reduces training time and makes maintenance easier."
            ]
          }
        ]
      },
      {
        id: "ict-7-implementation",
        number: "7.3",
        title: "Implementation and Evaluation",
        summary: "Implementation introduces the new system; evaluation checks whether it meets the objectives.",
        keyPoints: [
          "Direct changeover replaces the old system immediately and is fast but risky.",
          "Parallel running uses old and new systems together and is safer but more expensive.",
          "Phased and pilot implementation reduce risk by introducing the system gradually."
        ],
        studyBlocks: [
          {
            heading: "Choosing Changeover",
            points: [
              "Direct changeover suits low-risk systems or situations where speed matters.",
              "Parallel running suits important systems where failure would be costly.",
              "Pilot implementation tests the system in one department or location first.",
              "Phased implementation introduces parts of the system one at a time."
            ]
          },
          {
            heading: "Evaluation",
            points: [
              "Compare the finished system with the original objectives.",
              "Collect feedback from users and compare performance against the old system.",
              "Identify improvements, limitations, and maintenance needs."
            ]
          }
        ],
        compare: {
          headers: ["Method", "Benefit", "Risk or Cost"],
          rows: [
            ["Direct", "Fast and cheaper", "High risk if new system fails"],
            ["Parallel", "Old system remains as backup", "More work and cost"],
            ["Pilot", "Tests with a small group first", "Rollout takes longer"],
            ["Phased", "Gradual introduction", "May need old and new parts to work together"]
          ]
        }
      }
    ],
    quiz: [
      {
        id: "ict-7-q1",
        topic: "Analysis",
        question: "What is a disadvantage of observation during systems analysis?",
        options: ["It prevents analysts seeing any workflow", "Staff may change behaviour because they are watched", "It always deletes source files", "It cannot identify documents"],
        correctIndex: 1,
        feedback: "Correct. Observation can be affected when people alter their normal behaviour."
      },
      {
        id: "ict-7-q2",
        topic: "Implementation",
        question: "Why might an organisation choose parallel running?",
        options: ["It deletes all old files immediately", "It gives a working backup if the new system fails", "It removes all testing", "It halves all staff workload"],
        correctIndex: 1,
        feedback: "Correct. Parallel running reduces risk because the old system is still available."
      }
    ],
    glossary: [
      { term: "Analysis", definition: "Investigating the current system and requirements." },
      { term: "Normal data", definition: "Valid test data that should be accepted." },
      { term: "Abnormal data", definition: "Invalid test data that should be rejected." },
      { term: "Extreme data", definition: "Boundary test data at the edge of valid limits." },
      { term: "Direct changeover", definition: "Replacing the old system with the new one immediately." },
      { term: "Parallel running", definition: "Using old and new systems together for a period." },
      { term: "Evaluation", definition: "Reviewing whether a system meets its objectives." }
    ]
  },
  {
    id: "safety-security",
    moduleId: 8,
    moduleTitle: "Safety and Security Protocols",
    overview: "Learn common threats, protection methods, encryption, authentication, backup, and safe working practice.",
    lessons: [
      {
        id: "ict-8-threats",
        number: "8.1",
        title: "Threats to Data and Systems",
        summary: "Security threats target data, accounts, networks, software, and users.",
        keyPoints: [
          "Malware includes harmful software such as viruses, worms, trojans, ransomware, and spyware.",
          "Phishing tricks users into giving away confidential information through fake messages or websites.",
          "Pharming redirects users to fake websites without the user deliberately following a fake link."
        ],
        studyBlocks: [
          {
            heading: "How Threats Cause Harm",
            points: [
              "Malware can damage files, steal data, lock systems, or spy on user activity.",
              "Phishing can lead to stolen passwords, bank details, or identity information.",
              "Weak passwords and unpatched software make attacks easier."
            ]
          },
          {
            heading: "Exam Focus",
            points: [
              "Always link the protection method to the threat.",
              "For phishing, user training and careful checking of links are relevant.",
              "For malware, antivirus, updates, backups, and restricted permissions are relevant."
            ]
          }
        ],
        compare: {
          headers: ["Threat", "Meaning", "Possible Protection"],
          rows: [
            ["Phishing", "Fake message to steal information", "Training, checking URLs, spam filters"],
            ["Pharming", "Redirecting to fake websites", "Secure DNS, browser warnings, certificates"],
            ["Malware", "Harmful software", "Antivirus, updates, backups"],
            ["Ransomware", "Locks data until payment is demanded", "Backups, security updates, user training"]
          ]
        },
        image: {
          url: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=900",
          alt: "Cyber security padlock on a digital screen"
        }
      },
      {
        id: "ict-8-protection",
        number: "8.2",
        title: "Protection Methods",
        summary: "Security uses layers: authentication, permissions, encryption, firewalls, updates, and backups.",
        keyPoints: [
          "Authentication checks that a user is who they claim to be.",
          "Access rights limit what users can see, edit, delete, or install.",
          "Firewalls filter traffic entering or leaving a network or device."
        ],
        studyBlocks: [
          {
            heading: "Authentication",
            points: [
              "Strong passwords should be hard to guess and not reused across important accounts.",
              "Two-factor authentication adds another proof, such as a code or authenticator app.",
              "Biometrics use physical features such as fingerprint or face recognition, but can raise privacy concerns."
            ]
          },
          {
            heading: "Backups",
            points: [
              "Backups protect against accidental deletion, hardware failure, ransomware, or disasters.",
              "A good backup plan considers frequency, location, security, and restore testing.",
              "Keeping a backup offline or separate can protect it if the main system is attacked."
            ]
          }
        ]
      },
      {
        id: "ict-8-encryption",
        number: "8.3",
        title: "Encryption",
        summary: "Encryption converts readable data into ciphertext so it cannot be understood without the correct key.",
        keyPoints: [
          "Encryption protects data if it is intercepted or stolen.",
          "Symmetric encryption uses the same key to encrypt and decrypt.",
          "Asymmetric encryption uses a public key and a private key."
        ],
        studyBlocks: [
          {
            heading: "How Asymmetric Encryption Helps",
            points: [
              "The public key can be shared openly and used to encrypt data.",
              "Only the matching private key can decrypt the data.",
              "This is useful for secure communication across public networks."
            ]
          },
          {
            heading: "Limitations",
            points: [
              "Encryption does not stop data being intercepted; it makes intercepted data unreadable.",
              "Lost keys can make data impossible to recover.",
              "Encryption can add processing overhead, especially for large amounts of data."
            ]
          }
        ]
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
      },
      {
        id: "ict-8-q2",
        topic: "Encryption",
        question: "What does encryption do to readable data?",
        options: ["Converts it into unreadable ciphertext", "Deletes every file", "Prints it automatically", "Turns it into hardware"],
        correctIndex: 0,
        feedback: "Correct. Encryption scrambles readable data so it cannot be understood without the key."
      }
    ],
    glossary: [
      { term: "Malware", definition: "Software designed to harm, disrupt, spy, or gain unauthorised access." },
      { term: "Phishing", definition: "A scam message designed to steal information." },
      { term: "Pharming", definition: "Redirecting users to fake websites without obvious warning." },
      { term: "Firewall", definition: "Hardware or software that filters network traffic." },
      { term: "Authentication", definition: "Checking the identity of a user or device." },
      { term: "Encryption", definition: "Scrambling data so it is unreadable without a key." },
      { term: "Backup", definition: "A separate copy of data used for recovery." }
    ]
  },
  {
    id: "communication",
    moduleId: 9,
    moduleTitle: "Audience Awareness and Digital Communication",
    overview: "Study how digital communication should be planned for audience, purpose, clarity, accessibility, and responsible use.",
    lessons: [
      {
        id: "ict-9-audience",
        number: "9.1",
        title: "Audience and Purpose",
        summary: "Good digital communication starts by identifying who the message is for and why it is being created.",
        keyPoints: [
          "Audience affects vocabulary, detail, layout, colour, images, tone, and accessibility choices.",
          "A formal report for adults needs a different style from a poster for young children.",
          "Purpose may be to inform, persuade, instruct, advertise, warn, entertain, or collect information."
        ],
        studyBlocks: [
          {
            heading: "Design Decisions",
            points: [
              "Font size and contrast should support readability.",
              "Images should be relevant and not distract from the message.",
              "Technical language should match the reader's knowledge level."
            ]
          },
          {
            heading: "Strong Answers",
            points: [
              "Name the audience and explain the specific design choice.",
              "Connect the choice to readability, understanding, accessibility, or trust.",
              "Avoid generic statements such as make it nice or use colours."
            ]
          }
        ]
      },
      {
        id: "ict-9-netiquette",
        number: "9.2",
        title: "Netiquette and Responsible Communication",
        summary: "Netiquette means using suitable behaviour when communicating online.",
        keyPoints: [
          "Messages should be polite, clear, relevant, and suitable for the context.",
          "All-caps text can seem like shouting and may be unsuitable in formal messages.",
          "Users should avoid sharing private data, forwarding rumours, or sending harmful content."
        ],
        studyBlocks: [
          {
            heading: "Email and Messaging",
            points: [
              "Use a clear subject line so the purpose is obvious.",
              "Check recipients before sending private or sensitive information.",
              "Use attachments carefully and avoid opening unexpected files."
            ]
          },
          {
            heading: "Online Responsibility",
            points: [
              "Respect copyright and cite sources where required.",
              "Do not post personal information that could put someone at risk.",
              "Report abusive, suspicious, or unsafe behaviour through the correct channel."
            ]
          }
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
      },
      {
        id: "ict-9-q2",
        topic: "Netiquette",
        question: "Why should all-caps text normally be avoided in formal online communication?",
        options: ["It can appear as shouting", "It improves every password", "It creates a database field", "It disables malware"],
        correctIndex: 0,
        feedback: "Correct. All-caps can appear aggressive or unsuitable in formal communication."
      }
    ],
    glossary: [
      { term: "Target audience", definition: "The intended users or readers of a communication." },
      { term: "Purpose", definition: "The reason a communication is created." },
      { term: "Netiquette", definition: "Acceptable behaviour when communicating online." },
      { term: "Accessibility", definition: "Designing so people with different needs can use or understand the content." },
      { term: "Copyright", definition: "Legal protection for original work such as text, images, music, and software." }
    ]
  }
];
