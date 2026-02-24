import React, { useRef } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Image as ImageIcon, Trash2, Camera, Eye, EyeOff } from 'lucide-react';

export function HeaderEditor() {
    const { resumeJson, updateSection } = useResumeStore();
    const header = resumeJson?.header || { full_name: '', headline: '', email: '' };
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        updateSection('header', { ...header, [name]: value });
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateSection('header', { ...header, photo_url: reader.result as string, show_photo: true });
            };
            reader.readAsDataURL(file);
        }
    };

    const togglePhoto = (e: React.MouseEvent) => {
        e.preventDefault();
        updateSection('header', { ...header, show_photo: !header.show_photo });
    };

    const removePhoto = (e: React.MouseEvent) => {
        e.preventDefault();
        updateSection('header', { ...header, photo_url: '', show_photo: false });
    };

    return (
        <div className="flex flex-col gap-4 p-4">
            {/* Profile Photo Management */}
            <div className="flex flex-col gap-2 mb-2 p-4 bg-zinc-50 rounded-xl border border-zinc-200 border-dashed">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Camera className="w-3.5 h-3.5" />
                    Profile Photo
                </label>

                <div className="flex items-center gap-4">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="relative w-16 h-16 rounded-lg border-2 border-dashed border-zinc-200 bg-white flex items-center justify-center cursor-pointer hover:border-indigo-400"
                    >
                        {header.photo_url ? (
                            <img src={header.photo_url} alt="Profile" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                            <ImageIcon className="w-6 h-6 text-zinc-300" />
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                    </div>

                    <div className="flex flex-col gap-2 flex-1">
                        <div className="flex gap-2">
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-1 bg-indigo-600 text-white text-xs font-bold py-1.5 rounded">Upload</button>
                            {header.photo_url && (
                                <button type="button" onClick={removePhoto} className="p-1.5 bg-rose-50 text-rose-600 rounded">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        {header.photo_url && (
                            <button type="button" onClick={togglePhoto} className="text-[10px] font-bold py-1 border rounded text-zinc-500">
                                {header.show_photo ? "Hide on CV" : "Show on CV"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Full Name</label>
                    <input name="full_name" value={header.full_name || ''} onChange={handleChange} className="border p-2 rounded text-sm" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Headline</label>
                    <input name="headline" value={header.headline || ''} onChange={handleChange} className="border p-2 rounded text-sm" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Email</label>
                    <input name="email" value={header.email || ''} onChange={handleChange} className="border p-2 rounded text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Phone</label>
                        <input name="phone" value={header.phone || ''} onChange={handleChange} className="border p-2 rounded text-sm" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Location</label>
                        <input name="location" value={header.location || ''} onChange={handleChange} className="border p-2 rounded text-sm" />
                    </div>
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase">LinkedIn</label>
                    <input name="linkedin_url" value={header.linkedin_url || ''} onChange={handleChange} className="border p-2 rounded text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-zinc-500 uppercase">GitHub</label>
                        <input name="github_url" value={header.github_url || ''} onChange={handleChange} className="border p-2 rounded text-sm" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Portfolio</label>
                        <input name="portfolio_url" value={header.portfolio_url || ''} onChange={handleChange} className="border p-2 rounded text-sm" />
                    </div>
                </div>
            </div>
        </div>
    );
}
