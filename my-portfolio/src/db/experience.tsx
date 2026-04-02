export interface Experience{
    role: string;
    company: string;
    tags: string[];
    description: string;
    location: string;
    startDate: string;
    endDate: string;
}

const ROLE = "Software Engineer Intern"

export const experiences: Experience[] = [
    {
        role:ROLE,
        company:"MovableInk",
        tags:['Backend'],
        description:"Backend && API developemnt",
        location:"Toronto, Canada",
        startDate:"Apr. 2025",
        endDate:'Aug. 2025',
    },
    {
        role:ROLE,
        company:"OTTO by Rockwell",
        tags:['Robotics'],
        description:"Worked on OS Team, contributed to robot diagnostics aggregator and command-line tools",
        location:"Kitchener, Canada",
        startDate:"Sep. 2024",
        endDate:'Dec. 2024',
    },
    {
        role:ROLE,
        company:"University of Waterloo",
        tags:['AI', 'Fullstack'],
        description:"Built a React + TypeScript dashboard for real-time data visualization",
        location:"Nanjing, China",
        startDate:"May. 2023",
        endDate:'Aug. 2023',
    },
    {
        role:ROLE,
        company:"Arcelormittal Tailored Blanks",
        tags:['Robotics'],
        description:"Deployed YOLOv8 and create data piplines to enabling real-time steel blank detection for quantity monitoring",
        location:"Kitchener, Canada",
        startDate:"Sep. 2024",
        endDate:'Dec. 2024',
    },
    {
        role:ROLE,
        company:"Hanjie Technology Co Ltd",
        tags:['FrontEnd'],
        description:"Built a React + TypeScript dashboard for real-time data visualization",
        location:"Nanjing, China",
        startDate:"May. 2023",
        endDate:'Aug. 2023',
    },
]