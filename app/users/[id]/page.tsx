import Link from 'next/link';
import { MdArrowBack, MdPerson, MdCheck, MdEmail } from 'react-icons/md';
import { supabase } from '@/lib/supabase';

// Revalidate occasionally to update profile info
export const revalidate = 60;

export default async function UserProfilePage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ backUrl?: string }> }) {
    const { id } = await params;
    const { backUrl } = await searchParams;
    const targetUrl = backUrl || '/';
    const linkText = backUrl ? '戻る' : 'トップページ';

    // Fetch user profile
    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">ユーザーが見つかりませんでした</h1>
                <Link href={targetUrl} className="text-[#bf0000] font-bold hover:underline flex items-center gap-1">
                    <MdArrowBack /> {linkText}
                </Link>
            </div>
        );
    }

    // Optional: Fetch user's listings to show they are active? 
    // For now, adhering strictly to "icon, name, gender, age, occupation".

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center">
                    <Link href={targetUrl} className="text-gray-500 hover:text-gray-800 font-bold flex items-center gap-1 text-sm">
                        <MdArrowBack /> {linkText}
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-2xl">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-8 flex flex-col items-center text-center">

                    {/* Icon */}
                    <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 overflow-hidden mb-6 border-4 border-gray-50">
                        {user.photo_url ? (
                            <img src={user.photo_url} alt={user.display_name} className="w-full h-full object-cover" />
                        ) : (
                            <MdPerson size={64} />
                        )}
                    </div>

                    {/* Name */}
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">{user.display_name}</h1>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-8 bg-gray-50 rounded-xl p-6 border border-gray-100">
                        <div className="flex flex-col items-center">
                            <span className="text-xs font-bold text-gray-400 mb-1">性別</span>
                            <span className="font-bold text-gray-800 text-lg">{user.gender || '未設定'}</span>
                        </div>
                        <div className="flex flex-col items-center border-t sm:border-t-0 sm:border-l border-gray-200 pt-4 sm:pt-0">
                            <span className="text-xs font-bold text-gray-400 mb-1">年齢</span>
                            <span className="font-bold text-gray-800 text-lg">{user.age ? `${user.age}歳` : '未設定'}</span>
                        </div>
                        <div className="flex flex-col items-center border-t sm:border-t-0 sm:border-l border-gray-200 pt-4 sm:pt-0">
                            <span className="text-xs font-bold text-gray-400 mb-1">職業</span>
                            <span className="font-bold text-gray-800 text-lg">{user.occupation || '未設定'}</span>
                        </div>
                    </div>

                    {/* Introduction (Future proofing, if column exists) */}
                    {/* 
                    <div className="mt-8 text-left w-full">
                        <h3 className="text-sm font-bold text-gray-400 mb-2">自己紹介</h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {user.introduction || '自己紹介はまだありません。'}
                        </p>
                    </div> 
                    */}

                </div>
            </div>
        </div>
    );
}
