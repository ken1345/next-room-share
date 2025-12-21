"use client";

import { useState } from 'react';
import { MdFilterList, MdCheck, MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';

type SearchFiltersProps = {
    rentMin: number;
    setRentMin: (val: number) => void;
    rentMax: number;
    setRentMax: (val: number) => void;
    walkTime: number | null;
    setWalkTime: (val: number | null) => void;
    filterType: string[];
    setFilterType: (val: string[] | ((prev: string[]) => string[])) => void;
    genderFilter: 'all' | 'male' | 'female';
    setGenderFilter: (val: 'all' | 'male' | 'female') => void;
    selectedAmenities: string[];
    setSelectedAmenities: (val: string[] | ((prev: string[]) => string[])) => void;
    selectedEquipment: string[];
    setSelectedEquipment: (val: string[] | ((prev: string[]) => string[])) => void;
    selectedPersonalEquipment: string[];
    setSelectedPersonalEquipment: (val: string[] | ((prev: string[]) => string[])) => void;

    // Add collapse props
    collapsible?: boolean;
    initialOpen?: boolean;
};

export default function SearchFilters({
    rentMin,
    setRentMin,
    rentMax,
    setRentMax,
    walkTime,
    setWalkTime,
    filterType,
    setFilterType,
    genderFilter,
    setGenderFilter,
    selectedAmenities,
    setSelectedAmenities,
    selectedEquipment,
    setSelectedEquipment,
    selectedPersonalEquipment,
    setSelectedPersonalEquipment,
    collapsible = false,
    initialOpen = true
}: SearchFiltersProps) {
    const [isOpen, setIsOpen] = useState(initialOpen);

    const toggleOpen = () => {
        if (collapsible) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div
                className={`flex items-center justify-between font-bold text-gray-800 ${collapsible ? 'cursor-pointer' : ''} ${isOpen ? 'mb-4 border-b pb-2' : ''}`}
                onClick={toggleOpen}
            >
                <div className="flex items-center gap-2">
                    <MdFilterList size={20} /> 絞り込み条件
                </div>
                {collapsible && (
                    <div className="text-gray-500">
                        {isOpen ? <MdKeyboardArrowUp size={24} /> : <MdKeyboardArrowDown size={24} />}
                    </div>
                )}
            </div>

            {/* Content Wrapper */}
            {isOpen && (
                <div className="animate-in slide-in-from-top-2 fade-in duration-200">
                    {/* 家賃 (Rent) */}
                    <div className="mb-6">
                        <h4 className="text-sm font-bold text-gray-600 mb-2">家賃 (万円)</h4>
                        <div className="flex items-center gap-2 mb-2">
                            <input
                                type="number"
                                min="0"
                                max="50"
                                value={rentMin}
                                onChange={(e) => setRentMin(Number(e.target.value))}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                placeholder="下限"
                            />
                            <span className="text-gray-400">~</span>
                            <input
                                type="number"
                                min="0"
                                max="50"
                                value={rentMax}
                                onChange={(e) => setRentMax(Number(e.target.value))}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                placeholder="上限"
                            />
                        </div>
                    </div>

                    {/* 最寄り駅徒歩 (Walk Time) */}
                    <div className="mb-6">
                        <h4 className="text-sm font-bold text-gray-600 mb-2">駅徒歩</h4>
                        <div className="space-y-2">
                            {[
                                { label: '指定なし', value: null },
                                { label: '5分以内', value: 5 },
                                { label: '10分以内', value: 10 },
                                { label: '15分以内', value: 15 },
                                { label: '20分以内', value: 20 },
                            ].map((opt) => (
                                <label key={opt.label} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="walkTime"
                                        checked={walkTime === opt.value}
                                        onChange={() => setWalkTime(opt.value)}
                                        className="text-[#bf0000] focus:ring-[#bf0000]"
                                    />
                                    <span className="text-sm text-gray-700">{opt.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* 部屋タイプ (Room Type) */}
                    <div className="mb-6">
                        <h4 className="text-sm font-bold text-gray-600 mb-2">部屋タイプ</h4>
                        <div className="space-y-2">
                            {['個室', 'ドミトリー', '半個室'].map(t => (
                                <label key={t} className="flex items-center gap-2 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={filterType.includes(t)}
                                            onChange={(e) => {
                                                if (e.target.checked) setFilterType(prev => [...prev, t]);
                                                else setFilterType(prev => prev.filter(x => x !== t));
                                            }}
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm transition-all checked:border-[#bf0000] checked:bg-[#bf0000]"
                                        />
                                        <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                            <MdCheck size={14} />
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-700">{t}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* 性別 (Gender) */}
                    <div className="mb-6">
                        <h4 className="text-sm font-bold text-gray-600 mb-2">入居条件</h4>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    checked={genderFilter === 'all'}
                                    onChange={() => setGenderFilter('all')}
                                    className="text-[#bf0000] focus:ring-[#bf0000]"
                                />
                                <span className="text-sm text-gray-700">指定なし</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    checked={genderFilter === 'male'}
                                    onChange={() => setGenderFilter('male')}
                                    className="text-[#bf0000] focus:ring-[#bf0000]"
                                />
                                <span className="text-sm text-gray-700">男性限定</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    checked={genderFilter === 'female'}
                                    onChange={() => setGenderFilter('female')}
                                    className="text-[#bf0000] focus:ring-[#bf0000]"
                                />
                                <span className="text-sm text-gray-700">女性限定</span>
                            </label>
                        </div>
                    </div>

                    {/* こだわり条件 (Amenities) */}
                    <div className="mb-6">
                        <h4 className="text-sm font-bold text-gray-600 mb-2">こだわり条件</h4>
                        <div className="space-y-2">
                            {[
                                "即入居可", "住民票登録可", "年齢制限なし", "預り金なし",
                                "駐車場有", "駐輪場有", "ペット相談可", "高速インターネット(光回線)",
                                "外国人歓迎", "楽器可", "DIY可", "鍵付き個室", "2人入居可",
                                "光熱費込み", "仕事場利用可", "友人宿泊可", "カップル可", "家族宿泊可", "喫煙可",
                                "新築", "リノベ"
                            ].map(amenity => (
                                <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedAmenities.includes(amenity)}
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedAmenities(prev => [...prev, amenity]);
                                                else setSelectedAmenities(prev => prev.filter(x => x !== amenity));
                                            }}
                                            className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm transition-all checked:border-[#bf0000] checked:bg-[#bf0000]"
                                        />
                                        <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                            <MdCheck size={12} />
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-700">{amenity}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* 共用設備 (Equipment) */}
                    <div className="mb-6">
                        <h4 className="text-sm font-bold text-gray-600 mb-2">共用設備</h4>
                        <div className="space-y-2">
                            {[
                                "炊飯器", "電子レンジ", "冷蔵庫", "食洗器", "シャワー", "お風呂", "洗濯機", "トイレ", "テレビ", "エアコン", "Wifi",
                                "掃除機", "ドライヤー", "アイロン", "オートロック"
                            ].map(item => (
                                <label key={item} className="flex items-center gap-2 cursor-pointer">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedEquipment.includes(item)}
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedEquipment(prev => [...prev, item]);
                                                else setSelectedEquipment(prev => prev.filter(x => x !== item));
                                            }}
                                            className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm transition-all checked:border-[#bf0000] checked:bg-[#bf0000]"
                                        />
                                        <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                            <MdCheck size={12} />
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-700">{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* 個室設備 (Personal Equipment) */}
                    <div className="mb-6">
                        <h4 className="text-sm font-bold text-gray-600 mb-2">個室設備</h4>
                        <div className="space-y-2">
                            {[
                                "布団", "ベッド", "エアコン", "インターネット", "テレビ", "机", "椅子", "収納", "ベランダ", "フローリング", "畳"
                            ].map(item => (
                                <label key={item} className="flex items-center gap-2 cursor-pointer">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedPersonalEquipment.includes(item)}
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedPersonalEquipment(prev => [...prev, item]);
                                                else setSelectedPersonalEquipment(prev => prev.filter(x => x !== item));
                                            }}
                                            className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm transition-all checked:border-[#bf0000] checked:bg-[#bf0000]"
                                        />
                                        <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                            <MdCheck size={12} />
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-700">{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
