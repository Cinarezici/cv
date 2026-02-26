// PDF Generator — Landscape A4 5-slide presentation using @react-pdf/renderer
// Unicode font support (Turkish, Arabic, etc.) via Noto Sans
import React from 'react';
import {
  Document,
  Font,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from '@react-pdf/renderer';
import { createServiceRoleClient } from './supabase/service';
import { parsePresentationSections, buildPreviewHtml } from './letter-generator';

// ─────────────────────────────
// Register Unicode-capable fonts using LOCAL TTF files from node_modules
// @react-pdf/renderer only supports TTF/OTF — NOT woff/woff2.
// ─────────────────────────────
import path from 'path';

const FONT_NOTO_REGULAR = path.join(process.cwd(), 'public/fonts/noto-sans-v27-latin-regular.ttf');
const FONT_LIBERATION_BOLD = path.join(process.cwd(), 'public/fonts/LiberationSans-Bold.ttf');
const FONT_LIBERATION_ITALIC = path.join(process.cwd(), 'public/fonts/LiberationSans-Italic.ttf');
const FONT_LIBERATION_BOLD_ITALIC = path.join(process.cwd(), 'public/fonts/LiberationSans-BoldItalic.ttf');

try {
  Font.register({
    family: 'UnicodeFont',
    fonts: [
      { src: FONT_NOTO_REGULAR, fontWeight: 400 },
      { src: FONT_LIBERATION_BOLD, fontWeight: 700 },
      { src: FONT_LIBERATION_ITALIC, fontWeight: 400, fontStyle: 'italic' },
      { src: FONT_LIBERATION_BOLD_ITALIC, fontWeight: 700, fontStyle: 'italic' },
    ],
  });
} catch (e) {
  console.error('Font registration failed:', e);
}

// Don't break on special chars
Font.registerHyphenationCallback(word => [word]);

// ─────────────────────────────
// Types & Templates
// ─────────────────────────────
export interface PDFTemplate {
  id: string;
  name: string;
  isPremium: boolean;
  layout: 'minimal' | 'modern' | 'classic' | 'bold';
  fonts: { heading: string; body: string };
  colors: { primary: string; accent: string; text: string; muted: string; bg: string };
  headerStyle: 'simple' | 'full' | 'sidebar';
}

export const PDF_TEMPLATES: PDFTemplate[] = [
  {
    id: 'minimal', name: 'Minimal', isPremium: false, layout: 'minimal',
    fonts: { heading: 'UnicodeFont', body: 'UnicodeFont' },
    colors: { primary: '#1a1a2e', accent: '#2563eb', text: '#2d2d2d', muted: '#777777', bg: '#f8fafc' },
    headerStyle: 'simple',
  },
  {
    id: 'modern', name: 'Modern Pro', isPremium: false, layout: 'modern',
    fonts: { heading: 'UnicodeFont', body: 'UnicodeFont' },
    colors: { primary: '#0f172a', accent: '#e6a817', text: '#1e293b', muted: '#64748b', bg: '#f1f5f9' },
    headerStyle: 'full',
  },
  {
    id: 'classic', name: 'Classic Executive', isPremium: true, layout: 'classic',
    fonts: { heading: 'UnicodeFont', body: 'UnicodeFont' },
    colors: { primary: '#1a1a1a', accent: '#8b0000', text: '#1a1a1a', muted: '#666666', bg: '#fafaf8' },
    headerStyle: 'simple',
  },
  {
    id: 'bold', name: 'Bold Startup', isPremium: true, layout: 'bold',
    fonts: { heading: 'UnicodeFont', body: 'UnicodeFont' },
    colors: { primary: '#6d28d9', accent: '#f59e0b', text: '#111827', muted: '#6b7280', bg: '#fdf4ff' },
    headerStyle: 'sidebar',
  },
];

// A4 Landscape sidebar width
const SIDEBAR_W = 200;

// ─────────────────────────────
// Helper: get initials
// ─────────────────────────────
function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?';
  return ((parts[0][0] ?? '') + (parts[parts.length - 1][0] ?? '')).toUpperCase();
}

// ─────────────────────────────
// Build the 5-page PDF document
// ─────────────────────────────
function buildPresentationDocument(
  sections: { intro: string; strengths: string; whyCompany: string; closing: string },
  candidateName: string,
  candidateHeadline: string,
  candidateEmail: string,
  candidateLinkedIn: string,
  companyName: string,
  targetRole: string,
  template: PDFTemplate,
  currentDate: string,
  isPro: boolean = true,
) {
  const e = React.createElement;
  const NAVY = template.colors.primary;
  const GOLD = template.colors.accent;
  const WHITE = '#ffffff';
  const TEXT = template.colors.text;

  const styles = StyleSheet.create({
    // ── Cover ──────────────────────────────────────────
    coverPage: {
      backgroundColor: NAVY,
      position: 'relative',
      flexDirection: 'column',
      justifyContent: 'center',
    } as any,
    coverStripe: {
      position: 'absolute', top: 0, right: 0, bottom: 0,
      width: 80, backgroundColor: GOLD,
    } as any,
    coverStripe2: {
      position: 'absolute', top: 0, right: 100, bottom: 0,
      width: 10, backgroundColor: GOLD + '60',
    } as any,
    coverContent: { paddingLeft: 64, paddingRight: 160 } as any,
    coverName: {
      fontSize: 38, fontFamily: 'UnicodeFont', fontWeight: 700,
      color: WHITE, lineHeight: 1.15, marginBottom: 12,
    } as any,
    coverRole: {
      fontSize: 11, fontFamily: 'UnicodeFont', fontWeight: 700,
      color: GOLD, letterSpacing: 1.5,
    } as any,
    coverPrepared: {
      fontSize: 10, color: WHITE + '99', marginTop: 18, fontFamily: 'UnicodeFont',
    } as any,
    coverDate: {
      position: 'absolute', bottom: 24, left: 64,
      fontSize: 9, color: WHITE + '55', fontFamily: 'UnicodeFont',
    } as any,
    coverBrand: {
      position: 'absolute', bottom: 24, right: 110,
      fontSize: 9, color: WHITE + '35', fontFamily: 'UnicodeFont',
    } as any,

    // ── Content slides ──────────────────────────────────
    contentPage: { flexDirection: 'row', backgroundColor: WHITE } as any,

    sidebar: {
      width: SIDEBAR_W,
      backgroundColor: NAVY,
      flexDirection: 'column',
      alignItems: 'center',
      padding: '36 14 28',
    } as any,
    avatarCircle: {
      width: 68, height: 68, borderRadius: 34,
      backgroundColor: GOLD,
      alignItems: 'center', justifyContent: 'center',
      marginBottom: 12,
    } as any,
    avatarInitials: {
      fontSize: 24, fontFamily: 'UnicodeFont', fontWeight: 700, color: NAVY,
    } as any,
    sidebarName: {
      fontSize: 11, fontFamily: 'UnicodeFont', fontWeight: 700,
      color: WHITE, textAlign: 'center', lineHeight: 1.4,
    } as any,
    sidebarDivider: {
      height: 1, backgroundColor: WHITE + '20',
      marginTop: 18, marginBottom: 14,
      alignSelf: 'stretch', marginHorizontal: 10,
    } as any,
    sidebarSectionLabel: {
      fontSize: 7.5, fontFamily: 'UnicodeFont', fontWeight: 400,
      color: WHITE + '55', textAlign: 'center', letterSpacing: 1.2,
    } as any,
    sidebarSpacer: { flex: 1 } as any,
    // Contact info at bottom — only shown when present
    sidebarContactBlock: {
      alignItems: 'center', paddingHorizontal: 8,
    } as any,
    sidebarContactText: {
      fontSize: 7, fontFamily: 'UnicodeFont', fontWeight: 400,
      color: WHITE + '60', textAlign: 'center', lineHeight: 1.6,
    } as any,

    // Right content area
    contentArea: {
      flex: 1,
      padding: '38 48 32 42',
      flexDirection: 'column',
    } as any,
    slideNumber: {
      fontSize: 52, fontFamily: 'UnicodeFont', fontWeight: 700,
      color: NAVY + '0d', lineHeight: 1, marginBottom: 2,
    } as any,
    sectionTitle: {
      // Bigger, more eye-catching section title
      fontSize: 26, fontFamily: 'UnicodeFont', fontWeight: 700,
      color: NAVY, marginBottom: 8, lineHeight: 1.2,
    } as any,
    goldBar: {
      alignSelf: 'stretch', height: 2.5, backgroundColor: GOLD,
      borderRadius: 1, marginBottom: 20,
    } as any,
    bodyText: {
      // Increased from 10pt to 11.5pt for better readability
      fontSize: 11.5, fontFamily: 'UnicodeFont', fontWeight: 400,
      color: TEXT, lineHeight: 1.72,
    } as any,

    // ── Thank You slide ─────────────────────────────────
    thankYouPage: {
      backgroundColor: NAVY,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    } as any,
    thankYouTitle: {
      fontSize: 48, fontFamily: 'UnicodeFont', fontWeight: 700,
      color: WHITE, textAlign: 'center', marginBottom: 14,
    } as any,
    thankYouSubtitle: {
      fontSize: 12, fontFamily: 'UnicodeFont', fontWeight: 400,
      color: WHITE + '80', textAlign: 'center',
      lineHeight: 1.6, marginBottom: 36,
    } as any,
    // Green connect box (matching user's design)
    letConnectBox: {
      borderWidth: 2, borderColor: '#22c55e', borderRadius: 12,
      paddingHorizontal: 56, paddingVertical: 18,
      alignItems: 'center', marginBottom: 36,
    } as any,
    letConnectLabel: {
      fontSize: 16, fontFamily: 'UnicodeFont', fontWeight: 700,
      color: WHITE, marginBottom: 8,
    } as any,
    letConnectEmail: {
      fontSize: 12, fontFamily: 'UnicodeFont', fontWeight: 400,
      color: '#86efac',  // light green
    } as any,
    thankYouQuote: {
      fontSize: 9, fontFamily: 'UnicodeFont', fontWeight: 400,
      fontStyle: 'italic', color: WHITE + '45', textAlign: 'center',
      paddingHorizontal: 80, lineHeight: 1.65,
    } as any,
    watermark: {
      position: 'absolute',
      bottom: 20,
      left: 0,
      right: 0,
      textAlign: 'center',
      fontSize: 10,
      fontFamily: 'UnicodeFont',
      fontWeight: 700,
      color: '#94a3b8', // text-slate-400
      letterSpacing: 1.5,
      opacity: 0.8,
      textTransform: 'uppercase',
    } as any,
  });

  const initials = getInitials(candidateName);

  // ── Sidebar: initials circle + name + divider + section label + optional contact ──
  const SidebarEl = (sectionLabel: string) => {
    const hasContact = !!(candidateEmail || candidateLinkedIn);
    return e(View, { style: styles.sidebar },
      e(View, { style: styles.avatarCircle },
        e(Text, { style: styles.avatarInitials }, initials),
      ),
      e(Text, { style: styles.sidebarName }, candidateName),
      e(View, { style: styles.sidebarDivider }),
      e(Text, { style: styles.sidebarSectionLabel }, sectionLabel.toUpperCase()),
      e(View, { style: styles.sidebarSpacer }),
      // Only show contact block if email or LinkedIn exists
      hasContact ? e(View, { style: styles.sidebarContactBlock },
        candidateEmail
          ? e(Text, { style: styles.sidebarContactText }, candidateEmail)
          : null,
        candidateLinkedIn
          ? e(Text, { style: styles.sidebarContactText }, candidateLinkedIn)
          : null,
      ) : null,
    );
  };

  // ── Content page ──
  const makeContentPage = (
    num: string,
    title: string,
    sectionLabel: string,
    body: string,
  ) =>
    e(Page, { key: `page-${num}`, size: 'A4', orientation: 'landscape', style: styles.contentPage },
      SidebarEl(sectionLabel),
      e(View, { style: styles.contentArea },
        e(Text, { style: styles.slideNumber }, num),
        e(Text, { style: styles.sectionTitle }, title),
        e(View, { style: styles.goldBar }),
        e(Text, { style: styles.bodyText }, body),
      ),
    );

  return e(Document, {},
    // Page 1: Cover
    e(Page, { key: 'cover', size: 'A4', orientation: 'landscape', style: styles.coverPage },
      e(View, { style: styles.coverStripe }),
      e(View, { style: styles.coverStripe2 }),
      e(View, { style: styles.coverContent },
        e(Text, { style: styles.coverName }, candidateName.toUpperCase()),
        e(Text, { style: styles.coverRole }, targetRole.toUpperCase()),
        e(Text, { style: styles.coverPrepared }, `Prepared for ${companyName}`),
      ),
      e(Text, { style: styles.coverDate }, currentDate),
      e(Text, { style: styles.coverBrand }, 'Powered by CV Optimizer'),
    ),

    // Page 2: Introduction
    makeContentPage('01', 'Introduction', 'My Profile', sections.intro),

    // Page 3: Key Strengths
    makeContentPage('02', 'Key Strengths', 'My Strengths', sections.strengths),

    // Page 4: Why [Company]
    makeContentPage('03', `Why ${companyName}?`, 'My Perspective', sections.whyCompany),

    // Page 5: Thank You
    e(Page, { key: 'thankyou', size: 'A4', orientation: 'landscape', style: styles.thankYouPage },
      e(Text, { style: styles.thankYouTitle }, 'Thank You'),
      e(Text, { style: styles.thankYouSubtitle }, 'I look forward to discussing my application with you.'),
      // Green "Let's Connect" box with email if available
      e(View, { style: styles.letConnectBox },
        e(Text, { style: styles.letConnectLabel }, "Let's Connect"),
        candidateEmail
          ? e(Text, { style: styles.letConnectEmail }, candidateEmail)
          : null,
      ),
      sections.closing
        ? e(Text, { style: styles.thankYouQuote }, `"${sections.closing}"`)
        : null,
    ),
    !isPro ? e(View, { style: styles.watermark, fixed: true },
      e(Text, {}, 'Created with CV Optimizer AI')
    ) : null,
  );
}

// ─────────────────────────────
// Main export — render PDF and upload
// ─────────────────────────────
export async function generateLetterPDF(
  letterText: string,
  resumeJSON: any,
  companyName: string,
  targetRole: string,
  templateId: string,
  userId: string,
  letterId: string,
  isPro: boolean = true,
): Promise<{ pdfUrl: string; pdfStoragePath: string }> {
  const template = PDF_TEMPLATES.find(t => t.id === templateId) ?? PDF_TEMPLATES[1];
  const sections = parsePresentationSections(letterText);

  // Preserve original name (with special chars) for display
  const candidateName = resumeJSON?.name || resumeJSON?.full_name || 'Candidate';
  const candidateHeadline = resumeJSON?.headline || '';
  const candidateEmail = resumeJSON?.email || '';
  const candidateLinkedIn = resumeJSON?.linkedin_url || resumeJSON?.linkedin || '';

  const now = new Date();
  const currentDate = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const doc = buildPresentationDocument(
    sections,
    candidateName,
    candidateHeadline,
    candidateEmail,
    candidateLinkedIn,
    companyName,
    targetRole,
    template,
    currentDate,
    isPro,
  );

  const pdfBuffer = await renderToBuffer(doc as any);

  // Sanitize to ASCII only for the storage KEY (not the display name)
  const toAscii = (s: string) =>
    (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9_\-]/g, '_');

  const safeName = toAscii(companyName);
  const safeCandidate = toAscii(candidateName);
  const filename = `${safeCandidate}_${safeName}_Presentation.pdf`;
  const storagePath = `motivation-letters/${userId}/${letterId}/${filename}`;

  const supabase = createServiceRoleClient();

  const { error: uploadError } = await supabase.storage
    .from('user-files')
    .upload(storagePath, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`PDF upload failed: ${uploadError.message}`);
  }

  const { data: urlData } = await supabase.storage
    .from('user-files')
    .createSignedUrl(storagePath, 365 * 24 * 60 * 60);

  return {
    pdfUrl: urlData?.signedUrl ?? '',
    pdfStoragePath: storagePath,
  };
}

// ─────────────────────────────
// Dashboard preview HTML
// ─────────────────────────────
export function buildPresentationHtml(
  letterText: string,
  resumeJSON: any,
  companyName: string,
  targetRole: string,
  _template?: PDFTemplate,
): string {
  return buildPreviewHtml(letterText, companyName, targetRole, resumeJSON);
}

export const buildPDFHtml = buildPresentationHtml;
