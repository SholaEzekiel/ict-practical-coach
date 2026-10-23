export type IctGlossaryEntry = {
  term: string;
  definition: string;
  topic?: string;
  aliases?: string[];
  sourcePages?: number[];
  alsoStudyIn?: string[];
};

type SourceEntry = IctGlossaryEntry & { moduleId: string };
type Row = [term: string, definition: string, aliases?: string[]];
function entries(page: number | number[], moduleId: string, topic: string, rows: Row[]): SourceEntry[] {
  return rows.map(([term, definition, aliases]) => ({ term, definition, aliases, moduleId, topic, sourcePages: Array.isArray(page) ? page : [page] }));
}

// Reviewed and paraphrased from the user's photographed glossary, not raw OCR.
// Aliases consolidate repeated headings while context keeps different meanings separate.
export const ictCoursebookGlossary: SourceEntry[] = [
  ...entries(565, "input-output", "Input, output and control", [
    ["3D printer", "An output device that builds a physical object by depositing material in successive layers."],
    ["3D scanner", "An input device that captures an object's shape to produce a three-dimensional digital model."],
    ["Actuator", "A component that converts a control signal into a physical action, such as opening a valve."]
  ]),
  ...entries(565, "networks", "Mobile communication", [
    ["3G and 4G", "Generations of mobile-network technology; 4G generally supports faster data transfer than 3G."],
    ["5G", "A later generation of cellular networking designed for higher capacity, faster data and lower latency."]
  ]),
  ...entries(565, "systems-life-cycle", "Testing", [
    ["Abnormal data", "Invalid test input that a system should detect and reject.", ["Invalid data", "Erroneous data"]]
  ]),
  ...entries(565, "application-web-authoring", "Files and accessibility", [
    ["Absolute file path", "A complete location beginning at a drive root or including a full web address."],
    ["Alternative text", "A text description that conveys an image's meaning when it cannot be seen.", ["Alt text"]]
  ]),
  ...entries(565, "application-spreadsheets", "References", [
    ["Absolute reference", "A cell reference whose locked row and column do not change when its formula is copied, such as $B$8."]
  ]),
  ...entries(565, "application-presentations", "Navigation", [
    ["Action buttons", "Clickable slide objects assigned an action such as opening another slide or a web page."]
  ]),
  ...entries(565, "application-word-processing", "Text and layout", [
    ["Alignment", "The positioning of text relative to the left margin, right margin or both.", ["Text alignment"]]
  ]),
  ...entries(565, "computer-systems", "Data representation", [
    ["Analogue", "Data represented by continuously varying quantities rather than separate digital values."]
  ]),
  ...entries(566, "systems-life-cycle", "Analysis and evaluation", [
    ["Analysis", "Investigating a problem and the current system to identify what a replacement must do."],
    ["Appropriateness", "How well a solution matches its intended task, users and circumstances."]
  ]),
  ...entries(566, "application-web-authoring", "Structure and behaviour", [
    ["Anchor", "A named destination within a web page that a hyperlink can jump to."],
    ["HTML attribute", "Extra information placed in an element's opening tag, such as an image's src or alt value.", ["Attributes"]],
    ["Behaviour layer", "The interactive behaviour of a web page, commonly implemented with JavaScript."]
  ]),
  ...entries(566, "application-presentations", "Slides and effects", [
    ["Animation", "An effect applied to an object on a slide, rather than to the change between slides."],
    ["Automated slide numbering", "Slide numbers generated and updated by the presentation software."]
  ]),
  ...entries(566, "safety-security", "Protection and identity", [
    ["Anti-malware software", "Software that detects, blocks or removes malicious programs."],
    ["Antivirus software", "Protection software that detects and deals with computer viruses."],
    ["Asymmetric encryption", "Encryption using a related public/private key pair rather than one shared secret key."],
    ["Authentication", "Checking evidence to establish that a user or device is who it claims to be."],
    ["Biometric data", "Measurements of distinctive physical or behavioural characteristics used to recognise a person."]
  ]),
  ...entries(566, "computer-systems", "Software and processing", [
    ["Application software", "Programs used to perform user tasks, such as preparing documents or calculating budgets.", ["Applications"]],
    ["Arithmetic and logic unit", "The CPU component that performs calculations and logical comparisons.", ["ALU", "Arithmetic logic unit"]],
    ["Automated software tool", "A software feature that performs a task automatically when its conditions are met."]
  ]),
  ...entries(566, "application-spreadsheets", "Formulae and data", [
    ["Arithmetic operator", "A symbol specifying a calculation, such as +, -, * or /."],
    ["Ascending order", "An arrangement from smallest to largest, or from A to Z."],
    ["Axes titles", "Descriptions identifying what the axes of a chart measure or represent."],
    ["Bar chart", "A chart using horizontal bars to compare categories."]
  ]),
  ...entries(566, "applications", "Intelligent and medical systems", [
    ["Artificial intelligence", "Computer systems performing tasks such as recognising patterns, learning or making decisions.", ["AI"]],
    ["Augmented reality", "Digital content overlaid on a user's view of the real environment.", ["AR"]],
    ["Automated number plate recognition", "A system that reads vehicle registration plates from captured images.", ["ANPR", "Automated number plate recognition system"]],
    ["Automated teller machine", "A self-service terminal providing banking services such as cash withdrawals.", ["ATM"]],
    ["Autonomous vehicle", "A vehicle using sensors and control systems to navigate with little or no human driving."],
    ["Bio-ink", "Printable material containing living cells, often with supporting material, used in bioprinting."],
    ["Biomaterials", "Natural or synthetic materials used to support, repair or replace biological tissue."]
  ]),
  ...entries(566, "application-images", "Image properties", [
    ["Aspect ratio", "The proportional relationship between an image's width and height."]
  ]),
  ...entries(566, "application-word-processing", "Editing and automation", [
    ["Autocorrect", "A feature that automatically substitutes a correction for a recognised typing error."],
    ["Automated object", "A document field updated by software, such as the current page number or page count."]
  ]),
  ...entries(566, "communication", "Communication and reliability", [
    ["Audio communication", "Communication using sound, including speech."],
    ["Audio-conference", "A live meeting in which people in different locations communicate by voice."],
    ["Bcc", "An email recipient field that hides those recipients' addresses from other recipients.", ["Blind carbon copy"]],
    ["Bias", "A preference or viewpoint that can make information unbalanced or unfair."]
  ]),
  ...entries(566, "storage", "Secondary storage", [
    ["Backing storage device", "A secondary-storage device that retains data without power; it may be internal or external."]
  ]),
  ...entries(566, "input-output", "Automatic data capture", [
    ["Bar code", "A machine-readable pattern of bars and spaces encoding an identifier.", ["Barcode"]]
  ]),
  ...entries(566, "networks", "Mobile communication", [
    ["Base station", "Radio equipment linking mobile devices in a coverage area to the cellular network."]
  ]),
  ...entries(566, "applications", "Processing methods", [
    ["Batch process", "Processing a collected group of jobs together, without an immediate response for each user."]
  ]),
  ...entries(567, "safety-security", "Identity and authentication", [
    ["Biometric methods", "Identification or authentication techniques based on measurable characteristics such as fingerprints."]
  ]),
  ...entries(567, "applications", "Medical technology", [
    ["Bioprinting", "Using 3D-printing methods with biological material to create tissue-like structures."]
  ]),
  ...entries(567, "computer-systems", "Data and hardware", [
    ["Bit", "A binary digit with one of two possible values: 0 or 1."],
    ["Central processing unit", "The processor that executes program instructions and coordinates processing.", ["CPU", "Processor"]],
    ["Character set", "A defined collection of characters represented by a computer's encoding system."]
  ]),
  ...entries(567, "application-word-processing", "Lists and navigation", [
    ["Blank page", "A document page with no entered text or images.", ["Blank pages"]],
    ["Bookmark (document)", "A named location or selection used to navigate within a document.", ["Bookmark (layout)"]],
    ["Bullet list", "A list whose items begin with symbols rather than sequence numbers.", ["Bullets"]]
  ]),
  ...entries(567, "communication", "Online communication", [
    ["Blog", "A website containing regularly published posts, often presenting opinions or experiences."],
    ["Browser", "Application software that retrieves and displays web content.", ["Web browser"]],
    ["Cc", "An email recipient field used to send visible copies to additional recipients.", ["Carbon copy"]]
  ]),
  ...entries(567, "networks", "Wireless and network devices", [
    ["Bluetooth", "Short-range wireless communication commonly used to connect nearby devices."],
    ["Bridge", "A network device joining segments of a local network and filtering traffic between them."],
    ["Cell (mobile network)", "The geographical coverage area served by a cellular base station."],
    ["Cellular network", "A mobile radio network divided into coverage areas served by base stations."]
  ]),
  ...entries(567, "storage", "Optical media", [
    ["Blu-ray disc", "An optical disc format offering greater typical capacity than DVD."],
    ["CD-ROM and DVD-ROM", "Optical discs supplied with data that users can read but cannot rewrite.", ["CD-ROMs and DVD-ROMs"]],
    ["CD-R and DVD-R", "Recordable optical discs on which data can be written once.", ["CD-Rs and DVD-Rs"]],
    ["CD-RW and DVD-RW", "Rewritable optical discs that can be erased and recorded again.", ["CD-RWs and DVD-RWs"]]
  ]),
  ...entries(567, "application-web-authoring", "HTML structure", [
    ["Body", "The HTML element containing the page content presented to users."],
    ["Bookmark (web authoring)", "A named anchor identifying a destination within a web page."]
  ]),
  ...entries(567, "application-databases", "Fields and forms", [
    ["Boolean", "A data type representing one of two logical states, such as true or false."],
    ["Calculated field", "A field whose value is computed from other fields or expressions."],
    ["Check box", "A form control used to turn an independent option on or off."]
  ]),
  ...entries(567, "systems-life-cycle", "Design and validation", [
    ["Bottom-up design", "Designing small components first and combining them into larger subsystems."],
    ["Character check", "A validation check restricting input to an allowed set of characters."],
    ["Check digit", "A digit calculated from other digits in an identifier to help detect entry errors."]
  ]),
  ...entries(567, "application-images", "Image properties", [
    ["Brightness", "The overall lightness or darkness of an image."]
  ]),
  ...entries(567, "input-output", "Touch and payment devices", [
    ["Capacitive touch screen", "A touch screen that detects changes in an electrical field caused by a finger."],
    ["Chip and PIN reader", "A device that reads a payment card's chip and allows the holder to enter a PIN."]
  ]),
  ...entries(567, "applications", "Electronic payments", [
    ["Card verification value", "A card security code requested for some card-not-present payments.", ["CVV"]],
    ["Cheque", "A written instruction directing a bank to pay a stated amount to a named recipient."]
  ]),
  ...entries(567, "application-presentations", "Slide delivery", [
    ["Carousel", "A slide-show mode that repeatedly cycles through slides until stopped."]
  ]),
  ...entries(567, "application-spreadsheets", "Cells and charts", [
    ["Category axis", "The chart axis showing the categories being compared."],
    ["Category axis labels", "The individual category names shown along a chart's category axis."],
    ["Category axis title", "A heading describing the categories shown on a chart axis."],
    ["Cell", "One worksheet box at the intersection of a row and a column.", ["Cells", "Cell (spreadsheet)"]],
    ["Cell reference", "A worksheet address formed from a column letter and row number, such as D4.", ["Cell references"]],
    ["Chart", "A graphical representation of data that makes comparisons or patterns easier to see.", ["Charts"]],
    ["Chart title", "A heading stating the subject of a chart."]
  ]),
  ...entries(568, "safety-security", "Encryption", [
    ["Cipher", "A method or algorithm for transforming readable data into an encrypted form."],
    ["Ciphertext", "The unreadable output produced by an encryption process."]
  ]),
  ...entries(568, "computer-systems", "Hardware and software", [
    ["Circuit board", "A rigid board carrying electronic components and conducting paths."],
    ["Clock", "A circuit supplying timing pulses that coordinate processor operations."],
    ["Command line interface", "An interface in which users enter text commands.", ["CLI"]],
    ["Compiler", "Software translating a high-level program into another form, commonly machine code.", ["Compilers"]],
    ["Component", "An individual part of a larger computer system.", ["Components"]],
    ["Computer", "A programmable device that accepts input, processes data and produces output."],
    ["Computer system", "Hardware, software and associated devices working together to perform tasks."]
  ]),
  ...entries([568, 577], "computer-systems", "Software and processing", [
    ["Code", "Instructions or markup written using the syntax of a computer language.", ["Program code"]]
  ]),
  ...entries(568, "application-web-authoring", "CSS and structure", [
    ["Class", "A reusable HTML label selected in CSS with a dot to apply shared styling."],
    ["Content layer", "The page's meaningful structure and content, normally expressed using HTML."]
  ]),
  ...entries(568, "application-images", "Files and appearance", [
    ["Cloning", "Copying a sampled area of an image onto another area."],
    ["Colour depth", "The number of bits used to represent each pixel's colour.", ["Image colour depth"]],
    ["Compressed", "Stored using an encoding that reduces the space required."],
    ["Compression algorithm", "A method for encoding data in a smaller representation."],
    ["Contrast", "The difference between lighter and darker areas in an image."]
  ]),
  ...entries(568, "networks", "Online services", [
    ["Cloud computing", "Using computing services delivered over a network, typically the internet."]
  ]),
  ...entries(568, "storage", "Remote and optical storage", [
    ["Cloud storage", "Keeping files on remote servers accessed through a network."],
    ["Compact disc", "An optical disc read using a laser, commonly used for audio or computer data.", ["CD", "Compact disk"]]
  ]),
  ...entries(568, "application-word-processing", "Page design", [
    ["Column break", "A deliberate break that moves following text into the next text column."],
    ["Columns (layout)", "Vertical areas into which page text is arranged."],
    ["Consistent character spacing", "Using matching character-spacing settings for equivalent text."],
    ["Consistent layout", "Repeating the placement of equivalent page elements across documents."],
    ["Consistent style", "Using the same visual conventions for equivalent content across documents."]
  ]),
  ...entries(568, "application-spreadsheets", "Tables and charts", [
    ["Column chart", "A chart using vertical columns to compare categories."],
    ["Column", "A vertical sequence of worksheet cells identified by a letter.", ["Columns (spreadsheets)"]],
    ["Column width", "The horizontal space assigned to a worksheet column."],
    ["Comma-separated values", "A plain-text format storing table rows with values separated by commas.", ["CSV"]],
    ["Conditional formatting", "Formatting applied automatically when a cell meets a rule."],
    ["Contiguous data", "Data occupying adjacent worksheet cells that can be selected as one block."]
  ]),
  ...entries(568, "application-databases", "Keys and form controls", [
    ["Columnar form", "A form layout presenting the fields of one record at a time."],
    ["Combo box", "A form control presenting a drop-down choice list, sometimes also allowing typed input."],
    ["Command button", "A control that runs an assigned action when activated."],
    ["Compound key", "A key made from two or more fields whose combined values identify a record."],
    ["Control", "A form or report object used to display data, accept input or initiate an action."]
  ]),
  ...entries(568, "applications", "Design, learning and payments", [
    ["Computer-aided design", "Software used to create, modify and analyse designs.", ["CAD"]],
    ["Computer-aided learning", "Using computer systems to support teaching and learning.", ["CAL"]],
    ["Computer modelling", "Representing a real system with a computer model to explore how it behaves."],
    ["Computer-generated environment", "A simulated setting created by computer graphics."],
    ["Contactless payment", "A payment made by bringing a compatible card or device near a payment terminal."]
  ]),
  ...entries(568, "input-output", "Control systems", [
    ["Control signals", "Signals instructing equipment or actuators how to operate."]
  ]),
  ...entries(569, "computer-systems", "Processing and data", [
    ["Control unit", "The CPU component coordinating instruction execution and data movement."],
    ["Data", "Raw facts or values that can be processed to produce information."],
    ["Default setting", "The setting used automatically unless a user changes it."],
    ["Desktop computer", "A general-purpose computer designed mainly for use at a fixed desk."]
  ]),
  ...entries(569, "application-word-processing", "Editing and house style", [
    ["Copy", "Place a duplicate of selected content on the clipboard without removing the original."],
    ["Corporate house style", "An organisation's agreed rules for the appearance of its documents."],
    ["Cut", "Move selected content to the clipboard, removing it from its original position."],
    ["Delete", "Remove selected content without needing to place it on the clipboard."]
  ]),
  ...entries(569, "communication", "Audience and responsibility", [
    ["Copyright", "Rights controlling how a creator's original work may be copied, distributed or adapted."],
    ["Copyright acts", "Laws establishing and protecting rights in original creative work."],
    ["Corporate branding", "A consistent identity helping audiences recognise an organisation."],
    ["Criminal material", "Digital content whose possession, creation or distribution is unlawful in the relevant jurisdiction."]
  ]),
  ...entries(569, "safety-security", "Personal data and protection", [
    ["Credentials", "Evidence used to establish access rights, such as a username and password."],
    ["Credit card fraud", "Unauthorised use of payment-card information to obtain money or goods."],
    ["Data subject", "The individual to whom personal data relates."],
    ["Decryption", "Recovering readable data from encrypted data using the appropriate method and key.", ["Decrypt"]]
  ]),
  ...entries(569, "applications", "Banking and medicine", [
    ["Credit card", "A payment card allowing purchases using money borrowed from its issuer."],
    ["Customised medicine", "Treatment or medication tailored to an individual patient's needs.", ["Personalised medicine"]],
    ["Debit card", "A payment card used to take money directly from the holder's bank account."]
  ]),
  ...entries(569, "application-databases", "Data organisation", [
    ["Criterion", "A condition a record must satisfy to be included in a query result.", ["Criteria"]],
    ["Data entry form", "An interface for entering or editing data stored in a table."],
    ["Data integrity", "The accuracy and consistency of stored data."],
    ["Data redundancy", "Unnecessary repetition of the same stored facts."],
    ["Data structure", "An organised arrangement used to store and manage data.", ["File/data structures"]],
    ["Data type", "A classification determining the kind of value a field can hold."],
    ["Database", "An organised collection of related data that can be searched and updated."],
    ["Database query", "A request to retrieve or process data matching specified conditions.", ["Database queries", "Query"]],
    ["Date/time", "A data type storing calendar dates, times or both."]
  ]),
  ...entries(569, "application-images", "Editing", [
    ["Cropping", "Removing unwanted outer portions of an image without scaling the remaining content."]
  ]),
  ...entries(569, "input-output", "Displays", [
    ["CRT monitor", "An older display using a cathode-ray tube to form its picture."]
  ]),
  ...entries(569, "application-web-authoring", "Style rules", [
    ["Cascading Style Sheets", "A language defining the presentation of HTML content, including layout, colours and typography.", ["CSS"]]
  ]),
  ...entries(569, "application-spreadsheets", "Models and chart annotation", [
    ["Currency", "A number format displaying monetary values with an appropriate currency symbol."],
    ["Data label", "Text attached to a chart item to identify it or describe its value."],
    ["Data model", "A representation of relationships and rules used to explore a system's behaviour."],
    ["Data value labels", "Chart labels displaying the numeric values represented by individual data points."],
    ["Descending order", "An arrangement from largest to smallest, or from Z to A."]
  ]),
  ...entries(569, "application-presentations", "Delivery", [
    ["Custom show", "A selected sequence of slides adapted from a larger presentation for a particular audience."]
  ]),
  ...entries(569, "systems-life-cycle", "Capture and design", [
    ["Data capture form", "A structured document or screen used to collect data for later processing."],
    ["Design", "Planning the data, interfaces, processing and resources needed for a proposed system."],
    ["Design wizard", "A guided tool that asks questions to help create an object such as a form or report."]
  ]),
  ...entries(569, "networks", "Data transmission", [
    ["Data packet", "A unit of transmitted data containing a portion of a message and delivery information."]
  ]),
  ...entries(570, "computer-systems", "Software and files", [
    ["Device driver", "Software enabling the operating system to communicate with a particular hardware device.", ["Device drivers"]],
    ["Dialogue-based interface", "An interface allowing users to interact with a system through spoken language."],
    ["Digital", "Data represented using discrete values, typically encoded as binary digits."],
    ["Documents", "Digital files containing organised information, such as text, tables, slides or reports."],
    ["Drive", "A storage device or logical storage location identified by the operating system."],
    ["Drop-down menu", "A list of commands or choices revealed when its control is activated."],
    ["Dynamic", "Changing in response to data, events or other conditions."],
    ["Ease of use", "How readily a user can learn and operate a system to complete a task."],
    ["Efficiency", "How effectively a task uses resources such as time, processing or user effort."]
  ]),
  ...entries(570, "input-output", "Capture and conversion", [
    ["Digital camera", "A device capturing photographs as digital image files."],
    ["Digital-to-analogue converter", "A component converting digital values into a continuously varying analogue signal.", ["DAC"]],
    ["Dot matrix printer", "An impact printer whose pins strike an inked ribbon to create patterns of dots."],
    ["Driving wheel", "A steering-wheel input device used in driving games or simulations.", ["Racing wheel"]]
  ]),
  ...entries(570, "safety-security", "Certificates and protection", [
    ["Digital certificate", "An electronically signed document linking an identity or domain to a public key; it does not guarantee a site's honesty."],
    ["Dongle", "A small plug-in device, sometimes used to enable licensed software or connectivity."],
    ["Electrical overload", "A circuit carrying more current than it can safely handle."],
    ["Encryption", "Transforming readable data into a form that requires an appropriate key to recover.", ["Encrypted"]]
  ]),
  ...entries(570, "storage", "Optical discs", [
    ["Digital versatile disc", "An optical storage medium with greater typical capacity than a CD.", ["DVD", "Digital versatile disk"]]
  ]),
  ...entries(570, "systems-life-cycle", "Implementation and documentation", [
    ["Direct changeover", "Replacing the old system with the new one at a chosen point without a period of parallel use."],
    ["Documentation", "Written or digital information describing a system and how to use or maintain it."]
  ]),
  ...entries(570, "application-web-authoring", "Addresses", [
    ["Domain name", "A human-readable name resolved through DNS to locate internet services."]
  ]),
  ...entries(570, "application-word-processing", "Editing and document objects", [
    ["Dragging", "Moving an object or selection while holding down a pointing-device button."],
    ["Duplicate", "Create another copy of an object or file."],
    ["Embedded object", "Content stored inside a destination document rather than updated from an external source."]
  ]),
  ...entries(570, "systems-life-cycle", "Verification", [
    ["Double data entry", "Entering data twice and comparing the two versions to find transcription differences."]
  ]),
  ...entries(570, "application-presentations", "Effects", [
    ["Effect options", "Settings controlling an effect's behaviour, such as its direction, duration or sequence."]
  ]),
  ...entries(570, "applications", "Electronic services", [
    ["Electronic control unit", "An embedded controller managing electronic functions in a vehicle.", ["ECU"]],
    ["Electronic funds transfer", "Moving money electronically between accounts.", ["EFT", "Electronic fund transfer", "Money transfer"]],
    ["Electronic funds transfer at point of sale", "A checkout system that electronically transfers payment when a customer pays by card.", ["EFTPOS", "Electronic fund transfers point of sale"]],
    ["Electronic tokens", "Digital units used to represent value or rights; some are used in cryptocurrency systems."],
    ["E-publications", "Publications distributed in digital form, such as electronic books or magazines."]
  ]),
  ...entries(570, "communication", "Email and meetings", [
    ["Electronic-conference", "A meeting connecting people in different locations using communication technology."],
    ["Email", "Electronic messages sent between users through networked mail services."],
    ["Email attachment", "A file sent with an email message."],
    ["Email group", "A saved collection of recipients used to address messages to several people together."]
  ]),
  ...entries(567, "safety-security", "Certificates and authentication", [
    ["Certificate authority", "An organisation trusted to issue and digitally sign certificates.", ["CA", "Certificate authorities"]],
    ["Challenge-response check", "An authentication process in which a system requests evidence that the user can provide."]
  ]),
  ...entries(570, "application-databases", "Data modelling", [
    ["Entity", "A person, object, event or concept about which a database stores information."]
  ]),
  ...entries(571, "computer-systems", "Files and folders", [
    ["E-reader", "A portable device designed primarily for reading digital publications.", ["E-readers"]],
    ["Export", "Save or convert content into a format suitable for use outside the current application."],
    ["File allocation table", "A file-system structure tracking where file data is stored on a disk.", ["FAT"]],
    ["File extension", "A filename suffix commonly indicating the format or associated application."],
    ["File format", "The rules used to organise and encode the contents of a file."],
    ["File name", "The name identifying a file within its containing folder."],
    ["Folder hierarchy", "A parent-and-child arrangement of folders used to organise files."]
  ]),
  ...entries(571, "safety-security", "Safe use and protection", [
    ["E-safety", "Using digital technologies in ways that protect people from online risks.", ["eSafety"]],
    ["Firewall", "Hardware or software filtering network traffic according to security rules."]
  ]),
  ...entries(571, "applications", "Expert and simulated systems", [
    ["Expert system", "A system using stored knowledge and rules to offer advice in a specialist domain."],
    ["Explanation system", "The part of an expert system that explains how it reached its conclusion."],
    ["Extended reality", "An umbrella term covering virtual, augmented and mixed-reality experiences.", ["XR"]]
  ]),
  ...entries(571, "application-databases", "Fields, keys and calculations", [
    ["Expression", "A combination of values, field references and operators evaluated to produce a result."],
    ["Field", "A named item of information stored for each record."],
    ["Field name", "A label identifying a field or database-table column."],
    ["Flat-file database", "A database storing its records in a single table."],
    ["Foreign key", "A field linking a record to a key value in another table."]
  ]),
  ...entries(571, "application-web-authoring", "Stylesheets and transfer", [
    ["External stylesheet", "A separate CSS file linked to one or more web pages."],
    ["File Transfer Protocol", "A protocol for transferring files; standard FTP does not itself encrypt the connection.", ["FTP"]]
  ]),
  ...entries(571, "networks", "Network access", [
    ["Extranet", "Controlled access to part of an organisation's private network for authorised external users."]
  ]),
  ...entries(571, "systems-life-cycle", "Testing and validation", [
    ["Extreme data", "Valid test values at the permitted boundaries, such as the minimum and maximum.", ["Boundary data"]],
    ["Final testing", "Testing the completed system as a whole before acceptance or release.", ["Terminal testing"]],
    ["Format check", "A validation rule testing whether input follows a required pattern."]
  ]),
  ...entries(571, "application-spreadsheets", "Formatting and calculations", [
    ["Fill", "A background colour or shading applied inside a cell or object."],
    ["Filtering", "Displaying only data that satisfies chosen conditions without deleting the other records."],
    ["Formula", "A calculation entered in a spreadsheet, normally starting with = and using values, references or functions.", ["Formulae", "Mathematical formula"]]
  ]),
  ...entries(571, "communication", "Searching and discussion", [
    ["Search filters", "Options restricting search results by properties such as type or date.", ["Filters"]],
    ["Forum", "An online discussion space containing posts and replies organised by topic."],
    ["Forwarding", "Sending a received email on to another recipient."]
  ]),
  ...entries(571, "application-word-processing", "Typography and editing", [
    ["Find", "Locate occurrences of specified text in a document."],
    ["Find and replace", "Locate specified text and substitute different text."],
    ["Font face", "A specific typeface or styled variation used to display text."],
    ["Font family", "A related collection of typefaces sharing a common design."],
    ["Font type", "A broad typeface category such as serif, sans-serif or script."],
    ["Footer", "An area near the bottom of a page used for recurring information."]
  ]),
  ...entries(571, "storage", "Magnetic and flash storage", [
    ["Fixed hard disk drive", "A magnetic storage drive installed inside a computer.", ["Fixed hard disk drives"]],
    ["Flash memory", "Non-volatile electronic memory that can be erased and rewritten."],
    ["Flash memory card", "A compact removable flash-storage medium used in devices such as cameras.", ["Flash memory cards", "Memory card"]],
    ["Floating-gate transistor", "An electronic component that can retain charge to represent stored data without continuous power.", ["Floating gate transistors"]]
  ]),
  ...entries(572, "application-presentations", "Output and objects", [
    ["Full-page slides", "A print layout placing one slide on each printed page."],
    ["Handout", "A printed or exported arrangement of slides intended for the audience.", ["Handouts"]],
    ["Group", "Combine selected objects so they can be moved or manipulated together."]
  ]),
  ...entries(572, "application-databases", "Database functions", [
    ["Function (database)", "A reusable operation used to calculate a value or perform a database-related task."]
  ]),
  ...entries(572, "application-spreadsheets", "Functions and charts", [
    ["Function", "A predefined calculation used in formulae, such as SUM or AVERAGE.", ["Function (spreadsheet)"]],
    ["Graph", "A chart showing relationships or patterns between values.", ["Graphs"]],
    ["Gridlines", "Lines marking worksheet-cell boundaries or helping readers read values across a chart."],
    ["Horizontal", "Extending from side to side rather than from top to bottom."]
  ]),
  ...entries(572, "computer-systems", "Interfaces, software and hardware", [
    ["Function (program)", "A named reusable section of code called to perform a task or return a value.", ["Functions (programs)"]],
    ["Generic file type", "A widely supported format usable across different applications or operating systems."],
    ["Gesture-based interface", "An interface controlled by recognised movements of a user's body."],
    ["Graphical user interface", "An interface using visible controls such as windows, icons, menus and pointers.", ["GUI"]],
    ["Graphics card", "Hardware that processes graphics and prepares images for display."],
    ["Hardware", "The physical components of a computer system."]
  ]),
  ...entries(572, "applications", "Geographical information", [
    ["Geographic information system", "A system for storing, analysing and displaying information linked to geographical locations.", ["GIS", "Geographic information systems"]],
    ["Global positioning system", "A satellite-based system for determining a receiver's position.", ["GPS", "Global positioning systems"]],
    ["Hazard map", "A map showing places exposed to specified risks, such as flooding."]
  ]),
  ...entries(572, "application-word-processing", "Proofing and layout", [
    ["Grammar check", "A tool suggesting corrections to sentence structure or word use; its suggestions still need review.", ["Grammar check tool"]],
    ["Gutter margin", "Extra space reserved for binding so text is not hidden by the binding.", ["Gutter margins"]],
    ["Hanging paragraph", "A paragraph whose later lines are indented farther than its first line."],
    ["Hard page break", "A page break inserted deliberately by the user."],
    ["Hard copy", "A physical printed version of digital content.", ["Hard-copy"]],
    ["Header", "An area near the top of a page used for recurring information."],
    ["Highlight", "Select text for an editing action, or apply a contrasting background to emphasise it."],
    ["Homophone", "A word sounding like another word but differing in spelling or meaning."]
  ]),
  ...entries(572, "input-output", "Pointing and audio devices", [
    ["Graphics tablet", "An input surface used with a stylus to enter drawing or pointing information."],
    ["Headphones", "Audio output worn over or in the ears for personal listening."]
  ]),
  ...entries(572, "communication", "Rules and guidance", [
    ["Guidelines", "Recommendations or rules guiding how a task or activity should be carried out."]
  ]),
  ...entries(572, "safety-security", "Unauthorised access", [
    ["Hacker", "In this security context, a person attempting unauthorised access to a system."],
    ["Hacking", "Attempting to gain access to a computer or data without permission.", ["Hack"]]
  ]),
  ...entries(572, "storage", "Magnetic drives", [
    ["Hard disk drive", "A non-volatile storage device using magnetised rotating disks.", ["HDD"]]
  ]),
  ...entries(572, "networks", "Mobile and local networks", [
    ["Handover", "Transferring an active mobile connection between base stations as coverage changes."],
    ["Hub", "A device that repeats received network traffic to its other ports rather than selecting one destination."]
  ]),
  ...entries(572, "application-web-authoring", "HTML, styling and publishing", [
    ["Head", "The HTML element containing page metadata and links to resources such as stylesheets."],
    ["Hex code", "A hexadecimal notation commonly used for web colours, such as #FF0000 for red.", ["Hex codes"]],
    ["Hosting", "Providing server resources that make a website available over a network."],
    ["HTTPS", "HTTP protected by TLS to encrypt data in transit and authenticate the server connection."],
    ["Hyperlink", "A selectable link to another resource or a location within a document or page."]
  ]),
  ...entries([572, 573], "application-web-authoring", "HTML, styling and publishing", [
    ["HyperText Markup Language", "The markup language defining the structure and meaning of web-page content.", ["HTML"]]
  ]),
  ...entries(573, "application-web-authoring", "HTML, styling and publishing", [
    ["HyperText Transfer Protocol", "A request-and-response protocol used to exchange web resources, not a page-formatting language.", ["HTTP"]]
  ]),
  ...entries(572, "computer-systems", "File organisation", [
    ["Hierarchical structure", "An organisation of items into parent-and-child levels, such as folders and subfolders."]
  ]),
  ...entries(573, "safety-security", "Privacy and identity", [
    ["Identity theft", "Using another person's stolen personal details to impersonate them."],
    ["Information assets", "Data or information valuable enough to require protection from loss, theft or damage."],
    ["Inherence factor", "Authentication evidence based on a person's characteristics, such as a fingerprint."],
    ["International data protection legislation", "Rules governing the lawful handling of personal data across relevant jurisdictions."],
    ["Key (encryption)", "A value used by an encryption algorithm to encrypt, decrypt or authenticate data.", ["Key"]],
    ["Key logger", "Software or hardware recording keystrokes, potentially to steal confidential information.", ["Keystroke logger"]],
    ["Knowledge factor", "Authentication evidence based on something a person knows, such as a password."]
  ]),
  ...entries(573, "application-images", "Resolution", [
    ["Image resolution", "The amount of image detail, described by pixel dimensions or by pixels per unit length at a stated output size."]
  ]),
  ...entries(573, "systems-life-cycle", "Investigation and implementation", [
    ["Implementation", "Putting a developed system into operational use."],
    ["Input format", "The planned structure or representation of data entered into a system."],
    ["Interview", "Gathering information by asking a person questions directly."]
  ]),
  ...entries(573, "computer-systems", "Files, data and portable systems", [
    ["Import", "Bring data or content from another file or format into an application."],
    ["Information", "Data given context or processed so that it has meaning."],
    ["Internal memory", "Memory directly available to the processor for instructions or working data."],
    ["Keyword", "A word with a special defined role in a computer language.", ["Key word"]],
    ["Laptop computer", "A portable general-purpose computer with an integrated screen, keyboard and battery."]
  ]),
  ...entries(573, "communication", "Audience and ownership", [
    ["Inappropriate material", "Content unsuitable for its audience or the setting in which it is accessed."],
    ["Intellectual property", "Creative work, inventions or designs over which people or organisations have rights."]
  ]),
  ...entries(573, "application-word-processing", "Paragraphs and objects", [
    ["Indentation", "The distance between a paragraph's text and its normal margin position."],
    ["Indented paragraph", "A paragraph with a first line or whole text block moved inward from the margin."],
    ["Insert", "Add content at a chosen position without necessarily replacing existing content."],
    ["Landscape", "Page orientation in which the page is wider than it is tall."]
  ]),
  ...entries(573, "applications", "Expert systems and services", [
    ["Inference engine", "The part of an expert system that applies rules to known facts to reach conclusions."],
    ["Intelligent transport system", "Connected sensing and control technologies used to manage transport more effectively."],
    ["Internet banking", "Accessing banking services and transactions through an internet connection."],
    ["Internet of things", "Network-connected physical objects that collect, exchange or act on data.", ["IoT"]],
    ["Knowledge base", "Stored specialist facts used by an expert system."]
  ]),
  ...entries(573, "input-output", "Data entry and printing", [
    ["Inkjet printer", "An output device producing print by spraying tiny drops of ink onto a surface."],
    ["Input device", "Hardware used to send data or instructions into a computer."],
    ["Joystick", "A lever-based input device used to control direction or movement."],
    ["Keyboard", "An input device using keys to enter characters and commands."]
  ]),
  ...entries(573, "application-web-authoring", "Inline styling", [
    ["Inline style", "CSS declarations placed in an HTML element's style attribute.", ["Inline"]]
  ]),
  ...entries(573, "application-databases", "Types and keys", [
    ["Input mask", "A pattern controlling the permitted positions or characters when entering data."],
    ["Integer", "A whole-number data type without a fractional part."],
    ["Key field", "A field used to identify or locate records, usually uniquely in the case of a primary key."]
  ]),
  ...entries(573, "networks", "Internet addressing and access", [
    ["Internet", "The global interconnection of networks supporting services including the web and email."],
    ["Internet Protocol", "Rules for addressing and routing packets between networks.", ["IP"]],
    ["Internet service provider", "An organisation supplying customers with internet connectivity.", ["ISP"]],
    ["Intranet", "A private network or set of web resources accessible to an organisation's authorised users."],
    ["IP address", "A numerical network address used to identify an interface for packet delivery."]
  ]),
  ...entries(574, "input-output", "Printers, pens and sensors", [
    ["Laser printer", "A printer using an electrostatic image, toner and heat to produce printed output."],
    ["Light pen", "A light-sensitive pointing device historically used with compatible CRT displays."],
    ["Light sensor", "An input device measuring the intensity of light."],
    ["Magnetic stripe reader", "A device reading information encoded on a card's magnetic stripe."]
  ]),
  ...entries(574, "application-images", "Layers and compression", [
    ["Layer (image)", "A separate level of image content that can be edited or stacked independently.", ["Layer (images)"]],
    ["Lossless compression", "Reducing file size in a way that allows the original data to be recovered exactly."],
    ["Lossy compression", "Reducing file size by discarding some information, so the original cannot be recovered exactly."]
  ]),
  ...entries(574, "application-web-authoring", "Layers and local resources", [
    ["Layer (web authoring)", "A conceptual division of web design into content, presentation and behaviour."],
    ["Local web page", "A page stored locally, for example alongside the page currently being edited.", ["Local web pages"]]
  ]),
  ...entries(574, "application-word-processing", "Layout and linked content", [
    ["Layout", "The placement and arrangement of text, images and other elements on a page or screen."],
    ["Line spacing", "The vertical distance between successive lines of text."],
    ["Linked object", "Content connected to an external source so it can reflect changes to that source."],
    ["Margins", "Blank areas between page edges and the main content."],
    ["Master page", "A reusable page design supplying shared layout elements to other pages."]
  ]),
  ...entries(574, "application-presentations", "Master layouts", [
    ["Layout master", "A reusable slide layout controlling the placement of placeholders and other elements."],
    ["Master slide", "A template controlling shared slide formatting and design features."]
  ]),
  ...entries(574, "application-spreadsheets", "Chart keys and functions", [
    ["Legend", "A chart key explaining which colours or symbols represent each data series."],
    ["Line graph", "A chart connecting plotted values with lines, often used to show change over time."],
    ["Maximum value", "The largest value in a data set."]
  ]),
  ...entries(574, "communication", "Law and streamed media", [
    ["Legislation", "Laws governing an activity or subject; applicable rules depend on jurisdiction."],
    ["Live streaming", "Transmitting media as an event takes place so viewers can receive it with a short delay."],
    ["Media streaming", "Delivering audio or video progressively so playback can begin before the whole file arrives."]
  ]),
  ...entries(574, "systems-life-cycle", "Evaluation and operational systems", [
    ["Length check", "A validation rule checking the number of characters in an input."],
    ["Limitations", "Restrictions or shortcomings affecting what a system can do."],
    ["Live data", "Real operational data, rather than data invented solely for a test."],
    ["Live system", "A system being used for its real operational purpose."]
  ]),
  ...entries(574, "computer-systems", "Software development and licensing", [
    ["Licence key", "A code used to activate or validate access to licensed software."],
    ["Linker", "Software combining compiled program parts and required libraries into an executable form.", ["Linkers"]]
  ]),
  ...entries(574, "networks", "Local networks and addresses", [
    ["Local area network", "A network covering a limited site, such as a school or office.", ["LAN"]],
    ["Media access control address", "A link-layer identifier assigned to a network interface; it can be changed or spoofed in some circumstances.", ["MAC address"]]
  ]),
  ...entries(574, "application-databases", "Logical criteria", [
    ["Logical operator", "An operator such as AND, OR or NOT used to combine or negate conditions."]
  ]),
  ...entries(574, "applications", "Machine learning", [
    ["Machine learning", "Methods enabling computer systems to improve pattern-based performance from training data."]
  ]),
  ...entries(574, "storage", "Magnetic recording", [
    ["Magnetic polarity", "The orientation of magnetisation that can be used to encode data."],
    ["Magnetic storage media", "Media storing data using magnetised regions."],
    ["Magnetic tape", "A long magnetic recording strip commonly used for backups and archives."],
    ["Magnetic tape drive", "A device that reads and writes data on magnetic tape."]
  ]),
  ...entries(574, "safety-security", "Malware and biometrics", [
    ["Malware", "Software deliberately designed to damage, disrupt, spy on or gain unauthorised access to systems."],
    ["Match points", "Selected biometric features compared with a stored template when identifying a person."]
  ]),
  ...entries(575, "storage", "Portable memory", [
    ["Memory stick", "A portable flash-storage device that usually connects through USB.", ["Memory sticks", "USB flash drive", "Pen drive"]]
  ]),
  ...entries(575, "application-spreadsheets", "Cells, functions and chart data", [
    ["Merge cells", "Combine adjacent cells into one larger cell.", ["Merge", "Merged cells"]],
    ["Minimum value", "The smallest value in a data set."],
    ["Named range", "A meaningful name assigned to a cell or range for use in formulae.", ["Named cell or named range"]],
    ["Nested function", "A function used as an argument within another function."],
    ["Non-contiguous data", "Data in separate worksheet locations rather than one adjoining block."]
  ]),
  ...entries(575, "application-web-authoring", "Metadata and navigation", [
    ["Metadata", "Information describing a document, such as its title, author or character encoding."],
    ["Navigation", "Moving between pages, sections or resources using controls such as links."]
  ]),
  ...entries(575, "input-output", "Input and output hardware", [
    ["Microphone", "An input device converting sound into an electrical signal."],
    ["Monitor", "An output device displaying information visually."],
    ["Mouse", "A pointing device controlling an on-screen pointer and allowing selection."],
    ["Multimedia projector", "An output device displaying computer images on a larger surface."],
    ["Numeric keypad", "A compact group of keys designed for entering digits and numerical commands."],
    ["Optical character recognition", "Software converting images of printed or written characters into editable text.", ["OCR"]],
    ["Optical mark recognition", "Detecting the positions of marks on forms, rather than recognising written characters.", ["OMR"]]
  ]),
  ...entries(575, "computer-systems", "Hardware and modular software", [
    ["Microprocessor", "An integrated circuit carrying out processing and control instructions."],
    ["Module", "A component of a program designed to perform a defined part of its work.", ["Modules"]],
    ["Motherboard", "The main circuit board connecting a computer's processor, memory and other components."],
    ["Non-volatile", "Retaining stored data when power is removed."]
  ]),
  ...entries(575, "applications", "Modelling", [
    ["Modelling software", "Programs for constructing and exploring representations of real or proposed systems."]
  ]),
  ...entries(575, "safety-security", "Authentication", [
    ["Multi-factor authentication", "Using evidence from more than one factor category to verify identity.", ["MFA"]]
  ]),
  ...entries(575, "application-presentations", "Multimedia", [
    ["Multimedia", "A combination of media forms, such as text, images, audio and video."],
    ["Multimedia presentation", "A slide-based communication using several media types."],
    ["On mouse click", "An event setting that starts an action when a mouse button is pressed."]
  ]),
  ...entries(575, "application-databases", "Forms and relationships", [
    ["Navigation controls", "Controls used to move between records, forms or application screens."],
    ["Numeric", "A data type storing numbers that may be used in calculations."],
    ["One-to-many relationship", "A relationship in which one record can be linked to several records in another table."]
  ]),
  ...entries(575, "networks", "Connections and traffic", [
    ["Near field communication", "Very-short-range wireless communication used for tasks such as contactless identification or payment.", ["NFC"]],
    ["Network", "Connected devices that can exchange data or share resources."],
    ["Network interface card", "Hardware providing a device with a network connection.", ["NIC"]],
    ["Network switch", "A device forwarding local-network frames towards the intended destination port.", ["Switch"]],
    ["Network traffic", "The flow or quantity of data being carried by a network."]
  ]),
  ...entries(575, "communication", "Online conduct and publications", [
    ["Netiquette", "Conventions for considerate and appropriate online communication."],
    ["Newsletter", "A publication issued periodically to inform a particular audience."]
  ]),
  ...entries(575, "systems-life-cycle", "Investigation and test data", [
    ["Normal data", "Valid test input representative of typical intended use."],
    ["Observation", "Studying how people carry out a task to understand the current system."]
  ]),
  ...entries(575, "application-word-processing", "Lists", [
    ["Numbered list", "A list whose items are identified with sequence numbers or letters."]
  ]),
  ...entries(576, "applications", "Online services and medical records", [
    ["Online booking system", "A networked system for checking availability and reserving services or places.", ["Online booking systems"]],
    ["Patient record system", "A system holding information about patients, consultations and treatment."],
    ["Personal financial model", "A computer model used to plan an individual's income, spending or savings."],
    ["Pharmacy records", "Stored information about medicines prescribed or dispensed."]
  ]),
  ...entries(576, "computer-systems", "Files and devices", [
    ["Open", "Load a file into an application so its contents can be used."],
    ["Operating system", "System software managing hardware, files, programs and user interaction.", ["OS"]],
    ["Phablet", "A large-screen smartphone whose size lies between typical phones and tablets."]
  ]),
  ...entries(576, "input-output", "Input and output devices", [
    ["Optical mouse", "A mouse using an optical sensor to track movement relative to a surface."],
    ["Output device", "Hardware presenting processed information to a person or another system."],
    ["Peripherals", "Devices connected to a computer to provide input, output or additional functions."]
  ]),
  ...entries(576, "storage", "Optical recording", [
    ["Optical storage device", "A drive that reads or writes optical media using laser light."],
    ["Optical storage media", "Media such as CDs and DVDs that encode data for optical reading."]
  ]),
  ...entries(576, "application-databases", "Controls and relationships", [
    ["Option group", "A collection of related choices typically allowing one option to be selected."],
    ["Orphan record", "A record whose foreign-key reference has no matching parent record.", ["Orphan (databases)"]]
  ]),
  ...entries(576, "application-word-processing", "Pagination and clipboard", [
    ["Orphan (layout)", "A paragraph's first line left alone at the bottom of a page or column.", ["Orphans (layout)"]],
    ["Page layout", "The arrangement of text and objects within a page."],
    ["Page orientation", "Whether a page is arranged in portrait or landscape form."],
    ["Page size", "The physical dimensions of the output page, such as A4."],
    ["Pagination", "Dividing content into pages and, where required, numbering them."],
    ["Paste", "Insert clipboard content at a chosen location."],
    ["Paste special", "Paste clipboard content with a chosen format, link or conversion option."]
  ]),
  ...entries(576, "systems-life-cycle", "Output and changeover", [
    ["Output format", "The planned form in which processed results are presented to users."],
    ["Parallel running", "Using old and new systems together for a period so their results can be compared."],
    ["Phased implementation", "Introducing a replacement system in stages rather than all at once."],
    ["Pilot running", "Trying a replacement system in a limited part of an organisation before wider deployment."]
  ]),
  ...entries(576, "networks", "Data routing", [
    ["Packet switching", "Sending messages as separately addressed packets that networks route to their destination."]
  ]),
  ...entries(576, "computer-systems", "Folder relationships", [
    ["Parent directory", "A folder containing another folder within the folder hierarchy."]
  ]),
  ...entries(576, "safety-security", "Privacy and attacks", [
    ["Password", "A secret used to authenticate a user or protect access to a resource."],
    ["Personal data", "Information relating to an identified or identifiable person."],
    ["Pharming", "Redirecting users to a fraudulent site by manipulating name resolution or related settings."],
    ["Phishing", "Deceptive messages or sites designed to persuade people to reveal information or take unsafe actions."],
    ["Physical token", "A possessed object used as authentication evidence, such as a security key."]
  ]),
  ...entries(576, "communication", "Rights and audio", [
    ["Piracy", "Unauthorised copying or distribution of protected software or other creative content."],
    ["Podcast", "An audio programme distributed digitally for streaming or downloading."]
  ]),
  ...entries(576, "application-spreadsheets", "Charts", [
    ["Percentages", "Values expressed as parts per hundred; on a pie chart they indicate shares of the whole."],
    ["Pie chart", "A circle divided into sectors to show parts of a whole."],
    ["Plot point", "A location on a graph corresponding to a set of data values."]
  ]),
  ...entries(576, "application-images", "Pixels", [
    ["Pixel", "An individual picture element in a raster image."]
  ]),
  ...entries(576, "application-presentations", "Slide objects", [
    ["Placeholder", "A reserved area for slide content such as text, images or media.", ["Placeholder positions"]]
  ]),
  ...entries(576, "safety-security", "Encryption", [
    ["Plaintext", "Readable data before encryption or after successful decryption."]
  ]),
  ...entries(577, "application-word-processing", "Typography and proofing", [
    ["Point", "A typographic measurement equal to one seventy-second of an inch."],
    ["Portrait", "Page orientation in which the page is taller than it is wide."],
    ["Predictive text", "Software suggesting likely words while the user types."],
    ["Proofing", "Checking a document's accuracy, language, consistency and presentation."],
    ["Proofread", "Read and inspect content to detect errors before it is published or submitted."],
    ["Poster", "A large-format document designed to convey a message to viewers in a public space."]
  ]),
  ...entries(577, "applications", "Retail and production systems", [
    ["Point of sale", "The place or system where a sale is recorded and payment is taken.", ["POS"]],
    ["Prosthetics", "Artificial devices replacing missing body parts."],
    ["Production line", "A sequence of production stages that may use computer-controlled equipment."]
  ]),
  ...entries(577, "storage", "Portable and direct-access storage", [
    ["Portable hard disk drive", "An external magnetic drive in a separate case connected to a computer.", ["Portable hard disk drives"]],
    ["Random access", "Accessing a required stored item without reading every preceding item.", ["Direct access"]]
  ]),
  ...entries(577, "safety-security", "Authentication and encryption", [
    ["Possession factor", "Authentication evidence based on something a person has, such as a security key."],
    ["Private key", "The secret part of an asymmetric key pair, used for operations such as decryption or signing."],
    ["Public key", "The shareable part of an asymmetric key pair, used for operations such as encryption or signature verification."],
    ["Quarantine", "Isolating suspicious software so it cannot run normally or spread."]
  ]),
  ...entries(577, "systems-life-cycle", "Validation and investigation", [
    ["Presence check", "A validation rule requiring an entry rather than an empty value."],
    ["Questionnaire", "A structured set of questions used to gather information from respondents."],
    ["Range check", "A validation rule testing whether a value lies within permitted limits."]
  ]),
  ...entries(577, "application-presentations", "Planning and delivery", [
    ["Presentation", "A structured communication to an audience, often supported by slides or other media."],
    ["Presentation template", "A reusable starting design for a presentation.", ["Style template"]],
    ["Presenter notes", "Additional notes supporting the speaker that need not appear on the audience's slide."]
  ]),
  ...entries(577, "application-web-authoring", "Presentation layer", [
    ["Presentation layer", "The visual styling of web content, generally defined using CSS."]
  ]),
  ...entries(577, "input-output", "Sensors and printed output", [
    ["Pressure sensor", "An input device measuring applied pressure."],
    ["Printers and plotters", "Output devices producing physical marks on paper or other materials."],
    ["QR code", "A two-dimensional matrix code that can encode text such as a web address."],
    ["QR scanner", "A camera-and-software system that reads the data encoded in a QR code."]
  ]),
  ...entries(577, "application-databases", "Records and controls", [
    ["Primary key", "A field or combination of fields uniquely identifying each record in a table."],
    ["Property sheet", "A panel listing editable settings for an object such as a form or control."],
    ["Query", "A request to select or process data according to specified instructions."],
    ["Radio button", "A control used to select one choice from a related set."],
    ["Record", "The related field values describing one instance of an entity."]
  ]),
  ...entries(577, "computer-systems", "Processing and programming", [
    ["Process", "Execute instructions or transform input data into results."],
    ["Programming language", "A language with rules and commands for expressing computer instructions.", ["Programming languages"]],
    ["Random-access memory", "Volatile working memory holding programs and data currently in use.", ["RAM"]],
    ["Read-only memory", "Non-volatile memory holding data or instructions that are not normally changed during everyday use.", ["ROM"]]
  ]),
  ...entries(577, "networks", "Communication protocols", [
    ["Protocol", "An agreed set of rules governing communication between devices or programs."]
  ]),
  ...entries(577, "application-spreadsheets", "Ranges", [
    ["Range", "A group of worksheet cells, commonly identified by its corner addresses such as B4:B7."]
  ]),
  ...entries(577, "applications", "Processing methods", [
    ["Real-time", "Processing with a response fast enough to meet the timing requirements of the activity."]
  ]),
  ...entries(578, "application-databases", "Relational data", [
    ["Referential integrity", "Rules maintaining valid links between related records and preventing orphan references."],
    ["Relational database", "A database organising related data in linked tables."],
    ["Relational database management system", "Software for creating, managing and querying relational databases.", ["RDBMS"]],
    ["Relationship", "An association linking records in different tables through corresponding fields."]
  ]),
  ...entries(578, "application-images", "Transformations", [
    ["Reflection", "Flipping an image to create a mirror image."],
    ["Rotate", "Turn an image or object through a specified angle."]
  ]),
  ...entries(578, "computer-systems", "Processor memory", [
    ["Register", "A very small, fast storage location within the CPU.", ["Registers"]]
  ]),
  ...entries(578, "application-word-processing", "Position and document sections", [
    ["Relative position", "An object's location described in relation to another object or reference point.", ["Relative"]],
    ["Section break", "A boundary allowing different layout settings in different parts of a document."],
    ["Section", "A document region that can have its own layout or formatting settings.", ["Sections"]]
  ]),
  ...entries(578, "application-web-authoring", "Paths and scripts", [
    ["Relative file path", "A resource location interpreted from the current file or base directory."],
    ["Script", "Instructions used to automate work or implement behaviour."],
    ["Scripting language", "A language commonly used to automate tasks or add interaction, such as JavaScript."],
    ["Second-level domain", "A domain label directly below a top-level domain, such as example in example.com."]
  ]),
  ...entries(578, "application-spreadsheets", "References and chart details", [
    ["Relative reference", "A cell reference that changes its row or column offset when a formula is copied."],
    ["Row height", "The vertical space assigned to a worksheet row."],
    ["Row", "A horizontal sequence of worksheet cells identified by a number.", ["Rows"]],
    ["Scale", "The intervals and limits used to represent values along a chart axis.", ["Scales"]],
    ["Secondary axis", "An additional axis used to display a data series with a different scale."],
    ["Sector", "A slice of a pie chart representing a share of the total."],
    ["Sector labels", "Text identifying what individual pie-chart slices represent."]
  ]),
  ...entries(578, "systems-life-cycle", "Correction and requirements", [
    ["Remedial action", "A change made to correct an identified fault or shortcoming."],
    ["Requirements specification", "A documented statement of what a proposed system must do and any relevant constraints."]
  ]),
  ...entries(578, "input-output", "Capture and control devices", [
    ["Remote control", "A handheld input device sending commands to equipment from a distance."],
    ["Resistive touch screen", "A touch screen detecting contact when pressure brings conductive layers together."],
    ["Radio-frequency identification", "Identifying tagged objects by radio communication between a tag and reader.", ["RFID"]],
    ["RFID tag", "A tag containing identification data readable through radio communication."],
    ["Scanner", "An input device converting a physical image or document into digital image data."]
  ]),
  ...entries(578, "safety-security", "Health and safety", [
    ["Repetitive strain injury", "An injury associated with repeated movements or sustained awkward use of muscles and tendons.", ["RSI"]]
  ]),
  ...entries(578, "communication", "Email and searching", [
    ["Reply to all", "Send a response to the sender and the other visible recipients of an email."],
    ["Search engine", "A service that indexes resources and retrieves results matching a user's search."]
  ]),
  ...entries(578, "applications", "Automation, learning and expert systems", [
    ["Robot", "A programmable machine carrying out physical tasks automatically."],
    ["Rules base", "The collection of decision rules used by an expert system."],
    ["School management system", "Software supporting school administration, records and related educational processes."]
  ]),
  ...entries(578, "networks", "Routing and satellites", [
    ["Router", "A device forwarding packets between different networks."],
    ["Satellite", "An object placed in orbit, used for services such as communication, navigation or observation."],
    ["Satellite dish", "A directional antenna for receiving or transmitting satellite signals."],
    ["Satellite phone", "A phone communicating through satellites rather than relying only on terrestrial mobile masts.", ["Satellite phones"]],
    ["Satellite systems", "Systems using orbiting satellites to provide communication or other services."],
    ["Satellite television", "Television programmes delivered to receivers through satellite communication."]
  ]),
  ...entries(578, "computer-systems", "Digital sampling and interface help", [
    ["Sample", "Measure a signal at a particular instant so the measurement can be represented digitally."],
    ["Screenshot", "A digital image capturing all or part of a displayed screen."],
    ["ScreenTip", "A short help message displayed when a pointer rests on a control."]
  ]),
  ...entries(578, "application-word-processing", "Fonts", [
    ["Sans-serif font", "A typeface without decorative finishing strokes at the ends of its main strokes."]
  ]),
  ...entries(579, "input-output", "Sensors and sound", [
    ["Sensor", "An input device measuring a physical property such as temperature, pressure or light."],
    ["Smartphone sensor", "A sensor built into a phone to measure properties such as movement, light or orientation."],
    ["Spatial laser sensor", "A sensor using laser measurements to detect objects or measure distances and shapes.", ["Spatial laser sensors"]],
    ["Speaker", "An output device converting electrical signals into audible sound."]
  ]),
  ...entries(579, "storage", "Access and solid-state media", [
    ["Sequential storage", "Data organised in a defined order, for example sorted by a key."],
    ["Serial storage", "Storage read in physical sequence, requiring earlier data to be passed before later data."],
    ["Solid-state drive", "A secondary-storage device using electronic memory without moving mechanical parts.", ["SSD"]],
    ["Solid-state storage media", "Electronic storage media, commonly flash memory, with no moving parts."]
  ]),
  ...entries(579, "application-spreadsheets", "Series and chart source data", [
    ["Series", "A sequence of values following a pattern, such as consecutive dates or numbers."],
    ["Specified data range", "The selected cells supplying the data for a chart."],
    ["Sort", "Rearrange records or worksheet rows according to one or more chosen keys."],
    ["Static", "Remaining unchanged unless explicitly edited or replaced."]
  ]),
  ...entries(579, "application-word-processing", "Typography and proofing", [
    ["Serif font", "A typeface with small finishing strokes on the ends of its main strokes."],
    ["Shape", "A ready-made drawing object such as a rectangle or arrow.", ["Shapes"]],
    ["Soft page break", "A page boundary inserted automatically as content fills the available space."],
    ["Soft copy", "An electronic rather than printed version of a document.", ["Softcopy"]],
    ["Spell check", "A tool comparing words with a dictionary and suggesting possible spelling corrections."]
  ]),
  ...entries(579, "networks", "Network services", [
    ["Server", "A computer or program providing services or resources to clients over a network."]
  ]),
  ...entries(579, "communication", "Messaging and social sites", [
    ["Short message service", "A service for sending short text messages over mobile networks.", ["SMS"]],
    ["Simple Mail Transfer Protocol", "A protocol used to submit and relay email between mail systems.", ["SMTP"]],
    ["Social networking site", "An online service where people form connections and share messages or content.", ["Social networking sites"]],
    ["Spam", "Unsolicited bulk messages, commonly sent for advertising or deception."]
  ]),
  ...entries(579, "safety-security", "Threats", [
    ["Shoulder surfing", "Obtaining information by watching someone's screen or input activity."],
    ["Smishing", "Phishing carried out through text messages."],
    ["Spyware", "Software secretly collecting information about a user's activity or data."]
  ]),
  ...entries(579, "computer-systems", "Files, software and sound", [
    ["Sibling folder", "A folder sharing the same immediate parent as another folder."],
    ["Smart device", "An electronic device capable of processing data and interacting with users or other devices."],
    ["Smartphone", "A mobile phone with an operating system supporting apps, internet access and other computing functions."],
    ["Software", "Programs and instructions used to direct a computer's operations."],
    ["Software licence", "Permission to use software under stated conditions; payment is not required for every licence."],
    ["Sound card", "Hardware processing audio input or output signals."]
  ]),
  ...entries(579, "applications", "Simulation and connected systems", [
    ["Simulate", "Represent the behaviour of a real or proposed system using a model."],
    ["Smart card", "A card containing an integrated circuit that stores or processes information."],
    ["Smart city", "A city using connected data and control systems to improve public services."],
    ["Stock control system", "A system updating inventory records and supporting replenishment decisions."]
  ]),
  ...entries(579, "application-presentations", "Slide structure", [
    ["Slide", "One screen or page of content within a presentation."],
    ["Slide show", "Slides displayed as a sequence for an audience."]
  ]),
  ...entries(579, "application-web-authoring", "Editing source", [
    ["Source code editor", "An editor supporting code entry with features such as syntax highlighting and completion."]
  ]),
  ...entries(580, "storage", "Devices and media", [
    ["Storage device", "Hardware that reads data from or writes data to a storage medium."],
    ["Storage media", "The physical material or technology on which data is recorded."]
  ]),
  ...entries(580, "computer-systems", "Memory and system software", [
    ["Storage location", "An addressable position where a data value can be held in memory."],
    ["Syntax", "The structural rules governing valid statements in a computer language."],
    ["System software", "Software operating and managing a computer, including its operating system and utilities."],
    ["Tablet", "A portable computer with a touch screen as its main user interface."]
  ]),
  ...entries(580, "safety-security", "Passwords and encryption", [
    ["Strong password", "A password resistant to guessing, typically long, unique and not predictable."],
    ["Symmetric encryption", "Encryption using the same secret key to encrypt and decrypt data."]
  ]),
  ...entries(580, "application-word-processing", "Styles and page text", [
    ["Style sheet (house style)", "A document recording agreed formatting and design rules.", ["Style sheet"]],
    ["Subscript", "Characters positioned below the normal text baseline."],
    ["Superscript", "Characters positioned above the normal text baseline."],
    ["Tab", "A formatting feature positioning text at a defined tab stop."],
    ["Tab key", "The key commonly used to move to the next tab stop or interface control."],
    ["Tab stop", "A defined horizontal position used to align text."],
    ["Text alignment", "The arrangement of paragraph lines against the left, right, centre or both margins."],
    ["Text box", "A container holding text that can be positioned independently of the main text flow."],
    ["Text enhancement", "Formatting such as bold, italic or underline used to emphasise text."],
    ["Text wrapping", "The way text flows around a positioned image or object."],
    ["Thesaurus", "A tool suggesting synonyms and related words."]
  ]),
  ...entries(580, "input-output", "Pens and sensors", [
    ["Stylus", "A pen-shaped input tool used with a compatible screen or tablet."],
    ["Temperature sensor", "An input device measuring temperature and reporting readings to a system."]
  ]),
  ...entries(580, "systems-life-cycle", "Design, staff and testing", [
    ["Systems analyst", "A specialist investigating requirements and helping plan an information system."],
    ["System flowchart", "A diagram showing the flow of data, processing and storage through a system.", ["System flowcharts"]],
    ["System manager", "A person overseeing a system's operation and administration."],
    ["System specification", "A documented description of the hardware, software and technical requirements of a system."],
    ["Technical documentation", "Information for developers and technicians explaining a system's structure and maintenance."],
    ["Test data", "Values chosen to check whether a system behaves as required."],
    ["Test design", "A description of a test's inputs, actions and expected results."],
    ["Test plan", "An organised list of tests with their inputs, expected outcomes and recorded results."],
    ["Test strategy", "The overall approach describing how and why testing will be carried out."],
    ["Testing", "Checking system behaviour against specified requirements using planned test cases."],
    ["Top-down design", "Breaking an overall system design into successively smaller components."]
  ]),
  ...entries(580, "application-databases", "Tables and forms", [
    ["Table", "A database structure holding records in rows and fields in columns."],
    ["Tabular form", "A form layout displaying several records in rows at the same time."],
    ["Text", "A data type holding character strings, including digits not intended for arithmetic."]
  ]),
  ...entries(580, "application-spreadsheets", "Tabulation", [
    ["Tabulation", "Organising information into rows and columns."]
  ]),
  ...entries(580, "application-web-authoring", "Tags and backgrounds", [
    ["Tag", "A markup instruction identifying the start or end of an HTML element.", ["Tags"]],
    ["Tiling", "Repeating a background image to cover an area."]
  ]),
  ...entries(580, "networks", "Internet protocols", [
    ["TCP/IP", "A suite of networking protocols including IP addressing/routing and TCP's reliable ordered delivery."]
  ]),
  ...entries(580, "communication", "Conversations", [
    ["Thread", "A linked sequence of messages and replies concerning a topic."]
  ]),
  ...entries(581, "application-web-authoring", "Domain names and addresses", [
    ["Top-level domain", "The final label in a domain name, such as com or org."],
    ["Uniform Resource Locator", "An address specifying the location of a resource and how it is accessed.", ["URL"]]
  ]),
  ...entries(581, "input-output", "Pointing and video capture", [
    ["Touch screen", "A display that also accepts input through touches on its surface."],
    ["Touchpad", "A touch-sensitive pointing surface commonly built into a laptop."],
    ["Trackball", "A pointing device controlled by rotating an exposed ball while its body stays still."],
    ["Video camera", "An input device capturing moving images electronically."]
  ]),
  ...entries(581, "application-word-processing", "Review and versioning", [
    ["Track changes", "A review feature recording edits so they can be inspected, accepted or rejected.", ["Track changes tool"]],
    ["Typographical", "Relating to the appearance, arrangement or correctness of printed or displayed characters."],
    ["Version control", "Managing successive versions of a document or program so changes can be tracked or recovered."]
  ]),
  ...entries(581, "applications", "Transport and positioning", [
    ["Traffic management", "Using information and control systems to coordinate vehicle and pedestrian movement."],
    ["Traffic modelling", "Simulating traffic to investigate the effects of routes, timings or demand."],
    ["Trilateration", "Estimating a position from distances to known reference locations."]
  ]),
  ...entries(581, "systems-life-cycle", "Data quality", [
    ["Transcription", "Transferring information from one medium or representation to another."],
    ["Transposition error", "An entry error in which characters or values are accidentally reversed."],
    ["Type check", "A validation check testing whether a value belongs to an expected data type."],
    ["Valid", "Satisfying specified validation rules; this does not by itself prove a value is accurate."],
    ["Validation", "Checking data against rules for acceptable input, without guaranteeing its truth."],
    ["Validation routine", "Code or a procedure that applies an input-validation rule.", ["Validation routines", "Validation rules"]],
    ["Verification", "Checking that entered or copied data matches its original source."],
    ["Verify", "Check a result or entry against evidence or a trusted source."]
  ]),
  ...entries(581, "computer-systems", "Components and programs", [
    ["Transistor", "An electronic component used to switch or control electrical signals."],
    ["Unique", "Not repeated within the relevant set."],
    ["Utility software", "System software performing maintenance, protection or configuration tasks.", ["Utilities"]],
    ["Variable", "A named storage location whose value can change while a program runs."]
  ]),
  ...entries(581, "application-presentations", "Effects and events", [
    ["Transition", "An effect used when moving from one slide to another."],
    ["Trigger", "An event or condition causing an assigned action to start."]
  ]),
  ...entries(581, "networks", "Transmission", [
    ["Transmission", "Sending data or signals from one place or device to another."]
  ]),
  ...entries(581, "application-images", "Files and objects", [
    ["Transparency", "The extent to which underlying content is visible through an image or object."],
    ["Uncompressed", "Stored without compression; decompressing a lossy file does not restore discarded information."],
    ["Ungroup", "Separate grouped objects so they can be selected or edited individually."]
  ]),
  ...entries(581, "application-spreadsheets", "Data and chart axes", [
    ["Transpose", "Exchange the row and column arrangement of data."],
    ["Value axis", "The chart axis showing the numerical scale for measured values."],
    ["Value axis labels", "The displayed numerical markers along a value axis."],
    ["Value axis title", "A heading describing the measurement or unit shown on a value axis."],
    ["Vertical", "Extending from top to bottom rather than side to side."]
  ]),
  ...entries(581, "safety-security", "Authentication", [
    ["Two-factor authentication", "Authentication requiring evidence from two different factor categories.", ["2FA"]]
  ]),
  ...entries(581, "application-databases", "Identification", [
    ["Unique identifier", "A value or combination of values distinguishing one record or entity from all others in its set."]
  ]),
  ...entries(581, "storage", "Capacity units", [
    ["Units of memory", "Eight bits make one byte; decimal prefixes use powers of 1000, while binary prefixes such as KiB use powers of 1024."]
  ]),
  ...entries(581, "applications", "Expert-system interaction", [
    ["User interface (expert system)", "The controls through which a user supplies information to an expert system and receives its advice."]
  ]),
  ...entries(581, "communication", "Video", [
    ["Video communication", "Communication using moving images, often accompanied by sound."]
  ]),
  ...entries(582, "communication", "Web and remote meetings", [
    ["Video-conference", "A live meeting in which remote participants exchange both sound and moving images."],
    ["Visual verification", "Comparing entered information visually against its original source."],
    ["Voice over Internet Protocol", "Carrying voice-call data over IP networks.", ["VoIP"]],
    ["Webcast", "A broadcast delivered over the web, commonly with one-way presentation to its audience."],
    ["Web-conference", "A live online meeting that can combine audio, video and shared content."],
    ["Webinar", "An online seminar or presentation that may allow questions and audience interaction."],
    ["Wiki", "A site whose pages can be created or revised collaboratively by authorised users."]
  ]),
  ...entries(582, "applications", "Simulation and forecasting", [
    ["Virtual reality", "An interactive computer-generated environment experienced as an alternative to the real surroundings.", ["VR"]],
    ["Weather forecasting", "Using observations and computer models to predict future weather conditions."]
  ]),
  ...entries(582, "safety-security", "Threats and authentication", [
    ["Vishing", "Phishing through voice calls to obtain information or persuade a victim to act."],
    ["Zero login", "Authentication relying on background signals, such as behaviour or device information, rather than an explicit login step."]
  ]),
  ...entries(582, "computer-systems", "Memory and user tools", [
    ["Volatile", "Losing stored contents when power is removed."],
    ["Widget", "A small interface component providing a specific function or item of information."]
  ]),
  ...entries(582, "application-web-authoring", "Pages and servers", [
    ["Web page", "An individual web document containing content that a browser can present."],
    ["Web server", "A computer or program serving web resources in response to requests."],
    ["Website", "A related collection of web pages and resources."],
    ["World Wide Web", "Interlinked resources accessed over the internet using web protocols and browsers.", ["WWW"]]
  ]),
  ...entries(582, "input-output", "Camera and pointing devices", [
    ["Webcam", "A camera designed to provide live digital video to a computer or network."],
    ["Wireless mouse", "A mouse communicating with a computer wirelessly rather than through a connecting cable."]
  ]),
  ...entries(582, "networks", "Wide and wireless networks", [
    ["Wide area network", "A network spanning a large geographical area, often connecting several local networks.", ["WAN"]],
    ["Wi-Fi", "Wireless networking technology commonly used to connect devices to a local network."],
    ["Wireless local area network", "A local network using wireless communication for device connections.", ["WLAN"]]
  ]),
  ...entries(582, "application-word-processing", "Paragraph flow", [
    ["Widow", "A paragraph's last line appearing alone at the top of a new page or column.", ["Widows"]],
    ["Wrap", "Automatically continue text on a new line when it reaches the available line width."]
  ]),
  ...entries(582, "application-databases", "Searching", [
    ["Wildcard", "A special pattern character standing for one or more unknown characters in a search."]
  ]),
  ...entries(582, "application-spreadsheets", "Chart dimensions", [
    ["X-axis", "The horizontal axis of a typical two-dimensional chart."],
    ["Y-axis", "The vertical axis of a typical two-dimensional chart."],
    ["Z-axis", "The additional coordinate axis in a three-dimensional chart."]
  ])
];

export const ictGlossaryRelatedModules: Record<string, string[]> = {
  "Copyright": ["social-economic"], "Copyright acts": ["social-economic"],
  "Intellectual property": ["social-economic"], "Piracy": ["social-economic"],
  "Software licence": ["social-economic"], "Personal data": ["social-economic"],
  "Data subject": ["social-economic"], "International data protection legislation": ["social-economic"],
  "Inappropriate material": ["social-economic"], "Criminal material": ["social-economic"],
  "Robot": ["social-economic"], "Autonomous vehicle": ["social-economic"],
  "Smart city": ["social-economic"], "Computer-aided learning": ["social-economic"],
  "Repetitive strain injury": ["social-economic"], "Artificial intelligence": ["social-economic"],
  "Digital certificate": ["networks", "application-web-authoring"],
  "HTTPS": ["networks", "safety-security"], "Domain name": ["networks"],
  "Cloud storage": ["networks"],
  "Bar code": ["applications"], "Radio-frequency identification": ["applications"],
  "Validation": ["application-databases", "application-spreadsheets"],
  "Verification": ["application-databases", "application-spreadsheets"],
  "Double data entry": ["application-spreadsheets"],
  "Range check": ["application-databases", "application-spreadsheets"],
  "Presence check": ["application-databases"], "Type check": ["application-databases"],
  "Format check": ["application-databases"], "Length check": ["application-databases"],
  "Logical operator": ["application-spreadsheets"], "Boolean": ["application-spreadsheets"],
  "Comma-separated values": ["application-databases"],
  "Chart": ["application-presentations"], "Legend": ["application-presentations"],
  "Aspect ratio": ["application-presentations", "application-word-processing"],
  "Cropping": ["application-presentations", "application-word-processing"],
  "Text wrapping": ["application-images"], "Hyperlink": ["application-presentations"],
  "Copy": ["application-presentations"], "Cut": ["application-presentations"],
  "Paste": ["application-presentations"], "Group": ["application-images"],
  "Data type": ["application-spreadsheets"], "Font family": ["application-web-authoring"],
  "Colour depth": ["computer-systems"], "Lossless compression": ["storage"],
  "Lossy compression": ["storage"]
};

export const ictGlossarySourcePhotos = [
  { page: 565, files: ["1001338329.jpg"] },
  ...Array.from({ length: 15 }, (_, index) => ({ page: 566 + index, files: [`${1001338330 + index * 2}.jpg`, `${1001338331 + index * 2}.jpg`] })),
  { page: 581, files: ["1001338365.jpg", "1001338366.jpg"] },
  { page: 582, files: ["1001338370.jpg"] }
];

export function ictTermKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function mergeIctGlossary(base: IctGlossaryEntry[], additions: IctGlossaryEntry[]) {
  const result = base.map(entry => ({ ...entry }));
  for (const entry of additions) {
    const keys = new Set([entry.term, ...(entry.aliases || [])].map(ictTermKey));
    const matches = result.filter(candidate => [candidate.term, ...(candidate.aliases || [])].some(name => keys.has(ictTermKey(name))));
    const aliases = [...new Set([...(entry.aliases || []), ...matches.flatMap(match => [match.term, ...(match.aliases || [])])])].filter(name => ictTermKey(name) !== ictTermKey(entry.term));
    const sourcePages = [...new Set([...(entry.sourcePages || []), ...matches.flatMap(match => match.sourcePages || [])])].sort((a, b) => a - b);
    const merged = { ...entry, aliases, sourcePages, alsoStudyIn: [...new Set([...(entry.alsoStudyIn || []), ...matches.flatMap(match => match.alsoStudyIn || [])])] };
    for (const match of matches) result.splice(result.indexOf(match), 1);
    result.push(merged);
  }
  return result.sort((a, b) => a.term.localeCompare(b.term, "en"));
}
