-- Portfolio database schema

DROP TABLE IF EXISTS profile;
DROP TABLE IF EXISTS portfolio_items;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS tools;
DROP TABLE IF EXISTS languages;

CREATE TABLE profile (
  id INTEGER PRIMARY KEY CHECK (id = 1), -- single-row table
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  bio TEXT NOT NULL,
  location TEXT,
  hourly_rate TEXT,
  availability TEXT,
  total_earnings TEXT,
  total_jobs INTEGER,
  upwork_url TEXT NOT NULL,
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE tools (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE languages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  proficiency TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE portfolio_items (
  id TEXT PRIMARY KEY,        -- Canva design id
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  view_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Seed: profile -------------------------------------------------------

INSERT INTO profile (id, name, tagline, bio, location, hourly_rate, availability, total_earnings, total_jobs, upwork_url) VALUES (
  1,
  'Sorawich N.',
  'AI Product Visuals & E-Commerce Photo Retouching',
  'I help Shopify and e-commerce brands sell more with scroll-stopping product visuals — from clean photo retouching to AI-generated lifestyle scenes and ad creatives. Based in Bangkok, working with clients worldwide.',
  'Bangkok, Thailand',
  '$15/hr',
  'More than 30 hrs/week',
  '$1K+',
  4,
  'https://upwork.com/freelancers/~01995892b2264f41b5'
);

-- Seed: skills ----------------------------------------------------------

INSERT INTO skills (name, sort_order) VALUES
  ('Graphic Design', 1),
  ('Photo Retouching', 2),
  ('AI Image Generation', 3),
  ('Image Editing', 4),
  ('Image Prompting', 5);

-- Seed: tools -------------------------------------------------------------

INSERT INTO tools (name, sort_order) VALUES
  ('Photoshop', 1),
  ('Illustrator', 2),
  ('Premiere Pro', 3),
  ('After Effects', 4),
  ('Canva', 5),
  ('CapCut', 6),
  ('ChatGPT', 7),
  ('Gemini', 8),
  ('Claude', 9);

-- Seed: languages ---------------------------------------------------------

INSERT INTO languages (name, proficiency, sort_order) VALUES
  ('Thai', 'Fluent', 1),
  ('English', 'Conversational', 2);

-- Seed: portfolio items (curated from Canva) -------------------------------

INSERT INTO portfolio_items (id, title, category, thumbnail_url, view_url, sort_order) VALUES
  ('DAHIH2DYaA8', 'Photo Editing / Image Retouching', 'Retouching', 'https://design.canva.ai/RHvkPv3T1UENv-_', 'https://www.canva.com/d/EsrZ-uIjQHveo5_', 1),
  ('DAHOV7Xo9bg', 'Wellness Reminder — Instagram Post', 'Social Post', 'https://design.canva.ai/W_9g5uJLCj_xvhO', 'https://www.canva.com/d/CpjYMUCg-0Iaf_9', 2),
  ('DAHNkU2j9HE', '2-in-1 Running Shorts', 'Product Design', 'https://design.canva.ai/oSM900P0PlEmNIh', 'https://www.canva.com/d/pg0GsN1ZHwNDrcN', 3),
  ('DAHNkalqvRA', 'Sale Badge — Prime Day 70% Off', 'Ad Creative', 'https://design.canva.ai/uyWnl8cfqmWyKci', 'https://www.canva.com/d/OrmpcDHHpXuTyNZ', 4),
  ('DAHNlvBixMA', 'Prime Day Sale Dropped — Sitewide 70% Off', 'Ad Creative', 'https://design.canva.ai/FfJ3zaDj6lLXhXQ', 'https://www.canva.com/d/yQHFHF_xTIuEBeY', 5),
  ('DAHNk2Yh194', 'Prime Day Sale Campaign', 'Campaign', 'https://design.canva.ai/uKFcKICvqEjrjCv', 'https://www.canva.com/d/wlA85N3KO8TZ3qJ', 6),
  ('DAG1A4MpIiI', 'Personal Trainer — Business Card', 'Branding', 'https://design.canva.ai/16RLawbSlESmSJa', 'https://www.canva.com/d/HH6UpBw9bfJb1p6', 7),
  ('DAGmwnGv_sE', 'Y2K Store Notice — Facebook Post', 'Social Post', 'https://design.canva.ai/xSq79h2n69gWv6C', 'https://www.canva.com/d/VKs5C_8Z-MiO8Dz', 8),
  ('DAHHIKoLr7U', 'Coming Soon — TikTok Cover', 'Video Cover', 'https://design.canva.ai/oIEqoBYTWo9aLyK', 'https://www.canva.com/d/Yknp-lENPaBijFO', 9),
  ('DAHJACAxGm0', 'Coming Soon — Mobile Video Cover', 'Video Cover', 'https://design.canva.ai/NxHiOlIUrh8zg47', 'https://www.canva.com/d/AYqwoDd8g_EKg0j', 10),
  ('DAHKkQAXuTA', 'Smartwatch Review — TikTok Cover', 'Video Cover', 'https://design.canva.ai/v2p0iQHIsp8rSaZ', 'https://www.canva.com/d/lQ6Tld7NgpLEPwT', 11),
  ('DAHKjejlhKM', 'AI Video Effect — Station Ad Board', 'AI Generation', 'https://design.canva.ai/LZhpsTEbWzXJZLj', 'https://www.canva.com/d/r_qcZqa6s7I_i_E', 12);
