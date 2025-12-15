"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { MdPsychology, MdCheck, MdArrowForward, MdRestartAlt, MdHome, MdCake, MdStar } from 'react-icons/md';

type Question = {
    id: number;
    text: string;
    options: { label: string; type: string }[];
};

const QUESTIONS: Question[] = [
    {
        id: 1,
        text: "休日の過ごし方は？",
        options: [
            { label: "家でゆっくり映画や読書", type: "introvert" },
            { label: "外に出かけてアクティブに！", type: "extrovert" },
            { label: "友人を呼んでホームパーティー", type: "party" },
            { label: "黙々と趣味や勉強に没頭", type: "stoic" },
        ]
    },
    {
        id: 2,
        text: "部屋の掃除頻度は？",
        options: [
            { label: "毎日ピカピカにしないと気が済まない", type: "clean" },
            { label: "週に1回程度、ある程度片付いていればOK", type: "normal" },
            { label: "散らかっていても気にならない", type: "messy" },
            { label: "気づいた時にやるスタイル", type: "normal" },
        ]
    },
    {
        id: 3,
        text: "他人との距離感は？",
        options: [
            { label: "積極的に交流したい！ご飯も一緒に", type: "social" },
            { label: "挨拶程度で、基本はプライベート重視", type: "private" },
            { label: "気が向いた時だけ話したい", type: "mood" },
            { label: "家族のように何でも話せる関係がいい", type: "family" },
        ]
    },
    {
        id: 4,
        text: "お風呂やキッチンの使い方は？",
        options: [
            { label: "使ったら必ずすぐに綺麗にする", type: "clean" },
            { label: "後でまとめてやることもある", type: "messy" },
            { label: "ルールを決めて当番制にしたい", type: "rule" },
            { label: "細かいことは気にしない", type: "free" },
        ]
    }
];

// 四柱推命：十干（日干）の定義
const TEN_ELEMENTS: { [key: number]: { name: string; symbol: string; desc: string; shareStyle: string; color: string } } = {
    0: { name: "大樹（甲）", symbol: "🌲", desc: "向上心が強く、一本気なリーダータイプ。曲がったことが大嫌い。", shareStyle: "ルールをしっかり守る規律あるシェアハウス", color: "bg-green-100 text-green-800 border-green-200" },
    1: { name: "草花（乙）", symbol: "🌷", desc: "柔軟で協調性が高く、どんな環境でも逞しく根を張れる愛されキャラ。", shareStyle: "アットホームで会話の多いシェアハウス", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    2: { name: "太陽（丙）", symbol: "☀️", desc: "明るく情熱的で、そこにいるだけで周囲を照らすムードメーカー。", shareStyle: "イベントが多く賑やかな大型シェアハウス", color: "bg-red-100 text-red-800 border-red-200" },
    3: { name: "灯火（丁）", symbol: "🕯️", desc: "静かに燃える情熱を持ち、鋭い感性と温かい配慮ができる芸術家肌。", shareStyle: "インテリアや雰囲気にこだわるお洒落な物件", color: "bg-orange-100 text-orange-800 border-orange-200" },
    4: { name: "山岳（戊）", symbol: "⛰️", desc: "どっしりと構えた安定感があり、頼りがいのある包容力バツグンの親分肌。", shareStyle: "管理がしっかりしていて安心感のある物件", color: "bg-amber-100 text-amber-800 border-amber-200" },
    5: { name: "大地（己）", symbol: "🌾", desc: "堅実で家庭的、人を育てるのが上手で、粘り強い庶民派。", shareStyle: "リビングに自然と人が集まる温かいシェアハウス", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    6: { name: "鋼鉄（庚）", symbol: "⚔️", desc: "意志が固く、決断力と行動力に優れた改革者。白黒はっきりつけたいタイプ。", shareStyle: "お互いに干渉しすぎず、自立した大人のシェアハウス", color: "bg-slate-100 text-slate-800 border-slate-200" },
    7: { name: "宝石（辛）", symbol: "💎", desc: "繊細で美意識が高く、試練によって磨かれる特別な輝きを持つ。", shareStyle: "新築・築浅で設備が整った綺麗な物件（汚いのはNG）", color: "bg-purple-100 text-purple-800 border-purple-200" },
    8: { name: "大海（壬）", symbol: "🌊", desc: "自由奔放でスケールが大きく、変化を恐れない冒険家。", shareStyle: "国際交流や多拠点生活など、刺激のあるシェアハウス", color: "bg-blue-100 text-blue-800 border-blue-200" },
    9: { name: "雨露（癸）", symbol: "🌧️", desc: "慈悲深く、知性的で、環境に合わせて形を変えられる奉仕の人。", shareStyle: "少人数で落ち着いた、静かな環境のシェアハウス", color: "bg-cyan-100 text-cyan-800 border-cyan-200" },
};

export default function DiagnosisPage() {
    const [step, setStep] = useState<'start' | 'bday' | 'bday_result' | 'question' | 'result'>('start');
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [year, setYear] = useState('2000');
    const [month, setMonth] = useState('1');
    const [day, setDay] = useState('1');
    const [stemIndex, setStemIndex] = useState<number | null>(null);

    const handleStart = () => {
        setStep('bday');
        setAnswers([]);
        setStemIndex(null);
    };

    // 日干の計算ロジック (簡易版)
    // 基準日: 2000年1月1日 (戊午 = 4(戊))
    const calculateDayStem = (y: number, m: number, d: number): number => {
        const target = new Date(y, m - 1, d); // Month is 0-indexed
        const base = new Date(2000, 0, 1); // 2000-01-01

        // Set hours to 0 to avoid DST issues affecting day difference
        target.setHours(0, 0, 0, 0);
        base.setHours(0, 0, 0, 0);

        const baseStem = 4; // 戊

        // 日数差 (JST考慮...簡易的にUTCでの差分日数を使う)
        // Note: Date.parseはUTC計算になりがちだが、input type="date"の値(yyyy-mm-dd)をnew Dateすると
        // ブラウザの実装依存だが、通常はローカルタイム0:00になることが多い。
        // ここでは時差によるズレ許容の簡易計算とする
        const diffTime = target.getTime() - base.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        let stem = (baseStem + diffDays) % 10;
        if (stem < 0) stem += 10;

        return stem;
    };

    const handleBdaySubmit = () => {
        const y = parseInt(year);
        const m = parseInt(month);
        const d = parseInt(day);

        const stem = calculateDayStem(y, m, d);
        setStemIndex(stem);
        setStep('bday_result');
    };

    const handleToQuestions = () => {
        setStep('question');
        setCurrentQIndex(0);
    };

    const handleAnswer = (type: string) => {
        const newAnswers = [...answers, type];
        setAnswers(newAnswers);

        if (currentQIndex < QUESTIONS.length - 1) {
            setCurrentQIndex(prev => prev + 1);
        } else {
            setStep('result');
        }
    };

    const getResult = () => {
        if (stemIndex === null) return null;

        // 1. 四柱推命（日干）によるベース性格
        const fate = TEN_ELEMENTS[stemIndex];

        // 2. Q&Aによる補正（ライフスタイル）
        const counts: { [key: string]: number } = {};
        answers.forEach(a => counts[a] = (counts[a] || 0) + 1);

        const isClean = (counts['clean'] || 0) > 0;
        const isSocial = (counts['social'] || 0) + (counts['party'] || 0) + (counts['family'] || 0) > 0;

        let subAdvice = "";
        if (isClean && stemIndex !== 7) subAdvice = "また、あなたは綺麗好きなので、掃除ルールが明確な物件を優先しましょう。";
        if (isSocial && stemIndex !== 2 && stemIndex !== 8) subAdvice = "交流好きな一面もあるため、共有スペースが広い物件も候補に入れてみてください。";

        return {
            title: `あなたの本質は「${fate.name}」`,
            symbol: fate.symbol,
            desc: fate.desc,
            advice: fate.shareStyle,
            subAdvice: subAdvice,
            color: fate.color
        };
    };

    const result = step === 'result' ? getResult() : null;
    const stemData = stemIndex !== null ? TEN_ELEMENTS[stemIndex] : null;

    const years = Array.from({ length: 100 }, (_, i) => 1930 + i).reverse();
    const months = Array.from({ length: 12 }, (_, i) => 1 + i);
    const days = Array.from({ length: 31 }, (_, i) => 1 + i);

    return (
        <div className="min-h-screen bg-[#fcfbf7] flex flex-col items-center justify-center p-4">
            <Link href="/" className="absolute top-6 left-6 text-gray-500 hover:text-[#bf0000] flex items-center gap-1 font-bold">
                <MdHome size={20} /> ホームに戻る
            </Link>

            <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 min-h-[500px] flex flex-col relative transition-all duration-500">

                {/* Decoration */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 to-purple-500" />

                {step === 'start' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-10 text-center animate-fadeIn">
                        <div className="w-32 h-32 bg-pink-50 rounded-full flex items-center justify-center mb-8 text-pink-500 shadow-sm">
                            <MdPsychology size={80} />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">四柱推命 × ルームシェア診断</h1>
                        <p className="text-gray-500 font-bold mb-10 leading-relaxed">
                            古代中国の占術「四柱推命」の本質診断と<br />
                            ライフスタイル診断を組み合わせて<br />
                            あなたに最適な環境を導き出します。
                        </p>
                        <button
                            onClick={handleStart}
                            className="bg-[#bf0000] text-white font-bold text-xl px-12 py-4 rounded-full shadow-lg hover:bg-black hover:scale-105 transition flex items-center gap-2"
                        >
                            診断スタート <MdArrowForward />
                        </button>
                    </div>
                )}

                {step === 'bday' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-10 text-center animate-slideInRight">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-500 shadow-sm">
                            <MdCake size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">生年月日を教えてください</h2>
                        <p className="text-sm text-gray-500 mb-8 font-bold">四柱推命であなたの本質（タイプ）を診断します。</p>

                        <div className="flex gap-2 mb-8 w-full max-w-sm justify-center">
                            <div className="relative">
                                <select
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-8 font-bold text-gray-700 focus:border-[#bf0000] outline-none"
                                >
                                    {years.map(y => <option key={y} value={y}>{y}年</option>)}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                            </div>
                            <div className="relative">
                                <select
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                    className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-8 font-bold text-gray-700 focus:border-[#bf0000] outline-none"
                                >
                                    {months.map(m => <option key={m} value={m}>{m}月</option>)}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                            </div>
                            <div className="relative">
                                <select
                                    value={day}
                                    onChange={(e) => setDay(e.target.value)}
                                    className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-8 font-bold text-gray-700 focus:border-[#bf0000] outline-none"
                                >
                                    {days.map(d => <option key={d} value={d}>{d}日</option>)}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                            </div>
                        </div>

                        <button
                            onClick={handleBdaySubmit}
                            className="bg-[#bf0000] text-white font-bold text-lg px-10 py-3 rounded-full shadow-md hover:bg-black transition"
                        >
                            診断する
                        </button>
                    </div>
                )}

                {step === 'bday_result' && stemData && (
                    <div className="flex-1 flex flex-col items-center justify-center p-10 text-center animate-fadeIn">
                        <p className="text-sm text-gray-400 font-bold mb-2">四柱推命による診断結果</p>
                        <div className="text-6xl mb-4">{stemData.symbol}</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            あなたは「{stemData.name}」タイプ
                        </h2>
                        <p className="text-gray-600 font-bold mb-8 leading-relaxed">
                            {stemData.desc}
                        </p>

                        <div className="bg-gray-50 p-6 rounded-xl w-full mb-8">
                            <p className="font-bold text-sm text-gray-500 mb-2">次はライフスタイルについて</p>
                            <p className="text-gray-800 font-bold">
                                この結果に加えて、あなたの生活スタイルを<br />分析し、最適な物件タイプを判定します。
                            </p>
                        </div>

                        <button
                            onClick={handleToQuestions}
                            className="bg-[#bf0000] text-white font-bold text-lg px-10 py-3 rounded-full shadow-md hover:bg-black transition"
                        >
                            質問へ進む <MdArrowForward />
                        </button>
                    </div>
                )}

                {step === 'question' && (
                    <div className="flex-1 flex flex-col p-8 md:p-12 animate-slideInRight">
                        <div className="mb-8">
                            <span className="text-[#bf0000] font-bold text-sm tracking-widest">LIFESTYLE QUESTION {currentQIndex + 1} / {QUESTIONS.length}</span>
                            <div className="h-2 w-full bg-gray-100 rounded-full mt-2 overflow-hidden">
                                <div
                                    className="h-full bg-[#bf0000] transition-all duration-500 ease-out"
                                    style={{ width: `${((currentQIndex + 1) / QUESTIONS.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
                            {QUESTIONS[currentQIndex].text}
                        </h2>

                        <div className="space-y-3 flex-1">
                            {QUESTIONS[currentQIndex].options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(option.type)}
                                    className="w-full text-left p-5 rounded-xl border border-gray-200 hover:border-[#bf0000] hover:bg-red-50 transition font-bold text-gray-700 flex items-center justify-between group"
                                >
                                    {option.label}
                                    <MdCheck className="opacity-0 group-hover:opacity-100 text-[#bf0000] transition" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 'result' && result && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-10 text-center animate-fadeIn">
                        <div className="text-6xl mb-4">{result.symbol}</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            {result.title}
                        </h2>

                        <div className={`p-6 rounded-2xl border-2 mb-6 w-full ${result.color} text-left`}>
                            <p className="font-bold mb-4 leading-relaxed">
                                {result.desc}
                            </p>
                            <div className="bg-white/60 p-4 rounded-xl">
                                <span className="block text-xs font-bold opacity-70 mb-1 flex items-center gap-1"><MdStar /> おすすめの環境</span>
                                <p className="font-bold text-lg">{result.advice}</p>
                            </div>
                            {result.subAdvice && (
                                <p className="mt-4 text-sm font-bold opacity-80 border-t border-black/10 pt-2 dashed">
                                    💡 {result.subAdvice}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 w-full">
                            <Link href="/search" className="bg-[#bf0000] text-white font-bold py-4 rounded-xl shadow-md hover:bg-black transition block w-full text-center">
                                おすすめの物件を探す
                            </Link>
                            <button
                                onClick={handleStart}
                                className="text-gray-500 font-bold py-3 hover:text-gray-800 transition flex items-center justify-center gap-2"
                            >
                                <MdRestartAlt /> もう一度診断する
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
