import React from 'react';
import { Mail, Phone, MapPin, Linkedin as LinkedinIcon, Github, Globe, Briefcase, User, Book } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { THEMES } from '@/lib/theme-config';

interface CVRendererProps {
    avatarUrl: string | null;
    showPhoto: boolean;
    isPro?: boolean;
}

export function CVRenderer({ avatarUrl, showPhoto, isPro = true }: CVRendererProps) {
    const { resumeJson, themeId, colorPaletteId, themeCategory, sectionOrder } = useResumeStore();

    const currentThemeConfig = THEMES[themeId] || THEMES['clean-ats'];
    const accentColor = colorPaletteId === 'emerald' ? '#10b981'
        : colorPaletteId === 'indigo' ? '#4f46e5'
            : colorPaletteId === 'slate' ? '#475569'
                : colorPaletteId === 'rose' ? '#e11d48'
                    : colorPaletteId === 'cerulean' ? '#0284c7'
                        : colorPaletteId === 'amber' ? '#d97706'
                            : '#4f46e5'; // Default indigo

    const sidebarBg = '#1a1c23';
    const fontFamily = currentThemeConfig.defaultFontFamily;

    const header = resumeJson?.header || {} as any;
    const name = header.full_name || 'Your Name';
    const email = header.email || '';
    const location = header.location || '';
    const phone = header.phone || '';
    const linkedin = header.linkedin_url || '';
    const github = header.github_url || '';
    const portfolio = header.portfolio_url || '';
    const headline = header.headline || '';

    const currentAvatarUrl = header.photo_url || avatarUrl;
    const currentShowPhoto = header.show_photo !== undefined ? header.show_photo : showPhoto;

    const isSingleColumn = currentThemeConfig.layout === 'single_column';

    // Groups: which theme IDs use which rendering style branch
    const CREATIVE_THEMES = ['creative-visual', 'corporate-visual', 'compact-visual'];
    const EXECUTIVE_THEMES = ['executive-ats', 'minimal-visual'];
    const AWESOME_CV_THEMES = ['awesome-cv'];
    const JAKE_THEMES = ['jake-resume'];
    const ALTACV_THEMES = ['altacv'];
    const NEXTJS_THEMES = ['nextjs-resume'];
    const RENDERCV_THEMES = ['rendercv-tech'];
    const REACTIVE_THEMES = ['reactive-resume'];

    const isCreative = CREATIVE_THEMES.includes(themeId);
    const isExecutive = EXECUTIVE_THEMES.includes(themeId);
    const isAwesomeCV = AWESOME_CV_THEMES.includes(themeId);
    const isJakeResume = JAKE_THEMES.includes(themeId);
    const isAltaCV = ALTACV_THEMES.includes(themeId);
    const isNextjsResume = NEXTJS_THEMES.includes(themeId);
    const isRenderCV = RENDERCV_THEMES.includes(themeId);
    const isReactive = REACTIVE_THEMES.includes(themeId);
    const showIcons = currentThemeConfig.allowsIcons;
    const showPhotoConfig = currentThemeConfig.allowsPhoto && currentShowPhoto;

    const sidebarSectionKeys = ['skills', 'languages', 'certifications'];
    const sidebarSections = sectionOrder.filter(s => sidebarSectionKeys.includes(s as any));
    const mainSections = isSingleColumn
        ? sectionOrder
        : sectionOrder.filter(s => !sidebarSectionKeys.includes(s as any) && s !== 'header');

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION RENDERERS — shared across ATS & sidebar templates
    // ─────────────────────────────────────────────────────────────────────────
    const RENDERERS: Record<string, () => React.ReactNode> = {
        header: () => (
            <header className={isSingleColumn ? "mb-10 text-center" : "mb-8 border-b-2 pb-6"} style={!isSingleColumn ? { borderColor: accentColor } : {}} key="header">
                <h1 className={isSingleColumn ? "text-[32px] font-black text-zinc-900 uppercase tracking-widest mb-2" : "text-4xl font-bold text-zinc-900 uppercase tracking-widest mb-2"} style={{ color: isSingleColumn ? '#18181b' : accentColor }}>
                    {name}
                </h1>
                {headline && <div className={isSingleColumn ? "text-[14px] font-semibold text-zinc-500 uppercase tracking-widest mb-4" : "text-xl font-medium text-zinc-700 mb-4"}>{headline}</div>}
                <div className={isSingleColumn ? "flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-zinc-600 font-medium tracking-wider" : "flex flex-wrap gap-4 text-sm text-zinc-600 font-medium tracking-wide"}>
                    {email && <span>{email}</span>}
                    {phone && <span>• {phone}</span>}
                    {location && <span>• {location}</span>}
                    {linkedin && <span>• {linkedin.replace('https://www.linkedin.com/in/', '').replace('https://linkedin.com/in/', '')}</span>}
                    {github && <span>• {github.replace('https://github.com/', 'github.com/')}</span>}
                    {portfolio && <span>• {portfolio.replace(/^https?:\/\//, '')}</span>}
                </div>
            </header>
        ),
        summary: () => {
            if (!resumeJson?.summary) return null;
            return (
                <section className={isSingleColumn ? 'mb-8' : 'mb-10'} key="summary">
                    {isSingleColumn ? (
                        <h2 className="text-[12px] font-black text-zinc-900 uppercase tracking-widest mb-3 border-b border-zinc-200 pb-2">
                            Professional Summary
                        </h2>
                    ) : (
                        <div className="flex items-center gap-2 mb-4">
                            {showIcons && <div className="p-1.5 bg-zinc-100 rounded-sm"><User className="w-4 h-4 text-zinc-600" /></div>}
                            <h2 className={`text-lg font-bold text-zinc-900 uppercase tracking-widest ${!showIcons ? 'border-b border-zinc-200 pb-1 flex-1' : ''}`}
                                style={!showIcons ? { color: accentColor } : {}}>
                                Profile
                            </h2>
                        </div>
                    )}
                    <p className={isSingleColumn ? "text-[12px] leading-[1.8] text-zinc-700 text-justify" : "text-[14px] leading-relaxed text-zinc-600 text-justify"}>{resumeJson.summary}</p>
                </section>
            );
        },
        experience: () => {
            if (!resumeJson?.experience?.length) return null;
            return (
                <section className={isSingleColumn ? 'mb-8' : 'mb-10'} key="experience">
                    {isSingleColumn ? (
                        <h2 className="text-[12px] font-black text-zinc-900 uppercase tracking-widest mb-5 border-b border-zinc-200 pb-2">Experience</h2>
                    ) : (
                        <div className="flex items-center gap-2 mb-6">
                            {showIcons && <div className="p-1.5 bg-zinc-100 rounded-sm"><Briefcase className="w-4 h-4 text-zinc-600" /></div>}
                            <h2 className={`text-lg font-bold text-zinc-900 uppercase tracking-widest ${!showIcons ? 'border-b border-zinc-200 pb-1 flex-1' : ''}`}
                                style={!showIcons ? { color: accentColor } : {}}>
                                Experience
                            </h2>
                        </div>
                    )}
                    <div className={isSingleColumn ? 'space-y-6' : 'space-y-8'}>
                        {resumeJson.experience.map((exp: any, i: number) => (
                            <div key={i} className={!isSingleColumn ? 'relative pl-4 border-l-2 border-zinc-200' : ''}>
                                {!isSingleColumn && (
                                    <div className="absolute w-3 h-3 rounded-full -left-[7px] top-1.5 ring-4 ring-white" style={{ backgroundColor: accentColor }} />
                                )}
                                <div className={isSingleColumn ? 'flex justify-between items-start mb-0.5' : 'flex flex-col sm:flex-row justify-between items-start mb-2'}>
                                    <div>
                                        <h3 className={isSingleColumn ? "font-bold text-[13px] text-zinc-900 leading-snug" : "font-bold text-[16px] text-zinc-900"}>{exp.role}</h3>
                                        {!isSingleColumn && (
                                            <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mt-0.5">
                                                {exp.company}{exp.location && <span className="text-zinc-400 capitalize"> | {exp.location}</span>}
                                            </p>
                                        )}
                                    </div>
                                    <span className={isSingleColumn ? 'text-[11px] font-semibold text-zinc-500 tracking-wider uppercase whitespace-nowrap' : 'text-[12px] font-bold px-2 py-1 rounded mt-1 sm:mt-0 whitespace-nowrap'}
                                        style={!isSingleColumn ? { backgroundColor: `${accentColor}1A`, color: accentColor } : {}}>
                                        {exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}
                                    </span>
                                </div>
                                {isSingleColumn && (
                                    <div className="text-[12px] font-bold text-zinc-600 mb-3 flex items-center">
                                        {exp.company}{exp.location && <span className="text-zinc-400 font-medium ml-1">, {exp.location}</span>}
                                    </div>
                                )}
                                <ul className={isSingleColumn ? 'list-none space-y-2' : 'mt-3 space-y-2'}>
                                    {exp.bullets?.map((bullet: string, j: number) => (
                                        <li key={j} className={isSingleColumn
                                            ? 'text-[12px] text-zinc-700 leading-[1.7] pl-3 relative before:content-["•"] before:absolute before:left-0 before:text-zinc-400'
                                            : 'text-[13px] text-zinc-600 leading-relaxed pl-4 relative before:content-["■"] before:absolute before:left-0 before:top-[4px] before:text-[8px] before:text-zinc-300'
                                        }>{bullet}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            );
        },
        education: () => {
            if (!resumeJson?.education?.length) return null;
            return (
                <section className={isSingleColumn ? 'mb-8' : ''} key="education">
                    {isSingleColumn ? (
                        <h2 className="text-[12px] font-black text-zinc-900 uppercase tracking-widest mb-4 border-b border-zinc-200 pb-2">Education</h2>
                    ) : (
                        <div className="flex items-center gap-2 mb-6">
                            {showIcons && <div className="p-1.5 bg-zinc-100 rounded-sm"><Book className="w-4 h-4 text-zinc-600" /></div>}
                            <h2 className={`text-lg font-bold text-zinc-900 uppercase tracking-widest ${!showIcons ? 'border-b border-zinc-200 pb-1 flex-1' : ''}`}
                                style={!showIcons ? { color: accentColor } : {}}>
                                Education
                            </h2>
                        </div>
                    )}
                    <div className={isSingleColumn ? 'space-y-4' : 'grid grid-cols-1 gap-4'}>
                        {resumeJson.education.map((edu: any, i: number) => (
                            <div key={i} className={isSingleColumn ? 'flex justify-between items-start mb-3' : 'bg-zinc-50 p-4 rounded-lg border border-zinc-100 flex flex-col'}>
                                {isSingleColumn ? (
                                    /* Minimalist single-row flex layout */
                                    <>
                                        <div>
                                            <h3 className="font-bold text-[13px] text-zinc-900">
                                                {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                                            </h3>
                                            <p className="text-[12px] font-medium text-zinc-600 mt-0.5">{edu.school}</p>
                                            {edu.honors && (
                                                <div className="mt-1 text-[11px] text-zinc-500 leading-relaxed">
                                                    <span className="font-bold text-zinc-700">Honors:</span> {edu.honors}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="text-[11px] font-semibold text-zinc-500 tracking-wider uppercase block">
                                                {edu.start_date}{edu.start_date && edu.end_date ? ' - ' : ''}{edu.is_current ? 'Present' : edu.end_date}
                                            </span>
                                            {edu.gpa && <span className="text-[11px] font-bold text-zinc-400 mt-0.5 block">GPA: {edu.gpa}</span>}
                                        </div>
                                    </>
                                ) : (
                                    /* Standard box layout for sidebar theme etc */
                                    <>
                                        <div className="flex justify-between items-start w-full">
                                            <div>
                                                <h3 className="font-bold text-zinc-900 text-[14px]">
                                                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                                                </h3>
                                                <p className="text-[13px] text-zinc-500 mt-1">{edu.school}</p>
                                            </div>
                                            <div className="text-[12px] font-semibold text-zinc-400 flex flex-col items-end">
                                                <span>
                                                    {edu.start_date}{edu.start_date && edu.end_date ? ' - ' : ''}{edu.is_current ? 'Present' : edu.end_date}
                                                </span>
                                                {edu.gpa && <span className="text-[12px] text-zinc-500 mt-0.5">GPA: {edu.gpa}</span>}
                                            </div>
                                        </div>
                                        {edu.honors && (
                                            <div className="mt-3 text-[12px] text-zinc-500 leading-relaxed">
                                                <span className="font-semibold text-zinc-700">Honors & Activities:</span> {edu.honors}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            );
        },
        skills: () => {
            if (!resumeJson?.skills?.core?.length) return null;
            return (
                <section key="skills" className={isSingleColumn ? "mb-8" : ""}>
                    {isSingleColumn ? (
                        <h2 className="text-[12px] font-black text-zinc-900 uppercase tracking-widest mb-3 border-b border-zinc-200 pb-2">Skills</h2>
                    ) : (
                        <h2 className="text-sm font-bold tracking-widest uppercase text-zinc-100 border-b border-zinc-700 pb-2 mb-4">Skills</h2>
                    )}
                    <div className={isSingleColumn ? 'text-[12px] text-zinc-700 leading-relaxed' : 'flex flex-wrap gap-2'}>
                        {isSingleColumn ? (
                            <div className="space-y-1.5">
                                <div><span className="font-bold text-zinc-900 mr-2 uppercase text-[10px] tracking-widest">Core</span> {resumeJson.skills.core?.join(' • ') || ''}</div>
                                {(resumeJson.skills.tools?.length ?? 0) > 0 && (
                                    <div><span className="font-bold text-zinc-900 mr-2 uppercase text-[10px] tracking-widest">Tools</span> {resumeJson.skills.tools?.join(' • ') || ''}</div>
                                )}
                            </div>
                        ) : (
                            <>
                                {resumeJson.skills.core?.map((s: string, i: number) => (
                                    <span key={`c${i}`} className="bg-zinc-800 text-zinc-300 text-[11px] px-3 py-1 rounded-sm border border-zinc-700">{s}</span>
                                ))}
                                {resumeJson.skills.tools?.map((t: string, i: number) => (
                                    <span key={`t${i}`} className="bg-zinc-800 text-zinc-400 text-[11px] px-3 py-1 rounded-sm border border-zinc-700 border-dashed">{t}</span>
                                ))}
                            </>
                        )}
                    </div>
                </section>
            );
        },
        projects: () => {
            if (!resumeJson?.projects?.length) return null;
            return (
                <section className={isSingleColumn ? 'mb-8' : 'mb-10'} key="projects">
                    {isSingleColumn ? (
                        <h2 className="text-[12px] font-black text-zinc-900 uppercase tracking-widest mb-4 border-b border-zinc-200 pb-2">Projects</h2>
                    ) : (
                        <div className="flex items-center gap-2 mb-6">
                            {showIcons && <div className="p-1.5 bg-zinc-100 rounded-sm"><Briefcase className="w-4 h-4 text-zinc-600" /></div>}
                            <h2 className={`text-lg font-bold text-zinc-900 uppercase tracking-widest ${!showIcons ? 'border-b border-zinc-200 pb-1 flex-1' : ''}`}
                                style={!showIcons ? { color: accentColor } : {}}>
                                Projects
                            </h2>
                        </div>
                    )}
                    <div className={isSingleColumn ? 'space-y-5' : 'space-y-6'}>
                        {resumeJson.projects.map((proj: any, i: number) => (
                            <div key={i} className={!isSingleColumn ? 'relative pl-4 border-l-2 border-zinc-200' : ''}>
                                {!isSingleColumn && (
                                    <div className="absolute w-3 h-3 rounded-full -left-[7px] top-1.5 ring-4 ring-white" style={{ backgroundColor: accentColor }} />
                                )}
                                <div className={isSingleColumn ? 'flex justify-between items-start mb-0.5' : 'flex flex-col sm:flex-row justify-between items-start mb-2'}>
                                    <div>
                                        <h3 className={isSingleColumn ? "font-bold text-[13px] text-zinc-900 leading-snug" : "font-bold text-[16px] text-zinc-900"}>{proj.name}</h3>
                                        {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 font-medium block mt-0.5">{proj.link.replace(/^https?:\/\/(www\.)?/, '')}</a>}
                                    </div>
                                    <span className={isSingleColumn ? 'text-[11px] font-semibold text-zinc-500 tracking-wider uppercase whitespace-nowrap' : 'text-[12px] font-bold px-2 py-1 rounded mt-1 sm:mt-0 whitespace-nowrap'}
                                        style={!isSingleColumn ? { backgroundColor: `${accentColor}1A`, color: accentColor } : {}}>
                                        {proj.start_date || ''} {proj.start_date && proj.end_date ? '–' : ''} {proj.end_date || ''}
                                    </span>
                                </div>
                                <ul className={isSingleColumn ? 'list-none space-y-2 mt-2' : 'mt-3 space-y-2'}>
                                    {proj.bullets?.map((bullet: string, j: number) => (
                                        <li key={j} className={isSingleColumn
                                            ? 'text-[12px] text-zinc-700 leading-[1.7] pl-3 relative before:content-["•"] before:absolute before:left-0 before:text-zinc-400'
                                            : 'text-[13px] text-zinc-600 leading-relaxed pl-4 relative before:content-["■"] before:absolute before:left-0 before:top-[4px] before:text-[8px] before:text-zinc-300'
                                        }>{bullet}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            );
        },
        certifications: () => {
            if (!resumeJson?.certifications?.length) return null;
            return (
                <section className={isSingleColumn ? 'mb-8' : 'mb-10'} key="certifications">
                    {isSingleColumn ? (
                        <h2 className="text-[12px] font-black text-zinc-900 uppercase tracking-widest mb-4 border-b border-zinc-200 pb-2">Certifications</h2>
                    ) : (
                        <h2 className="text-sm font-bold tracking-widest uppercase text-zinc-100 border-b border-zinc-700 pb-2 mb-4">Certifications</h2>
                    )}
                    <div className={isSingleColumn ? 'space-y-3' : 'space-y-4'}>
                        {resumeJson.certifications.map((cert: any, i: number) => (
                            <div key={i} className={isSingleColumn ? 'flex justify-between items-start' : ''}>
                                <div>
                                    <h3 className={isSingleColumn ? "font-bold text-[13px] text-zinc-900" : "text-[13px] font-bold text-zinc-100"}>{cert.name}</h3>
                                    <p className={isSingleColumn ? "text-[12px] text-zinc-600 mt-0.5" : "text-[12px] text-zinc-400 mt-1"}>{cert.issuer}</p>
                                </div>
                                {isSingleColumn && cert.date && (
                                    <span className="text-[11px] font-semibold text-zinc-500 tracking-wider uppercase">{cert.date}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            );
        },
        languages: () => {
            if (!resumeJson?.languages?.length) return null;
            return (
                <section className={isSingleColumn ? 'mb-8' : 'mb-10'} key="languages">
                    {isSingleColumn ? (
                        <h2 className="text-[12px] font-black text-zinc-900 uppercase tracking-widest mb-3 border-b border-zinc-200 pb-2">Languages</h2>
                    ) : (
                        <h2 className="text-sm font-bold tracking-widest uppercase text-zinc-100 border-b border-zinc-700 pb-2 mb-4">Languages</h2>
                    )}
                    <div className={isSingleColumn ? 'flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-zinc-700' : 'space-y-3'}>
                        {resumeJson.languages.map((lang: any, i: number) => (
                            <div key={i} className={isSingleColumn ? 'flex items-center gap-2' : ''}>
                                {isSingleColumn ? (
                                    <>
                                        <span className="font-bold text-zinc-900 text-[13px]">{lang.language}</span>
                                        <span className="text-zinc-500 block">•</span>
                                        <span className="text-[12px] text-zinc-600">{lang.level}</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[13px] font-bold text-zinc-100">{lang.language}</span>
                                            <span className="text-[11px] text-zinc-400">{lang.level}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            );
        },
    };

    // ─────────────────────────────────────────────────────────────────────────
    // CREATIVE TEMPLATE — full-width colored header + two-column body
    // ─────────────────────────────────────────────────────────────────────────
    if (isCreative) {
        return (
            <div
                className="w-full bg-white shadow-2xl print:shadow-none shrink-0 relative"
                style={{ minHeight: '297mm', fontFamily, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' } as any}
            >
                {!isPro && <div className="hidden print:block absolute bottom-0 left-0 right-0 py-4 text-center text-[11px] font-bold text-zinc-400 tracking-widest z-50 uppercase">Created with CV Optimizer AI</div>}
                {/* ── Full-width colored header ─────────────────────────────── */}
                <div className="px-10 py-8 flex items-center justify-between relative" style={{ backgroundColor: accentColor }}>
                    <div className="flex-1 pr-6">
                        <h1 className="text-[38px] font-black text-white uppercase tracking-wide leading-none">{name}</h1>
                        {headline && (
                            <p className="text-white/70 font-bold uppercase tracking-widest mt-2 text-[13px]">{headline}</p>
                        )}
                        <div className="mt-4 flex flex-wrap items-center gap-4 text-white/80 text-[12px] font-medium">
                            {email && <span className="flex items-center gap-1.5"><Mail className="w-3 h-3 shrink-0" />{email}</span>}
                            {phone && <span className="flex items-center gap-1.5"><Phone className="w-3 h-3 shrink-0" />{phone}</span>}
                            {location && <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3 shrink-0" />{location}</span>}
                        </div>
                    </div>
                    {/* Circular photo */}
                    {showPhotoConfig && currentAvatarUrl ? (
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/30 shadow-xl shrink-0">
                            <img src={currentAvatarUrl} alt={name} className="w-full h-full object-cover" />
                        </div>
                    ) : showPhotoConfig ? (
                        <div className="w-24 h-24 rounded-full border-4 border-white/20 bg-white/10 flex items-center justify-center shrink-0">
                            <span className="text-3xl font-black text-white/80">{name.charAt(0)}</span>
                        </div>
                    ) : null}
                </div>

                {/* ── Two-column body ──────────────────────────────────────── */}
                <div className="flex flex-1">
                    {/* LEFT: Profile + Experience */}
                    <div className="flex-1 p-8 border-r border-zinc-100">
                        {/* Profile / Summary */}
                        {resumeJson?.summary && (
                            <section className="mb-8">
                                <h2 className="text-[14px] font-black uppercase tracking-widest mb-4 pb-1 border-b-[3px]" style={{ color: accentColor, borderColor: `${accentColor}44` }}>
                                    Profile
                                </h2>
                                <p className="text-[13px] leading-relaxed text-zinc-600 mt-4 text-justify">{resumeJson.summary}</p>
                            </section>
                        )}
                        {/* Experience */}
                        {resumeJson?.experience?.length > 0 && (
                            <section>
                                <h2 className="text-[14px] font-black uppercase tracking-widest mb-6 pb-1 border-b-[3px]" style={{ color: accentColor, borderColor: `${accentColor}44` }}>
                                    Experience
                                </h2>
                                <div className="space-y-8">
                                    {resumeJson.experience.map((exp: any, i: number) => (
                                        <div key={i} className="relative pl-4 border-l-2 border-zinc-100">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="text-[15px] font-bold text-zinc-900">{exp.role}</h3>
                                                <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
                                                    {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
                                                </span>
                                            </div>
                                            <p className="text-[13px] font-black uppercase tracking-wide mb-3" style={{ color: accentColor }}>{exp.company}</p>
                                            <ul className="space-y-2">
                                                {exp.bullets?.map((bullet: string, j: number) => (
                                                    <li key={j} className="text-[12px] text-zinc-600 leading-relaxed pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-zinc-300">
                                                        {bullet}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* RIGHT: Skills + Education + Connect */}
                    <div className="w-[36%] shrink-0 p-8 bg-zinc-50/50">
                        {/* Skills */}
                        {(resumeJson?.skills?.core?.length ?? 0) > 0 && (
                            <section className="mb-10">
                                <h2 className="text-[14px] font-black uppercase tracking-widest mb-6 pb-1 border-b-[3px]" style={{ color: accentColor, borderColor: `${accentColor}44` }}>
                                    Skills
                                </h2>
                                <div className="space-y-4">
                                    {[...(resumeJson.skills.core || []), ...(resumeJson.skills.tools || [])].map((skill: string, i: number) => (
                                        <div key={i}>
                                            <p className="text-[12px] font-bold text-zinc-700 mb-1">{skill}</p>
                                            <div className="h-[6px] w-full bg-zinc-200 rounded-full overflow-hidden">
                                                <div className="h-full rounded-full" style={{ backgroundColor: accentColor, width: '100%' }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                        {/* Education */}
                        {resumeJson?.education?.length > 0 && (
                            <section className="mb-10">
                                <h2 className="text-[14px] font-black uppercase tracking-widest mb-6 pb-1 border-b-[3px]" style={{ color: accentColor, borderColor: `${accentColor}44` }}>
                                    Education
                                </h2>
                                <div className="space-y-4">
                                    {resumeJson.education.map((edu: any, i: number) => (
                                        <div key={i} className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm">
                                            <p className="text-[13px] font-black text-zinc-900 leading-snug">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                                            <p className="text-[12px] text-zinc-500 font-bold mt-1 uppercase tracking-wide">{edu.school}</p>
                                            <div className="flex justify-between items-end mt-2">
                                                <p className="text-[11px] text-zinc-400 font-bold">
                                                    {edu.start_date} - {edu.is_current ? 'Present' : edu.end_date}
                                                </p>
                                                {edu.gpa && <p className="text-[10px] font-bold text-zinc-400">GPA: {edu.gpa}</p>}
                                            </div>
                                            {edu.honors && <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed"><span className="font-bold text-zinc-700">Honors:</span> {edu.honors}</p>}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                        {/* Connect / Links */}
                        {(linkedin || github || portfolio) && (
                            <section>
                                <h2 className="text-[14px] font-black uppercase tracking-widest mb-6 pb-1 border-b-[3px]" style={{ color: accentColor, borderColor: `${accentColor}44` }}>
                                    Connect
                                </h2>
                                <div className="space-y-3">
                                    {linkedin && (
                                        <div className="flex items-start gap-2.5 text-[12px] text-zinc-600 break-all group">
                                            <LinkedinIcon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: accentColor }} />
                                            <span className="font-medium group-hover:text-zinc-900 transition-colors">{linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
                                        </div>
                                    )}
                                    {github && (
                                        <div className="flex items-start gap-2.5 text-[12px] text-zinc-600 break-all group">
                                            <Github className="w-4 h-4 mt-0.5 shrink-0" style={{ color: accentColor }} />
                                            <span className="font-medium group-hover:text-zinc-900 transition-colors">{github.replace(/^https?:\/\/(www\.)?/, '')}</span>
                                        </div>
                                    )}
                                    {portfolio && (
                                        <div className="flex items-start gap-2.5 text-[12px] text-zinc-600 break-all group">
                                            <Globe className="w-4 h-4 mt-0.5 shrink-0" style={{ color: accentColor }} />
                                            <span className="font-medium group-hover:text-zinc-900 transition-colors">{portfolio.replace(/^https?:\/\/(www\.)?/, '')}</span>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center py-4 text-[10px] text-zinc-300 border-t border-zinc-100 mt-4">
                    Created with CV Optimizer
                </div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // EXECUTIVE TEMPLATE — Distinct Premium Two-Column Layout
    // ─────────────────────────────────────────────────────────────────────────
    if (isExecutive) {
        return (
            <div
                className="max-w-[210mm] w-full bg-white shadow-2xl print:shadow-none shrink-0 relative flex flex-col"
                style={{ minHeight: '297mm', fontFamily, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' } as any}
            >
                {!isPro && <div className="hidden print:block absolute bottom-0 left-0 right-0 py-4 text-center text-[11px] font-bold text-zinc-400 tracking-widest z-50 uppercase">Created with CV Optimizer AI</div>}

                {/* Heavy Executive Header */}
                <div className="pt-10 pb-8 px-10 border-b-[6px]" style={{ borderColor: accentColor }}>
                    <div className="flex justify-between items-end gap-6">
                        <div className="flex-1">
                            <h1 className="text-[42px] font-black text-zinc-900 tracking-tight leading-[1] uppercase">{name}</h1>
                            {headline && (
                                <p className="text-[16px] font-bold uppercase tracking-widest mt-2 text-zinc-600" style={{ color: accentColor }}>{headline}</p>
                            )}
                        </div>
                        {/* Optional small circular photo if enabled */}
                        {showPhotoConfig && currentAvatarUrl && (
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 shadow-sm shrink-0" style={{ borderColor: accentColor }}>
                                <img src={currentAvatarUrl} alt={name} className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                    {/* Header Contact Strip */}
                    <div className="flex flex-wrap items-center mt-5 pt-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest border-t border-zinc-200">
                        {email && <span className="mr-5">{email}</span>}
                        {phone && <span className="mr-5">{phone}</span>}
                        {location && <span className="mr-5">{location}</span>}
                        {linkedin && <span className="mr-5">{linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>}
                        {portfolio && <span>{portfolio.replace(/^https?:\/\/(www\.)?/, '')}</span>}
                    </div>
                </div>

                <div className="flex flex-1">
                    {/* Left Column (Contact & Skills) - 30% Width */}
                    <div className="w-[30%] bg-zinc-50/80 p-8 border-r border-zinc-200">
                        {/* Summary in Sidebar (Optional Executive Style) */}
                        {resumeJson?.summary && (
                            <section className="mb-10">
                                <h2 className="text-[12px] font-black uppercase tracking-widest text-zinc-900 mb-4 pb-2 border-b-2" style={{ borderColor: accentColor }}>
                                    Executive Summary
                                </h2>
                                <p className="text-[11.5px] font-medium leading-[1.8] text-zinc-600 text-justify">{resumeJson.summary}</p>
                            </section>
                        )}

                        {/* Skills */}
                        {(resumeJson?.skills?.core?.length ?? 0) > 0 && (
                            <section className="mb-10">
                                <h2 className="text-[12px] font-black uppercase tracking-widest text-zinc-900 mb-4 pb-2 border-b-2" style={{ borderColor: accentColor }}>
                                    Core Competencies
                                </h2>
                                <div className="space-y-2.5">
                                    {resumeJson.skills.core?.map((skill: string, i: number) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-sm shrink-0 mt-[5px]" style={{ backgroundColor: accentColor }} />
                                            <span className="text-[12px] font-bold text-zinc-700 leading-snug">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                                {(resumeJson.skills.tools?.length ?? 0) > 0 && (
                                    <div className="mt-5">
                                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Tools & Tech</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {resumeJson.skills.tools?.map((tool: string, i: number) => (
                                                <span key={`t${i}`} className="text-[10px] font-bold px-2 py-1 bg-white border border-zinc-200 rounded text-zinc-600">
                                                    {tool}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Education (moved to right side normally, but sidebar if desired) */}
                        {/* We'll put Education on the Right Column as it's data-heavy */}

                        {/* Certifications / Languages in sidebar */}
                    </div>

                    {/* Right Column (Experience & Education) - 70% Width */}
                    <div className="flex-1 p-8 pl-10 pr-10 bg-white">
                        {/* Experience */}
                        {resumeJson?.experience?.length > 0 && (
                            <section className="mb-10">
                                <h2 className="text-[14px] font-black uppercase tracking-widest text-zinc-900 mb-6 flex items-center gap-3">
                                    <span className="w-6 h-1" style={{ backgroundColor: accentColor }}></span>
                                    Professional Experience
                                </h2>
                                <div className="space-y-8">
                                    {resumeJson.experience.map((exp: any, i: number) => (
                                        <div key={i}>
                                            <div className="flex justify-between items-baseline mb-1 border-b border-zinc-100 pb-2">
                                                <div>
                                                    <h3 className="text-[15px] font-black text-zinc-900">{exp.role}</h3>
                                                    <p className="text-[13.5px] font-bold mt-1" style={{ color: accentColor }}>{exp.company}{exp.location && <span className="text-zinc-500 font-medium ml-1">, {exp.location}</span>}</p>
                                                </div>
                                                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider shrink-0 ml-4 py-1 px-2 bg-zinc-50 rounded">
                                                    {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
                                                </span>
                                            </div>

                                            <ul className="space-y-2.5 mt-4">
                                                {exp.bullets?.map((bullet: string, j: number) => (
                                                    <li key={j} className="text-[12.5px] font-medium text-zinc-700 leading-[1.65] pl-4 relative before:absolute before:left-0 before:top-[6px] before:w-1 before:h-1 before:bg-zinc-400 before:rounded-full">
                                                        {bullet}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education (Right Column) */}
                        {resumeJson?.education?.length > 0 && (
                            <section>
                                <h2 className="text-[14px] font-black uppercase tracking-widest text-zinc-900 mb-6 flex items-center gap-3">
                                    <span className="w-6 h-1" style={{ backgroundColor: accentColor }}></span>
                                    Education & Details
                                </h2>
                                <div className="grid grid-cols-1 gap-5">
                                    {resumeJson.education.map((edu: any, i: number) => (
                                        <div key={i} className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-[14px] text-zinc-900 leading-snug">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                                                <p className="text-[13px] font-medium text-zinc-600 mt-1">{edu.school}</p>
                                                {edu.honors && <p className="text-[11.5px] text-zinc-600 mt-2 leading-[1.6]"><span className="font-bold text-zinc-800">Honors:</span> {edu.honors}</p>}
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                                                    {edu.start_date} - {edu.is_current ? 'Present' : edu.end_date}
                                                </p>
                                                {edu.gpa && <p className="text-[11px] font-bold py-0.5 px-2 bg-zinc-50 rounded mt-1.5 inline-block text-zinc-600 border border-zinc-200">GPA: {edu.gpa}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // AWESOME-CV — Dark teal sidebar + white right column (posquit0/Awesome-CV)
    // ─────────────────────────────────────────────────────────────────────────
    if (isAwesomeCV) {
        const sidebarColor = accentColor;
        return (
            <div className="max-w-[210mm] w-full shadow-2xl print:shadow-none flex flex-row shrink-0 relative" style={{ minHeight: '297mm', fontFamily: 'Roboto, sans-serif', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' } as any}>
                {!isPro && <div className="hidden print:block absolute bottom-0 left-0 right-0 py-4 text-center text-[11px] font-bold text-zinc-400 tracking-widest z-50 uppercase">Created with CV Optimizer AI</div>}
                {/* Left dark sidebar */}
                <aside className="w-[30%] shrink-0 flex flex-col" style={{ backgroundColor: sidebarColor }}>
                    {/* Photo */}
                    <div className="flex justify-center pt-10 pb-6 px-5">
                        {showPhotoConfig && currentAvatarUrl ? (
                            <img src={currentAvatarUrl} alt={name} className="w-28 h-28 rounded-full object-cover border-4 border-white/20 shadow-xl" />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center shadow-xl">
                                <span className="text-4xl font-black text-white">{name.charAt(0)}</span>
                            </div>
                        )}
                    </div>
                    {/* Name block */}
                    <div className="px-5 pb-4 text-center border-b border-white/20">
                        <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest">{headline}</p>
                    </div>
                    {/* Contact */}
                    <div className="px-5 pt-5 pb-4">
                        <h2 className="text-[9px] font-black uppercase tracking-[3px] text-white/50 mb-3">Contact</h2>
                        <div className="space-y-2">
                            {email && <div className="flex items-start gap-2 text-[11px] text-white/80 break-all"><Mail className="w-3 h-3 mt-0.5 shrink-0 text-white/50" />{email}</div>}
                            {phone && <div className="flex items-start gap-2 text-[11px] text-white/80"><Phone className="w-3 h-3 mt-0.5 shrink-0 text-white/50" />{phone}</div>}
                            {location && <div className="flex items-start gap-2 text-[11px] text-white/80"><MapPin className="w-3 h-3 mt-0.5 shrink-0 text-white/50" />{location}</div>}
                            {linkedin && <div className="flex items-start gap-2 text-[11px] text-white/80 break-all"><LinkedinIcon className="w-3 h-3 mt-0.5 shrink-0 text-white/50" />{linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</div>}
                            {github && <div className="flex items-start gap-2 text-[11px] text-white/80 break-all"><Github className="w-3 h-3 mt-0.5 shrink-0 text-white/50" />{github.replace(/^https?:\/\/(www\.)?/, '')}</div>}
                        </div>
                    </div>
                    {/* Skills */}
                    {(resumeJson?.skills?.core?.length ?? 0) > 0 && (
                        <div className="px-5 pt-2 pb-4">
                            <h2 className="text-[9px] font-black uppercase tracking-[3px] text-white/50 mb-3">Skills</h2>
                            <div className="space-y-1.5">
                                {[...(resumeJson.skills?.core || []), ...(resumeJson.skills?.tools || [])].slice(0, 10).map((s: string, i: number) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white/50 shrink-0" />
                                        <span className="text-[11px] text-white/80">{s}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Languages */}
                    {resumeJson?.languages?.length > 0 && (
                        <div className="px-5 pt-2">
                            <h2 className="text-[9px] font-black uppercase tracking-[3px] text-white/50 mb-3">Languages</h2>
                            <div className="space-y-1.5">
                                {resumeJson.languages.map((l: any, i: number) => (
                                    <div key={i} className="text-[11px] text-white/80">{l.language} <span className="text-white/40">· {l.level}</span></div>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>
                {/* Right white column */}
                <main className="flex-1 bg-white flex flex-col">
                    {/* Header */}
                    <div className="px-8 pt-10 pb-6 border-b-2" style={{ borderColor: sidebarColor }}>
                        <h1 className="text-[34px] font-black text-zinc-900 uppercase tracking-widest leading-none">{name}</h1>
                        {headline && <p className="text-[13px] font-bold uppercase tracking-widest mt-2" style={{ color: sidebarColor }}>{headline}</p>}
                    </div>
                    <div className="flex-1 px-8 pt-6 space-y-6">
                        {/* Summary */}
                        {resumeJson?.summary && (
                            <section>
                                <h2 className="text-[11px] font-black uppercase tracking-[3px] mb-3 pb-1 border-b-2" style={{ color: sidebarColor, borderColor: sidebarColor }}>Summary</h2>
                                <p className="text-[12px] leading-relaxed text-zinc-600">{resumeJson.summary}</p>
                            </section>
                        )}
                        {/* Experience */}
                        {resumeJson?.experience?.length > 0 && (
                            <section>
                                <h2 className="text-[11px] font-black uppercase tracking-[3px] mb-4 pb-1 border-b-2" style={{ color: sidebarColor, borderColor: sidebarColor }}>Experience</h2>
                                <div className="space-y-5">
                                    {resumeJson.experience.map((exp: any, i: number) => (
                                        <div key={i}>
                                            <div className="flex justify-between items-baseline">
                                                <h3 className="text-[13px] font-black text-zinc-900">{exp.role}</h3>
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}</span>
                                            </div>
                                            <p className="text-[11px] font-bold uppercase tracking-wide mt-0.5" style={{ color: sidebarColor }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                                            <ul className="mt-2 space-y-1">
                                                {exp.bullets?.map((b: string, j: number) => (
                                                    <li key={j} className="text-[11.5px] text-zinc-600 leading-relaxed pl-3 relative before:content-['▸'] before:absolute before:left-0 before:font-bold" style={{ '--tw-before-color': sidebarColor } as any}>{b}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                        {/* Education */}
                        {resumeJson?.education?.length > 0 && (
                            <section>
                                <h2 className="text-[11px] font-black uppercase tracking-[3px] mb-4 pb-1 border-b-2" style={{ color: sidebarColor, borderColor: sidebarColor }}>Education</h2>
                                <div className="space-y-3">
                                    {resumeJson.education.map((edu: any, i: number) => (
                                        <div key={i} className="flex justify-between items-start">
                                            <div><h3 className="text-[12.5px] font-bold text-zinc-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3><p className="text-[11px] text-zinc-500">{edu.school}</p></div>
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider shrink-0 ml-4">{edu.start_date} – {edu.is_current ? 'Present' : edu.end_date}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </main>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // JAKE'S RESUME — Ultra-compact single column, horizontal-rule sections
    // ─────────────────────────────────────────────────────────────────────────
    if (isJakeResume) {
        return (
            <div className="max-w-[210mm] w-full bg-white shadow-2xl print:shadow-none shrink-0 px-11 py-9 relative" style={{ minHeight: '297mm', fontFamily: 'Georgia, Charter, serif', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' } as any}>
                {!isPro && <div className="hidden print:block absolute bottom-0 left-0 right-0 py-4 text-center text-[11px] font-bold text-zinc-400 tracking-widest z-50 uppercase">Created with CV Optimizer AI</div>}
                {/* Header */}
                <div className="text-center mb-4">
                    <h1 className="text-[28px] font-black text-zinc-900 tracking-tight">{name}</h1>
                    <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 text-[11px] text-zinc-600 font-medium mt-1.5">
                        {phone && <span>{phone}</span>}
                        {phone && email && <span>·</span>}
                        {email && <span>{email}</span>}
                        {email && location && <span>·</span>}
                        {location && <span>{location}</span>}
                        {(location || email) && linkedin && <span>·</span>}
                        {linkedin && <span>{linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, 'linkedin.com/in/')}</span>}
                        {linkedin && github && <span>·</span>}
                        {github && <span>{github.replace(/^https?:\/\/(www\.)?github\.com\//, 'github.com/')}</span>}
                    </div>
                </div>
                <hr className="border-t border-zinc-900 mb-4" />
                {/* Education */}
                {resumeJson?.education?.length > 0 && (
                    <section className="mb-3">
                        <h2 className="text-[12px] font-black uppercase tracking-widest text-zinc-900 mb-1">Education</h2>
                        <hr className="border-t border-zinc-900 mb-2" />
                        {resumeJson.education.map((edu: any, i: number) => (
                            <div key={i} className="flex justify-between items-baseline mb-0.5">
                                <div><span className="text-[12px] font-bold text-zinc-900">{edu.school}</span> <span className="text-[11px] text-zinc-500">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.gpa ? ` — GPA: ${edu.gpa}` : ''}</span></div>
                                <span className="text-[11px] text-zinc-600 shrink-0 ml-4">{edu.start_date} – {edu.is_current ? 'Present' : edu.end_date}</span>
                            </div>
                        ))}
                    </section>
                )}
                {/* Experience */}
                {resumeJson?.experience?.length > 0 && (
                    <section className="mb-3">
                        <h2 className="text-[12px] font-black uppercase tracking-widest text-zinc-900 mb-1">Experience</h2>
                        <hr className="border-t border-zinc-900 mb-2" />
                        <div className="space-y-2.5">
                            {resumeJson.experience.map((exp: any, i: number) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-[12px] font-bold text-zinc-900">{exp.role}</span>
                                        <span className="text-[11px] text-zinc-600 shrink-0 ml-4">{exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-[11.5px] font-medium text-zinc-700 italic">{exp.company}{exp.location ? `, ${exp.location}` : ''}</span>
                                    </div>
                                    <ul className="mt-1 space-y-0.5">
                                        {exp.bullets?.map((b: string, j: number) => (
                                            <li key={j} className="text-[11px] text-zinc-700 leading-snug pl-4 relative before:content-['•'] before:absolute before:left-1.5">{b}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                {/* Projects/Skills */}
                {(resumeJson?.skills?.core?.length ?? 0) > 0 && (
                    <section className="mb-3">
                        <h2 className="text-[12px] font-black uppercase tracking-widest text-zinc-900 mb-1">Technical Skills</h2>
                        <hr className="border-t border-zinc-900 mb-2" />
                        <div className="flex flex-wrap gap-y-1">
                            {(resumeJson.skills?.core?.length ?? 0) > 0 && (
                                <div className="text-[11px] text-zinc-700 w-full"><span className="font-bold">Languages:</span> {(resumeJson.skills.core ?? []).join(', ')}</div>
                            )}
                            {(resumeJson.skills?.tools?.length ?? 0) > 0 && (
                                <div className="text-[11px] text-zinc-700 w-full"><span className="font-bold">Frameworks & Tools:</span> {(resumeJson.skills.tools ?? []).join(', ')}</div>
                            )}
                        </div>
                    </section>
                )}
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ALTACV — Two-column: narrow left with profile dots, wide right main
    // ─────────────────────────────────────────────────────────────────────────
    if (isAltaCV) {
        return (
            <div className="max-w-[210mm] w-full bg-white shadow-2xl print:shadow-none flex flex-col shrink-0 relative" style={{ minHeight: '297mm', fontFamily: 'Lato, sans-serif', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' } as any}>
                {!isPro && <div className="hidden print:block absolute bottom-0 left-0 right-0 py-4 text-center text-[11px] font-bold text-zinc-400 tracking-widest z-50 uppercase">Created with CV Optimizer AI</div>}
                {/* Full-width header */}
                <div className="px-10 py-7" style={{ backgroundColor: accentColor }}>
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex-1">
                            <h1 className="text-[36px] font-black text-white leading-none tracking-tight">{name}</h1>
                            {headline && <p className="text-white/75 text-[14px] font-medium mt-1.5">{headline}</p>}
                        </div>
                        {showPhotoConfig && currentAvatarUrl && (
                            <img src={currentAvatarUrl} alt={name} className="w-20 h-20 rounded-full object-cover border-4 border-white/30 shrink-0" />
                        )}
                    </div>
                </div>
                {/* Body */}
                <div className="flex flex-1">
                    {/* Narrow left column */}
                    <aside className="w-[35%] shrink-0 bg-zinc-50 border-r border-zinc-100 px-6 py-6 space-y-6">
                        {/* Contact */}
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[3px] mb-2" style={{ color: accentColor }}>Contact</h3>
                            <div className="space-y-1.5">
                                {email && <div className="flex items-start gap-1.5 text-[11px] text-zinc-600"><span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1" style={{ backgroundColor: accentColor }} />{email}</div>}
                                {phone && <div className="flex items-start gap-1.5 text-[11px] text-zinc-600"><span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1" style={{ backgroundColor: accentColor }} />{phone}</div>}
                                {location && <div className="flex items-start gap-1.5 text-[11px] text-zinc-600"><span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1" style={{ backgroundColor: accentColor }} />{location}</div>}
                                {linkedin && <div className="flex items-start gap-1.5 text-[11px] text-zinc-600 break-all"><span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1" style={{ backgroundColor: accentColor }} />{linkedin.replace(/^https?:\/\/(www\.)?/, '')}</div>}
                            </div>
                        </div>
                        {/* Skills */}
                        {(resumeJson?.skills?.core?.length ?? 0) > 0 && (
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[3px] mb-2" style={{ color: accentColor }}>Skills</h3>
                                <div className="space-y-1">
                                    {[...(resumeJson.skills?.core || []), ...(resumeJson.skills?.tools || [])].slice(0, 10).map((s: string, i: number) => (
                                        <div key={i} className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                                            <span className="text-[11px] text-zinc-700">{s}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Education */}
                        {resumeJson?.education?.length > 0 && (
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[3px] mb-2" style={{ color: accentColor }}>Education</h3>
                                {resumeJson.education.map((edu: any, i: number) => (
                                    <div key={i} className="mb-2">
                                        <p className="text-[11.5px] font-bold text-zinc-900 leading-snug">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                                        <p className="text-[11px] text-zinc-500">{edu.school}</p>
                                        <p className="text-[10px] text-zinc-400">{edu.start_date} – {edu.is_current ? 'Present' : edu.end_date}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Languages */}
                        {resumeJson?.languages?.length > 0 && (
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[3px] mb-2" style={{ color: accentColor }}>Languages</h3>
                                {resumeJson.languages.map((l: any, i: number) => (
                                    <div key={i} className="flex items-center gap-1.5 mb-1">
                                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                                        <span className="text-[11px] text-zinc-700">{l.language}</span>
                                        <span className="text-[10px] text-zinc-400">· {l.level}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </aside>
                    {/* Wide right main */}
                    <main className="flex-1 px-8 py-6 space-y-6">
                        {resumeJson?.summary && (
                            <section>
                                <h2 className="text-[11px] font-black uppercase tracking-[3px] mb-2 flex items-center gap-2" style={{ color: accentColor }}>
                                    <span className="w-5 h-0.5" style={{ backgroundColor: accentColor }} />About Me
                                </h2>
                                <p className="text-[12px] leading-relaxed text-zinc-600">{resumeJson.summary}</p>
                            </section>
                        )}
                        {resumeJson?.experience?.length > 0 && (
                            <section>
                                <h2 className="text-[11px] font-black uppercase tracking-[3px] mb-3 flex items-center gap-2" style={{ color: accentColor }}>
                                    <span className="w-5 h-0.5" style={{ backgroundColor: accentColor }} />Experience
                                </h2>
                                <div className="space-y-5">
                                    {resumeJson.experience.map((exp: any, i: number) => (
                                        <div key={i} className="pl-3" style={{ borderLeft: `3px solid ${accentColor}33` }}>
                                            <div className="flex justify-between items-baseline">
                                                <h3 className="text-[13px] font-black text-zinc-900">{exp.role}</h3>
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase shrink-0 ml-3">{exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}</span>
                                            </div>
                                            <p className="text-[11.5px] font-bold mt-0.5" style={{ color: accentColor }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                                            <ul className="mt-1.5 space-y-1">
                                                {exp.bullets?.map((b: string, j: number) => (
                                                    <li key={j} className="text-[11.5px] text-zinc-600 leading-relaxed pl-2 relative before:content-['·'] before:absolute before:left-0 before:font-black" style={{ '--accent': accentColor } as any}>{b}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </main>
                </div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // NEXTJS RESUME — Minimal centered, big italic name (ibelick/nextjs-resume)
    // ─────────────────────────────────────────────────────────────────────────
    if (isNextjsResume) {
        return (
            <div className="max-w-[210mm] w-full bg-white shadow-2xl print:shadow-none px-16 py-14 shrink-0 relative" style={{ minHeight: '297mm', fontFamily: 'Inter, system-ui, sans-serif', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' } as any}>
                {!isPro && <div className="hidden print:block absolute bottom-0 left-0 right-0 py-4 text-center text-[11px] font-bold text-zinc-400 tracking-widest z-50 uppercase">Created with CV Optimizer AI</div>}
                {/* Header: centered, minimal */}
                <div className="mb-10 pb-8 border-b border-zinc-200">
                    <h1 className="text-[40px] font-light text-zinc-900 tracking-tight leading-none mb-2">{name}</h1>
                    {headline && <p className="text-[15px] text-zinc-500 font-normal mb-4">{headline}</p>}
                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-zinc-500">
                        {email && <span>{email}</span>}
                        {phone && <span>{phone}</span>}
                        {location && <span>{location}</span>}
                        {linkedin && <span>{linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>}
                        {github && <span>{github.replace(/^https?:\/\/(www\.)?/, '')}</span>}
                        {portfolio && <span>{portfolio.replace(/^https?:\/\/(www\.)?/, '')}</span>}
                    </div>
                </div>
                {/* Summary */}
                {resumeJson?.summary && (
                    <section className="mb-8">
                        <p className="text-[13px] leading-[1.9] text-zinc-600 font-light">{resumeJson.summary}</p>
                    </section>
                )}
                {/* Experience */}
                {resumeJson?.experience?.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-[11px] font-semibold uppercase tracking-[4px] text-zinc-400 mb-5">Experience</h2>
                        <div className="space-y-6">
                            {resumeJson.experience.map((exp: any, i: number) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="text-[14px] font-semibold text-zinc-900">{exp.role}</h3>
                                        <span className="text-[11px] text-zinc-400">{exp.start_date} — {exp.is_current ? 'Present' : exp.end_date}</span>
                                    </div>
                                    <p className="text-[12.5px] text-zinc-500 mb-2">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                                    <ul className="space-y-1">
                                        {exp.bullets?.map((b: string, j: number) => (
                                            <li key={j} className="text-[12px] text-zinc-600 font-light leading-relaxed flex gap-2"><span className="text-zinc-300 shrink-0">—</span>{b}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                {/* Education */}
                {resumeJson?.education?.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-[11px] font-semibold uppercase tracking-[4px] text-zinc-400 mb-5">Education</h2>
                        <div className="space-y-3">
                            {resumeJson.education.map((edu: any, i: number) => (
                                <div key={i} className="flex justify-between items-baseline">
                                    <div><p className="text-[13px] font-semibold text-zinc-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p><p className="text-[12px] text-zinc-500">{edu.school}</p></div>
                                    <span className="text-[11px] text-zinc-400 shrink-0 ml-4">{edu.start_date} — {edu.is_current ? 'Present' : edu.end_date}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                {/* Skills */}
                {(resumeJson?.skills?.core?.length ?? 0) > 0 && (
                    <section>
                        <h2 className="text-[11px] font-semibold uppercase tracking-[4px] text-zinc-400 mb-5">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {[...(resumeJson.skills?.core || []), ...(resumeJson.skills?.tools || [])].map((s: string, i: number) => (
                                <span key={i} className="text-[12px] px-3 py-1 border border-zinc-200 rounded-full text-zinc-700 font-light">{s}</span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // RENDERCV TECH — Dense single-col engineering format (rendercv/rendercv)
    // ─────────────────────────────────────────────────────────────────────────
    if (isRenderCV) {
        return (
            <div className="max-w-[210mm] w-full bg-white shadow-2xl print:shadow-none px-10 py-10 shrink-0 relative" style={{ minHeight: '297mm', fontFamily: 'Roboto Mono, monospace', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' } as any}>
                {!isPro && <div className="hidden print:block absolute bottom-0 left-0 right-0 py-4 text-center text-[11px] font-bold text-zinc-400 tracking-widest z-50 uppercase">Created with CV Optimizer AI</div>}
                {/* Dense header */}
                <div className="mb-5 pb-4" style={{ borderBottom: `2px solid ${accentColor}` }}>
                    <h1 className="text-[26px] font-black text-zinc-900 tracking-tight leading-none">{name}</h1>
                    {headline && <p className="text-[12px] font-bold mt-1" style={{ color: accentColor }}>{headline}</p>}
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-0.5 text-[10.5px] text-zinc-500 font-mono">
                        {email && <span>{email}</span>}
                        {phone && <span>{phone}</span>}
                        {location && <span>{location}</span>}
                        {linkedin && <span>{linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>}
                        {github && <span>{github.replace(/^https?:\/\/(www\.)?/, '')}</span>}
                    </div>
                </div>
                {/* Skills — first for ATS */}
                {(resumeJson?.skills?.core?.length ?? 0) > 0 && (
                    <section className="mb-4">
                        <h2 className="text-[10px] font-black uppercase tracking-[3px] mb-2" style={{ color: accentColor }}>Technical Skills</h2>
                        <div className="space-y-1">
                            {(resumeJson.skills?.core?.length ?? 0) > 0 && (
                                <p className="text-[11px] text-zinc-700 leading-snug"><span className="font-bold">Languages:</span> {(resumeJson.skills.core ?? []).join(' · ')}</p>
                            )}
                            {(resumeJson.skills?.tools?.length ?? 0) > 0 && (
                                <p className="text-[11px] text-zinc-700 leading-snug"><span className="font-bold">Technologies:</span> {(resumeJson.skills.tools ?? []).join(' · ')}</p>
                            )}
                        </div>
                    </section>
                )}
                {/* Experience */}
                {resumeJson?.experience?.length > 0 && (
                    <section className="mb-4">
                        <h2 className="text-[10px] font-black uppercase tracking-[3px] mb-2" style={{ color: accentColor }}>Experience</h2>
                        <div className="space-y-3">
                            {resumeJson.experience.map((exp: any, i: number) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-[12px] font-black text-zinc-900">{exp.role}</span>
                                        <span className="text-[10px] font-mono text-zinc-400 shrink-0 ml-3">{exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}</span>
                                    </div>
                                    <p className="text-[11px] font-bold mb-1.5" style={{ color: accentColor }}>{exp.company}{exp.location ? ` | ${exp.location}` : ''}</p>
                                    <ul className="space-y-0.5">
                                        {exp.bullets?.map((b: string, j: number) => (
                                            <li key={j} className="text-[10.5px] text-zinc-700 leading-snug pl-3 relative before:content-['-'] before:absolute before:left-0 before:text-zinc-400">{b}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                {/* Education */}
                {resumeJson?.education?.length > 0 && (
                    <section className="mb-4">
                        <h2 className="text-[10px] font-black uppercase tracking-[3px] mb-2" style={{ color: accentColor }}>Education</h2>
                        {resumeJson.education.map((edu: any, i: number) => (
                            <div key={i} className="flex justify-between items-baseline mb-1">
                                <span className="text-[11.5px] font-bold text-zinc-900">{edu.school} <span className="font-normal text-zinc-600">— {edu.degree}{edu.field ? ` in ${edu.field}` : ''}</span></span>
                                <span className="text-[10px] font-mono text-zinc-400 shrink-0 ml-3">{edu.start_date} – {edu.is_current ? 'Present' : edu.end_date}</span>
                            </div>
                        ))}
                    </section>
                )}
                {/* Summary at bottom (as most FAANG CVs lead with skills/exp) */}
                {resumeJson?.summary && (
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[3px] mb-2" style={{ color: accentColor }}>Summary</h2>
                        <p className="text-[11px] text-zinc-600 leading-relaxed">{resumeJson.summary}</p>
                    </section>
                )}
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // REACTIVE RESUME — Card-based, top accent strip (amruthpillai/reactive-resume)
    // ─────────────────────────────────────────────────────────────────────────
    if (isReactive) {
        return (
            <div className="max-w-[210mm] w-full bg-zinc-50 shadow-2xl print:shadow-none flex flex-col shrink-0 relative" style={{ minHeight: '297mm', fontFamily: 'Inter, system-ui, sans-serif', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' } as any}>
                {!isPro && <div className="hidden print:block absolute bottom-0 left-0 right-0 py-4 text-center text-[11px] font-bold text-zinc-400 tracking-widest z-50 uppercase">Created with CV Optimizer AI</div>}
                {/* Top accent strip */}
                <div className="h-1.5 w-full" style={{ backgroundColor: accentColor }} />
                {/* Header */}
                <div className="bg-white px-10 py-8 shadow-sm">
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex-1">
                            <h1 className="text-[32px] font-black text-zinc-900 tracking-tight leading-none">{name}</h1>
                            {headline && <p className="text-[13px] mt-2 font-medium" style={{ color: accentColor }}>{headline}</p>}
                            <div className="flex flex-wrap gap-x-5 gap-y-0.5 mt-3 text-[11px] text-zinc-500">
                                {email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{email}</span>}
                                {phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{phone}</span>}
                                {location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{location}</span>}
                                {linkedin && <span>{linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>}
                            </div>
                        </div>
                        {showPhotoConfig && currentAvatarUrl && (
                            <div style={{ borderColor: accentColor }} className="w-20 h-20 rounded-full overflow-hidden border-[3px] shrink-0">
                                <img src={currentAvatarUrl} alt={name} className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                </div>
                {/* Body: two-column cards */}
                <div className="flex flex-1 gap-4 p-6">
                    {/* Left narrow column */}
                    <div className="w-[35%] shrink-0 space-y-4">
                        {/* Summary */}
                        {resumeJson?.summary && (
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-zinc-100">
                                <h3 className="text-[9px] font-black uppercase tracking-[3px] mb-2" style={{ color: accentColor }}>About</h3>
                                <p className="text-[11px] text-zinc-600 leading-relaxed">{resumeJson.summary}</p>
                            </div>
                        )}
                        {/* Skills */}
                        {(resumeJson?.skills?.core?.length ?? 0) > 0 && (
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-zinc-100">
                                <h3 className="text-[9px] font-black uppercase tracking-[3px] mb-2" style={{ color: accentColor }}>Skills</h3>
                                <div className="flex flex-wrap gap-1">
                                    {[...(resumeJson.skills?.core || []), ...(resumeJson.skills?.tools || [])].slice(0, 12).map((s: string, i: number) => (
                                        <span key={i} className="text-[9px] font-bold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: accentColor }}>{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Education */}
                        {resumeJson?.education?.length > 0 && (
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-zinc-100">
                                <h3 className="text-[9px] font-black uppercase tracking-[3px] mb-2" style={{ color: accentColor }}>Education</h3>
                                {resumeJson.education.map((edu: any, i: number) => (
                                    <div key={i} className="mb-2">
                                        <p className="text-[11px] font-bold text-zinc-900 leading-snug">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                                        <p className="text-[10px] text-zinc-500">{edu.school}</p>
                                        <p className="text-[9.5px] text-zinc-400">{edu.start_date} – {edu.is_current ? 'Present' : edu.end_date}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Languages */}
                        {resumeJson?.languages?.length > 0 && (
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-zinc-100">
                                <h3 className="text-[9px] font-black uppercase tracking-[3px] mb-2" style={{ color: accentColor }}>Languages</h3>
                                {resumeJson.languages.map((l: any, i: number) => (
                                    <div key={i} className="flex justify-between text-[10.5px] mb-1"><span className="font-bold text-zinc-700">{l.language}</span><span className="text-zinc-400">{l.level}</span></div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Right wide column */}
                    <div className="flex-1 space-y-4">
                        {resumeJson?.experience?.length > 0 && (
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-zinc-100">
                                <h3 className="text-[9px] font-black uppercase tracking-[3px] mb-3" style={{ color: accentColor }}>Experience</h3>
                                <div className="space-y-4">
                                    {resumeJson.experience.map((exp: any, i: number) => (
                                        <div key={i} className="pl-3" style={{ borderLeft: `3px solid ${accentColor}` }}>
                                            <div className="flex justify-between items-baseline">
                                                <h4 className="text-[12px] font-black text-zinc-900">{exp.role}</h4>
                                                <span className="text-[9.5px] text-zinc-400 shrink-0 ml-2">{exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}</span>
                                            </div>
                                            <p className="text-[10.5px] font-bold mb-1" style={{ color: accentColor }}>{exp.company}</p>
                                            <ul className="space-y-0.5">
                                                {exp.bullets?.map((b: string, j: number) => (
                                                    <li key={j} className="text-[10.5px] text-zinc-600 leading-snug pl-2 relative before:content-['·'] before:absolute before:left-0 before:font-black">{b}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SINGLE COLUMN — ATS Safe
    // ─────────────────────────────────────────────────────────────────────────
    if (isSingleColumn) {
        return (
            <div
                className="max-w-[210mm] w-full bg-white shadow-2xl print:shadow-none p-12 shrink-0 border border-zinc-200 print:border-none relative"
                style={{ minHeight: '297mm', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact', fontFamily } as any}
            >
                {!isPro && <div className="hidden print:block absolute bottom-0 left-0 right-0 py-4 text-center text-[11px] font-bold text-zinc-400 tracking-widest z-50 uppercase">Created with CV Optimizer AI</div>}

                {/* ALWAYS force header to render first, even if user's sectionOrder lacks it */}
                {RENDERERS['header']?.()}

                {/* Render the rest of the sections, minus header if it exists */}
                {mainSections.filter(s => s !== 'header').map(s => RENDERERS[s]?.())}
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // TWO COLUMN — Dark sidebar (startup-visual / executive visual)
    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div
            className="max-w-[210mm] w-full shadow-2xl print:shadow-none flex flex-row overflow-hidden rounded-xl print:rounded-none shrink-0 relative"
            style={{ minHeight: '297mm', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact', fontFamily, backgroundColor: sidebarBg } as any}
        >
            {!isPro && <div className="hidden print:block absolute bottom-0 left-0 right-0 py-4 text-center text-[11px] font-bold text-zinc-400 tracking-widest z-50 uppercase bg-white/80 backdrop-blur-sm">Created with CV Optimizer AI</div>}
            {/* Left Sidebar */}
            <aside className="w-[32%] text-zinc-300 p-8 flex flex-col shrink-0" style={{ backgroundColor: sidebarBg }}>
                {/* Photo */}
                {showPhotoConfig && currentAvatarUrl ? (
                    <div className="flex justify-center mb-8">
                        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-zinc-700 shadow-xl bg-zinc-900">
                            <img src={currentAvatarUrl} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                ) : showPhotoConfig ? (
                    <div className="flex justify-center mb-8">
                        <div className="w-40 h-40 rounded-full border-2 border-zinc-700 bg-zinc-800 flex items-center justify-center shadow-xl">
                            <span className="text-5xl text-zinc-500 font-bold">{name.charAt(0)}</span>
                        </div>
                    </div>
                ) : null}

                {/* Contact */}
                <div className="space-y-4 mb-10">
                    {(email || phone || location || linkedin || github || portfolio) && (
                        <h2 className="text-sm font-bold tracking-widest uppercase text-zinc-100 border-b border-zinc-700 pb-2 mb-4">Contact</h2>
                    )}
                    {email && (
                        <div className="flex items-center gap-3 text-[13px] break-all">
                            {showIcons ? <Mail className="w-4 h-4 shrink-0" style={{ color: accentColor }} /> : <span className="font-bold">E:</span>}
                            <span>{email}</span>
                        </div>
                    )}
                    {phone && (
                        <div className="flex items-center gap-3 text-[13px]">
                            {showIcons ? <Phone className="w-4 h-4 shrink-0" style={{ color: accentColor }} /> : <span className="font-bold">P:</span>}
                            <span>{phone}</span>
                        </div>
                    )}
                    {location && (
                        <div className="flex items-center gap-3 text-[13px]">
                            {showIcons ? <MapPin className="w-4 h-4 shrink-0" style={{ color: accentColor }} /> : <span className="font-bold">L:</span>}
                            <span>{location}</span>
                        </div>
                    )}
                    {linkedin && (
                        <div className="flex items-center gap-3 text-[13px] break-all">
                            {showIcons ? <LinkedinIcon className="w-4 h-4 shrink-0" style={{ color: accentColor }} /> : <span className="font-bold">In:</span>}
                            <span>{linkedin.replace('https://www.linkedin.com/in/', '').replace('https://linkedin.com/in/', '')}</span>
                        </div>
                    )}
                    {github && (
                        <div className="flex items-center gap-3 text-[13px] break-all">
                            {showIcons ? <Github className="w-4 h-4 shrink-0" style={{ color: accentColor }} /> : <span className="font-bold">GH:</span>}
                            <span>{github.replace('https://github.com/', '')}</span>
                        </div>
                    )}
                    {portfolio && (
                        <div className="flex items-center gap-3 text-[13px] break-all">
                            {showIcons ? <Globe className="w-4 h-4 shrink-0" style={{ color: accentColor }} /> : <span className="font-bold">Web:</span>}
                            <span>{portfolio.replace(/^https?:\/\//, '')}</span>
                        </div>
                    )}
                </div>

                {/* Sidebar sections (Skills + …) */}
                {sidebarSections.map(s => RENDERERS[s]?.())}
            </aside>

            {/* Right Main Content */}
            <main className="flex-1 bg-white text-zinc-800 p-10 pt-12 flex flex-col">
                {RENDERERS['header']()}
                {mainSections.map(s => RENDERERS[s]?.())}
            </main>
        </div>
    );
}
