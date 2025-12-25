"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { MdCloudUpload, MdArrowBack, MdCheck, MdArrowForward } from 'react-icons/md';

function BeforeAfterPostForm() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // Image State
    const [beforeFile, setBeforeFile] = useState<File | null>(null);
    const [afterFile, setAfterFile] = useState<File | null>(null);
    const [beforePreview, setBeforePreview] = useState<string | null>(null);
    const [afterPreview, setAfterPreview] = useState<string | null>(null);

    // Drag State
    const [isDraggingBefore, setIsDraggingBefore] = useState(false);
    const [isDraggingAfter, setIsDraggingAfter] = useState(false);
    const [botCheck, setBotCheck] = useState(''); // Honeypot

    // Auth Check
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setUser(null);
            } else {
                setUser(session.user);
            }
        };
        checkUser();
    }, []);

    // WebP Conversion Helper
    const convertToWebP = async (file: File): Promise<File> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Canvas context not available'));
                    return;
                }
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                            type: 'image/webp',
                            lastModified: Date.now(),
                        });
                        resolve(newFile);
                    } else {
                        reject(new Error('Conversion failed'));
                    }
                }, 'image/webp', 0.8);
            };
            img.onerror = (err) => reject(err);
            img.src = URL.createObjectURL(file);
        });
    };

    const processFile = async (file: File, type: 'before' | 'after') => {
        if (!file.type.startsWith('image/')) return;

        try {
            const webpFile = await convertToWebP(file);
            const url = URL.createObjectURL(webpFile);

            if (type === 'before') {
                setBeforeFile(webpFile);
                setBeforePreview(url);
            } else {
                setAfterFile(webpFile);
                setAfterPreview(url);
            }
        } catch (error) {
            console.error("WebP conversion failed:", error);
            // Fallback to original
            const url = URL.createObjectURL(file);
            if (type === 'before') {
                setBeforeFile(file);
                setBeforePreview(url);
            } else {
                setAfterFile(file);
                setAfterPreview(url);
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0], type);
        }
    };



    // Drag & Drop Handlers
    const handleDragOver = (e: React.DragEvent, type: 'before' | 'after') => {
        e.preventDefault();
        if (type === 'before') setIsDraggingBefore(true);
        else setIsDraggingAfter(true);
    };

    const handleDragLeave = (e: React.DragEvent, type: 'before' | 'after') => {
        e.preventDefault();
        if (type === 'before') setIsDraggingBefore(false);
        else setIsDraggingAfter(false);
    };

    const handleDrop = (e: React.DragEvent, type: 'before' | 'after') => {
        e.preventDefault();
        if (type === 'before') setIsDraggingBefore(false);
        else setIsDraggingAfter(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0], type);
        }
    };

    const uploadImage = async (file: File) => {
        const fileExt = file.name.split('.').pop() || 'webp';
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `before_after/${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);

        return publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !beforeFile || !afterFile) return;

        // 1. Honeypot Check
        if (botCheck) {
            router.push('/before-after'); // Fake success
            return;
        }

        // 2. Client-side Rate Limit (5 mins)
        const lastPostTime = localStorage.getItem('last_ba_post_time');
        if (lastPostTime && Date.now() - Number(lastPostTime) < 5 * 60 * 1000) {
            alert('投稿間隔が短すぎます。しばらく待ってから再度お試しください。');
            return;
        }

        setIsLoading(true);

        try {
            // 3. Server-side Rate Limit (DB Check)
            const { data: recentPosts } = await supabase
                .from('before_after_posts')
                .select('created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1);

            if (recentPosts && recentPosts.length > 0) {
                const lastTime = new Date(recentPosts[0].created_at).getTime();
                if (Date.now() - lastTime < 5 * 60 * 1000) {
                    alert('投稿間隔が短すぎます。しばらく待ってから再度お試しください。');
                    return; // Finally block will stop loading
                }
            }

            // --- AI Content Moderation Check ---
            try {
                const textToCheck = `${title}\n${description}`;
                const modResponse = await fetch('/api/moderation/check', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: textToCheck }),
                });

                if (modResponse.ok) {
                    const modResult = await modResponse.json();
                    if (modResult.flagged) {
                        alert(`投稿内容に不適切な表現が含まれている可能性があります。\n(理由: ${modResult.categories.join(', ')})`);
                        return; // Stop submission
                    }
                }
            } catch (e) {
                console.warn("Moderation check failed, proceeding anyway...", e);
            }
            // -----------------------------------

            // Unload images
            const beforeUrl = await uploadImage(beforeFile);
            const afterUrl = await uploadImage(afterFile);

            // Insert to DB
            const { error } = await supabase
                .from('before_after_posts')
                .insert({
                    user_id: user.id,
                    title: title,
                    description: description,
                    before_image_url: beforeUrl,
                    after_image_url: afterUrl
                });

            if (error) throw error;

            // Update Client Timestamp
            localStorage.setItem('last_ba_post_time', String(Date.now()));

            alert('投稿が完了しました！');
            router.push('/before-after'); // Redirect to gallery list

        } catch (error: any) {
            console.error('Submission error:', error);
            alert('投稿に失敗しました: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (user === null) {
        // Loading or Not Logged In check happens fast
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 font-sans">
            <div className="container mx-auto px-4 max-w-2xl">
                <Link href="/before-after" className="inline-flex items-center gap-1 text-gray-500 hover:text-[#bf0000] font-bold mb-6">
                    <MdArrowBack /> 一覧に戻る
                </Link>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">ビフォーアフターを投稿</h1>
                    <p className="text-gray-500 mb-8 font-bold text-sm">あなたのDIYや模様替えの成果をシェアしよう！</p>

                    {!user ? (
                        <div className="text-center py-10">
                            <p className="mb-4 font-bold text-gray-600">投稿にはログインが必要です。</p>
                            <Link href="/login?redirect=/before-after/new" className="bg-[#bf0000] text-white font-bold py-3 px-8 rounded-full shadow-md hover:bg-black transition">
                                ログインする
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Honeypot Field */}
                            <input
                                type="text"
                                name="bot_check"
                                value={botCheck}
                                onChange={(e) => setBotCheck(e.target.value)}
                                style={{ display: 'none' }}
                                tabIndex={-1}
                                autoComplete="off"
                            />
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">タイトル</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="例: 和室を洋室風にDIY"
                                    className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:border-[#bf0000] outline-none transition font-bold"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 text-center">BEFORE</label>
                                    <label
                                        onDragOver={e => handleDragOver(e, 'before')}
                                        onDragLeave={e => handleDragLeave(e, 'before')}
                                        onDrop={e => handleDrop(e, 'before')}
                                        className={`aspect-square rounded-lg bg-gray-50 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition relative overflow-hidden ${isDraggingBefore ? 'border-[#bf0000] bg-red-50' :
                                            beforePreview ? 'border-gray-200' : 'border-gray-300 hover:border-[#bf0000] hover:bg-red-50'
                                            }`}
                                    >
                                        {beforePreview ? (
                                            <img src={beforePreview} alt="Before" className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <MdCloudUpload className={`text-3xl mb-2 transition ${isDraggingBefore ? 'text-[#bf0000]' : 'text-gray-400'}`} />
                                                <span className={`text-xs font-bold ${isDraggingBefore ? 'text-[#bf0000]' : 'text-gray-500'}`}>
                                                    {isDraggingBefore ? 'ドロップして追加' : '写真を選択'}
                                                </span>
                                            </>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={e => handleFileChange(e, 'before')} required={!beforePreview} />
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 text-center">AFTER</label>
                                    <label
                                        onDragOver={e => handleDragOver(e, 'after')}
                                        onDragLeave={e => handleDragLeave(e, 'after')}
                                        onDrop={e => handleDrop(e, 'after')}
                                        className={`aspect-square rounded-lg bg-gray-50 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition relative overflow-hidden ${isDraggingAfter ? 'border-[#bf0000] bg-red-50' :
                                            afterPreview ? 'border-[#bf0000]' : 'border-gray-300 hover:border-[#bf0000] hover:bg-red-50'
                                            }`}
                                    >
                                        {afterPreview ? (
                                            <img src={afterPreview} alt="After" className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <MdCloudUpload className={`text-3xl mb-2 transition ${isDraggingAfter ? 'text-[#bf0000]' : 'text-gray-400'}`} />
                                                <span className={`text-xs font-bold ${isDraggingAfter ? 'text-[#bf0000]' : 'text-gray-500'}`}>
                                                    {isDraggingAfter ? 'ドロップして追加' : '写真を選択'}
                                                </span>
                                            </>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={e => handleFileChange(e, 'after')} required={!afterPreview} />
                                    </label>
                                </div>
                            </div>

                            {/* Arrow Indicator between images visual */}
                            <div className="flex justify-center -mt-6 relative z-10 pointer-events-none">
                                <div className="bg-white rounded-full p-2 border border-gray-100 shadow-sm text-gray-400">
                                    <MdArrowForward />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">説明・コメント</label>
                                <textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="工夫した点や大変だったことなど..."
                                    rows={4}
                                    className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:border-[#bf0000] outline-none transition"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#bf0000] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-black transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? '投稿中...' : <><MdCheck /> 投稿する</>}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function BeforeAfterPostPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BeforeAfterPostForm />
        </Suspense>
    );
}
