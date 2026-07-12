-- Drop existing tables to ensure clean slate
DROP TABLE IF EXISTS portfolio_profile CASCADE;
DROP TABLE IF EXISTS portfolio_projects CASCADE;
DROP TABLE IF EXISTS portfolio_experience CASCADE;
DROP TABLE IF EXISTS portfolio_experience_roles CASCADE;
DROP TABLE IF EXISTS portfolio_stack CASCADE;
DROP TABLE IF EXISTS portfolio_certifications CASCADE;
DROP TABLE IF EXISTS portfolio_recommendations CASCADE;
DROP TABLE IF EXISTS portfolio_affiliations CASCADE;

-- Create Profile Table
CREATE TABLE IF NOT EXISTS portfolio_profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT NOT NULL,
  title TEXT NOT NULL,
  email TEXT NOT NULL,
  experience_years TEXT DEFAULT '4+ yrs',
  uptime TEXT DEFAULT '100%',
  projects_count TEXT DEFAULT '10+',
  alma_mater TEXT DEFAULT 'WMSU',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE portfolio_profile ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select" ON portfolio_profile;
DROP POLICY IF EXISTS "Allow authenticated CRUD" ON portfolio_profile;
CREATE POLICY "Allow public select" ON portfolio_profile FOR SELECT USING (true);
CREATE POLICY "Allow authenticated CRUD" ON portfolio_profile FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create Projects Table
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  badge TEXT NOT NULL,
  extra_badges TEXT[],
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  featured_in TEXT[],
  app_store_url TEXT,
  play_store_url TEXT,
  icon_type TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select" ON portfolio_projects;
DROP POLICY IF EXISTS "Allow authenticated CRUD" ON portfolio_projects;
CREATE POLICY "Allow public select" ON portfolio_projects FOR SELECT USING (true);
CREATE POLICY "Allow authenticated CRUD" ON portfolio_projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create Experience Table
CREATE TABLE IF NOT EXISTS portfolio_experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  initials TEXT NOT NULL,
  type TEXT NOT NULL,
  duration_total TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE portfolio_experience ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select" ON portfolio_experience;
DROP POLICY IF EXISTS "Allow authenticated CRUD" ON portfolio_experience;
CREATE POLICY "Allow public select" ON portfolio_experience FOR SELECT USING (true);
CREATE POLICY "Allow authenticated CRUD" ON portfolio_experience FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create Experience Roles Table
CREATE TABLE IF NOT EXISTS portfolio_experience_roles (
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
DROP POLICY IF EXISTS "Allow public select" ON portfolio_experience_roles;
DROP POLICY IF EXISTS "Allow authenticated CRUD" ON portfolio_experience_roles;
CREATE POLICY "Allow public select" ON portfolio_experience_roles FOR SELECT USING (true);
CREATE POLICY "Allow authenticated CRUD" ON portfolio_experience_roles FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create Tech Stack Table
CREATE TABLE IF NOT EXISTS portfolio_stack (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  items TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE portfolio_stack ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select" ON portfolio_stack;
DROP POLICY IF EXISTS "Allow authenticated CRUD" ON portfolio_stack;
CREATE POLICY "Allow public select" ON portfolio_stack FOR SELECT USING (true);
CREATE POLICY "Allow authenticated CRUD" ON portfolio_stack FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create Certifications Table
DROP TABLE IF EXISTS portfolio_certifications CASCADE;
CREATE TABLE portfolio_certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'AI',
  verify_url TEXT,
  icon_type TEXT NOT NULL,
  rotation TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE portfolio_certifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select" ON portfolio_certifications;
DROP POLICY IF EXISTS "Allow authenticated CRUD" ON portfolio_certifications;
CREATE POLICY "Allow public select" ON portfolio_certifications FOR SELECT USING (true);
CREATE POLICY "Allow authenticated CRUD" ON portfolio_certifications FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create Recommendations Table
CREATE TABLE IF NOT EXISTS portfolio_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  author TEXT NOT NULL,
  initials TEXT NOT NULL,
  role TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE portfolio_recommendations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select" ON portfolio_recommendations;
DROP POLICY IF EXISTS "Allow authenticated CRUD" ON portfolio_recommendations;
CREATE POLICY "Allow public select" ON portfolio_recommendations FOR SELECT USING (true);
CREATE POLICY "Allow authenticated CRUD" ON portfolio_recommendations FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create Affiliations Table
CREATE TABLE IF NOT EXISTS portfolio_affiliations (
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
DROP POLICY IF EXISTS "Allow public select" ON portfolio_affiliations;
DROP POLICY IF EXISTS "Allow authenticated CRUD" ON portfolio_affiliations;
CREATE POLICY "Allow public select" ON portfolio_affiliations FOR SELECT USING (true);
CREATE POLICY "Allow authenticated CRUD" ON portfolio_affiliations FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seeds (Initial Template Data)
-- Profile Seed
INSERT INTO portfolio_profile (name, bio, title, email, experience_years, uptime, projects_count, alma_mater) 
SELECT 'Fran Peruso', 'Software Engineer & UI/UX Designer. Offline-first systems, multi-tenant SaaS structures, distributed state, cloud infrastructure.', 'Software Engineer', 'frandilbertperuso@gmail.com', '4+ yrs', '100%', '10+', 'WMSU'
WHERE NOT EXISTS (SELECT 1 FROM portfolio_profile);

-- Projects Seeds
INSERT INTO portfolio_projects (badge, extra_badges, title, description, featured_in, app_store_url, play_store_url, icon_type, featured)
SELECT 'SYSTEM ENGINEERING', ARRAY['OFFLINE FIRST', 'DISTRIBUTED LEDGER'], 'Project Alpha // Regional Ledger Sync', 'An offline-first ledger syncing node subsystem capable of handling low-connectivity peripheral nodes.', ARRAY['Architecture Spec ↗', 'System Overview ↗', 'Scale Analysis ↗'], '#', '#', 'alpha', true
WHERE NOT EXISTS (SELECT 1 FROM portfolio_projects WHERE title = 'Project Alpha // Regional Ledger Sync');

INSERT INTO portfolio_projects (badge, extra_badges, title, description, featured_in, app_store_url, play_store_url, icon_type, featured)
SELECT 'SaaS PLATFORM', ARRAY['MULTI-TENANT', 'EDGE NODE CACHE'], 'Project Beta // Audio Processing Engine', 'Gamified state processing engine caching multi-format audio streams via local-first file subsystem.', ARRAY['API Document ↗', 'Performance Benchmark ↗'], '#', '#', 'beta', true
WHERE NOT EXISTS (SELECT 1 FROM portfolio_projects WHERE title = 'Project Beta // Audio Processing Engine');

INSERT INTO portfolio_projects (badge, extra_badges, title, description, featured_in, app_store_url, play_store_url, icon_type, featured)
SELECT 'OPEN SOURCE', ARRAY['CLI COMPANION'], 'Project Gamma // Automated Deployment Toolkit', 'A highly optimized CLI companion for automating redundant deployment workflows and database migrations.', ARRAY['Source Repo ↗', 'Release Logs ↗'], '#', '#', 'gamma', true
WHERE NOT EXISTS (SELECT 1 FROM portfolio_projects WHERE title = 'Project Gamma // Automated Deployment Toolkit');

INSERT INTO portfolio_projects (badge, title, description, icon_type, featured)
SELECT 'GENERATIVE AI', 'Project Delta', 'An AI-native platform prototype mapping spiritual and theological learning datasets.', 'delta', false
WHERE NOT EXISTS (SELECT 1 FROM portfolio_projects WHERE title = 'Project Delta');

INSERT INTO portfolio_projects (badge, title, description, icon_type, featured)
SELECT 'GENERATIVE AI', 'Project Epsilon', 'Automated social media fact-checker model API integrating localized verification models.', 'epsilon', false
WHERE NOT EXISTS (SELECT 1 FROM portfolio_projects WHERE title = 'Project Epsilon');

INSERT INTO portfolio_projects (badge, title, description, icon_type, featured)
SELECT 'PLATFORM', 'Project Zeta', 'Workspace booking engine and availability scheduler scaled for enterprise office fleets.', 'zeta', false
WHERE NOT EXISTS (SELECT 1 FROM portfolio_projects WHERE title = 'Project Zeta');

INSERT INTO portfolio_projects (badge, title, description, icon_type, featured)
SELECT 'PLATFORM', 'Project Eta', 'Verification compiler issuing cryptographically verifiable, skills-based credentials.', 'eta', false
WHERE NOT EXISTS (SELECT 1 FROM portfolio_projects WHERE title = 'Project Eta');


-- Experiences Seeds
-- Company Alpha
INSERT INTO portfolio_experience (id, name, initials, type)
SELECT 'a0000000-0000-0000-0000-000000000001', 'Company Alpha', 'CA', 'Full-time'
WHERE NOT EXISTS (SELECT 1 FROM portfolio_experience WHERE id = 'a0000000-0000-0000-0000-000000000001');

INSERT INTO portfolio_experience_roles (experience_id, title, period, duration, description, skills)
SELECT 'a0000000-0000-0000-0000-000000000001', 'Lead Software Architect', 'AUG 2025 - PRESENT', '11 MOS', 
  ARRAY['Direct technical architecture and system-level scaling strategies across core platform infrastructure.', 'Provide design oversight for microservices pipelines, security standards, and high-throughput databases.'],
  ARRAY['System Architecture', 'Cloud Scaling', 'Generative AI', '+2 skills']
WHERE NOT EXISTS (SELECT 1 FROM portfolio_experience_roles WHERE title = 'Lead Software Architect' AND experience_id = 'a0000000-0000-0000-0000-000000000001');

-- Company Beta
INSERT INTO portfolio_experience (id, name, initials, type, duration_total, location)
SELECT 'a0000000-0000-0000-0000-000000000002', 'Company Beta', 'CB', 'Full-time', '1 yr 2 mos', 'Manila, PH · Hybrid'
WHERE NOT EXISTS (SELECT 1 FROM portfolio_experience WHERE id = 'a0000000-0000-0000-0000-000000000002');

INSERT INTO portfolio_experience_roles (experience_id, title, period, duration, description, skills)
SELECT 'a0000000-0000-0000-0000-000000000002', 'Senior DevOps Engineer', 'FEB 2025 - AUG 2025', '7 MOS', 
  ARRAY['Managed automated container workloads, CI/CD orchestration, and server provisioning workflows.', 'Standardized infrastructure-as-code scripts, reducing provisioning times and improving build reliability.'],
  ARRAY['Docker', 'Kubernetes', 'CI/CD', 'AWS', '+3 skills']
WHERE NOT EXISTS (SELECT 1 FROM portfolio_experience_roles WHERE title = 'Senior DevOps Engineer' AND experience_id = 'a0000000-0000-0000-0000-000000000002');

INSERT INTO portfolio_experience_roles (experience_id, title, period, duration, description, skills)
SELECT 'a0000000-0000-0000-0000-000000000002', 'Full Stack Developer', 'JUL 2024 - FEB 2025', '8 MOS', 
  ARRAY['Contributed to front-end refactoring and modular interface assembly using modern component frameworks.', 'Audited and optimized database queries, reducing server overhead and improving overall response latency.'],
  ARRAY['TypeScript', 'React', 'Node.js', 'SQL', '+3 skills']
WHERE NOT EXISTS (SELECT 1 FROM portfolio_experience_roles WHERE title = 'Full Stack Developer' AND experience_id = 'a0000000-0000-0000-0000-000000000002');

-- Company Gamma
INSERT INTO portfolio_experience (id, name, initials, type, duration_total, location)
SELECT 'a0000000-0000-0000-0000-000000000003', 'Company Gamma', 'CG', 'Contract', '2 yrs 7 mos', 'Remote'
WHERE NOT EXISTS (SELECT 1 FROM portfolio_experience WHERE id = 'a0000000-0000-0000-0000-000000000003');

INSERT INTO portfolio_experience_roles (experience_id, title, period, duration, description, skills)
SELECT 'a0000000-0000-0000-0000-000000000003', 'Software Engineering Lead', 'JAN 2022 - JUL 2024', '2 YRS 7 MOS', 
  ARRAY['Led development and deployment of responsive web tools and mobile components for enterprise clients.', 'Organized sprint cycles, code reviews, and architectural designs for a multi-disciplinary engineering team.'],
  ARRAY['Next.js', 'TypeScript', 'Solution Architecture', '+3 skills']
WHERE NOT EXISTS (SELECT 1 FROM portfolio_experience_roles WHERE title = 'Software Engineering Lead' AND experience_id = 'a0000000-0000-0000-0000-000000000003');

-- Company Delta
INSERT INTO portfolio_experience (id, name, initials, type, duration_total, location)
SELECT 'a0000000-0000-0000-0000-000000000004', 'Company Delta', 'CD', 'Internship', '6 mos', 'On-site'
WHERE NOT EXISTS (SELECT 1 FROM portfolio_experience WHERE id = 'a0000000-0000-0000-0000-000000000004');

INSERT INTO portfolio_experience_roles (experience_id, title, period, duration, description, skills)
SELECT 'a0000000-0000-0000-0000-000000000004', 'Software Developer Intern', 'JUL 2021 - DEC 2021', '6 MOS', 
  ARRAY['Assisted in code refactoring, bug fixes, and layout assembly under senior engineer guidance.', 'Contributed to unit test coverage and documented internal REST API endpoints.'],
  ARRAY['JavaScript', 'CSS', 'Git']
WHERE NOT EXISTS (SELECT 1 FROM portfolio_experience_roles WHERE title = 'Software Developer Intern' AND experience_id = 'a0000000-0000-0000-0000-000000000004');

-- Stack Seeds
INSERT INTO portfolio_stack (category, items) 
SELECT 'frontend', ARRAY['JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js', 'Tailwind CSS', 'SCSS', 'Styled Components', 'Vite', 'Webpack', 'ESLint', 'Prettier']
WHERE NOT EXISTS (SELECT 1 FROM portfolio_stack WHERE category = 'frontend');

INSERT INTO portfolio_stack (category, items) 
SELECT 'backend', ARRAY['Node.js', 'Python', 'Java', 'PHP', 'Express.js', 'NestJS', 'FastAPI', 'Spring Boot', 'Laravel', 'PostgreSQL', 'MySQL', 'MongoDB', 'DynamoDB', 'OAuth', 'JWT', 'LDAP', 'REST', 'GraphQL', 'gRPC', 'AWS Lambda']
WHERE NOT EXISTS (SELECT 1 FROM portfolio_stack WHERE category = 'backend');

INSERT INTO portfolio_stack (category, items) 
SELECT 'devops & cloud', ARRAY['AWS', 'GCP', 'Azure', 'GitHub Actions', 'Jenkins', 'GitLab CI', 'Terraform', 'AWS CloudFormation', 'Docker', 'Kubernetes', 'Prometheus', 'Grafana', 'Datadog']
WHERE NOT EXISTS (SELECT 1 FROM portfolio_stack WHERE category = 'devops & cloud');

INSERT INTO portfolio_stack (category, items) 
SELECT 'ai & machine learning', ARRAY['TensorFlow', 'PyTorch', 'LangChain', 'Transformers', 'OpenAI', 'Anthropic', 'Mistral', 'Hugging Face', 'LlamaIndex', 'AutoGPT', 'Claude Code', 'Codex']
WHERE NOT EXISTS (SELECT 1 FROM portfolio_stack WHERE category = 'ai & machine learning');

INSERT INTO portfolio_stack (category, items) 
SELECT 'security & identity', ARRAY['AWS IAM', 'Azure AD', 'Okta', 'SAP CDC', 'Auth0', 'Cognito', 'AES', 'RSA', 'SHA', 'GDPR', 'SOC 2', 'ISO 27001']
WHERE NOT EXISTS (SELECT 1 FROM portfolio_stack WHERE category = 'security & identity');

INSERT INTO portfolio_stack (category, items) 
SELECT 'cms & no-code', ARRAY['WordPress', 'Strapi', 'Bubble', 'Webflow', 'Microsoft Power Platform', 'n8n']
WHERE NOT EXISTS (SELECT 1 FROM portfolio_stack WHERE category = 'cms & no-code');

INSERT INTO portfolio_stack (category, items) 
SELECT 'developer tools', ARRAY['Git', 'GitHub', 'GitLab', 'Bitbucket', 'VS Code', 'JetBrains IntelliJ', 'PyCharm', 'Slack', 'Discord', 'Teams', 'JIRA', 'Trello', 'ClickUp']
WHERE NOT EXISTS (SELECT 1 FROM portfolio_stack WHERE category = 'developer tools');

-- Certifications Seeds
INSERT INTO portfolio_certifications (title, issuer, category, verify_url, icon_type, rotation)
SELECT 'Generative Models Specialist', 'PLATFORM ALPHA', 'AI', '#', 'alpha', '-rotate-1 sm:-rotate-[1.5deg]'
WHERE NOT EXISTS (SELECT 1 FROM portfolio_certifications WHERE title = 'Generative Models Specialist');

INSERT INTO portfolio_certifications (title, issuer, category, verify_url, icon_type, rotation)
SELECT 'Neural Networks Practitioner', 'ACADEMY BETA', 'AI', '#', 'beta', 'rotate-1 sm:rotate-[1.2deg]'
WHERE NOT EXISTS (SELECT 1 FROM portfolio_certifications WHERE title = 'Neural Networks Practitioner');

-- Recommendations Seeds
INSERT INTO portfolio_recommendations (text, author, initials, role, date)
SELECT 'An exceptionally skilled developer. Their technical execution and ability to ship complex systems cleanly is outstanding. They are always focused on clean engineering principles.', 'Mentor Alpha', 'MA', 'Department of Systems Architecture', 'AUG 2025'
WHERE NOT EXISTS (SELECT 1 FROM portfolio_recommendations WHERE author = 'Mentor Alpha');

-- Affiliations Seeds
INSERT INTO portfolio_affiliations (name, initials, role, description, link_text, link_url, watermark)
SELECT 'Association Alpha of Developer Operations', 'AA', 'MEMBER', 'A regional association advancing cloud operations, container orchestration, and continuous integration adoption.', 'association-alpha.org ↗', '#', 'ALPHA'
WHERE NOT EXISTS (SELECT 1 FROM portfolio_affiliations WHERE name = 'Association Alpha of Developer Operations');

INSERT INTO portfolio_affiliations (name, initials, role, description, link_text, link_url, watermark)
SELECT 'Software Systems Industry Board', 'SS', 'MEMBER', 'A national industry body representing software developers, systems engineering professionals, and IT service providers.', 'software-board.org ↗', '#', 'SSIB'
WHERE NOT EXISTS (SELECT 1 FROM portfolio_affiliations WHERE name = 'Software Systems Industry Board');

INSERT INTO portfolio_affiliations (name, initials, role, description, link_text, link_url, watermark)
SELECT 'AppBuilders Community', 'AB', 'FOUNDER', 'A local developer community founded to support software engineers, systems architects, and indie hackers building web tools.', 'appbuilders.dev ↗', '#', 'ABPH'
WHERE NOT EXISTS (SELECT 1 FROM portfolio_affiliations WHERE name = 'AppBuilders Community');
