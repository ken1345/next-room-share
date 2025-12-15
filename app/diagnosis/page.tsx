"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { MdPsychology, MdCheck, MdArrowForward, MdRestartAlt, MdHome } from 'react-icons/md';

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

export default function DiagnosisPage() {
    const [step, setStep] = useState<'start' | 'question' | 'result'>('start');
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);

    const handleStart = () => {
        setStep('question');
        setCurrentQIndex(0);
        setAnswers([]);
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
        // Simple logic for demo purposes
        const counts: { [key: string]: number } = {};
        answers.forEach(a => counts[a] = (counts[a] || 0) + 1);

        // Count specific traits
        const isClean = (counts['clean'] || 0) > 0;
        const isSocial = (counts['social'] || 0) + (counts['party'] || 0) + (counts['family'] || 0) > 0;
        const isPrivate = (counts['private'] || 0) > 0;
        const isExtrovert = (counts['extrovert'] || 0) > 0;

        if (isSocial && isExtrovert) return {
            type: "パーティーピーポータイプ",
            desc: "賑やかな環境が大好き！国際交流シェアハウスや、イベントが多い大型シェアハウスがおすすめです。",
            color: "bg-pink-100 text-pink-800 border-pink-200"
        };
        if (isPrivate && isClean) return {
            type: "ミニマリスト・静寂タイプ",
            desc: "一人の時間を大切にしたいあなた。防音性が高く、個室完備の少人数シェアハウスが向いています。",
            color: "bg-blue-100 text-blue-800 border-blue-200"
        };
        if (isClean) return {
            type: "綺麗好き・几帳面タイプ",
            desc: "清潔感が第一！管理会社がしっかり清掃に入ってくれる物件や、新築のリノベーション物件を探しましょう。",
            color: "bg-green-100 text-green-800 border-green-200"
        };
        return {
            type: "バランス重視・マイペースタイプ",
            desc: "程よい距離感を保てるあなた。どんなシェアハウスでも馴染めますが、ルールが厳しすぎない物件がベターです。",
            color: "bg-yellow-100 text-yellow-800 border-yellow-200"
        };
    };

    const result = step === 'result' ? getResult() : null;

    return (
        <div className="min-h-screen bg-[#fcfbf7] flex flex-col items-center justify-center p-4">
            <Link href="/" className="absolute top-6 left-6 text-gray-500 hover:text-[#bf0000] flex items-center gap-1 font-bold">
                <MdHome size={20} /> ホームに戻る
            </Link>

            <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 min-h-[500px] flex flex-col relative">

                {/* Decoration */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 to-purple-500" />

                {step === 'start' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-10 text-center animate-fadeIn">
                        <div className="w-32 h-32 bg-pink-50 rounded-full flex items-center justify-center mb-8 text-pink-500 shadow-sm">
                            <MdPsychology size={80} />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">ルームシェア相性診断</h1>
                        <p className="text-gray-500 font-bold mb-10 leading-relaxed">
                            生活スタイルや性格から、<br />あなたにぴったりのシェアハウスタイプを<br />たった1分で診断します！
                        </p>
                        <button
                            onClick={handleStart}
                            className="bg-[#bf0000] text-white font-bold text-xl px-12 py-4 rounded-full shadow-lg hover:bg-black hover:scale-105 transition flex items-center gap-2"
                        >
                            診断スタート <MdArrowForward />
                        </button>
                    </div>
                )}

                {step === 'question' && (
                    <div className="flex-1 flex flex-col p-8 md:p-12 animate-slideInRight">
                        <div className="mb-8">
                            <span className="text-[#bf0000] font-bold text-sm tracking-widest">QUESTION {currentQIndex + 1} / {QUESTIONS.length}</span>
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
                    <div className="flex-1 flex flex-col items-center justify-center p-10 text-center animate-fadeIn">
                        <p className="text-gray-400 font-bold mb-4">診断結果</p>
                        <h2 className="text-4xl font-bold text-gray-800 mb-6">
                            あなたは...
                        </h2>

                        <div className={`p-8 rounded-2xl border-2 mb-8 w-full ${result.color}`}>
                            <h3 className="text-2xl font-bold mb-4">{result.type}</h3>
                            <p className="font-bold opacity-90 leading-relaxed text-left md:text-center">
                                {result.desc}
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 w-full">
                            <Link href="/search" className="bg-[#bf0000] text-white font-bold py-4 rounded-xl shadow-md hover:bg-black transition block w-full">
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
