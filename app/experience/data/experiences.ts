export interface Experience {
  id: number
  title: string
  company: string
  location: string
  duration: string
  type: string
  description: string
  achievements: string[]
  technologies: string[]
  companyLogo: string
  color: string
  current?: boolean
  highlightMetrics?: string[]
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
      "Leading development of RAG-based enterprise knowledge platforms and ERP solutions for government PSU clients using Python, FastAPI, and modern LLM technologies.",
    achievements: [
      "Led development of RAG-based enterprise knowledge platform using LangChain, Qdrant vector database, and LLM APIs, architecting modular FastAPI microservices",
      "Architected and deployed enterprise ERP solutions serving 4,000+ users using Frappe Framework, ERPNext, Python, and JavaScript for government PSU",
      "Built advanced payroll and financial management systems with bulk arrear processing, GST compliance reporting, and Ind AS 116 compliant property management",
      "Developed automated CRM lead capture system using OpenCV for text extraction and LLM integration for data structuring",
      "Optimized SQL queries and MariaDB database performance through indexing strategies and query optimization, improving dashboard response times",
      "Built multi-agent workflow systems for enterprise automation and document processing with Apache Superset monitoring dashboards",
    ],
    technologies: [
      "Python",
      "FastAPI",
      "Flask",
      "LangChain",
      "LLM APIs",
      "Qdrant",
      "OpenCV",
      "Frappe Framework",
      "ERPNext",
      "MariaDB",
      "PostgreSQL",
      "Redis",
      "Apache Superset",
      "JavaScript",
      "RAG Systems",
      "Multi-agent Workflows",
      "SQLAlchemy",
    ],
    companyLogo: "🏢",
    color: "from-blue-500 to-cyan-500",
    current: true,
    highlightMetrics: [
      "4,000+ users served",
      "Government PSU clients",
      "RAG-based platforms",
      "Enterprise ERP systems",
    ],
  },
  {
    id: 2,
    title: "Software Developer",
    company: "Extension Technologies Pvt Ltd",
    location: "Delhi, India",
    duration: "Jul 2023 - Jun 2024",
    type: "Full-time",
    description:
      "Developed middleware solutions for ERPNext and Zoho integration, enabling real-time CRM/HRMS metadata delivery and automated workflow systems.",
    achievements: [
      "Developed middleware solution for ERPNext and Zoho integration, enabling real-time CRM/HRMS metadata delivery to auto-rendered UIs",
      "Integrated multiple third-party APIs including WhatsApp Business, Shopify, and Unicommerce for automated lead and order synchronization",
      "Built comprehensive email application using React, Vite, and Shadcn/ui to resolve Frappe's IMAP/POP3 integration limitations",
      "Implemented secure DocuSign OAuth integration for internal approval workflows, streamlining document signing processes",
      "Developed event-driven workflows and scheduled tasks for automated business processes",
      "Centralized email communication within ERP system, improving workflow efficiency across organizational teams",
    ],
    technologies: [
      "Python",
      "ERPNext",
      "Frappe Framework",
      "React.js",
      "Vite",
      "Shadcn/ui",
      "WhatsApp Business API",
      "Shopify API",
      "Unicommerce",
      "DocuSign API",
      "Zoho Integration",
      "OAuth Authentication",
      "JavaScript",
      "REST APIs",
      "Event-driven Workflows",
    ],
    companyLogo: "🚀",
    color: "from-purple-500 to-pink-500",
    highlightMetrics: [
      "Multiple API integrations",
      "Real-time synchronization",
      "Automated workflows",
      "OAuth implementation",
    ],
  },
]

// Updated summary to match actual resume data
export const experienceSummary = {
  totalExperience: "1.5+ years",
  keyMetrics: [
    "4,000+ enterprise users served",
    "Government PSU clients",
    "RAG-based knowledge platforms",
    "Enterprise ERP implementations",
    "340+ LeetCode problems solved",
  ],
  coreExpertise: [
    "RAG Systems & LLM Integration",
    "Enterprise ERP Solutions",
    "FastAPI Microservices",
    "Third-party API Integration",
    "Database Optimization",
  ],
}