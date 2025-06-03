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
      "Built and customized enterprise ERP solutions for a PSU client, aligning modules with government workflows and automating financial and operational processes.",
    achievements: [
      "Migrated legacy documents to structured ERP modules for automation across departments.",
      "Built a complete financial module including invoice booking, deductions, and multi-mode payments.",
      "Developed a property management system in compliance with Ind AS 116 for global use.",
      "Customized payroll for project-wise bookings, arrears, and pay fixation workflows.",
      "Designed GST reclaim reports and project-wise expenditure summaries using accounting dimensions.",
      "Deployed scalable services on Kubernetes with CI/CD, optimized MySQL queries, and integrated CDN for performance.",
    ],
    technologies: [
      "Python",
      "JavaScript",
      "Frappe",
      "MySQL",
      "Kubernetes",
      "Docker",
      "CI/CD",
      "Redis",
      "AWS",
    ],
    companyLogo: "",
    color: "from-blue-500 to-cyan-500",
    current: true,
  },
  {
    id: 2,
    title: "Software Developer",
    company: "Extension Technologies Pvt Ltd",
    location: "Delhi, India",
    duration: "Jul 2023 - Jun 2024",
    type: "Full-time",
    description:
      "Engineered scalable backend APIs and ERP customizations for client platforms involving reservations, document workflows, and CRM integrations.",
    achievements: [
      "Developed REST APIs in Flask handling 10k+ concurrent room bookings with concurrency control.",
      "Built credit management workflows for tracking and redeeming credits with usage-based validation.",
      "Customized ERPNext for stock entry, product bundles, and CRM flows across 6+ client projects.",
      "Integrated DocuSign for digital signatures and WhatsApp APIs (Interakt) for ERP messaging.",
      "Enhanced field ticketing and assignment systems for LIXIL support operations.",
    ],
    technologies: [
      "Python",
      "Flask",
      "Frappe",
      "Redis",
      "MariaDB",
      "JavaScript",
      "ERPNext",
      "Interakt API",
      "DocuSign API",
    ],
    companyLogo: "",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    title: "Software Developer Intern",
    company: "Extension Technologies Pvt Ltd",
    location: "Delhi, India",
    duration: "Nov 2022 - Jun 2023",
    type: "Internship",
    description:
      "Contributed to backend development and API design as part of the ERP and booking system product teams.",
    achievements: [
      "Designed credit-based booking eligibility module with REST endpoints.",
      "Contributed to development and testing of file vault and POS modules.",
      "Optimized database queries and participated in client demos and feedback loops.",
    ],
    technologies: [
      "Python",
      "Vue.js",
      "Frappe",
      "MySQL",
      "Tailwind CSS",
      "Git",
    ],
    companyLogo: "",
    color: "from-green-500 to-emerald-500",
  },
];
