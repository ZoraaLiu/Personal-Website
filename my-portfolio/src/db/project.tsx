export interface Project {
    title: string;
    description: string;
    tags: string[];
    githubUrl?: string;
    images: string[];
}

export const projects: Project[] = [
    {
        title: "AR Horror Game",
        description: "A Unity-based augmented reality horror game that uses a flashlight interaction mechanic to drive exploration and tension.",
        tags: ["Unity", "C#", "AR", "Game Development"],
        githubUrl: "https://github.com/joeyuh/ar_flashlight_horror",
        images: [],
    },
    {
        title: "Security Control System",
        description: "An access control system where valid password entry unlocks a door, then automatically re-locks it after a timed countdown displayed to the user.",
        tags: ["Embedded Systems", "Control Logic", "Security", "Hardware"],
        githubUrl: "https://github.com/ZoraaLiu/Security-Control-System",
        images: [],
    },
    {
        title: "MIPS Assembly Compiler",
        description: "A compiler project that transforms machine-code-related input into WLP4 (a subset of C), implementing key compilation phases end to end.",
        tags: ["Compiler", "MIPS"],
        images: [],
    },
    {
        title: "FinAdvisor Serverless",
        description: "A serverless financial advisory system that runs a lightweight LLM on AWS Lambda to analyze spending patterns and generate budgeting and saving suggestions.",
        tags: ["AWS Lambda", "LLM", "Serverless"],
        githubUrl: "https://github.com/ZoraaLiu/finadvisor-serverless",
        images: [],
    },
    {
        title: "Chess Game",
        description: "A C++ object-oriented chess implementation focused on modeling core game rules and piece behaviors through clean class design.",
        tags: ["C++", "OOP","Algorithms"],
        githubUrl: "https://github.com/ZoraaLiu/chess_game",
        images: [],
    },
    {
        title: "FoggyTCP",
        description: "A TCP connection simulation project that explores reliability and transport-layer behavior under constrained or unstable network conditions.",
        tags: ["Networking", "TCP", "Simulation"],
        githubUrl: "https://github.com/Choleeee/foggytcp",
        images: [],
    },
    {
        title: "Song Review App",
        description: "A collaborative app for sharing songs and posting reviews, centered on user-generated music discovery and feedback.",
        tags: ["Full Stack", "DB interaction"],
        githubUrl: "https://github.com/rrrena-yang/song-review-app",
        images: [],
    },
];
