"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { MdHome, MdAttachMoney, MdCalculate, MdRestartAlt } from 'react-icons/md';

export default function SimulatorPage() {
    const [rent, setRent] = useState(60000);
    const [utility, setUtility] = useState(10000);
    const [internet, setInternet] = useState(4000);
    const [food, setFood] = useState(30000);
    const [daily, setDaily] = useState(5000);
    const [hobby, setHobby] = useState(10000);

    const total = rent + utility + internet + food + daily + hobby;
    const initialCost = rent * 3; // 敷金・礼金など概算

    return (
        <div className="min-h-screen bg-[#fcfbf7] p-8">
            <Link href="/" className="text-gray-500 hover:text-[#bf0000] flex items-center gap-1 font-bold mb-8">
                <MdHome size={20} /> ホームに戻る
            </Link>

            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 mb-8">
                    <div className="bg-green-50 p-8 text-center border-b border-green-100">
                        <MdCalculate className="mx-auto text-green-500 mb-4" size={64} />
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">生活費シミュレーター</h1>
                        <p className="text-gray-500 font-bold">月々いくらかかる？リアルな数字で計算してみよう</p>
                    </div>

                    <div className="p-8 grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">家賃・共益費</label>
                                <input
                                    type="range" min="0" max="150000" step="1000"
                                    value={rent} onChange={(e) => setRent(Number(e.target.value))}
                                    className="w-full accent-green-500"
                                />
                                <div className="text-right font-bold text-2xl text-gray-800">{rent.toLocaleString()}円</div>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">水道・光熱費</label>
                                <input
                                    type="range" min="0" max="30000" step="1000"
                                    value={utility} onChange={(e) => setUtility(Number(e.target.value))}
                                    className="w-full accent-green-500"
                                />
                                <div className="text-right font-bold text-2xl text-gray-800">{utility.toLocaleString()}円</div>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">通信費</label>
                                <input
                                    type="range" min="0" max="10000" step="500"
                                    value={internet} onChange={(e) => setInternet(Number(e.target.value))}
                                    className="w-full accent-green-500"
                                />
                                <div className="text-right font-bold text-2xl text-gray-800">{internet.toLocaleString()}円</div>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">食費（外食含む）</label>
                                <input
                                    type="range" min="0" max="100000" step="1000"
                                    value={food} onChange={(e) => setFood(Number(e.target.value))}
                                    className="w-full accent-green-500"
                                />
                                <div className="text-right font-bold text-2xl text-gray-800">{food.toLocaleString()}円</div>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">日用品・消耗品</label>
                                <input
                                    type="range" min="0" max="20000" step="500"
                                    value={daily} onChange={(e) => setDaily(Number(e.target.value))}
                                    className="w-full accent-green-500"
                                />
                                <div className="text-right font-bold text-2xl text-gray-800">{daily.toLocaleString()}円</div>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">趣味・交際費</label>
                                <input
                                    type="range" min="0" max="100000" step="1000"
                                    value={hobby} onChange={(e) => setHobby(Number(e.target.value))}
                                    className="w-full accent-green-500"
                                />
                                <div className="text-right font-bold text-2xl text-gray-800">{hobby.toLocaleString()}円</div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6 flex flex-col justify-center sticky top-8 h-fit">
                            <h2 className="text-xl font-bold text-gray-600 mb-6 text-center">1ヶ月の支出目安</h2>
                            <div className="text-center mb-8">
                                <span className="text-5xl font-bold text-[#bf0000]">{total.toLocaleString()}</span>
                                <span className="text-xl font-bold text-gray-500 ml-2">円</span>
                            </div>

                            <div className="space-y-4 border-t border-gray-200 pt-6">
                                <div className="flex justify-between font-bold text-gray-600">
                                    <span>推定初期コスト（住居費×3）</span>
                                    <span>約 {initialCost.toLocaleString()}円</span>
                                </div>
                                <div className="text-xs text-gray-400 mt-2">
                                    ※初期費用は物件により大きく異なります（敷金・礼金・仲介手数料など）。あくまで目安としてお使いください。
                                </div>
                            </div>

                            <Link href="/search" className="block w-full bg-[#bf0000] text-white text-center font-bold py-4 rounded-xl shadow-md hover:opacity-80 transition mt-8">
                                この予算で物件を探す
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
