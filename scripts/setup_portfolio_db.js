const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.axllbwlghtutpilbvqkz:Kylafrandilbert123@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres'
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to Supabase DB");

    // Helper to drop and create tables cleanly
    const setupQueries = `
      -- 1. Profile Table
      DROP TABLE IF EXISTS portfolio_profile CASCADE;
      CREATE TABLE portfolio_profile (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        bio TEXT NOT NULL,
        title TEXT NOT NULL,
        email TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      ALTER TABLE portfolio_profile ENABLE ROW LEVEL SECURITY;
      CREATE POLICY "Allow public select" ON portfolio_profile FOR SELECT USING (true);
      CREATE POLICY "Allow authenticated CRUD" ON portfolio_profile FOR ALL TO authenticated USING (true) WITH CHECK (true);

      -- 2. Projects Table
      DROP TABLE IF EXISTS portfolio_projects CASCADE;
      CREATE TABLE portfolio_projects (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        badge TEXT NOT NULL,
        extra_badges TEXT[],
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        featured_in TEXT[],
        app_store_url TEXT,
        play_store_url TEXT,
        icon_type TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
      CREATE POLICY "Allow public select" ON portfolio_projects FOR SELECT USING (true);
      CREATE POLICY "Allow authenticated CRUD" ON portfolio_projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

      -- 3. Experience Table
      DROP TABLE IF EXISTS portfolio_experience CASCADE;
      CREATE TABLE portfolio_experience (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        initials TEXT NOT NULL,
        type TEXT NOT NULL,
        duration_total TEXT,
        location TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      ALTER TABLE portfolio_experience ENABLE ROW LEVEL SECURITY;
      CREATE POLICY "Allow public select" ON portfolio_experience FOR SELECT USING (true);
      CREATE POLICY "Allow authenticated CRUD" ON portfolio_experience FOR ALL TO authenticated USING (true) WITH CHECK (true);

      -- 4. Experience Roles Table
      DROP TABLE IF EXISTS portfolio_experience_roles CASCADE;
      CREATE TABLE portfolio_experience_roles (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        experience_id UUID REFERENCES portfolio_experience(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        period TEXT NOT NULL,
        duration TEXT NOT NULL,
        description TEXT[] NOT NULL,
        skills TEXT[] NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      ALTER TABLE portfolio_experience_roles ENABLE ROW LEVEL SECURITY;
      CREATE POLICY "Allow public select" ON portfolio_experience_roles FOR SELECT USING (true);
      CREATE POLICY "Allow authenticated CRUD" ON portfolio_experience_roles FOR ALL TO authenticated USING (true) WITH CHECK (true);

      -- 5. Tech Stack Table
      DROP TABLE IF EXISTS portfolio_stack CASCADE;
      CREATE TABLE portfolio_stack (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        category TEXT NOT NULL,
        items TEXT[] NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      ALTER TABLE portfolio_stack ENABLE ROW LEVEL SECURITY;
      CREATE POLICY "Allow public select" ON portfolio_stack FOR SELECT USING (true);
      CREATE POLICY "Allow authenticated CRUD" ON portfolio_stack FOR ALL TO authenticated USING (true) WITH CHECK (true);

      -- 6. Certifications Table
      DROP TABLE IF EXISTS portfolio_certifications CASCADE;
      CREATE TABLE portfolio_certifications (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title TEXT NOT NULL,
        issuer TEXT NOT NULL,
        verify_url TEXT,
        icon_type TEXT NOT NULL,
        rotation TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      ALTER TABLE portfolio_certifications ENABLE ROW LEVEL SECURITY;
      CREATE POLICY "Allow public select" ON portfolio_certifications FOR SELECT USING (true);
      CREATE POLICY "Allow authenticated CRUD" ON portfolio_certifications FOR ALL TO authenticated USING (true) WITH CHECK (true);

      -- 7. Recommendations Table
      DROP TABLE IF EXISTS portfolio_recommendations CASCADE;
      CREATE TABLE portfolio_recommendations (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        text TEXT NOT NULL,
        author TEXT NOT NULL,
        initials TEXT NOT NULL,
        role TEXT NOT NULL,
        date TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      ALTER TABLE portfolio_recommendations ENABLE ROW LEVEL SECURITY;
      CREATE POLICY "Allow public select" ON portfolio_recommendations FOR SELECT USING (true);
      CREATE POLICY "Allow authenticated CRUD" ON portfolio_recommendations FOR ALL TO authenticated USING (true) WITH CHECK (true);

      -- 8. Affiliations Table
      DROP TABLE IF EXISTS portfolio_affiliations CASCADE;
      CREATE TABLE portfolio_affiliations (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        initials TEXT NOT NULL,
        role TEXT NOT NULL,
        description TEXT NOT NULL,
        link_text TEXT NOT NULL,
        link_url TEXT NOT NULL,
        watermark TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      ALTER TABLE portfolio_affiliations ENABLE ROW LEVEL SECURITY;
      CREATE POLICY "Allow public select" ON portfolio_affiliations FOR SELECT USING (true);
      CREATE POLICY "Allow authenticated CRUD" ON portfolio_affiliations FOR ALL TO authenticated USING (true) WITH CHECK (true);
    `;

    await client.query(setupQueries);
    console.log("Database tables and RLS policies created.");

    // Seeding default templates so portfolio is not blank
    console.log("Seeding default data...");

    // Seed Profile
    await client.query(`
      INSERT INTO portfolio_profile (name, bio, title, email) VALUES (
        'Fran Peruso',
        'Software Engineer & UI/UX Designer. Offline-first systems, multi-tenant SaaS structures, distributed state, cloud infrastructure.',
        'Software Engineer',
        'frandilbertperuso@gmail.com'
      );
    `);

    // Seed Projects
    const seedProjects = [
      {
        badge: "SYSTEM ENGINEERING",
        extra_badges: ["OFFLINE FIRST", "DISTRIBUTED LEDGER"],
        title: "Project Alpha // Regional Ledger Sync",
        description: "An offline-first ledger syncing node subsystem capable of handling low-connectivity peripheral nodes.",
        featured_in: ["Architecture Spec ↗", "System Overview ↗", "Scale Analysis ↗"],
        app_store_url: "#",
        play_store_url: "#",
        icon_type: "alpha"
      },
      {
        badge: "SaaS PLATFORM",
        extra_badges: ["MULTI-TENANT", "EDGE NODE CACHE"],
        title: "Project Beta // Audio Processing Engine",
        description: "Gamified state processing engine caching multi-format audio streams via local-first file subsystem.",
        featured_in: ["API Document ↗", "Performance Benchmark ↗"],
        app_store_url: "#",
        play_store_url: "#",
        icon_type: "beta"
      },
      {
        badge: "OPEN SOURCE",
        extra_badges: ["CLI COMPANION"],
        title: "Project Gamma // Automated Deployment Toolkit",
        description: "A highly optimized CLI companion for automating redundant deployment workflows and database migrations.",
        featured_in: ["Source Repo ↗", "Release Logs ↗"],
        app_store_url: "#",
        play_store_url: "#",
        icon_type: "gamma"
      }
    ];

    for (const proj of seedProjects) {
      await client.query(`
        INSERT INTO portfolio_projects (badge, extra_badges, title, description, featured_in, app_store_url, play_store_url, icon_type)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
      `, [proj.badge, proj.extra_badges, proj.title, proj.description, proj.featured_in, proj.app_store_url, proj.play_store_url, proj.icon_type]);
    }

    // Seed Experiences
    const expAlphaRes = await client.query(`
      INSERT INTO portfolio_experience (name, initials, type)
      VALUES ('Company Alpha', 'CA', 'Full-time') RETURNING id;
    `);
    const expAlphaId = expAlphaRes.rows[0].id;
    await client.query(`
      INSERT INTO portfolio_experience_roles (experience_id, title, period, duration, description, skills)
      VALUES ($1, 'Lead Software Architect', 'AUG 2025 - PRESENT', '11 MOS', 
        ARRAY['Direct technical architecture and system-level scaling strategies across core platform infrastructure.', 'Provide design oversight for microservices pipelines, security standards, and high-throughput databases.'],
        ARRAY['System Architecture', 'Cloud Scaling', 'Generative AI', '+2 skills']
      );
    `, [expAlphaId]);

    const expBetaRes = await client.query(`
      INSERT INTO portfolio_experience (name, initials, type, duration_total, location)
      VALUES ('Company Beta', 'CB', 'Full-time', '1 yr 2 mos', 'Manila, PH · Hybrid') RETURNING id;
    `);
    const expBetaId = expBetaRes.rows[0].id;
    await client.query(`
      INSERT INTO portfolio_experience_roles (experience_id, title, period, duration, description, skills)
      VALUES ($1, 'Senior DevOps Engineer', 'FEB 2025 - AUG 2025', '7 MOS', 
        ARRAY['Managed automated container workloads, CI/CD orchestration, and server provisioning workflows.', 'Standardized infrastructure-as-code scripts, reducing provisioning times and improving build reliability.'],
        ARRAY['Docker', 'Kubernetes', 'CI/CD', 'AWS', '+3 skills']
      );
    `, [expBetaId]);
    await client.query(`
      INSERT INTO portfolio_experience_roles (experience_id, title, period, duration, description, skills)
      VALUES ($1, 'Full Stack Developer', 'JUL 2024 - FEB 2025', '8 MOS', 
        ARRAY['Contributed to front-end refactoring and modular interface assembly using modern component frameworks.', 'Audited and optimized database queries, reducing server overhead and improving overall response latency.'],
        ARRAY['TypeScript', 'React', 'Node.js', 'SQL', '+3 skills']
      );
    `, [expBetaId]);

    const expGammaRes = await client.query(`
      INSERT INTO portfolio_experience (name, initials, type, duration_total, location)
      VALUES ('Company Gamma', 'CG', 'Contract', '2 yrs 7 mos', 'Remote') RETURNING id;
    `);
    const expGammaId = expGammaRes.rows[0].id;
    await client.query(`
      INSERT INTO portfolio_experience_roles (experience_id, title, period, duration, description, skills)
      VALUES ($1, 'Software Engineering Lead', 'JAN 2022 - JUL 2024', '2 YRS 7 MOS', 
        ARRAY['Led development and deployment of responsive web tools and mobile components for enterprise clients.', 'Organized sprint cycles, code reviews, and architectural designs for a multi-disciplinary engineering team.'],
        ARRAY['Next.js', 'TypeScript', 'Solution Architecture', '+3 skills']
      );
    `, [expGammaId]);

    const expDeltaRes = await client.query(`
      INSERT INTO portfolio_experience (name, initials, type, duration_total, location)
      VALUES ('Company Delta', 'CD', 'Internship', '6 mos', 'On-site') RETURNING id;
    `);
    const expDeltaId = expDeltaRes.rows[0].id;
    await client.query(`
      INSERT INTO portfolio_experience_roles (experience_id, title, period, duration, description, skills)
      VALUES ($1, 'Software Developer Intern', 'JUL 2021 - DEC 2021', '6 MOS', 
        ARRAY['Assisted in code refactoring, bug fixes, and layout assembly under senior engineer guidance.', 'Contributed to unit test coverage and documented internal REST API endpoints.'],
        ARRAY['JavaScript', 'CSS', 'Git']
      );
    `, [expDeltaId]);

    // Seed Stack
    const stacks = [
      { category: "frontend", items: ["JavaScript", "TypeScript", "React", "Next.js", "Vue.js", "Tailwind CSS", "SCSS", "Styled Components", "Vite", "Webpack", "ESLint", "Prettier"] },
      { category: "backend", items: ["Node.js", "Python", "Java", "PHP", "Express.js", "NestJS", "FastAPI", "Spring Boot", "Laravel", "PostgreSQL", "MySQL", "MongoDB", "DynamoDB", "OAuth", "JWT", "LDAP", "REST", "GraphQL", "gRPC", "AWS Lambda"] },
      { category: "devops & cloud", items: ["AWS", "GCP", "Azure", "GitHub Actions", "Jenkins", "GitLab CI", "Terraform", "AWS CloudFormation", "Docker", "Kubernetes", "Prometheus", "Grafana", "Datadog"] },
      { category: "ai & machine learning", items: ["TensorFlow", "PyTorch", "LangChain", "Transformers", "OpenAI", "Anthropic", "Mistral", "Hugging Face", "LlamaIndex", "AutoGPT", "Claude Code", "Codex"] },
      { category: "security & identity", items: ["AWS IAM", "Azure AD", "Okta", "SAP CDC", "Auth0", "Cognito", "AES", "RSA", "SHA", "GDPR", "SOC 2", "ISO 27001"] },
      { category: "cms & no-code", items: ["WordPress", "Strapi", "Bubble", "Webflow", "Microsoft Power Platform", "n8n"] },
      { category: "developer tools", items: ["Git", "GitHub", "GitLab", "Bitbucket", "VS Code", "JetBrains IntelliJ", "PyCharm", "Slack", "Discord", "Teams", "JIRA", "Trello", "ClickUp"] }
    ];
    for (const s of stacks) {
      await client.query(`
        INSERT INTO portfolio_stack (category, items) VALUES ($1, $2);
      `, [s.category, s.items]);
    }

    // Seed Certifications
    const certs = [
      { title: "Generative Models Specialist", issuer: "PLATFORM ALPHA", verify_url: "#", icon_type: "alpha", rotation: "-rotate-1 sm:-rotate-[1.5deg]" },
      { title: "Neural Networks Practitioner", issuer: "ACADEMY BETA", verify_url: "#", icon_type: "beta", rotation: "rotate-1 sm:rotate-[1.2deg]" },
      { title: "Cognitive Systems Engineering", issuer: "INSTITUTE GAMMA", verify_url: "#", icon_type: "gamma", rotation: "-rotate-1 sm:-rotate-[0.8deg]" },
      { title: "Vector Database Architect", issuer: "REGISTRY DELTA", verify_url: "#", icon_type: "delta", rotation: "rotate-2 sm:rotate-[1.8deg]" },
      { title: "Retrieval-Augmented Systems", issuer: "SYSTEMS EPSILON", verify_url: "#", icon_type: "epsilon", rotation: "-rotate-1 sm:-rotate-[1.2deg]" },
      { title: "Advanced Data Structures", issuer: "ACADEMY BETA", verify_url: "#", icon_type: "beta", rotation: "rotate-1 sm:rotate-[0.8deg]" },
      { title: "Distributed Architecture Lead", issuer: "INSTITUTE GAMMA", verify_url: "#", icon_type: "gamma", rotation: "-rotate-1 sm:-rotate-[1.4deg]" },
      { title: "Relational Query Specialist", issuer: "REGISTRY DELTA", verify_url: "#", icon_type: "delta", rotation: "rotate-2 sm:rotate-[1deg]" },
      { title: "Systems Programming Core", issuer: "PLATFORM ALPHA", verify_url: "#", icon_type: "alpha", rotation: "-rotate-1 sm:-rotate-[0.8deg]" },
      { title: "Functional Language Expert", issuer: "SYSTEMS EPSILON", verify_url: "#", icon_type: "epsilon", rotation: "rotate-1 sm:rotate-[1.5deg]" },
      { title: "Cloud Operations Architect", issuer: "REGISTRY DELTA", verify_url: "#", icon_type: "delta", rotation: "-rotate-1 sm:-rotate-[1deg]" },
      { title: "Kubernetes Deployments Core", issuer: "PLATFORM ALPHA", verify_url: "#", icon_type: "alpha", rotation: "rotate-1 sm:rotate-[1.4deg]" },
      { title: "Cybersecurity Fundamentals", issuer: "INSTITUTE GAMMA", verify_url: "#", icon_type: "gamma", rotation: "-rotate-1 sm:-rotate-[1.6deg]" },
      { title: "Network Security Officer", issuer: "ACADEMY BETA", verify_url: "#", icon_type: "beta", rotation: "rotate-1 sm:rotate-[1deg]" },
      { title: "Agile Operations Professional", issuer: "PLATFORM ALPHA", verify_url: "#", icon_type: "alpha", rotation: "rotate-1 sm:rotate-[0.8deg]" },
      { title: "Product Lifecycle Management", issuer: "REGISTRY DELTA", verify_url: "#", icon_type: "delta", rotation: "-rotate-1 sm:-rotate-[1.2deg]" }
    ];
    for (const c of certs) {
      await client.query(`
        INSERT INTO portfolio_certifications (title, issuer, verify_url, icon_type, rotation) VALUES ($1, $2, $3, $4, $5);
      `, [c.title, c.issuer, c.verify_url, c.icon_type, c.rotation]);
    }

    // Seed Recommendations
    const recs = [
      { text: "An exceptionally skilled developer. Their technical execution and ability to ship complex systems cleanly is outstanding. They are always focused on clean engineering principles.", author: "Mentor Alpha", initials: "MA", role: "Department of Systems Architecture", date: "AUG 2025" },
      { text: "They are one of the most reliable engineering partners I have worked with. Their quick executions and concept building skills helped our team deliver most of our complex features ahead of schedule. They always provide insightful feedback both on the strategic and technical aspects of our systems.\n\nIn and out of work, their focus on code quality and clean documentation made a huge difference. I highly recommend them to any team looking for a technical leader who can also execute.", author: "Principal Partner", initials: "PP", role: "Platform Integration Lead", date: "JUL 2025" },
      { text: "They have been instrumental in our system scaling phases. As our Tech Lead, they're not just a strong developer—they are a true builder. From leading key migrations to mentoring junior developers, they consistently deliver high-quality solutions and forward-thinking ideas.", author: "Lead Beta", initials: "LB", role: "Enterprise Scale Systems", date: "MAY 2025" },
      { text: "I worked alongside them on several key backend initiatives. They have an impressive tenacity to deliver exactly what they commit to, without sacrificing quality or performance under tight constraints. Their eagerness to research new technologies and integrate them cleanly is a great asset.\n\nTheir work on optimizing database caches and CI/CD pipelines significantly reduced server overhead, improving overall system stability.", author: "Teammate Gamma", initials: "TG", role: "Cloud Systems Specialist", date: "DEC 2024" },
      { text: "A highly intelligent software engineer who takes lead on complex modules and handles team collaboration exceptionally well. They are extremely structured in their development approach.", author: "Technical Lead", initials: "TL", role: "Core Services Division", date: "MAR 2024" },
      { text: "I had the pleasure of collaborating on several integrations. They consistently brought strong domain knowledge in database design, performance optimization, and automation workflows. They are the kind of engineer who raises the bar for everyone around them.", author: "Partner Delta", initials: "PD", role: "API Infrastructure", date: "JAN 2024" },
      { text: "An incredible builder who is passionate about developer experience, automation tooling, and clean interfaces. They are always searching for ways to optimize current processes.", author: "Product Lead", initials: "PL", role: "DevOps & Integrations", date: "OCT 2023" },
      { text: "Their combination of technical depth and people skills makes them a rare find. They present complex solutions with confidence, communicate transparently with stakeholders, and execute with absolute precision.", author: "Advisor Epsilon", initials: "AE", role: "Strategic Operations", date: "JUN 2023" }
    ];
    for (const r of recs) {
      await client.query(`
        INSERT INTO portfolio_recommendations (text, author, initials, role, date) VALUES ($1, $2, $3, $4, $5);
      `, [r.text, r.author, r.initials, r.role, r.date]);
    }

    // Seed Affiliations
    const affs = [
      { name: "Association Alpha of Developer Operations", initials: "AA", role: "MEMBER", description: "A regional association advancing cloud operations, container orchestration, and continuous integration adoption.", link_text: "association-alpha.org ↗", link_url: "#", watermark: "ALPHA" },
      { name: "Software Systems Industry Board", initials: "SS", role: "MEMBER", description: "A national industry body representing software developers, systems engineering professionals, and IT service providers.", link_text: "software-board.org ↗", link_url: "#", watermark: "SSIB" },
      { name: "AppBuilders Community", initials: "AB", role: "FOUNDER", description: "A local developer community founded to support software engineers, systems architects, and indie hackers building web tools.", link_text: "appbuilders.dev ↗", link_url: "#", watermark: "ABPH" }
    ];
    for (const a of affs) {
      await client.query(`
        INSERT INTO portfolio_affiliations (name, initials, role, description, link_text, link_url, watermark)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
      `, [a.name, a.initials, a.role, a.description, a.link_text, a.link_url, a.watermark]);
    }

    console.log("Database seeded successfully.");
  } catch (err) {
    console.error("Error setting up DB:", err);
  } finally {
    await client.end();
  }
}

run();
