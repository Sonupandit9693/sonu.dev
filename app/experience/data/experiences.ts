export interface Experience {
  id: number;
  title: string;
  company: string;
  location: string;
  duration: string;
  type: string;
  description: string;
  achievements: string[];
  technologies: string[];
  companyLogo: string;
  color: string;
  current?: boolean;
}

export const experiences: Experience[] = [
  {
    id: 1,
    title: "Software Development Engineer",
    company: "Cyfuture India Pvt Ltd",
    location: "Noida, India",
    duration: "Jul 2024 - Present",
    type: "Full-time",
    description:
      "Leading a team of 5 developers in building scalable Enterprise Resource Planning (ERP) software.",
    achievements: [
      "Reduced application load time by 60% through optimization.",
      "Led migration to cloud infrastructure, saving $50k annually.",
      "Mentored 3 junior developers and established internal coding standards.",
      "Collaborated with clients to gather requirements and deliver custom solutions.",
      "Contributed to building and enhancing financial modules, banking payment services, GST validation, and accurate report generation for government portals.",
    ],
    technologies: [
      "Java",
      "Spring",
      "Python Scripting",
      "JavaScript",
      "TypeScript",
      "AWS",
      "Docker",
      "MySQL",
      "Kubernetes",
    ],
    companyLogo: "",
    color: "from-blue-500 to-cyan-500",
    current: true,
  },
  {
    id: 2,
    title: "Software Developer",
    company: "Extension Technologies",
    location: "Delhi, India",
    duration: "Dec 2023 - June 2024",
    type: "Full-time",
    description:
      "Developed and maintained multiple client projects using modern web technologies. Built responsive web applications and RESTful APIs serving 10k+ daily active users.",
    achievements: [
      "Built a multithreaded room booking system backend.",
      "Integrated payment gateways including Razorpay and Stripe.",
      "Implemented real-time features using WebSocket and Socket.IO.",
      "Integrated third-party APIs such as DocuSign, Google Maps, and Interakt WhatsApp API.",
    ],
    technologies: [
      "Python",
      "TypeScript",
      "Next.js",
      "Express.js",
      "MariaDB",
      "Redis",
      "Frappe",
    ],
    companyLogo: "",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    title: "Software Developer Intern",
    company: "Extension Technologies",
    location: "Delhi, India",
    duration: "Jul 2023 - Nov 2023",
    type: "Full-time",
    description:
      "Assisted senior developers and gained hands-on backend development experience, contributing to multiple client projects.",
    achievements: [
      "Built a credit management system for a room booking application.",
      "Implemented RESTful APIs for mobile and web applications.",
      "Optimized a POS system for faster transaction processing.",
    ],
    technologies: [
      "Python",
      "Vue.js",
      "Tailwind CSS",
      "Figma",
      "Git",
      "Frappe",
    ],
    companyLogo: "",
    color: "from-green-500 to-emerald-500",
  },
];
