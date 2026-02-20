import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { ResumeData } from '@/types';

const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#1a1a1a' },
    name: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
    headline: { fontSize: 12, color: '#555', marginBottom: 8 },
    contact: { fontSize: 9, color: '#666', marginBottom: 16, flexDirection: 'row', gap: 12 },
    sectionTitle: { fontSize: 12, fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: 3, marginBottom: 8, marginTop: 12 },
    expTitle: { fontSize: 10, fontWeight: 'bold' },
    expCompany: { fontSize: 9, color: '#444' },
    bullet: { fontSize: 9, marginLeft: 10, marginBottom: 2 },
    skill: { fontSize: 9, marginRight: 6 },
});

export function ResumePDF({ data }: { data: ResumeData }) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.name}>{data.name}</Text>
                {data.headline && <Text style={styles.headline}>{data.headline}</Text>}
                <View style={styles.contact}>
                    {data.email && <Text>{data.email}</Text>}
                    {data.phone && <Text>{data.phone}</Text>}
                    {data.location && <Text>{data.location}</Text>}
                </View>

                {data.summary && (
                    <>
                        <Text style={styles.sectionTitle}>Summary</Text>
                        <Text style={{ fontSize: 9 }}>{data.summary}</Text>
                    </>
                )}

                {data.experience && data.experience.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Experience</Text>
                        {data.experience.map((exp, i) => (
                            <View key={i} style={{ marginBottom: 10 }}>
                                <Text style={styles.expTitle}>{exp.title} – {exp.company}</Text>
                                <Text style={styles.expCompany}>{exp.start_date} – {exp.end_date}</Text>
                                {exp.bullets?.map((b, j) => (
                                    <Text key={j} style={styles.bullet}>• {b}</Text>
                                ))}
                            </View>
                        ))}
                    </>
                )}

                {data.education && data.education.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Education</Text>
                        {data.education.map((edu, i) => (
                            <View key={i} style={{ marginBottom: 6 }}>
                                <Text style={styles.expTitle}>{edu.degree}</Text>
                                <Text style={styles.expCompany}>{edu.school} · {edu.year}</Text>
                            </View>
                        ))}
                    </>
                )}

                {data.skills && data.skills.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Skills</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {data.skills.map((s, i) => (
                                <Text key={i} style={styles.skill}>{s}{i < data.skills.length - 1 ? ' ·' : ''}</Text>
                            ))}
                        </View>
                    </>
                )}
            </Page>
        </Document>
    );
}
