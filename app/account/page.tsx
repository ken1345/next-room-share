"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MdPerson, MdEmail, MdArrowForwardIos } from 'react-icons/md';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function AccountPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                // Fetch additional user data from Firestore
                try {
                    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                    if (userDoc.exists()) {
                        setUserData(userDoc.data());
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                // Redirect to login if not authenticated
                router.push('/login');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            <div className="bg-white border-b shadow-sm mb-6">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-800">アカウント</h1>
                    <Link href="/settings" className="text-sm font-bold text-gray-500 hover:text-gray-800 transition">
                        設定
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-2xl space-y-8">
                {/* Profile Section */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-6">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 shrink-0 overflow-hidden">
                        {user.photoURL ? (
                            <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                        ) : (
                            <MdPerson size={40} />
                        )}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-800 mb-1">{user.displayName || userData?.displayName || 'Guest User'}</h2>
                        <div className="flex items-center gap-2 text-gray-500 text-sm font-bold">
                            <MdEmail /> {user.email}
                        </div>
                        <div className="mt-4">
                            <button className="text-sm font-bold text-[#bf0000] border border-[#bf0000] px-4 py-2 rounded-full hover:bg-[#bf0000] hover:text-white transition">
                                プロフィールを編集
                            </button>
                        </div>
                    </div>
                </section>

                {/* Messages Section */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 px-1">メッセージ</h3>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-8 text-center text-gray-500">
                        <p>現在メッセージはありません。</p>
                        <p className="text-sm mt-2">物件に問い合わせるとここにメッセージが表示されます。</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
