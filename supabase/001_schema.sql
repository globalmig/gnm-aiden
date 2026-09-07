-- ============================================================================
-- gnm-company 프로젝트 스키마
-- 랜딩 페이지(app/landing) 상담 신청 폼에서 접수하는 리드(lead) 데이터를 저장한다.
-- ============================================================================

create extension if not exists "pgcrypto"; -- gen_random_uuid() 사용

-- ----------------------------------------------------------------------------
-- leads - 랜딩 페이지 상담 신청 폼 접수 데이터
-- 이름/휴대폰번호는 개인정보처리방침(datas/agreements.ts) 상 필수 수집 항목과 일치한다.
-- 필수 동의 3종(수집·이용 / 제3자 제공 / 만 14세 이상)은 폼에서 체크하지 않으면
-- 제출 자체가 불가능하므로 true 값만 허용해 데이터 정합성을 보장한다.
-- ----------------------------------------------------------------------------
create table if not exists public.leads (
    id                      uuid primary key default gen_random_uuid(),
    category                text not null check (category in ('internet', 'tv', 'combo')), -- 인터넷 / TV / 인터넷+TV
    name                    text not null,
    phone                   text not null,
    bundle_discount_opt_in  boolean not null default false, -- "결합 할인 혜택 안내 받기" 체크 여부
    agree_collection        boolean not null check (agree_collection),         -- (필수) 개인정보 수집 및 활용 동의
    agree_third_party       boolean not null check (agree_third_party),        -- (필수) 개인정보 제3자 제공 및 활용 동의
    agree_age               boolean not null check (agree_age),                -- (필수) 만 14세 이상
    agree_marketing         boolean not null default false,                    -- (선택) 마케팅 정보 수신 동의
    status                  text not null default 'new' check (status in ('new', 'contacted', 'completed')), -- 관리자 문의관리 처리 상태
    created_at              timestamptz not null default now()
);

comment on table public.leads is '랜딩 페이지 상담 신청 폼 접수 데이터';

create index if not exists leads_created_at_idx on public.leads (created_at);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_phone_idx on public.leads (phone);

-- ----------------------------------------------------------------------------
-- RLS
-- 앱은 항상 service role(supabaseAdmin, RLS 우회)로만 이 테이블에 접근하므로
-- 공개 정책 없이 RLS만 활성화해 anon key 노출 시에도 직접 접근을 차단한다.
-- ----------------------------------------------------------------------------
alter table public.leads enable row level security;
