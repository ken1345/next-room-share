
"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { MdCloudUpload, MdHome, MdAttachMoney, MdTrain, MdInfo, MdCheck, MdArrowBack, MdEdit } from 'react-icons/md';
import PhotoPropertyCard from '@/components/PhotoPropertyCard';
import TRAIN_DATA_JSON from '@/data/pref_line_station_full.json';
import REGION_MAPPING from '@/data/region-mapping.json';
import AREA_DATA_JSON from '@/data/generated-area-data.json';

const TRAIN_DATA: { [key: string]: { [key: string]: string[] } } = TRAIN_DATA_JSON;
const REGION_DATA: { [key: string]: string } = REGION_MAPPING;
const AREA_DATA: { [key: string]: { [key: string]: string[] } } = AREA_DATA_JSON;
const UNIQUE_REGIONS = Array.from(new Set(Object.values(REGION_DATA)));

function HostPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('edit');
    // Auth State
    const [user, setUser] = useState<any>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    // Flow State: 'input' | 'confirm' | 'complete'
    const [step, setStep] = useState<'input' | 'confirm' | 'complete'>('input');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [form, setForm] = useState({
        title: '',
        description: '',
        region: '',
        prefecture: '東京都',
        city: '',
        stationLine: '',
        stationName: '',
        minutesToStation: '',
        rent: '',
        type: 'private', // private, semi, shared
        gender: 'any',
        amenities: [] as string[],
    });

    // Get cities for current prefecture
    const cities = React.useMemo(() => {
        if (!form.prefecture) return [];
        const region = REGION_DATA[form.prefecture];
        if (!region) return [];
        return AREA_DATA[region]?.[form.prefecture] || [];
    }, [form.prefecture]);

    const amenityOptions = [
        "ペット相談可",
        "高速インターネット(光回線)",
        "駐車場あり",
        "女性限定",
        "外国人歓迎",
        "楽器可",
        "DIY可"
    ];

    const toggleAmenity = (option: string) => {
        setForm(prev => {
            const newAmenities = prev.amenities.includes(option)
                ? prev.amenities.filter(a => a !== option)
                : [...prev.amenities, option];
            return { ...prev, amenities: newAmenities };
        });
    };

    // Image State
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [originalHostId, setOriginalHostId] = useState<string | null>(null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        // Initial check
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
            setLoadingAuth(false);
        };
        checkUser();

        // Listener for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
            setLoadingAuth(false);
        });

        return () => subscription.unsubscribe();
        return () => subscription.unsubscribe();
    }, []);

    // Edit Mode: Fetch Data
    useEffect(() => {
        if (!editId) return;
        const fetchListing = async () => {
            const { data, error } = await supabase
                .from('listings')
                .select('*')
                .eq('id', editId)
                .single();

            if (data) {
                setForm({
                    title: data.title,
                    description: data.description,
                    region: REGION_DATA[data.prefecture] || '',
                    prefecture: data.prefecture,
                    city: data.city,
                    stationLine: data.station_line,
                    stationName: data.station_name,
                    minutesToStation: data.minutes_to_station ? String(data.minutes_to_station) : '',
                    rent: String(data.price),
                    type: data.room_type,
                    gender: data.gender_restriction,
                    amenities: data.amenities || [],
                });
                if (data.images) setExistingImages(data.images);
                setOriginalHostId(data.host_id);
            } else if (error) {
                console.error("Error fetching listing:", error);
            }
        };
        fetchListing();
    }, [editId]);

    // WebP Conversion Utility
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
                }, 'image/webp', 0.8); // Quality 0.8
            };
            img.onerror = (err) => reject(err);
            img.src = URL.createObjectURL(file);
        });
    };

    const processFiles = async (files: FileList | File[]) => {
        const fileArray = Array.from(files);
        for (const originalFile of fileArray) {
            if (!originalFile.type.startsWith('image/')) continue;

            try {
                // Convert to WebP immediately
                const webpFile = await convertToWebP(originalFile);

                setImageFiles(prev => [...prev, webpFile]);
                const url = URL.createObjectURL(webpFile);
                setPreviewUrls(prev => [...prev, url]);
            } catch (error) {
                console.error("WebP conversion failed:", error);
                // Fallback
                setImageFiles(prev => [...prev, originalFile]);
                const url = URL.createObjectURL(originalFile);
                setPreviewUrls(prev => [...prev, url]);
            }
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            processFiles(e.target.files);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            processFiles(e.dataTransfer.files);
        }
    };

    const removeImage = (index: number) => {
        if (index < existingImages.length) {
            setExistingImages(prev => prev.filter((_, i) => i !== index));
        } else {
            const newIndex = index - existingImages.length;
            setImageFiles(prev => prev.filter((_, i) => i !== newIndex));
            setPreviewUrls(prev => {
                const newUrls = [...prev];
                URL.revokeObjectURL(newUrls[newIndex]); // Cleanup memory
                return newUrls.filter((_, i) => i !== newIndex);
            });
        }
    };

    const handleCheck = (e: React.FormEvent) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        setStep('confirm');
    };

    const handleFinalSubmit = async () => {
        if (!user) return;

        // Check ownership before submitting if editing
        if (editId && originalHostId && user.id !== originalHostId) {
            alert(`エラー: あなたはこの物件の作成者ではありません。`);
            return;
        }

        setIsSubmitting(true);

        try {
            // 0. Ensure User Profile Exists (Fix for FK violation)
            const { data: profile } = await supabase.from('users').select('id').eq('id', user.id).single();
            if (!profile) {
                console.log("Creating missing public profile on host page...");
                const { error: createError } = await supabase.from('users').insert({
                    id: user.id,
                    email: user.email,
                    display_name: user.user_metadata?.full_name || 'User',
                    photo_url: user.user_metadata?.avatar_url || null,
                });
                if (createError) throw createError;
            }

            const uploadedImageUrls: string[] = [...existingImages];

            // 1. Upload Images
            for (const file of imageFiles) {
                // Sanitize filename: use timestamp + random string + extension to avoid "Invalid key"
                // Note: file is already converted to .webp in handleImageUpload, but we ensure ext is correct.
                const fileExt = file.name.split('.').pop() || 'webp';
                const randomId = Math.random().toString(36).substring(2, 12);
                const safeFileName = `${Date.now()}_${randomId}.${fileExt}`;
                const filePath = `listings/${user.id}/${safeFileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('images')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('images')
                    .getPublicUrl(filePath);

                uploadedImageUrls.push(publicUrl);
            }

            // 2. Insert or Update Listing
            const payload = {
                title: form.title,
                description: form.description,
                price: parseInt(form.rent),
                address: `${form.prefecture}${form.city}`,
                // Detailed location info for filtering
                prefecture: form.prefecture,
                city: form.city,
                station_line: form.stationLine,
                station_name: form.stationName,
                minutes_to_station: form.minutesToStation ? parseInt(form.minutesToStation) : null,
                // Type and Gender
                room_type: form.type,
                gender_restriction: form.gender,

                latitude: 35.681236,
                longitude: 139.767125,
                amenities: form.amenities,
                images: uploadedImageUrls,
                host_id: user.id,
            };

            let error;
            if (editId) {
                const { data: updatedData, error: updateError } = await supabase
                    .from('listings')
                    .update(payload)
                    .eq('id', editId)
                    .select(); // Return the updated row

                if (updatedData && updatedData.length === 0) {
                    throw new Error("更新できませんでした。権限がないか、物件が存在しません。");
                }
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('listings')
                    .insert(payload);
                error = insertError;
            }

            if (error) throw error;

            window.scrollTo(0, 0);
            setStep('complete');
        } catch (error: any) {
            console.error("Submission Error:", error);
            alert("掲載に失敗しました: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackToInput = () => {
        window.scrollTo(0, 0);
        setStep('input');
    };

    // Completion View
    if (step === 'complete') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
                <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-md w-full">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MdCheck className="text-4xl text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{editId ? '修正完了しました！' : '掲載完了しました！'}</h2>
                    <p className="text-gray-500 mb-6">{editId ? '物件情報が更新されました。' : 'あなたの部屋が公開されました。'}<br />お問い合わせをお待ちください。</p>
                    <Link href="/" className="bg-[#bf0000] text-white font-bold py-3 px-8 rounded-full shadow-md hover:bg-black transition">
                        トップに戻る
                    </Link>
                </div>
            </div>
        );
    }

    if (loadingAuth) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    // Not Logged In View
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans p-4">
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-lg w-full text-center">
                    <MdHome className="text-6xl text-[#bf0000] mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">ホストとして登録</h1>
                    <p className="text-gray-500 mb-8">お部屋を貸し出すにはログインが必要です。<br />素敵なルームメイトを見つけましょう。</p>

                    <div className="space-y-4">
                        <Link
                            href="/login?redirect=/host"
                            className="block w-full bg-[#bf0000] text-white font-bold py-3.5 rounded-lg shadow hover:bg-[#900000] transition text-lg"
                        >
                            ログインして始める
                        </Link>
                        <Link
                            href="/signup?redirect=/host"
                            className="block w-full bg-white text-gray-700 border border-gray-300 font-bold py-3.5 rounded-lg hover:bg-gray-50 transition"
                        >
                            新規会員登録
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Confirmation View
    if (step === 'confirm') {
        return (
            <div className="min-h-screen bg-gray-50 py-12 font-sans">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="mb-6">
                        <button onClick={handleBackToInput} className="text-gray-500 hover:text-gray-800 flex items-center gap-1 font-bold">
                            <MdArrowBack /> 修正する
                        </button>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">入力内容の確認</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Preview Card */}
                        <div className="md:col-span-1">
                            <h3 className="font-bold text-gray-600 mb-4 text-center md:text-left">検索結果での表示</h3>
                            <div className="max-w-sm mx-auto md:mx-0">
                                <PhotoPropertyCard
                                    imageUrl={[...existingImages, ...previewUrls].length > 0 ? [...existingImages, ...previewUrls][0] : undefined}
                                    image={[...existingImages, ...previewUrls].length > 0 ? undefined : 'bg-gray-200'}
                                    price={form.rent}
                                    station={`${form.stationName} ${form.minutesToStation}分`}
                                    badges={[
                                        form.type === 'private' ? '個室' : form.type === 'semi' ? '半個室' : 'ドミトリー',
                                        form.gender === 'female' ? '女性限定' : form.gender === 'male' ? '男性限定' : '性別不問'
                                    ]}
                                    title={form.title}
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-2 text-center md:text-left">※実際の表示イメージです</p>
                        </div>

                        {/* Data Summary */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2 pb-2 border-b">
                                    <MdInfo className="text-gray-400" /> 登録情報
                                </h2>
                                <dl className="grid grid-cols-1 gap-y-4">
                                    <div className="grid grid-cols-3 border-b border-gray-50 pb-2">
                                        <dt className="text-gray-500 text-sm font-bold">タイトル</dt>
                                        <dd className="col-span-2 font-bold text-gray-800">{form.title}</dd>
                                    </div>
                                    <div className="grid grid-cols-3 border-b border-gray-50 pb-2">
                                        <dt className="text-gray-500 text-sm font-bold">紹介文</dt>
                                        <dd className="col-span-2 text-sm text-gray-600 whitespace-pre-wrap">{form.description}</dd>
                                    </div>
                                    <div className="grid grid-cols-3 border-b border-gray-50 pb-2">
                                        <dt className="text-gray-500 text-sm font-bold">家賃</dt>
                                        <dd className="col-span-2 font-bold text-[#bf0000] text-lg">¥{form.rent}</dd>
                                    </div>
                                    <div className="grid grid-cols-3 border-b border-gray-50 pb-2">
                                        <dt className="text-gray-500 text-sm font-bold">エリア</dt>
                                        <dd className="col-span-2 text-gray-800">{form.prefecture} {form.city}</dd>
                                    </div>
                                    <div className="grid grid-cols-3 border-b border-gray-50 pb-2">
                                        <dt className="text-gray-500 text-sm font-bold">最寄り駅</dt>
                                        <dd className="col-span-2 text-gray-800">{form.stationLine} {form.stationName} 徒歩{form.minutesToStation}分</dd>
                                    </div>
                                    <div className="grid grid-cols-3 border-b border-gray-50 pb-2">
                                        <dt className="text-gray-500 text-sm font-bold">タイプ・条件</dt>
                                        <dd className="col-span-2 text-gray-800">
                                            {form.type === 'private' ? '個室' : form.type === 'semi' ? '半個室' : 'ドミトリー'} /
                                            {form.gender === 'female' ? ' 女性限定' : form.gender === 'male' ? ' 男性限定' : ' 性別不問'}
                                        </dd>
                                    </div>
                                    <div className="grid grid-cols-3 border-b border-gray-50 pb-2">
                                        <dt className="text-gray-500 text-sm font-bold">こだわり条件</dt>
                                        <dd className="col-span-2 text-gray-800">
                                            {form.amenities.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {form.amenities.map(tag => (
                                                        <span key={tag} className="text-xs bg-red-50 text-[#bf0000] px-2 py-1 rounded-full font-bold">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-xs">なし</span>
                                            )}
                                        </dd>
                                    </div>
                                    <div className="grid grid-cols-3">
                                        <dt className="text-gray-500 text-sm font-bold">写真</dt>
                                        <dd className="col-span-2 text-gray-800">
                                            <div className="flex gap-2 bg-gray-50 p-2 rounded overflow-x-auto">
                                                {[...existingImages, ...previewUrls].map((url, i) => (
                                                    <img key={i} src={url} className="h-16 w-16 object-cover rounded" />
                                                ))}
                                                {[...existingImages, ...previewUrls].length === 0 && <span className="text-gray-400 text-xs">なし</span>}
                                            </div>
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={handleBackToInput} disabled={isSubmitting} className="flex-1 bg-gray-200 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-300 transition text-lg">
                                    修正する
                                </button>
                                <button
                                    onClick={handleFinalSubmit}
                                    disabled={isSubmitting}
                                    className="flex-1 bg-[#bf0000] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-black transition text-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? '送信中...' : <><MdCheck /> この内容で掲載</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Logged In - Form View (Input)
    return (
        <div className="min-h-screen bg-gray-50 py-12 font-sans">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">物件情報の入力</h1>
                <p className="text-gray-500 mb-8">あなたの物件の魅力を伝えましょう。</p>

                <form onSubmit={handleCheck} className="space-y-8">

                    {/* 基本情報 */}
                    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2 pb-2 border-b">
                            <MdHome className="text-gray-400" /> 基本情報 {editId && <span className="text-sm rounded-full bg-blue-100 text-blue-600 px-2 py-0.5 ml-auto">収集中...</span>}
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">タイトル <span className="text-[#bf0000] text-xs ml-1">必須</span></label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                    required
                                    placeholder="例：【新宿10分】広々キッチンがあるシェアハウス"
                                    className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:border-[#bf0000] focus:ring-1 focus:ring-[#bf0000] outline-none transition font-bold"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">紹介文</label>
                                <textarea
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    placeholder="部屋の特徴や周辺環境について詳しく書きましょう"
                                    rows={5}
                                    className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:border-[#bf0000] outline-none transition"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">部屋タイプ</label>
                                    <select
                                        value={form.type}
                                        onChange={e => setForm({ ...form, type: e.target.value })}
                                        className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] outline-none font-bold"
                                    >
                                        <option value="private">個室</option>
                                        <option value="semi">半個室</option>
                                        <option value="shared">ドミトリー・シェア</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">入居者条件</label>
                                    <select
                                        value={form.gender}
                                        onChange={e => setForm({ ...form, gender: e.target.value })}
                                        className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] outline-none font-bold"
                                    >
                                        <option value="any">性別不問</option>
                                        <option value="female">女性限定</option>
                                        <option value="male">男性限定</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* アクセス・住所 */}
                    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2 pb-2 border-b">
                            <MdTrain className="text-gray-400" /> エリア・アクセス
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">地域 <span className="text-[#bf0000] text-xs ml-1">必須</span></label>
                                <select
                                    value={form.region}
                                    onChange={e => {
                                        const newRegion = e.target.value;
                                        setForm({
                                            ...form,
                                            region: newRegion,
                                            prefecture: '', // Reset Pref
                                            city: '', // Reset City
                                            stationLine: '',
                                            stationName: ''
                                        });
                                    }}
                                    required
                                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] outline-none font-bold"
                                >
                                    <option value="">地域を選択</option>
                                    {UNIQUE_REGIONS.map(r => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">都道府県 <span className="text-[#bf0000] text-xs ml-1">必須</span></label>
                                <select
                                    value={form.prefecture}
                                    onChange={e => {
                                        const newPref = e.target.value;
                                        setForm({
                                            ...form,
                                            prefecture: newPref,
                                            city: '', // Reset City
                                            stationLine: '', // Reset Line
                                            stationName: ''  // Reset Station
                                        });
                                    }}
                                    required
                                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] outline-none font-bold"
                                >
                                    <option value="">都道府県を選択</option>
                                    {Object.keys(TRAIN_DATA)
                                        .filter(pref => form.region ? REGION_DATA[pref] === form.region : true)
                                        .map(pref => (
                                            <option key={pref} value={pref}>{pref}</option>
                                        ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">市区町村 <span className="text-[#bf0000] text-xs ml-1">必須</span></label>
                                <select
                                    value={form.city}
                                    onChange={e => setForm({ ...form, city: e.target.value })}
                                    required
                                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] outline-none font-bold"
                                    disabled={!form.prefecture}
                                >
                                    <option value="">市区町村を選択</option>
                                    {cities.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-gray-700">最寄り駅</label>
                            <div className="flex flex-col md:flex-row gap-4">
                                <select
                                    value={form.stationLine}
                                    onChange={e => {
                                        const newLine = e.target.value;
                                        setForm({
                                            ...form,
                                            stationLine: newLine,
                                            stationName: '' // Reset Station
                                        });
                                    }}
                                    className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] outline-none font-bold"
                                    disabled={!form.prefecture}
                                >
                                    <option value="">路線を選択</option>
                                    {form.prefecture && TRAIN_DATA[form.prefecture] && Object.keys(TRAIN_DATA[form.prefecture]).map(line => (
                                        <option key={line} value={line}>{line}</option>
                                    ))}
                                </select>

                                <select
                                    value={form.stationName}
                                    onChange={e => setForm({ ...form, stationName: e.target.value })}
                                    className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] outline-none font-bold"
                                    disabled={!form.stationLine}
                                >
                                    <option value="">駅を選択</option>
                                    {form.prefecture && form.stationLine && TRAIN_DATA[form.prefecture][form.stationLine]?.map(station => (
                                        <option key={station} value={station}>{station}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <div className="relative">
                                    <input
                                        type="number"
                                        placeholder="徒歩何分？"
                                        value={form.minutesToStation}
                                        onChange={e => setForm({ ...form, minutesToStation: e.target.value })}
                                        className="w-full md:w-1/3 p-3 pl-4 pr-12 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:border-[#bf0000] outline-none font-bold"
                                    />
                                    <span className="absolute left-32 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">分</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 家賃 */}
                    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2 pb-2 border-b">
                            <MdAttachMoney className="text-gray-400" /> 家賃・条件
                        </h2>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">月額家賃 <span className="text-[#bf0000] text-xs ml-1">必須</span></label>
                            <div className="relative max-w-xs">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">¥</span>
                                <input
                                    type="number"
                                    value={form.rent}
                                    onChange={e => setForm({ ...form, rent: e.target.value })}
                                    placeholder="65000"
                                    required
                                    min="0"
                                    className="w-full p-4 pl-8 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:border-[#bf0000] outline-none transition font-bold text-lg"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">特徴・こだわり条件</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {amenityOptions.map((option) => (
                                    <label key={option} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${form.amenities.includes(option)
                                        ? 'bg-red-50 border-[#bf0000] text-[#bf0000]'
                                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                        }`}>
                                        <input
                                            type="checkbox"
                                            checked={form.amenities.includes(option)}
                                            onChange={() => toggleAmenity(option)}
                                            className="w-4 h-4 text-[#bf0000] focus:ring-[#bf0000] rounded border-gray-300"
                                        />
                                        <span className="text-sm font-bold">{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 写真 */}
                    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2 pb-2 border-b">
                            <MdCloudUpload className="text-gray-400" /> 写真アップロード
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {[...existingImages, ...previewUrls].map((url, idx) => (
                                <div key={idx} className="aspect-square rounded-lg bg-gray-100 overflow-hidden relative group">
                                    <img src={url} alt="preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}

                            <label
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`aspect-square rounded-lg bg-gray-50 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition group ${isDragging ? 'border-[#bf0000] bg-red-50' : 'border-gray-300 hover:bg-gray-100 hover:border-[#bf0000]'
                                    }`}
                            >
                                <MdCloudUpload className={`text-3xl mb-2 transition ${isDragging ? 'text-[#bf0000]' : 'text-gray-400 group-hover:text-[#bf0000]'}`} />
                                <span className={`text-xs font-bold ${isDragging ? 'text-[#bf0000]' : 'text-gray-500 group-hover:text-[#bf0000]'}`}>
                                    {isDragging ? 'ドロップして追加' : '写真を追加'}
                                </span>
                                <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                            </label>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full bg-[#bf0000] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-black transition text-lg flex items-center justify-center gap-2">
                            確認画面へ進む
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default function HostPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <HostPageContent />
        </Suspense>
    );
}

