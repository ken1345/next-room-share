"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MdSearch, MdLocationOn, MdTrain, MdMap, MdFilterList, MdCheckBox, MdCheckBoxOutlineBlank, MdSort, MdKeyboardArrowRight, MdCheck, MdArrowBack, MdSave } from 'react-icons/md';
import PhotoPropertyCard from '@/components/PhotoPropertyCard';
import { supabase } from '@/lib/supabase';

// Area Data Structure
import AREA_DATA_JSON from '@/data/generated-area-data.json';

// Area Data Structure (Typed)

const AREA_DATA: { [key: string]: { [key: string]: string[] } } = AREA_DATA_JSON;

// Train Data Structure (Mock)
const TRAIN_DATA: { [key: string]: { [key: string]: string[] } } = {
    "東京都": {
        "JR山手線": ["新宿駅", "渋谷駅", "池袋駅", "恵比寿駅", "高田馬場駅"],
        "JR中央線": ["東京駅", "新宿駅", "中野駅", "高円寺駅", "吉祥寺駅"],
        "京王井の頭線": ["渋谷駅", "下北沢駅", "明大前駅", "吉祥寺駅"],
        "東急田園都市線": ["渋谷駅", "三軒茶屋駅", "駒沢大学駅", "二子玉川駅"],
    },
    "神奈川県": {
        "東急東横線": ["横浜駅", "武蔵小杉駅", "日吉駅"],
        "JR京浜東北線": ["川崎駅", "横浜駅", "桜木町駅"],
    },
    "大阪府": {
        "JR大阪環状線": ["大阪駅", "天王寺駅", "京橋駅"],
        "御堂筋線": ["梅田駅", "なんば駅", "天王寺駅"],
    },
    "福岡県": {
        "地下鉄空港線": ["博多駅", "天神駅", "姪浜駅"],
        "西鉄天神大牟田線": ["西鉄福岡(天神)駅", "薬院駅"],
    }
};

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

    const [activeTab, setActiveTab] = useState(initialMode);
    const [filterType, setFilterType] = useState<string[]>([]);
    const [rentRange, setRentRange] = useState<number>(15);
    const [keyword, setKeyword] = useState('');

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
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching listings:", error);
            } else {
                setListings(data || []);
            }
            setLoading(false);
        };

        const checkUserAndLoadPrefs = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
                // Load preferences
                const { data, error } = await supabase
                    .from('users')
                    .select('search_preferences')
                    .eq('id', session.user.id)
                    .single();

                if (data?.search_preferences) {
                    const prefs = data.search_preferences as any;
                    // Only load valid prefs
                    if (prefs.activeTab) setActiveTab(prefs.activeTab);
                    if (prefs.areaSelection) setAreaSelection(prefs.areaSelection);
                    if (prefs.stationSelection) setStationSelection(prefs.stationSelection);
                    if (prefs.rentRange) setRentRange(prefs.rentRange);
                    if (prefs.keyword) setKeyword(prefs.keyword);
                    if (prefs.filterType) setFilterType(prefs.filterType);
                }
            }
        };

        fetchListings();
        checkUserAndLoadPrefs();
    }, []);

    const saveConditions = async () => {
        if (!user) {
            alert("検索条件を保存するにはログインが必要です。");
            return;
        }

        const preferences = {
            activeTab,
            areaSelection,
            stationSelection,
            rentRange,
            keyword,
            filterType
        };

        const { error } = await supabase
            .from('users')
            .update({ search_preferences: preferences })
            .eq('id', user.id);

        if (error) {
            console.error("Error saving preferences:", error);
            alert("保存に失敗しました。");
        } else {
            alert("検索条件を保存しました！次回訪問時に自動的に適用されます。");
        }
    };

    // Area Handlers
    // Area Handlers
    const handleRegionSelect = (region: string) => {
        setAreaSelection({ region, prefecture: null, city: null });
    };

    const handlePrefectureSelect = (pref: string) => {
        setAreaSelection(prev => ({ ...prev, prefecture: pref, city: null }));
    };

    const handleCitySelect = (city: string) => {
        setAreaSelection(prev => ({ ...prev, city }));
        // Here you would typically trigger a search or update URL
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
            if (areaSelection.city && p.city !== areaSelection.city) return false;
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

        // 5. Rent Filter
        // rentRange is Max Price in Man-en (e.g. 15 -> 150000)
        // p.price is raw integer
        if (p.price > rentRange * 10000) return false;

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

                            {/* 家賃 */}
                            {/* 家賃 */}
                            <div className="mb-6">
                                <h4 className="text-sm font-bold text-gray-600 mb-2">家賃上限: {rentRange}万円</h4>
                                <input
                                    type="range"
                                    min="3" max="20" step="1"
                                    value={rentRange}
                                    onChange={(e) => setRentRange(Number(e.target.value))}
                                    className="w-full accent-[#bf0000]"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>3万</span>
                                    <span>20万</span>
                                </div>
                            </div>

                            <button
                                onClick={saveConditions}
                                className="w-full bg-gray-800 text-white font-bold py-2 rounded-lg hover:bg-black transition flex items-center justify-center gap-2"
                            >
                                <MdSave /> 条件を保存して検索
                            </button>
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
                                            <span className={`cursor-pointer hover:underline ${!areaSelection.city ? 'font-bold text-gray-800' : ''}`} onClick={() => setAreaSelection(prev => ({ ...prev, city: null }))}>
                                                {areaSelection.prefecture}
                                            </span>
                                        </>
                                    )}
                                    {areaSelection.city && (
                                        <>
                                            <MdKeyboardArrowRight />
                                            <span className="font-bold text-[#bf0000]">{areaSelection.city}</span>
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
                                                    className="bg-white py-3 px-2 rounded border border-gray-200 hover:border-[#bf0000] hover:text-[#bf0000] transition text-sm font-bold shadow-sm"
                                                >
                                                    {region}
                                                </button>
                                            ))}
                                        </div>
                                    ) : !areaSelection.prefecture ? (
                                        // Step 2: Select Prefecture
                                        <div>
                                            <button onClick={() => setAreaSelection({ region: null, prefecture: null, city: null })} className="mb-3 text-xs flex items-center gap-1 text-gray-400 hover:text-gray-600">
                                                <MdArrowBack /> 地域選択に戻る
                                            </button>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {Object.keys(AREA_DATA[areaSelection.region!] || {}).map(pref => (
                                                    <button
                                                        key={pref}
                                                        onClick={() => handlePrefectureSelect(pref)}
                                                        className="bg-white py-3 px-2 rounded border border-gray-200 hover:border-[#bf0000] hover:text-[#bf0000] transition text-sm font-bold shadow-sm"
                                                    >
                                                        {pref}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        // Step 3: Select City
                                        <div>
                                            <button onClick={() => setAreaSelection(prev => ({ ...prev, prefecture: null, city: null }))} className="mb-3 text-xs flex items-center gap-1 text-gray-400 hover:text-gray-600">
                                                <MdArrowBack /> 都道府県選択に戻る
                                            </button>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {(AREA_DATA[areaSelection.region!][areaSelection.prefecture!] || []).map((city: string) => (
                                                    <button
                                                        key={city}
                                                        onClick={() => handleCitySelect(city)}
                                                        className={`py-3 px-2 rounded border transition text-sm font-bold shadow-sm flex items-center justify-center gap-2 ${areaSelection.city === city ? 'bg-[#bf0000] text-white border-[#bf0000]' : 'bg-white border-gray-200 hover:border-[#bf0000] hover:text-[#bf0000]'}`}
                                                    >
                                                        {city}
                                                        {areaSelection.city === city && <MdCheck />}
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
                                                    className="bg-white py-3 px-2 rounded border border-gray-200 hover:border-[#bf0000] hover:text-[#bf0000] transition text-sm font-bold shadow-sm"
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
                                                        className="bg-white py-3 px-4 rounded border border-gray-200 hover:border-[#bf0000] hover:text-[#bf0000] transition text-sm font-bold shadow-sm text-left flex items-center justify-between"
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
                                                        className={`py-3 px-2 rounded border transition text-sm font-bold shadow-sm flex items-center justify-center gap-2 ${stationSelection.station === station ? 'bg-[#bf0000] text-white border-[#bf0000]' : 'bg-white border-gray-200 hover:border-[#bf0000] hover:text-[#bf0000]'}`}
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
