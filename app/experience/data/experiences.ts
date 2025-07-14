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
  highlightMetrics?: string[];
}

export const experiences: Experience[] = [
  {
    id: 1,
    title: "Software Engineer – Applied AI & Backend Systems",
    company: "Cyfuture India Pvt Ltd",
    location: "Noida, India",
    duration: "Jul 2024 - Present",
    type: "Full-time",
    description:
      "Leading development of AI-integrated enterprise systems, RAG-based knowledge platforms, and scalable backend architecture for government and enterprise clients.",
    achievements: [
      "Led development of RAG-based enterprise knowledge platform using LangChain, GPT-4, and Qdrant, achieving 80-90% improved search relevance across business-critical documentation",
      "Architected modular FastAPI microservices for document parsing, OpenAI embedding generation, and vector indexing with real-time monitoring dashboards",
      "Delivered comprehensive ERP modules for PSU clients serving 5,000+ users, covering payroll automation, leasing management, and GST compliance workflows",
      "Engineered intelligent CRM automation using OpenCV and GPT-4 for visitor card text extraction, reducing manual data entry by 70%",
      "Optimized high-volume SQL queries and MariaDB configurations, reducing dashboard query latency by 30%",
      "Built multi-agent workflow orchestration systems for enterprise automation and document processing",
    ],
    technologies: [
      "Python",
      "FastAPI",
      "LangChain",
      "GPT-4",
      "Qdrant",
      "OpenCV",
      "Frappe",
      "MariaDB",
      "PostgreSQL",
      "Redis",
      "Docker",
      "Kubernetes",
      "AWS",
      "Apache Superset",
      "Celery",
      "RAG",
      "Microservices"
    ],
    companyLogo: "",
    color: "from-blue-500 to-cyan-500",
    current: true,
    highlightMetrics: [
      "5,000+ users served",
      "80-90% improved search relevance",
      "70% reduction in manual work",
      "30% query latency reduction"
    ]
  },
  {
    id: 2,
    title: "Software Developer",
    company: "Extension Technologies Pvt Ltd",
    location: "Delhi, India",
    duration: "Jul 2023 - Jun 2024",
    type: "Full-time",
    description:
      "Engineered scalable Flask REST APIs and ERP customizations for high-traffic booking systems and enterprise workflows.",
    achievements: [
      "Built scalable Flask REST APIs with multithreading and rate-limiting for real-time booking engine, handling 10,000+ concurrent users with 99.9% uptime",
      "Developed real-time synchronization middleware between ERPNext and Zoho systems, reducing frontend latency by 50%",
      "Engineered credit allocation engine for 1,000+ users, improving promotion tracking by 20%",
      "Integrated WhatsApp Business API, Shopify API, and DocuSign for automated lead synchronization and approval workflows",
      "Implemented secure OAuth-based authentication for document signing processes, reducing turnaround time by 30%",
      "Customized ERPNext for stock management, product bundles, and CRM flows across 6+ client projects",
    ],
    technologies: [
      "Python",
      "Flask",
      "ERPNext",
      "Frappe",
      "MariaDB",
      "Redis",
      "JavaScript",
      "REST APIs",
      "OAuth",
      "DocuSign API",
      "WhatsApp Business API",
      "Shopify API",
      "Multithreading",
      "Rate Limiting"
    ],
    companyLogo: "",
    color: "from-purple-500 to-pink-500",
    highlightMetrics: [
      "10,000+ concurrent users",
      "99.9% uptime",
      "50% latency reduction",
      "30% faster processing"
    ]
  },
  {
    id: 3,
    title: "Software Developer Intern",
    company: "Extension Technologies Pvt Ltd",
    location: "Delhi, India",
    duration: "Nov 2022 - Jun 2023",
    type: "Internship",
    description:
      "Contributed to backend development, API design, and database optimization for ERP and booking system platforms.",
    achievements: [
      "Designed credit-based booking eligibility module with REST endpoints and validation logic",
      "Developed file vault and POS modules with secure upload/download capabilities",
      "Optimized database queries and schema design for improved performance",
      "Participated in client demos, requirement gathering, and feedback implementation",
      "Built responsive frontend components using Vue.js and Tailwind CSS",
      "Implemented version control workflows and participated in code reviews",
    ],
    technologies: [
      "Python",
      "Vue.js",
      "Frappe",
      "MySQL",
      "Tailwind CSS",
      "REST APIs",
      "Git",
      "Database Optimization",
      "Frontend Development"
    ],
    companyLogo: "",
    color: "from-green-500 to-emerald-500",
    highlightMetrics: [
      "Multiple client projects",
      "Database query optimization",
      "Full-stack development"
    ]
  },
];

// Optional: Add a summary component for key metrics
export const experienceSummary = {
  totalExperience: "2+ years",
  keyMetrics: [
    "10,000+ concurrent users handled",
    "5,000+ enterprise users served",
    "80-90% improvement in search relevance",
    "70% reduction in manual processes",
    "99.9% system uptime achieved"
  ],
  coreExpertise: [
    "AI/ML Integration",
    "Backend Architecture",
    "Enterprise Systems",
    "High-Traffic APIs",
    "Database Optimization"
  ]
};