import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const docId = formData.get('docId') as string | null;
        const type = formData.get('type') as 'profile' | 'resume' | null;

        if (!file || !docId || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validate file
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Dosya bir resim olmalıdır.' }, { status: 400 });
        }
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'Dosya 5MB limitini aşıyor.' }, { status: 400 });
        }

        // Fetch current document first to delete old photo if exists
        const tableName = type === 'profile' ? 'profiles' : 'resumes';
        const jsonColumn = type === 'profile' ? 'raw_json' : 'optimized_json';

        const { data: doc, error: fetchError } = await supabase
            .from(tableName)
            .select(jsonColumn)
            .eq('id', docId)
            .eq('user_id', user.id)
            .single();

        if (fetchError || !doc) {
            throw new Error('Döküman veritabanında bulunamadı.');
        }

        const currentJson = (doc as any)[jsonColumn] || {};

        // Delete previous photo if it exists
        if (currentJson?.header?.photo_url) {
            try {
                const oldUrlString = currentJson.header.photo_url.split('?')[0]; // remove query params
                const match = oldUrlString.match(/user-files\/(photos\/.*)$/);
                if (match && match[1]) {
                    const oldFilePath = decodeURIComponent(match[1]);
                    await supabase.storage.from('user-files').remove([oldFilePath]);
                    console.log('Deleted old photo:', oldFilePath);
                }
            } catch (e) {
                console.error('Failed to parse and delete old photo:', e);
            }
        }

        // Read file arrayBuffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Supabase Storage
        const ext = file.name.split('.').pop() || 'png';
        const fileName = `photos/${user.id}/${docId}-${Date.now()}.${ext}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('user-files')
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: true,
            });

        if (uploadError) {
            console.error('Storage upload error:', uploadError);
            throw new Error('Görsel depolama alanına yüklenemedi.');
        }

        // Get public URL and append cache buster
        const { data: { publicUrl } } = supabase.storage
            .from('user-files')
            .getPublicUrl(fileName);

        const finalUrl = `${publicUrl}?v=${Date.now()}`;

        // Ensure header exists
        if (!currentJson.header) {
            currentJson.header = {};
        }

        // Assign public URL to header component
        currentJson.header.photo_url = finalUrl;

        // Perform the update
        const { error: updateError } = await supabase
            .from(tableName)
            .update({ [jsonColumn]: currentJson })
            .eq('id', docId)
            .eq('user_id', user.id);

        if (updateError) {
            console.error('DB update error:', updateError);
            throw new Error('Görsel adresi dökümana işlenemedi.');
        }

        return NextResponse.json({ success: true, url: finalUrl });

    } catch (err: any) {
        console.error('Fotoğraf yükleme hatası:', err);
        return NextResponse.json({ error: err.message || 'Bilinmeyen bir hata oluştu.' }, { status: 500 });
    }
}
