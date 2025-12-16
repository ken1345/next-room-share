"use client";
import { useState, useEffect, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MdSearch, MdLocationOn, MdTrain, MdMap, MdFilterList, MdCheckBox, MdCheckBoxOutlineBlank, MdSort, MdKeyboardArrowRight, MdCheck, MdArrowBack, MdSave } from 'react-icons/md';
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

interface SearchClientProps {
    initialListings: any[];
    initialCount: number;
}

export default function SearchClient({ initialListings, initialCount }: SearchClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Initialize State from URL Params
    const initialMode = searchParams.get('mode') || searchParams.get('tab') || 'area';
    const featureParam = searchParams.get('feature');

    const [activeTab, setActiveTab] = useState(initialMode);

    // Expanded Filters
    const [rentMin, setRentMin] = useState<number>(Number(searchParams.get('min_rent')) || 0);
    const [rentMax, setRentMax] = useState<number>(searchParams.get('max_rent') ? Number(searchParams.get('max_rent')) : 20);
    const [keyword, setKeyword] = useState(searchParams.get('q') || '');
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>(searchParams.get('amenities')?.split(',').filter(Boolean) || []);
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

    // Pagination State
    const ITEMS_PER_PAGE = 20;
    const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get('page')) || 1);

    // Sync State to URL
    useEffect(() => {
        const params = new URLSearchParams();

        if (activeTab !== 'area') params.set('tab', activeTab);
        params.set('tab', activeTab);

        if (featureParam) params.set('feature', featureParam);

        if (keyword) params.set('q', keyword);
        if (rentMin > 0) params.set('min_rent', rentMin.toString());
        if (rentMax < 50) params.set('max_rent', rentMax.toString());
        if (walkTime) params.set('walk', walkTime.toString());
        if (genderFilter !== 'all') params.set('gender', genderFilter);
        if (selectedAmenities.length > 0) params.set('amenities', selectedAmenities.join(','));
        if (filterType.length > 0) params.set('types', filterType.join(','));

        if (activeTab === 'area') {
            if (areaSelection.region) params.set('region', areaSelection.region);
            if (areaSelection.prefecture) params.set('pref', areaSelection.prefecture);
            if (areaSelection.city) params.set('city', areaSelection.city);
        } else {
            if (stationSelection.prefecture) params.set('station_pref', stationSelection.prefecture);
            if (stationSelection.line) params.set('line', stationSelection.line);
            if (stationSelection.station) params.set('station', stationSelection.station);
        }

        if (currentPage > 1) params.set('page', currentPage.toString());

        const newQuery = params.toString();
        const currentQuery = searchParams.toString();

        if (newQuery !== currentQuery) {
            router.replace(`${pathname}?${newQuery}`, { scroll: false });
            sessionStorage.setItem('last_search_url', `${pathname}?${newQuery}`);
        } else {
            sessionStorage.setItem('last_search_url', `${pathname}?${newQuery}`);
        }

    }, [
        activeTab, keyword, rentMin, rentMax, walkTime, genderFilter,
        selectedAmenities, filterType, areaSelection, stationSelection,
        currentPage, pathname, router, featureParam, searchParams
    ]);

    // Handlers
    const toggleAmenity = (amenity: string) => {
        setSelectedAmenities(prev =>
            prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
        );
        setCurrentPage(1);
    };

    const toggleType = (type: string) => {
        setFilterType(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
        setCurrentPage(1);
    };

    // Region Mapping Constants (Duplicated from old file or imported if possible)
    const REGION_MAPPING: { [key: string]: string[] } = {
        "関東": ["東京都", "神奈川県", "千葉県", "埼玉県", "茨城県", "栃木県", "群馬県"],
        "関西": ["大阪府", "京都府", "兵庫県", "奈良県", "滋賀県", "和歌山県"],
        // Add more if needed, simpler version for now
    };
    const REGIONS = Object.keys(REGION_MAPPING);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Sticky Header Tabs - REMOVED per previous task, using static or normal layout?
                User said "Remove sticky header/tabs" and passed.
                The previous file still had them but maybe not sticky?
                I'll keep the layout structure but ensure it's not sticky if user requested.
              */}
            <div className="bg-white border-b shadow-sm">
                <div className="container mx-auto px-4">
                    {/* Search Mode Tabs */}
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('area')}
                            className={`flex-1 py-4 text-center font-bold text-sm md:text-base transition relative ${activeTab === 'area' ? 'text-[#bf0000]' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            <span className="flex items-center justify-center gap-2"><MdLocationOn /> エリアから探す</span>
                            {activeTab === 'area' && <span className="absolute bottom-0 left-0 w-full h-1 bg-[#bf0000]"></span>}
                        </button>
                        <button
                            onClick={() => setActiveTab('station')}
                            className={`flex-1 py-4 text-center font-bold text-sm md:text-base transition relative ${activeTab === 'station' ? 'text-[#bf0000]' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            <span className="flex items-center justify-center gap-2"><MdTrain /> 沿線・駅から探す</span>
                            {activeTab === 'station' && <span className="absolute bottom-0 left-0 w-full h-1 bg-[#bf0000]"></span>}
                        </button>
                    </div>

                    {/* Filter UI - Area/Station Selectors */}
                    <div className="py-4 bg-gray-50/50">
                        {activeTab === 'area' ? (
                            <div className="flex flex-wrap gap-2 items-center">
                                <select
                                    className="p-2 border rounded"
                                    value={areaSelection.region || ''}
                                    onChange={(e) => setAreaSelection({ region: e.target.value, prefecture: null, city: null })}
                                >
                                    <option value="">地域を選択</option>
                                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                                {areaSelection.region && (
                                    <select
                                        className="p-2 border rounded"
                                        value={areaSelection.prefecture || ''}
                                        onChange={(e) => setAreaSelection(prev => ({ ...prev, prefecture: e.target.value, city: null }))}
                                    >
                                        <option value="">都道府県</option>
                                        {REGION_MAPPING[areaSelection.region]?.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                )}
                                {areaSelection.prefecture && (
                                    <select
                                        className="p-2 border rounded"
                                        value={areaSelection.city || ''}
                                        onChange={(e) => setAreaSelection(prev => ({ ...prev, city: e.target.value }))}
                                    >
                                        <option value="">市区町村</option>
                                        {AREA_DATA[areaSelection.prefecture] && Object.keys(AREA_DATA[areaSelection.prefecture]).map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2 items-center">
                                {/* Station Selector Logic */}
                                <select
                                    className="p-2 border rounded"
                                    value={stationSelection.prefecture || ''}
                                    onChange={(e) => setStationSelection({ prefecture: e.target.value, line: null, station: null })}
                                >
                                    <option value="">都道府県</option>
                                    {Object.keys(TRAIN_DATA).map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                                {stationSelection.prefecture && (
                                    <select
                                        className="p-2 border rounded"
                                        value={stationSelection.line || ''}
                                        onChange={(e) => setStationSelection(prev => ({ ...prev, line: e.target.value, station: null }))}
                                    >
                                        <option value="">路線</option>
                                        {Object.keys(TRAIN_DATA[stationSelection.prefecture]).map(line => (
                                            <option key={line} value={line}>{line}</option>
                                        ))}
                                    </select>
                                )}
                                {stationSelection.line && stationSelection.prefecture && (
                                    <select
                                        className="p-2 border rounded"
                                        value={stationSelection.station || ''}
                                        onChange={(e) => setStationSelection(prev => ({ ...prev, station: e.target.value }))}
                                    >
                                        <option value="">駅</option>
                                        {TRAIN_DATA[stationSelection.prefecture][stationSelection.line].map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
                {/* Desktop Sidebar Filters */}
                <aside className="hidden md:block w-64 flex-shrink-0 space-y-8">
                    {/* Keyword */}
                    <div>
                        <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><MdSearch /> キーワード</h3>
                        <input
                            type="text"
                            placeholder="駅名・地名・特徴など"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bf0000] focus:outline-none"
                        />
                    </div>

                    {/* Rent Range */}
                    <div>
                        <h3 className="font-bold text-gray-700 mb-3">家賃</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <select className="border p-1 rounded" value={rentMin} onChange={e => setRentMin(Number(e.target.value))}>
                                <option value="0">下限なし</option>
                                <option value="3">3万円</option>
                                <option value="5">5万円</option>
                            </select>
                            <span>〜</span>
                            <select className="border p-1 rounded" value={rentMax} onChange={e => setRentMax(Number(e.target.value))}>
                                <option value="5">5万円</option>
                                <option value="7">7万円</option>
                                <option value="10">10万円</option>
                                <option value="50">上限なし</option>
                            </select>
                        </div>
                    </div>

                    {/* Walk Time */}
                    <div>
                        <h3 className="font-bold text-gray-700 mb-3">駅徒歩</h3>
                        <div className="space-y-2">
                            {[5, 10, 15].map(m => (
                                <label key={m} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="walk"
                                        checked={walkTime === m}
                                        onChange={() => setWalkTime(m)}
                                        className="accent-[#bf0000]"
                                    />
                                    <span className="text-sm">{m}分以内</span>
                                </label>
                            ))}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="walk"
                                    checked={walkTime === null}
                                    onChange={() => setWalkTime(null)}
                                    className="accent-[#bf0000]"
                                />
                                <span className="text-sm">指定なし</span>
                            </label>
                        </div>
                    </div>

                    {/* Gender */}
                    <div>
                        <h3 className="font-bold text-gray-700 mb-3">性別</h3>
                        <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="gender" value="all" checked={genderFilter === 'all'} onChange={() => setGenderFilter('all')} className="accent-[#bf0000]" />
                                <span className="text-sm">指定なし</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="gender" value="male" checked={genderFilter === 'male'} onChange={() => setGenderFilter('male')} className="accent-[#bf0000]" />
                                <span className="text-sm">男性限定</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="gender" value="female" checked={genderFilter === 'female'} onChange={() => setGenderFilter('female')} className="accent-[#bf0000]" />
                                <span className="text-sm">女性限定</span>
                            </label>
                        </div>
                    </div>

                    {/* Types */}
                    <div>
                        <h3 className="font-bold text-gray-700 mb-3">タイプ</h3>
                        <div className="space-y-2">
                            {['個室', 'ドミトリー', 'シェアハウス'].map(t => (
                                <label key={t} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filterType.includes(t)}
                                        onChange={() => toggleType(t)}
                                        className="accent-[#bf0000]"
                                    />
                                    <span className="text-sm">{t}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Amenities */}
                    <div>
                        <h3 className="font-bold text-gray-700 mb-3">こだわり条件</h3>
                        <div className="space-y-2">
                            {['Wifi', '家具付き', 'オートロック', '駐輪場', 'ペット可'].map(a => (
                                <label key={a} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedAmenities.includes(a)}
                                        onChange={() => toggleAmenity(a)}
                                        className="accent-[#bf0000]"
                                    />
                                    <span className="text-sm">{a}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Results */}
                <main className="flex-1">
                    <div className="mb-4 flex items-center justify-between">
                        <h1 className="text-xl font-bold">
                            {activeTab === 'area' ? (areaSelection.city || areaSelection.prefecture || '全エリア') : (stationSelection.station || '全エリア')}
                            の検索結果
                            <span className="text-sm font-normal text-gray-500 ml-2">({initialCount}件)</span>
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {initialListings.map((listing: any) => (
                            <PhotoPropertyCard
                                key={listing.id}
                                id={listing.id}
                                imageUrl={listing.images?.[0] || null} // Handle first image
                                price={listing.price}
                                station={listing.station_name || '駅指定なし'}
                                badges={[listing.room_type, ...(listing.amenities || [])].slice(0, 3)}
                                title={listing.title}
                                viewCount={listing.view_count || 0}
                            />
                        ))}
                        {initialListings.length === 0 && (
                            <div className="col-span-full py-20 text-center text-gray-400">
                                条件に一致する物件は見つかりませんでした。
                            </div>
                        )}
                    </div>

                    {/* Pagination - Simplified */}
                    {initialCount > ITEMS_PER_PAGE && (
                        <div className="mt-12 flex justify-center gap-2">
                            {Array.from({ length: Math.ceil(initialCount / ITEMS_PER_PAGE) }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${currentPage === i + 1 ? 'bg-[#bf0000] text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
