"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MdArrowBack, MdSave, MdCloudUpload, MdPerson } from 'react-icons/md';
import { supabase } from '@/lib/supabase';

export default function EditProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null); // Supabase User
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [displayName, setDisplayName] = useState('');
    const [password, setPassword] = useState('');
    const [newImageFile, setNewImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [currentPhotoURL, setCurrentPhotoURL] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }

            const currentUser = session.user;
            setUser(currentUser);

            // Try to fetch from public.users first
            const { data: profile } = await supabase.from('users').select('*').eq('id', currentUser.id).single();

            if (profile) {
                setDisplayName(profile.display_name || '');
                setCurrentPhotoURL(profile.photo_url);
                setPreviewUrl(profile.photo_url);
            } else {
                // Fallback to metadata
                setDisplayName(currentUser.user_metadata?.display_name || currentUser.user_metadata?.full_name || '');
                setCurrentPhotoURL(currentUser.user_metadata?.avatar_url);
                setPreviewUrl(currentUser.user_metadata?.avatar_url);
            }
        };
        fetchUser();
    }, [router]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setNewImageFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsLoading(true);

        try {
            let photoURL = currentPhotoURL;

            // 1. Upload Image if changed
            if (newImageFile) {
                const filePath = `profiles/${user.id}/${Date.now()}_${newImageFile.name}`;
                const { data, error: uploadError } = await supabase.storage
                    .from('images') // Ensure 'images' bucket exists in Supabase
                    .upload(filePath, newImageFile, { upsert: true });

                if (uploadError) throw uploadError;

                // Get Public URL
                const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
                photoURL = publicUrl;
            }

            // 2. Update Supabase Auth (Password & Metadata)
            const authUpdates: any = {
                data: {
                    display_name: displayName,
                    avatar_url: photoURL,
                }
            };
            if (password) {
                authUpdates.password = password;
            }

            const { error: authError } = await supabase.auth.updateUser(authUpdates);
            if (authError) throw authError;

            // 3. Update public.users Table
            const { error: dbError } = await supabase
                .from('users')
                .upsert({
                    id: user.id,
                    display_name: displayName,
                    photo_url: photoURL,
                    email: user.email // Ensure email is in sync or handled by trigger
                });

            if (dbError) throw dbError;

            alert("プロフィールを更新しました！");
            router.push('/account');

        } catch (error: any) {
            console.error("Update Error:", error);
            alert("更新に失敗しました: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            <div className="bg-white border-b shadow-sm mb-6 sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center">
                    <Link href="/account" className="flex items-center gap-1 text-gray-500 hover:text-[#bf0000] font-bold text-sm transition">
                        <MdArrowBack /> キャンセル
                    </Link>
                    <h1 className="ml-4 text-lg font-bold text-gray-800">プロフィール編集</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-xl">
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-8">

                    {/* Icon Image */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 overflow-hidden border-2 border-gray-200 relative group">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <MdPerson size={50} />
                            )}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                            >
                                <MdCloudUpload className="text-white" size={24} />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-sm font-bold text-[#bf0000] hover:underline"
                        >
                            写真を変更する
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>

                    {/* Display Name */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">表示名</label>
                        <input
                            type="text"
                            required
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#bf0000] focus:ring-1 focus:ring-[#bf0000] outline-none transition font-bold text-gray-900"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">新しいパスワード (変更しない場合は空欄)</label>
                        <input
                            type="password"
                            minLength={8}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#bf0000] focus:ring-1 focus:ring-[#bf0000] outline-none transition font-bold text-gray-900"
                            placeholder="********"
                        />
                        <p className="text-xs text-gray-400 mt-2 font-bold">※Googleログインの場合はパスワード変更はできません。</p>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#bf0000] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-black transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? '保存中...' : <>保存する <MdSave /></>}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
