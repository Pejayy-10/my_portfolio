"use client";

import { motion } from "framer-motion";

interface StackCategory {
  name: string;
  items: string[];
}

const stackCategories: StackCategory[] = [
  {
    name: "frontend",
    items: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Vue.js",
      "Tailwind CSS",
      "SCSS",
      "Styled Components",
      "Vite",
      "Webpack",
      "ESLint",
      "Prettier",
    ],
  },
  {
    name: "backend",
    items: [
      "Node.js",
      "Python",
      "Java",
      "PHP",
      "Express.js",
      "NestJS",
      "FastAPI",
      "Spring Boot",
      "Laravel",
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "DynamoDB",
      "OAuth",
      "JWT",
      "LDAP",
      "REST",
      "GraphQL",
      "gRPC",
      "AWS Lambda",
    ],
  },
  {
    name: "devops & cloud",
    items: [
      "AWS",
      "GCP",
      "Azure",
      "GitHub Actions",
      "Jenkins",
      "GitLab CI",
      "Terraform",
      "AWS CloudFormation",
      "Docker",
      "Kubernetes",
      "Prometheus",
      "Grafana",
      "Datadog",
    ],
  },
  {
    name: "ai & machine learning",
    items: [
      "TensorFlow",
      "PyTorch",
      "LangChain",
      "Transformers",
      "OpenAI",
      "Anthropic",
      "Mistral",
      "Hugging Face",
      "LlamaIndex",
      "AutoGPT",
      "Claude Code",
      "Codex",
    ],
  },
  {
    name: "security & identity",
    items: [
      "AWS IAM",
      "Azure AD",
      "Okta",
      "SAP CDC",
      "Auth0",
      "Cognito",
      "AES",
      "RSA",
      "SHA",
      "GDPR",
      "SOC 2",
      "ISO 27001",
    ],
  },
  {
    name: "cms & no-code",
    items: [
      "WordPress",
      "Strapi",
      "Bubble",
      "Webflow",
      "Microsoft Power Platform",
      "n8n",
    ],
  },
  {
    name: "developer tools",
    items: [
      "Git",
      "GitHub",
      "GitLab",
      "Bitbucket",
      "VS Code",
      "JetBrains IntelliJ",
      "PyCharm",
      "Slack",
      "Discord",
      "Teams",
      "JIRA",
      "Trello",
      "ClickUp",
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
} as const;

export default function StackPage() {
  return (
    <div className="px-6 py-12 md:p-16 max-w-5xl mx-auto space-y-12">
      {/* Page Header */}
      <div>
        <h1 className="font-mono text-4xl text-[#e5e5e5] mb-6 lowercase tracking-tight">stack</h1>
        <p className="font-sans text-[15px] leading-relaxed text-[#888888] max-w-2xl">
          The tools, frameworks, and platforms I reach for — across the front end, back end, infrastructure, and AI.
        </p>
      </div>

      {/* Stack Categories Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-10"
      >
        {stackCategories.map((category) => (
          <motion.div 
            key={category.name} 
            variants={itemVariants}
            className="space-y-4"
          >
            {/* Category Title */}
            <h2 className="font-mono text-[11px] text-[#555] uppercase tracking-widest">
              {category.name}
            </h2>

            {/* Tech Badges Container */}
            <div className="flex flex-wrap gap-2.5">
              {category.items.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-xs text-[#888] bg-[#0c0c0c] border border-[#1a1a1a] rounded px-3 py-1.5 hover:text-[#e5e5e5] hover:border-[#333] hover:bg-[#0f0f0f] transition-all duration-200 cursor-default select-none"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
