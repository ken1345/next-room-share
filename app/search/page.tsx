"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MdSearch, MdLocationOn, MdTrain, MdMap, MdFilterList, MdCheckBox, MdCheckBoxOutlineBlank, MdSort, MdKeyboardArrowRight, MdCheck, MdArrowBack, MdSave } from 'react-icons/md';
import PhotoPropertyCard from '@/components/PhotoPropertyCard';
import { supabase } from '@/lib/supabase';

// Area Data Structure
import AREA_DATA_JSON from '@/data/generated-area-data.json';
// Train Data Structure
import TRAIN_DATA_JSON from '@/data/pref_line_station_full.json';

// Area Data Structure (Typed)

const AREA_DATA: { [key: string]: { [key: string]: string[] } } = AREA_DATA_JSON;

// Train Data Structure (Typed)
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

// Mock Data removed

function SearchContent() {
    const searchParams = useSearchParams();
    const initialMode = searchParams.get('mode') || 'area'; // area, station, map
    const featureParam = searchParams.get('feature');

    const [activeTab, setActiveTab] = useState(initialMode);
    const [filterType, setFilterType] = useState<string[]>([]);

    // Expanded Filters
    const [rentMin, setRentMin] = useState<number>(0);
    const [rentMax, setRentMax] = useState<number>(20); // Default max 20man
    const [keyword, setKeyword] = useState('');
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');

    // Data State
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    // Area Selection State
    const [areaSelection, setAreaSelection] = useState<AreaSelection>({ region: null, prefecture: null, city: null });

    // Station Selection State
    const [stationSelection, setStationSelection] = useState<StationSelection>({ prefecture: null, line: null, station: null });

    // Fetch Data
    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('listings')
                .select('*')
                .eq('is_public', true)
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching listings:", error);
            } else {
                setListings(data || []);
            }
            setLoading(false);
        };
        fetchListings();
    }, []);

    // Area Handlers
    const handleRegionSelect = (region: string) => {
        setAreaSelection({ region, prefecture: null, city: null });
    };

    const handlePrefectureSelect = (pref: string) => {
        setAreaSelection(prev => ({ ...prev, prefecture: pref, city: null }));
    };

    const handleCitySelect = (city: string) => {
        setAreaSelection(prev => ({ ...prev, city }));
    };

    const resetAreaSelection = () => {
        setAreaSelection({ region: null, prefecture: null, city: null });
    };

    // Station Handlers
    const handleStationPrefSelect = (prefecture: string) => {
        setStationSelection({ prefecture, line: null, station: null });
    };
    const handleLineSelect = (line: string) => {
        setStationSelection(prev => ({ ...prev, line, station: null }));
    };
    const handleStationSelect = (station: string) => {
        setStationSelection(prev => ({ ...prev, station }));
    };
    const resetStationSelection = () => {
        setStationSelection({ prefecture: null, line: null, station: null });
    };

    // Filtering logic (simple mock)
    // Filtering logic
    const filteredProperties = listings.filter(p => {
        // 1. Keyword Filter (Title, Description, Address)
        if (keyword) {
            const k = keyword.toLowerCase();
            const text = (p.title + p.description + p.address).toLowerCase();
            if (!text.includes(k)) return false;
        }

        // 2. Area Filter
        if (activeTab === 'area') {
            // Region/Prefecture/City
            // Note: Region is not stored in DB, but derived from Prefecture usually. 
            // We'll rely on Prefecture/City matching.
            if (areaSelection.prefecture && p.prefecture !== areaSelection.prefecture) return false;
            // City filter removed
            // if (areaSelection.city && p.city !== areaSelection.city) return false;
        }

        // 3. Station Filter
        if (activeTab === 'station') {
            if (stationSelection.prefecture && p.prefecture !== stationSelection.prefecture) return false;
            // Line filtering might be fuzzy if naming varies, but let's try exact match or includes
            if (stationSelection.line && p.station_line && !p.station_line.includes(stationSelection.line)) return false;
            if (stationSelection.station && p.station_name && !p.station_name.includes(stationSelection.station)) return false;
        }

        // 4. Room Type Filter
        if (filterType.length > 0) {
            // p.room_type should match one of the selected types
            // defined types in host page: private, semi, shared
            // UI labels: 個室, ドミトリー, 半個室, シェアハウス
            // Mapping: '個室'->'private', '半個室'->'semi', 'ドミトリー'->'shared'
            // Let's create a map or just check includes if we store Japanese. 
            // We stored code 'private', 'semi' etc.

            // Map UI label to Code
            const typeCodes = [];
            if (filterType.includes('個室')) typeCodes.push('private');
            if (filterType.includes('半個室')) typeCodes.push('semi');
            if (filterType.includes('ドミトリー')) typeCodes.push('shared');
            if (filterType.includes('シェアハウス')) typeCodes.push('shared'); // Synonym?

            if (!typeCodes.includes(p.room_type)) return false;
        }

        // 5. Rent Filter (Min/Max)
        // p.price is raw integer (yen)
        // inputs are in 'man-en' (10000 yen)
        if (p.price < rentMin * 10000) return false;
        if (p.price > rentMax * 10000) return false;

        // 6. Gender Filter
        if (genderFilter !== 'all') {
            // Logic depends on DB structure. Assuming p.gender_restriction or amenities tags
            // If p.gender_restriction is 'female', 'male', 'none'
            // If user wants 'female' -> show 'female' only or 'none' (any)?
            // Usually: 
            // - User Male -> Show 'male' allowed (none, male). Hide 'female'.
            // - User Female -> Show 'female' allowed (none, female). Hide 'male'.
            // - BUT this filter says "Gender: Male OK / Female OK".
            // If "Male OK" selected -> Show properties where men can live.

            if (genderFilter === 'male') {
                // Exclude female-only
                if (p.gender_restriction === 'female' || p.amenities?.includes('女性限定') || p.amenities?.includes('女性専用')) return false;
            }
            if (genderFilter === 'female') {
                // Exclude male-only (if exists)
                if (p.gender_restriction === 'male' || p.amenities?.includes('男性限定') || p.amenities?.includes('男性専用')) return false;
            }
        }

        // 7. Amenities Filter (AND logic: must have ALL selected)
        if (selectedAmenities.length > 0) {
            if (!p.amenities) return false;
            const hasAll = selectedAmenities.every(a => {
                // Mapping fuzzy terms if needed, or exact match
                if (a === 'Wifi無料') return p.amenities.includes('高速インターネット(光回線)') || p.amenities.includes('インターネット無料');
                if (a === 'エアコン') return p.amenities.includes('エアコン') || p.amenities.includes('冷暖房完備');
                if (a === '外国人可') return p.amenities.includes('外国人歓迎');
                return p.amenities.includes(a);
            });
            if (!hasAll) return false;
        }

        // 6. Feature Filter (New)
        if (featureParam) {
            if (featureParam === 'pet' && !p.amenities?.includes('ペット相談可')) return false;
            if (featureParam === 'wifi' && !p.amenities?.includes('高速インターネット(光回線)')) return false;
            if (featureParam === 'foreigner' && !p.amenities?.includes('外国人歓迎')) return false;
            if (featureParam === 'female') {
                if (p.gender_restriction !== 'female' && !p.amenities?.includes('女性限定')) return false;
            }
            if (featureParam === 'cheap' && p.price > 30000) return false;
            if (featureParam === 'diy' && !p.amenities?.includes('DIY可')) return false;
        }

        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            {/* Header Search Bar */}
            <div className="bg-[#bf0000] p-4 text-white sticky top-0 z-50 shadow-md">
                <div className="container mx-auto max-w-lg">
                    <div className="relative">
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="駅名・エリア・キーワードを入力"
                            className="w-full pl-10 pr-4 py-3 rounded-full text-gray-800 focus:outline-none shadow-sm font-bold"
                        />
                        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-2xl" />
                    </div>
                </div>
            </div>

            {/* Mode Tabs */}
            <div className="bg-white border-b sticky top-[72px] z-40">
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
                                        <span className="text-sm text-gray-700">男性OK</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="gender"
                                            checked={genderFilter === 'female'}
                                            onChange={() => setGenderFilter('female')}
                                            className="text-[#bf0000] focus:ring-[#bf0000]"
                                        />
                                        <span className="text-sm text-gray-700">女性OK</span>
                                    </label>
                                </div>
                            </div>

                            {/* こだわり条件 (Amenities) */}
                            <div className="mb-6">
                                <h4 className="text-sm font-bold text-gray-600 mb-2">こだわり条件</h4>
                                <div className="space-y-2">
                                    {[
                                        'Wifi無料', '家具家電付き', 'エアコン',
                                        'オートロック', 'ペット可', '駐車場あり',
                                        '駐輪場あり', '即入居可', '外国人可'
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
                                                            // Toggle or simply select
                                                            // If we want to allow re-selecting, just set it.
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
                            </div>
                        )}

                        {/* Results Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProperties.map(p => (
                                <div key={p.id} className="h-[320px]">
                                    <PhotoPropertyCard
                                        id={p.id}
                                        title={p.title}
                                        price={p.price}
                                        station={p.station_name ? `${p.station_name} ${p.minutes_to_station}分` : p.address}
                                        badges={[
                                            p.room_type === 'private' ? '個室' : p.room_type === 'semi' ? '半個室' : 'ドミトリー',
                                            ...(p.amenities || []).slice(0, 1)
                                        ]}
                                        imageUrl={p.images?.[0]}
                                        image={!p.images?.length ? 'bg-gray-200' : undefined}
                                        viewCount={p.view_count || 0}
                                        favoritesCount={p.favorites_count || 0}
                                        inquiryCount={p.inquiry_count || 0}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Pagination Placeholder */}
                        <div className="mt-10 flex justify-center gap-2">
                            <button className="w-10 h-10 rounded-full bg-[#bf0000] text-white font-bold shadow-md">1</button>
                            <button className="w-10 h-10 rounded-full bg-white text-gray-600 font-bold hover:bg-gray-100 border border-gray-200">2</button>
                            <button className="w-10 h-10 rounded-full bg-white text-gray-600 font-bold hover:bg-gray-100 border border-gray-200">3</button>
                        </div>
                    </main>

                </div>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <SearchContent />
        </Suspense>
    );
}
