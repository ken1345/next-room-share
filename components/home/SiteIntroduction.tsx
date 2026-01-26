import Link from 'next/link';
import { MdAddCircle, MdSearch, MdPeople, MdArrowForward } from 'react-icons/md';

export default function SiteIntroduction() {
    return (
        <section className="bg-white py-3 md:py-5 border-b border-red-100">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Main Headline */}

                    <div className="space-y-6 text-gray-600 font-medium leading-loose text-sm md:text-base mb-0 text-left">
                        <p>
                            「ルームシェアmikke」は、ルームシェアをしたい人と、空き部屋を貸したい人を繋ぐマッチングプラットフォームです。<br className="hidden md:block" />
                            登録料・手数料は<span className="text-[#bf0000] font-bold">完全無料</span>。仲介業者を挟まないから、初期費用も家賃も抑えられます。
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}

function FeaturePoint({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="bg-red-50 rounded-xl p-6 border border-red-100 flex flex-col h-full hover:shadow-md transition">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-8 bg-[#bf0000] rounded-full"></div>
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed flex-1">
                {desc}
            </p>
        </div>
    );
}

function StepCard({ step, title, desc, icon }: { step: string, title: string, desc: string, icon: React.ReactNode }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition">
            <div className="absolute -right-4 -top-4 text-8xl font-black text-gray-50 opacity-50 select-none group-hover:text-red-50 transition">
                {step}
            </div>
            <div className="relative z-10">
                <div className="mb-4 bg-red-50 w-16 h-16 rounded-full flex items-center justify-center group-hover:bg-[#bf0000] group-hover:text-white transition-colors duration-300 [&>svg]:transition-colors">
                    <div className="group-hover:text-white transition text-[#bf0000]">
                        {icon}
                    </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed text-sm">{desc}</p>
            </div>
        </div>
    );
}
