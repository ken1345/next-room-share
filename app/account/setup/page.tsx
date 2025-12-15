"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MdPerson, MdSave } from 'react-icons/md';
import { supabase } from '@/lib/supabase';

export default function AccountSetupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [displayName, setDisplayName] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [occupation, setOccupation] = useState('');

    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }
            setUser(session.user);

            // Pre-fill display name if available
            setDisplayName(session.user.user_metadata?.full_name || session.user.user_metadata?.display_name || '');
        };
        fetchUser();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!user) return;

            // Update Public Profile
            const { error } = await supabase
                .from('users')
                .upsert({
                    const updates = {
                        display_name: displayName,
                        gender: gender,
                        age: Number(age),
                        occupation: occupation,
                    };

                    const { error: updateError } = await supabase
                        .from('users')
                        .update(updates)
                        .eq('id', user.id);

                    if(updateError) {
                        // If update failed (e.g. no row), try insert (though trigger usually creates it)
                        const { error: insertError } = await supabase
                            .from('users')
                            .insert({ id: user.id, email: user.email, ...updates });

                        if (insertError) throw insertError;
                    }

            // Also update Auth Metadata for consistency
            await supabase.auth.updateUser({
                        data: {
                            display_name: displayName,
                            gender: gender,
                            age: Number(age),
                            occupation: occupation
                        }
                    });

                    alert("プロフィールの設定が完了しました！");

            // Redirect to returnUrl
            router.push(returnUrl);

                } catch (error: any) {
                    console.error(error);
                    alert("エラーが発生しました: " + error.message);
                } finally {
                setIsLoading(false);
            }
        };

        if (!user) return null;

        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
                <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-lg border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-red-100 text-[#bf0000] rounded-full flex items-center justify-center mx-auto mb-4">
                            <MdPerson size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">プロフィール設定</h1>
                        <p className="text-gray-500 text-sm">
                            サービスの利用を開始するには、<br />プロフィールの入力が必要です。
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">表示名</label>
                            <input
                                type="text"
                                required
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#bf0000] focus:ring-2 focus:ring-red-100 outline-none font-bold transition text-gray-900"
                                placeholder="ニックネーム"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">性別</label>
                                <select
                                    required
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#bf0000] focus:ring-2 focus:ring-red-100 outline-none font-bold transition text-gray-900 appearance-none bg-white"
                                >
                                    <option value="">選択</option>
                                    <option value="男性">男性</option>
                                    <option value="女性">女性</option>
                                    <option value="その他">その他</option>
                                    <option value="回答しない">回答しない</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">年齢</label>
                                <input
                                    type="number"
                                    required
                                    min={18}
                                    max={100}
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#bf0000] focus:ring-2 focus:ring-red-100 outline-none font-bold transition text-gray-900"
                                    placeholder="25"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">職業</label>
                            <input
                                type="text"
                                required
                                value={occupation}
                                onChange={(e) => setOccupation(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#bf0000] focus:ring-2 focus:ring-red-100 outline-none font-bold transition text-gray-900"
                                placeholder="例: 会社員、学生"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#bf0000] text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-black transition flex items-center justify-center gap-2"
                            >
                                {isLoading ? '保存中...' : '設定を保存して開始'} <MdSave />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    export default function AccountSetupPage() {
        return (
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
                <AccountSetupForm />
            </Suspense>
        );
    }
    ```
