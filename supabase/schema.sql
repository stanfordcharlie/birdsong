create table surveys (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  topic text not null,
  sponsor text not null,
  question_guide text not null,
  created_at timestamp with time zone default now()
);

create table responses (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid references surveys(id),
  respondent_name text not null,
  respondent_email text not null,
  messages jsonb not null default '[]',
  pain_points jsonb not null default '[]',
  lead_score integer,
  completed boolean default false,
  created_at timestamp with time zone default now()
);
