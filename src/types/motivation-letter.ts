export interface CompanyProfile {
    // Base identity
    name: string;
    website: string;
    industry: string;
    founded?: string | null;
    headquartersLocation?: string | null;
    employeeCount?: string | null;

    // Scraped Data
    mission?: string | null;
    vision?: string | null;
    values: string[];
    products: string[];
    recentNews: string[];
    cultureIndicators: string[];
    techStack?: string[];

    // Context
    painPoints?: string[];
    competitivePosition?: string | null;
    keyAchievements?: string[];

    // Meta
    dataQualityScore: number;
    scrapedPages: string[];
    scrapedAt: string;
}

export type ToneType = 'corporate' | 'startup' | 'friendly_formal' | 'executive';
export type GenerationStatus = 'pending' | 'researching' | 'generating' | 'creating_pdf' | 'completed' | 'failed';

export interface MotivationLetter {
    id: string;
    user_id: string;
    company_profile_id?: string;
    cv_id?: string;
    company_name: string;
    job_title: string;
    tone: ToneType;
    content: string;
    letter_html: string;

    pdf_storage_path?: string;
    pdf_url?: string;
    pdf_filename?: string;
    pdf_template_id: string;
    pdf_generated_at?: string;

    share_token?: string;
    share_url?: string;
    is_public: boolean;
    share_expires_at?: string;

    generation_status: GenerationStatus;
    generation_error?: string;
    batch_id?: string;

    created_at: string;
    updated_at: string;
}

export interface ApifyWebCrawlerItem {
    url: string;
    title?: string;
    text?: string;
    markdown?: string;
    metadata?: any;
}
