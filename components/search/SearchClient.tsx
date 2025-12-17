"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MdSearch, MdLocationOn, MdTrain, MdMap, MdFilterList, MdCheckBox, MdCheckBoxOutlineBlank, MdSort, MdKeyboardArrowRight, MdCheck, MdArrowBack, MdSave, MdKeyboardArrowUp } from 'react-icons/md';
import PhotoPropertyCard from '@/components/PhotoPropertyCard';

// Area Data Structure
import AREA_DATA_JSON from '@/data/generated-area-data.json';
// Train Data Structure
import TRAIN_DATA_JSON from '@/data/pref_line_station_full.json';

const AREA_DATA: { [key: string]: { [key: string]: string[] } } = AREA_DATA_JSON;
const TRAIN_DATA: { [key: string]: { [key: string]: string[] } } = TRAIN_DATA_JSON;

type AreaSelection = {
    region: string | null;
    prefecture: string | null;
    city: string | null;
};

type StationSelection = {
    prefecture: string | null;
    line: string | null;
    station: string | null;
};

type SearchClientProps = {
    listings: any[];
    totalCount: number;
};

export default function SearchClient({ listings, totalCount }: SearchClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Initialize State from URL Params
    const initialMode = searchParams.get('mode') || searchParams.get('tab') || 'area';
    const featureParam = searchParams.get('feature');

    const [activeTab, setActiveTab] = useState(initialMode);
    const [triggerSearch, setTriggerSearch] = useState(0);

    // Filter States
    const [rentMin, setRentMin] = useState<number>(Number(searchParams.get('min_rent')) || 0);
    const [rentMax, setRentMax] = useState<number>(searchParams.get('max_rent') ? Number(searchParams.get('max_rent')) : 50); // Default to 50 if logic implies no limit? Or 20? App had 20 but slider might vary.
    const [keyword, setKeyword] = useState(searchParams.get('q') || '');
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>(searchParams.get('amenities')?.split(',').filter(Boolean) || []);
    const [selectedEquipment, setSelectedEquipment] = useState<string[]>(searchParams.get('equipment')?.split(',').filter(Boolean) || []);
    const [selectedPersonalEquipment, setSelectedPersonalEquipment] = useState<string[]>(searchParams.get('personal_equipment')?.split(',').filter(Boolean) || []);
    const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>((searchParams.get('gender') as any) || 'all');
    const [walkTime, setWalkTime] = useState<number | null>(searchParams.get('walk') ? Number(searchParams.get('walk')) : null);
    const [filterType, setFilterType] = useState<string[]>(searchParams.get('types')?.split(',').filter(Boolean) || []);

    // Area Selection State
    const [areaSelection, setAreaSelection] = useState<AreaSelection>({
        region: searchParams.get('region') || null,
        prefecture: searchParams.get('pref') || null,
        city: searchParams.get('city') || null
    });

    // Station Selection State
    const [stationSelection, setStationSelection] = useState<StationSelection>({
        prefecture: searchParams.get('station_pref') || null,
        line: searchParams.get('line') || null,
        station: searchParams.get('station') || null
    });

    // Refs for Manual Filters (to avoid stale closures in useEffect)
    const areaRef = useRef(areaSelection);
    const stationRef = useRef(stationSelection);

    useEffect(() => {
        areaRef.current = areaSelection;
    }, [areaSelection]);

    useEffect(() => {
        stationRef.current = stationSelection;
    }, [stationSelection]);

    // Pagination State
    const ITEMS_PER_PAGE = 20;
    const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get('page')) || 1);

    // Sync State to URL
    useEffect(() => {
        const params = new URLSearchParams();

        if (activeTab !== 'area') params.set('tab', activeTab);
        // params.set('tab', activeTab); // Removed duplicate line

        if (featureParam) params.set('feature', featureParam);

        if (keyword) params.set('q', keyword);
        if (rentMin > 0) params.set('min_rent', rentMin.toString());
        if (rentMax < 50) params.set('max_rent', rentMax.toString());
        if (walkTime) params.set('walk', walkTime.toString());
        if (genderFilter !== 'all') params.set('gender', genderFilter);
        if (selectedAmenities.length > 0) params.set('amenities', selectedAmenities.join(','));
        if (selectedEquipment.length > 0) params.set('equipment', selectedEquipment.join(','));
        if (selectedPersonalEquipment.length > 0) params.set('personal_equipment', selectedPersonalEquipment.join(','));
        if (filterType.length > 0) params.set('types', filterType.join(','));

        console.log('Search Effect Triggered', {
            triggerSearch,
            activeTab,
            areaSelection: areaRef.current,
            stationSelection: stationRef.current
        });

        if (activeTab === 'area') {
            const area = areaRef.current;
            if (area.region) params.set('region', area.region);
            if (area.prefecture) params.set('pref', area.prefecture);
            if (area.city) params.set('city', area.city);
        } else {
            const station = stationRef.current;
            if (station.prefecture) params.set('station_pref', station.prefecture);
            if (station.line) params.set('line', station.line);
            if (station.station) params.set('station', station.station);
        }

        if (currentPage > 1) params.set('page', currentPage.toString());

        const newQuery = params.toString();
        const currentQuery = searchParams.toString();

        console.log('Query Construction', { newQuery, currentQuery });

        if (newQuery !== currentQuery) {
            console.log('Replacing URL');
            router.replace(`${pathname}?${newQuery}`, { scroll: false });
            sessionStorage.setItem('last_search_url', `${pathname}?${newQuery}`);
        } else {
            sessionStorage.setItem('last_search_url', `${pathname}?${newQuery}`);
        }

    }, [
        activeTab, keyword, rentMin, rentMax, walkTime, genderFilter,
        selectedAmenities, selectedEquipment, selectedPersonalEquipment, filterType,
        currentPage, pathname, router, featureParam, searchParams, triggerSearch
    ]);

    // Handlers
    const handleRegionSelect = (region: string) => {
        setAreaSelection({ region, prefecture: null, city: null });
        setCurrentPage(1);
    };

    const handlePrefectureSelect = (pref: string) => {
        setAreaSelection(prev => ({ ...prev, prefecture: pref, city: null }));
        setCurrentPage(1);
    };

    const handleCitySelect = (city: string) => {
        setAreaSelection(prev => ({ ...prev, city }));
        setCurrentPage(1);
    };

    const resetAreaSelection = () => {
        setAreaSelection({ region: null, prefecture: null, city: null });
        setCurrentPage(1);
    };

    const handleStationPrefSelect = (prefecture: string) => {
        setStationSelection({ prefecture, line: null, station: null });
        setCurrentPage(1);
    };
    const handleLineSelect = (line: string) => {
        setStationSelection(prev => ({ ...prev, line, station: null }));
        setCurrentPage(1);
    };
    const handleStationSelect = (station: string) => {
        setStationSelection(prev => ({ ...prev, station }));
        setCurrentPage(1);
    };
    const resetStationSelection = () => {
        setStationSelection({ prefecture: null, line: null, station: null });
        setCurrentPage(1);
    };

    // Scroll To Top Logic
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Pagination calculations
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    // Scroll to top when page changes via pagination (detected by props change, or manual effect)
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    // Reset page when filters change is handled by the handlers setting currentPage to 1 manually 
    // OR implicitly if dependencies change. 
    // In original code: `useEffect(() => setCurrentPage(1), [filters...])`.
    // I need to enable that here too properly to avoid staying on page 2 with no results.
    useEffect(() => {
        // This effect runs on any filter change.
        // We must be careful not to reset if ONLY page changed.
        // But currentPage is in deps of the URL syncer.
        // Here we want to reset page if OTHER filters change.
        // So exclude currentPage from deps here.
        setCurrentPage(1);
    }, [
        activeTab, keyword, rentMin, rentMax, walkTime, genderFilter,
        selectedAmenities, selectedEquipment, selectedPersonalEquipment, filterType, areaSelection, stationSelection, featureParam
    ]);

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            {/* Header Search Bar (Not Sticky) */}
            <div className="bg-[#bf0000] p-4 text-white shadow-md">
                <div className="container mx-auto max-w-lg">
                    <div className="relative">
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="駅名・エリア・キーワードを入力"
                            className="w-full pl-10 pr-4 py-3 rounded-full bg-white text-gray-800 focus:outline-none shadow-sm font-bold"
                        />
                        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-2xl" />
                    </div>
                </div>
            </div>

            {/* Mode Tabs (Not Sticky) */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 max-w-4xl grid grid-cols-2 text-center text-sm md:text-base font-bold text-gray-500">
                    <button
                        onClick={() => setActiveTab('area')}
                        className={`py-3 border-b-4 transition flex items-center justify-center gap-1 ${activeTab === 'area' ? 'border-[#bf0000] text-[#bf0000]' : 'border-transparent hover:bg-gray-50'}`}
                    >
                        <MdLocationOn /> エリアから
                    </button>
                    <button
                        onClick={() => setActiveTab('station')}
                        className={`py-3 border-b-4 transition flex items-center justify-center gap-1 ${activeTab === 'station' ? 'border-[#bf0000] text-[#bf0000]' : 'border-transparent hover:bg-gray-50'}`}
                    >
                        <MdTrain /> 沿線・駅から
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl py-6">
                <div className="flex flex-col md:flex-row gap-6">

                    {/* Sidebar Filters (Desktop) */}
                    <aside className="hidden md:block w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-24">
                            <div className="flex items-center gap-2 font-bold mb-4 text-gray-800 border-b pb-2">
                                <MdFilterList size={20} /> 絞り込み条件
                            </div>

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
                                        "光熱費込み", "仕事場利用可", "友人宿泊可", "カップル可", "家族宿泊可", "喫煙可"
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
                    </aside>

                    {/* Main Results */}
                    <main className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-xl text-gray-800">
                                {activeTab === 'area' ? 'エリアから探す' : '沿線・駅から探す'}
                            </h2>
                            <button className="md:hidden text-sm bg-gray-200 px-3 py-1 rounded font-bold flex items-center gap-1">
                                <MdFilterList /> 絞り込み
                            </button>
                            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                                <MdSort />
                                <select className="bg-transparent font-bold focus:outline-none">
                                    <option>おすすめ順</option>
                                    <option>新着順</option>
                                    <option>家賃が安い順</option>
                                </select>
                            </div>
                        </div>

                        {/* Active Feature Alert */}
                        {featureParam && (
                            <div className="bg-red-50 border border-red-100 text-[#bf0000] px-4 py-3 rounded-xl mb-6 flex items-center justify-between">
                                <span className="font-bold flex items-center gap-2">
                                    <MdCheck />
                                    {featureParam === 'pet' && 'ペット相談可の物件'}
                                    {featureParam === 'wifi' && '高速ネット（光回線）あり'}
                                    {featureParam === 'foreigner' && '外国人歓迎の物件'}
                                    {featureParam === 'female' && '女性専用・女性限定'}
                                    {featureParam === 'cheap' && '家賃3万円以下の格安物件'}
                                    {featureParam === 'diy' && 'DIY可・改装可能な物件'}
                                    {featureParam === 'gamer' && 'ゲーマー向け（高速回線・防音）'}
                                    {featureParam === 'gym' && 'ジム・スタジオ付き物件'}
                                    {featureParam === 'theater' && 'シアタールーム・プロジェクター付き'}
                                    {featureParam === 'sauna' && 'サウナ付き物件'}
                                </span>
                                <Link href="/search" className="text-sm underline hover:no-underline">解除する</Link>
                            </div>
                        )}

                        {/* Hierarchical Area Selector (Visible only when tab is 'area') */}
                        {activeTab === 'area' && (
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                                <div className="flex items-center justify-between mb-4 border-b pb-2">
                                    <h3 className="font-bold text-gray-700 flex items-center gap-2">
                                        <MdLocationOn className="text-[#bf0000]" />
                                        エリアを絞り込む
                                    </h3>
                                    {(areaSelection.region || areaSelection.prefecture) && (
                                        <button onClick={resetAreaSelection} className="text-xs text-gray-400 hover:text-[#bf0000] underline">
                                            条件をリセット
                                        </button>
                                    )}
                                </div>

                                {/* Breadcrumbs */}
                                <div className="flex items-center text-sm gap-2 mb-4 text-gray-500 overflow-x-auto whitespace-nowrap">
                                    <span className={`cursor-pointer hover:underline ${!areaSelection.region ? 'font-bold text-gray-800' : ''}`} onClick={resetAreaSelection}>全国</span>
                                    {areaSelection.region && (
                                        <>
                                            <MdKeyboardArrowRight />
                                            <span className={`cursor-pointer hover:underline ${!areaSelection.prefecture ? 'font-bold text-gray-800' : ''}`} onClick={() => setAreaSelection(prev => ({ ...prev, prefecture: null, city: null }))}>
                                                {areaSelection.region}
                                            </span>
                                        </>
                                    )}
                                    {areaSelection.prefecture && (
                                        <>
                                            <MdKeyboardArrowRight />
                                            <span className="font-bold text-[#bf0000]">{areaSelection.prefecture}</span>
                                        </>
                                    )}
                                </div>

                                {/* Selection Area */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    {!areaSelection.region ? (
                                        // Step 1: Select Region
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {Object.keys(AREA_DATA).map(region => (
                                                <button
                                                    key={region}
                                                    onClick={() => handleRegionSelect(region)}
                                                    className="bg-white py-3 px-2 rounded border border-gray-200 hover:border-[#bf0000] hover:text-[#bf0000] transition text-sm font-bold shadow-sm text-gray-800"
                                                >
                                                    {region}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        // Step 2: Select Prefecture (Final Step)
                                        <div>
                                            <button onClick={() => setAreaSelection({ region: null, prefecture: null, city: null })} className="mb-3 text-xs flex items-center gap-1 text-gray-400 hover:text-gray-600">
                                                <MdArrowBack /> 地域選択に戻る
                                            </button>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {Object.keys(AREA_DATA[areaSelection.region!] || {}).map(pref => (
                                                    <button
                                                        key={pref}
                                                        onClick={() => {
                                                            setAreaSelection(prev => ({ ...prev, prefecture: pref, city: null }));
                                                        }}
                                                        className={`py-3 px-2 rounded border transition text-sm font-bold shadow-sm flex items-center justify-center gap-2 ${areaSelection.prefecture === pref ? 'bg-[#bf0000] text-white border-[#bf0000]' : 'bg-white border-gray-200 hover:border-[#bf0000] hover:text-[#bf0000] text-gray-800'}`}
                                                    >
                                                        {pref}
                                                        {areaSelection.prefecture === pref && <MdCheck />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* Apply Button for Area */}
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => setTriggerSearch(prev => prev + 1)}
                                        className="bg-[#bf0000] text-white font-bold px-8 py-3 rounded-lg shadow-md hover:bg-[#900000] transition flex items-center gap-2"
                                    >
                                        <MdSearch className="text-xl" />
                                        この条件で検索する
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Hierarchical Station Selector (Visible only when tab is 'station') */}
                        {activeTab === 'station' && (
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                                <div className="flex items-center justify-between mb-4 border-b pb-2">
                                    <h3 className="font-bold text-gray-700 flex items-center gap-2">
                                        <MdTrain className="text-[#bf0000]" />
                                        駅を絞り込む
                                    </h3>
                                    {(stationSelection.prefecture || stationSelection.line) && (
                                        <button onClick={resetStationSelection} className="text-xs text-gray-400 hover:text-[#bf0000] underline">
                                            条件をリセット
                                        </button>
                                    )}
                                </div>

                                {/* Breadcrumbs */}
                                <div className="flex items-center text-sm gap-2 mb-4 text-gray-500 overflow-x-auto whitespace-nowrap">
                                    <span className={`cursor-pointer hover:underline ${!stationSelection.prefecture ? 'font-bold text-gray-800' : ''}`} onClick={resetStationSelection}>地域選択</span>
                                    {stationSelection.prefecture && (
                                        <>
                                            <MdKeyboardArrowRight />
                                            <span className={`cursor-pointer hover:underline ${!stationSelection.line ? 'font-bold text-gray-800' : ''}`} onClick={() => setStationSelection(prev => ({ ...prev, line: null, station: null }))}>
                                                {stationSelection.prefecture}
                                            </span>
                                        </>
                                    )}
                                    {stationSelection.line && (
                                        <>
                                            <MdKeyboardArrowRight />
                                            <span className={`cursor-pointer hover:underline ${!stationSelection.station ? 'font-bold text-gray-800' : ''}`} onClick={() => setStationSelection(prev => ({ ...prev, station: null }))}>
                                                {stationSelection.line}
                                            </span>
                                        </>
                                    )}
                                    {stationSelection.station && (
                                        <>
                                            <MdKeyboardArrowRight />
                                            <span className="font-bold text-[#bf0000]">{stationSelection.station}</span>
                                        </>
                                    )}
                                </div>

                                {/* Selection Area */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    {!stationSelection.prefecture ? (
                                        // Step 1: Select Prefecture (from TRAIN_DATA keys)
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {Object.keys(TRAIN_DATA).map(pref => (
                                                <button
                                                    key={pref}
                                                    onClick={() => handleStationPrefSelect(pref)}
                                                    className="bg-white py-3 px-2 rounded border border-gray-200 hover:border-[#bf0000] hover:text-[#bf0000] transition text-sm font-bold shadow-sm text-gray-800"
                                                >
                                                    {pref}
                                                </button>
                                            ))}
                                        </div>
                                    ) : !stationSelection.line ? (
                                        // Step 2: Select Line
                                        <div>
                                            <button onClick={() => setStationSelection({ prefecture: null, line: null, station: null })} className="mb-3 text-xs flex items-center gap-1 text-gray-400 hover:text-gray-600">
                                                <MdArrowBack /> 地域選択に戻る
                                            </button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {Object.keys(TRAIN_DATA[stationSelection.prefecture] || {}).map(line => (
                                                    <button
                                                        key={line}
                                                        onClick={() => handleLineSelect(line)}
                                                        className="bg-white py-3 px-4 rounded border border-gray-200 hover:border-[#bf0000] hover:text-[#bf0000] transition text-sm font-bold shadow-sm text-left flex items-center justify-between text-gray-800"
                                                    >
                                                        {line}
                                                        <MdKeyboardArrowRight className="text-gray-300" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        // Step 3: Select Station
                                        <div>
                                            <button onClick={() => setStationSelection(prev => ({ ...prev, line: null, station: null }))} className="mb-3 text-xs flex items-center gap-1 text-gray-400 hover:text-gray-600">
                                                <MdArrowBack /> 路線選択に戻る
                                            </button>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {(TRAIN_DATA[stationSelection.prefecture][stationSelection.line] || []).map((station: string) => (
                                                    <button
                                                        key={station}
                                                        onClick={() => handleStationSelect(station)}
                                                        className={`py-3 px-2 rounded border transition text-sm font-bold shadow-sm flex items-center justify-center gap-2 ${stationSelection.station === station ? 'bg-[#bf0000] text-white border-[#bf0000]' : 'bg-white border-gray-200 hover:border-[#bf0000] hover:text-[#bf0000] text-gray-800'}`}
                                                    >
                                                        {station}
                                                        {stationSelection.station === station && <MdCheck />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* Apply Button for Station */}
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => setTriggerSearch(prev => prev + 1)}
                                        className="bg-[#bf0000] text-white font-bold px-8 py-3 rounded-lg shadow-md hover:bg-[#900000] transition flex items-center gap-2"
                                    >
                                        <MdSearch className="text-xl" />
                                        この条件で検索する
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Results Grid - using props now */}
                        {/* Results Grid - using props now */}
                        <div className="grid grid-cols-1 gap-6">
                            {listings.length > 0 ? listings.map(p => (
                                <div key={p.id} className="h-auto">
                                    <PhotoPropertyCard
                                        horizontal={true}
                                        id={p.id}
                                        title={p.title}
                                        description={p.description}
                                        price={p.price}
                                        equipment={p.equipment || []}
                                        personalEquipment={p.personal_equipment || []}
                                        station={p.station_name ? `${p.station_name} ${p.minutes_to_station}分` : p.address}
                                        badges={[
                                            p.room_type === 'private' ? '個室' : p.room_type === 'semi' ? '半個室' : 'ドミトリー',
                                            ...(p.amenities || [])
                                        ]}
                                        imageUrl={p.images?.[0]}
                                        image={!p.images?.length ? 'bg-gray-200' : undefined}
                                        viewCount={p.view_count || 0}
                                        favoritesCount={p.favorites_count || 0}
                                        inquiryCount={p.inquiry_count || 0}
                                        prefecture={p.prefecture}
                                        city={p.city}
                                        slug={p.slug}
                                    />
                                </div>
                            )) : (
                                <div className="col-span-full py-20 text-center text-gray-500">
                                    <p className="text-xl font-bold mb-2">該当する物件が見つかりませんでした</p>
                                    <p className="text-sm">条件を変更して再度検索してください。</p>
                                </div>
                            )
                            }
                        </div>

                        {/* Real Pagination - Using totalCount passed from server */}
                        {totalPages > 1 && (
                            <div className="mt-10 flex justify-center gap-2">
                                {/* Prev Button */}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                                >
                                    &lt;
                                </button>

                                {/* Page Numbers */}
                                {Array.from({ length: totalPages }).map((_, i) => {
                                    const p = i + 1;
                                    // Simple logic to not show all 100 pages
                                    if (totalPages > 7 && Math.abs(currentPage - p) > 3 && p !== 1 && p !== totalPages) {
                                        if (p === 2 || p === totalPages - 1) return <span key={p} className="flex items-center">...</span>;
                                        return null;
                                    }

                                    return (
                                        <button
                                            key={p}
                                            onClick={() => setCurrentPage(p)}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border ${currentPage === p ? 'bg-[#bf0000] text-white border-[#bf0000]' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                                        >
                                            {p}
                                        </button>
                                    );
                                })}

                                {/* Next Button */}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                                >
                                    &gt;
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Scroll To Top Button */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-6 right-6 bg-[#bf0000] text-white p-4 rounded-full shadow-lg hover:bg-black transition-all duration-300 z-50 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
                aria-label="Scroll to top"
            >
                <MdKeyboardArrowUp className="text-2xl" />
            </button>
        </div>
    );
}
