"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MdArrowBack, MdSave, MdCloudUpload, MdPerson } from 'react-icons/md';
import { auth, db, storage } from '@/lib/firebase';
import { onAuthStateChanged, updateProfile, updatePassword, User } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function EditProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [displayName, setDisplayName] = useState('');
    const [password, setPassword] = useState('');
    const [newImageFile, setNewImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setDisplayName(currentUser.displayName || '');
                setPreviewUrl(currentUser.photoURL);
            } else {
                router.push('/login');
            }
        });
        return () => unsubscribe();
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
            let photoURL = user.photoURL;

            // 1. Upload Image if changed
            if (newImageFile) {
                try {
                    // Check if storage bucket is configured
                    // Note: storage.app.options might differ in structure depending on SDK version, 
                    // but verifying bucket existence is good practice.
                    if (!storage.app.options.storageBucket) {
                        throw new Error("Firebase Storage is not configured. (Check NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)");
                    }

                    const storageRef = ref(storage, `profile_images/${user.uid}/${newImageFile.name}`);

                    // Add timeout promise race to prevent indefinite hang
                    const uploadPromise = uploadBytes(storageRef, newImageFile);
                    const timeoutPromise = new Promise<never>((_, reject) =>
                        setTimeout(() => reject(new Error("Timeout: Image upload took too long. Check if Storage is enabled in Firebase Console.")), 15000)
                    );

                    const snapshot = await Promise.race([uploadPromise, timeoutPromise]) as any;
                    photoURL = await getDownloadURL(snapshot.ref);

                } catch (error: any) {
                    console.error("Storage Error:", error);
                    alert(`画像のアップロードに失敗しました: ${error.message}\n\nプロフィール名とパスワードの更新のみ続行します。`);
                    // Continue without updating image
                }
            }

            // 2. Update Auth Profile (Display Name & Photo)
            if (displayName !== user.displayName || photoURL !== user.photoURL) {
                await updateProfile(user, {
                    displayName: displayName,
                    photoURL: photoURL
                });

                // Update Firestore User Doc as well for consistency
                const userDocRef = doc(db, 'users', user.uid);
                await updateDoc(userDocRef, {
                    displayName: displayName,
                    photoURL: photoURL
                });
            }

            // 3. Update Password if provided
            if (password) {
                await updatePassword(user, password);
            }

            alert("プロフィールを更新しました！");
            router.push('/account');

        } catch (error: any) {
            console.error("Update Error:", error);
            if (error.code === 'auth/requires-recent-login') {
                alert("セキュリティのため、パスワード変更には再ログインが必要です。ログアウトして再度お試しください。");
            } else {
                alert("更新に失敗しました: " + error.message);
            }
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
