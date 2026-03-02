'use client';

import { useState, useRef } from 'react';
import { Camera, Loader2, ImagePlus } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    docId: string;
    type: 'resume' | 'profile';
    currentPhotoUrl?: string;
    onUploadSuccess?: (newUrl: string) => void;
}

export function UploadPhotoButton({ docId, type, currentPhotoUrl, onUploadSuccess }: Props) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            toast.error('Lütfen geçerli bir resim dosyası seçin (JPG, PNG vb.)');
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error("Dosya boyutu 5MB'dan küçük olmalıdır.");
            return;
        }

        setIsUploading(true);
        const loadingToast = toast.loading('Fotoğraf yükleniyor...');

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('docId', docId);
            formData.append('type', type);

            const res = await fetch('/api/upload-photo', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Yükleme başarısız oldu.');
            }

            const data = await res.json();

            toast.success('Fotoğraf başarıyla güncellendi.', { id: loadingToast });
            if (onUploadSuccess) onUploadSuccess(data.url);

            // Allow re-uploading the same file if needed
            if (fileInputRef.current) fileInputRef.current.value = '';

        } catch (err: any) {
            console.error('Upload error:', err);
            toast.error(err.message || 'Fotoğraf yüklenirken bir hata oluştu.', { id: loadingToast });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={isUploading}
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                title="Fotoğraf Ekle / Değiştir"
                className="flex items-center justify-center p-2 rounded-lg transition-colors border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-50 shadow-sm bg-white dark:bg-zinc-900"
            >
                {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                ) : currentPhotoUrl ? (
                    <Camera className="w-4 h-4" />
                ) : (
                    <ImagePlus className="w-4 h-4" />
                )}
            </button>
        </>
    );
}
