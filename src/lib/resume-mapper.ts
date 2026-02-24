import { ResumeData, ResumeJSON, ExperienceEntry, EducationEntry, SectionKey } from '@/types';

/**
 * Maps legacy ResumeData (often from AI or LinkedIn imports) to the new standardized ResumeJSON format.
 * This ensures that older or intermediate data structures don't break the UI/Editor.
 */
export function mapToResumeJSON(data: any): ResumeJSON {
    // If it already follows the new structure, return it
    if (data && data.header && (data.experience || data.education)) {
        return data as ResumeJSON;
    }

    // Default structure
    const result: ResumeJSON = {
        header: {
            full_name: data?.name || '',
            headline: data?.headline || '',
            email: data?.email || '',
            phone: data?.phone || '',
            location: data?.location || '',
            linkedin_url: data?.linkedin || '',
            photo_url: data?.avatar_base64 || '',
            show_photo: true,
        },
        summary: data?.summary || '',
        skills: {
            core: Array.isArray(data?.skills) ? data.skills : [],
            tools: [],
        },
        experience: Array.isArray(data?.experience)
            ? data.experience.map((exp: any, index: number) => ({
                id: `exp-${index}-${Date.now()}`,
                company: exp.company || '',
                role: exp.title || exp.role || '',
                location: exp.location || '',
                start_date: exp.start_date || '',
                end_date: exp.end_date || '',
                is_current: exp.end_date === 'Present' || !exp.end_date,
                bullets: Array.isArray(exp.bullets) ? exp.bullets : [],
            }))
            : [],
        education: Array.isArray(data?.education)
            ? data.education.map((edu: any, index: number) => ({
                id: `edu-${index}-${Date.now()}`,
                school: edu.school || '',
                degree: edu.degree || '',
                field: edu.field || '',
                start_date: edu.start_date || edu.year || '',
                end_date: edu.end_date || '',
                is_current: false,
                gpa: edu.gpa || '',
            }))
            : [],
        projects: [],
        certifications: [],
        languages: [],
    };

    return result;
}

/**
 * Default Section Order if not provided
 */
export const DEFAULT_SECTION_ORDER: SectionKey[] = [
    'header',
    'summary',
    'skills',
    'experience',
    'education',
    'projects',
    'certifications',
    'languages',
];
