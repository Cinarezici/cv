export interface Profile {
    id: string;
    user_id: string;
    full_name: string;
    headline: string;
    raw_json: ResumeData;
    created_at: string;
}

export interface ResumeData {
    name: string;
    headline?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    summary?: string;
    experience: Experience[];
    education: Education[];
    skills: string[];
}

export interface Experience {
    title: string;
    company: string;
    location?: string;
    start_date: string;
    end_date: string;
    bullets: string[];
}

export interface Education {
    degree: string;
    school: string;
    year: string;
    gpa?: string;
}

export interface Resume {
    id: string;
    user_id: string;
    profile_id: string;
    optimized_json: ResumeData;
    public_link_slug: string;
    expires_at: string | null;
    is_active: boolean;
    job_title?: string;
    created_at: string;
}

export interface Subscription {
    user_id: string;
    stripe_customer_id: string;
    status: 'active' | 'trialing' | 'expired' | 'canceled';
    trial_end: string | null;
}
