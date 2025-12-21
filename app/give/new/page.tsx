"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { MdArrowBack, MdCloudUpload, MdClose } from 'react-icons/md';
import AreaSelector from '@/components/AreaSelector';

export default function NewGivePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<{ file?: File, url: string } | null>(null);
    const [form, setForm] = useState({
        title: '',
        description: '',
        location: ''
    });

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) {
                router.push('/login?redirect=/give/new');
            }
        });
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setImage({ file, url });
        }
    };

    const removeImage = () => {
        if (image?.url) {
            URL.revokeObjectURL(image.url);
        }
        setImage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.description) {
            alert("タイトルと詳細は必須です。");
            return;
        }

        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert("投稿するにはログインが必要です。");
                router.push('/login');
                return;
            }

            let uploadedImageUrl = null;

            // Upload Image if present
            if (image?.file) {
                const file = image.file;
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
                const filePath = `giveaways/${user.id}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('images')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('images')
                    .getPublicUrl(filePath);

                uploadedImageUrl = publicUrl;
            }

            const { error } = await supabase.from('giveaways').insert({
                user_id: user.id,
                title: form.title,
                description: form.description,
                location: form.location,
                image_url: uploadedImageUrl
            });

            if (error) throw error;

            alert("投稿しました！");
            router.push('/give');
            router.refresh();

        } catch (error) {
            console.error(error);
            alert("投稿に失敗しました。");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center gap-2">
                    <Link href="/give" className="text-gray-500 hover:text-gray-800">
                        <MdArrowBack className="text-2xl" />
                    </Link>
                    <h1 className="font-bold text-lg text-gray-800">あげたいものを投稿</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-lg">
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-6">

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">写真 (任意)</label>
                        {!image ? (
                            <label className="w-full h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition text-gray-400">
                                <MdCloudUpload className="text-4xl mb-2" />
                                <span className="text-sm font-bold">写真をアップロード</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </label>
                        ) : (
                            <div className="relative w-full h-64 rounded-xl overflow-hidden group">
                                <img src={image.url} className="w-full h-full object-cover" />
                                <button type="button" onClick={removeImage} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition">
                                    <MdClose className="text-xl" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">タイトル <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            className="w-full border rounded-lg p-3 text-gray-800 focus:outline-none focus:border-[#bf0000]"
                            placeholder="例：無印良品のソファあげます"
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">受け渡し場所・地域</label>
                        <AreaSelector
                            value={form.location}
                            onChange={(val) => setForm({ ...form, location: val })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">詳細・状態 <span className="text-red-500">*</span></label>
                        <textarea
                            className="w-full border rounded-lg p-3 text-gray-800 focus:outline-none focus:border-[#bf0000] h-40"
                            placeholder="商品の状態や受け渡し方法などを詳しく書いてください。&#10;例：3年使用しました。目立った傷はありません。土日に取りに来てくれる方限定です。"
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-[#bf0000] text-white font-bold py-4 rounded-lg shadow-md hover:opacity-90 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? '投稿中...' : '投稿する'}
                    </button>

                </form>
            </div>
        </div>
    );
}
