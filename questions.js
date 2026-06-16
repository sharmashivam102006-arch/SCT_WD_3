// questions.js
const quizDatabase = [
    // --- WEB DEVELOPMENT (10 Questions) ---
    {
        id: 1, category: "web",
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlink and Text Markup Language", "Home Tool Markup Language"],
        answer: 0
    },
    {
        id: 2, category: "web",
        question: "Which CSS property controls the text size?",
        options: ["text-style", "font-size", "text-size", "font-style"],
        answer: 1
    },
    {
        id: 3, category: "web",
        question: "How do you declare a JavaScript variable that cannot be reassigned?",
        options: ["let", "var", "const", "static"],
        answer: 2
    },
    {
        id: 4, category: "web",
        question: "What is the correct syntax for referring to an external script called 'app.js'?",
        options: ["<script href='app.js'>", "<script name='app.js'>", "<script src='app.js'>", "<script file='app.js'>"],
        answer: 2
    },
    {
        id: 5, category: "web",
        question: "Which of the following is NOT a JavaScript framework/library?",
        options: ["React", "Angular", "Django", "Vue"],
        answer: 2
    },
    {
        id: 6, category: "web",
        question: "In CSS, what is the default value of the position property?",
        options: ["relative", "absolute", "fixed", "static"],
        answer: 3
    },
    {
        id: 7, category: "web",
        question: "What does API stand for?",
        options: ["Application Programming Interface", "Advanced Program Integration", "Application Process Interface", "Automated Programming Interface"],
        answer: 0
    },
    {
        id: 8, category: "web",
        question: "Which HTTP method is typically used to create a new resource?",
        options: ["GET", "POST", "PUT", "DELETE"],
        answer: 1
    },
    {
        id: 9, category: "web",
        question: "What is a closure in JavaScript?",
        options: ["A locked object", "A function bundled with its lexical environment", "A method to end a loop", "A strict mode feature"],
        answer: 1
    },
    {
        id: 10, category: "web",
        question: "Which HTML5 tag is used to draw graphics via scripting?",
        options: ["<svg>", "<canvas>", "<graphic>", "<draw>"],
        answer: 1
    },

    // --- GENERAL TECH (10 Questions) ---
    {
        id: 11, category: "tech",
        question: "What does CPU stand for?",
        options: ["Central Process Unit", "Computer Personal Unit", "Central Processing Unit", "Central Processor Unit"],
        answer: 2
    },
    {
        id: 12, category: "tech",
        question: "Who is known as the father of computer science?",
        options: ["Alan Turing", "Charles Babbage", "Ada Lovelace", "Bill Gates"],
        answer: 0
    },
    {
        id: 13, category: "tech",
        question: "What is the main function of a DNS server?",
        options: ["To store websites", "To translate domain names to IP addresses", "To encrypt data", "To block viruses"],
        answer: 1
    },
    {
        id: 14, category: "tech",
        question: "Which company developed the Android operating system initially?",
        options: ["Google", "Apple", "Android Inc.", "Samsung"],
        answer: 2
    },
    {
        id: 15, category: "tech",
        question: "What does GPU stand for?",
        options: ["Graphical Performance Unit", "Graphics Processing Unit", "Gaming Processor Unit", "General Processing Unit"],
        answer: 1
    },
    {
        id: 16, category: "tech",
        question: "In computing, what is a 'Bug'?",
        options: ["A virus", "An insect in the machine", "A flaw or fault in a program", "A feature tracking system"],
        answer: 2
    },
    {
        id: 17, category: "tech",
        question: "What data structure operates on a Last In, First Out (LIFO) principle?",
        options: ["Queue", "Tree", "Array", "Stack"],
        answer: 3
    },
    {
        id: 18, category: "tech",
        question: "What is the maximum capacity of a standard IPv4 address?",
        options: ["~4.3 billion", "~1 trillion", "~100 million", "Infinite"],
        answer: 0
    },
    {
        id: 19, category: "tech",
        question: "Which of the following is a NoSQL database?",
        options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"],
        answer: 2
    },
    {
        id: 20, category: "tech",
        question: "What does 'HTTP' stand for?",
        options: ["HyperText Transfer Protocol", "HyperText Transmission Protocol", "Hyper Transfer Text Protocol", "High Tech Transfer Protocol"],
        answer: 0
    }
];