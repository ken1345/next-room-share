"use client";
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MOCK_PROPERTIES } from '@/data/mock-properties';
import { MdArrowBack, MdCheck, MdEmail, MdPerson } from 'react-icons/md';

export default function ContactPage() {
    const params = useParams();
    const id = Number(params.id);
    const property = MOCK_PROPERTIES.find(p => p.id === id);

    const [form, setForm] = useState({
        name: '',
        age: '',
        gender: '',
        occupation: '',
        currentPrefecture: '',
        duration: '',
        moveInDate: '',
        message: '物件に興味があり、内覧を希望します。よろしくお願いします。'
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock submission & redirect to thread
        // In real app, we would get the threadId from the API response
        setTimeout(() => {
            window.location.href = '/messages/1';
        }, 500);
    };

    if (!property) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">物件が見つかりませんでした</h1>
                <Link href="/search" className="text-[#bf0000] font-bold hover:underline flex items-center gap-1">
                    <MdArrowBack /> 検索に戻る
                </Link>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MdCheck size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">送信完了</h2>
                    <p className="text-gray-600 mb-6">
                        お問い合わせありがとうございます。<br />
                        ホストからの返信をお待ちください。
                    </p>
                    <Link href="/search" className="block w-full bg-[#bf0000] text-white font-bold py-3 rounded-xl hover:bg-black transition">
                        トップへ戻る
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            {/* Header */}
            <div className="bg-white border-b shadow-sm sticky top-0 z-40">
                <div className="container mx-auto px-4 h-16 flex items-center">
                    <Link href={`/rooms/${id}`} className="text-gray-500 hover:text-gray-800 font-bold flex items-center gap-1">
                        <MdArrowBack /> 物件に戻る
                    </Link>
                    <h1 className="text-lg font-bold text-gray-800 ml-4 flex-1 text-center pr-20">お問い合わせ</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-2xl py-8">
                {/* Property Summary */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4 mb-8">
                    <div className={`w-24 h-24 ${property.image} bg-cover bg-center rounded-lg flex-shrink-0`}></div>
                    <div>
                        <h2 className="font-bold text-gray-800 text-sm md:text-base mb-2 line-clamp-2">{property.title}</h2>
                        <div className="text-xs text-gray-500 font-bold mb-1">{property.station}</div>
                        <div className="text-xl font-bold text-[#bf0000]">¥{property.price}万 <span className="text-xs text-gray-500 font-normal">/ 月</span></div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">お名前 <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] outline-none font-bold"
                            placeholder="山田 太郎"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">性別 <span className="text-red-500">*</span></label>
                            <select
                                required
                                value={form.gender}
                                onChange={e => setForm({ ...form, gender: e.target.value })}
                                className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] outline-none font-bold bg-white"
                            >
                                <option value="">選択してください</option>
                                <option value="male">男性</option>
                                <option value="female">女性</option>
                                <option value="other">その他・無回答</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">年齢 <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                required
                                min="0"
                                max="100"
                                value={form.age}
                                onChange={e => setForm({ ...form, age: e.target.value })}
                                className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] outline-none font-bold"
                                placeholder="25"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">職業 <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={form.occupation}
                                onChange={e => setForm({ ...form, occupation: e.target.value })}
                                className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] outline-none font-bold"
                                placeholder="会社員"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">現在の都道府県 <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={form.currentPrefecture}
                                onChange={e => setForm({ ...form, currentPrefecture: e.target.value })}
                                className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] outline-none font-bold"
                                placeholder="東京都"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">入居予定期間 <span className="text-red-500">*</span></label>
                        <select
                            required
                            value={form.duration}
                            onChange={e => setForm({ ...form, duration: e.target.value })}
                            className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] outline-none font-bold bg-white"
                        >
                            <option value="">選択してください</option>
                            <option value="1-5months">1ヶ月〜5ヶ月</option>
                            <option value="6months+">半年以上</option>
                            <option value="1year+">1年以上</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">入居希望日</label>
                        <input
                            type="date"
                            value={form.moveInDate}
                            onChange={e => setForm({ ...form, moveInDate: e.target.value })}
                            className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] outline-none font-bold"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">メッセージ <span className="text-red-500">*</span></label>
                        <textarea
                            required
                            rows={5}
                            value={form.message}
                            onChange={e => setForm({ ...form, message: e.target.value })}
                            className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] outline-none font-bold resize-none"
                        ></textarea>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full bg-[#bf0000] text-white font-bold py-4 rounded-xl shadow-md hover:bg-black transition text-lg flex items-center justify-center gap-2">
                            <MdEmail /> 送信する
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
