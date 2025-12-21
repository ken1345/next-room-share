"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AREA_DATA } from '@/lib/constants';
import { MdLocationOn } from 'react-icons/md';

export default function SearchAreaFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialArea = searchParams.get('area') || '';

    // Initialize state
    const [region, setRegion] = useState<string>("");
    const [prefecture, setPrefecture] = useState<string>("");
    const [city, setCity] = useState<string>(initialArea);

    // Initial detection
    useState(() => {
        if (initialArea) {
            for (const [r, prefs] of Object.entries(AREA_DATA)) {
                for (const [p, cities] of Object.entries(prefs)) {
                    if (cities.includes(initialArea)) {
                        setRegion(r);
                        setPrefecture(p);
                        return;
                    }
                }
            }
        }
    });

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (city) {
            params.set('area', city);
        } else {
            params.delete('area');
        }
        // Preserve other params if needed, or simple replace
        // For this app, generic search usually resets page?
        // Let's just push current path with new query
        const pathname = window.location.pathname;
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="w-full flex flex-col md:flex-row gap-2 items-center bg-gray-50 p-2 rounded-lg border border-gray-200">
            <div className="flex-1 w-full grid grid-cols-3 gap-2">
                <select
                    className="w-full p-2 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:border-[#bf0000]"
                    value={region}
                    onChange={(e) => {
                        setRegion(e.target.value);
                        setPrefecture("");
                        setCity("");
                    }}
                >
                    <option value="">地域</option>
                    {Object.keys(AREA_DATA).map((r) => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>

                <select
                    className="w-full p-2 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:border-[#bf0000]"
                    value={prefecture}
                    onChange={(e) => {
                        setPrefecture(e.target.value);
                        setCity("");
                    }}
                    disabled={!region}
                >
                    <option value="">都道府県</option>
                    {region && AREA_DATA[region] && Object.keys(AREA_DATA[region]).map((p) => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>

                <select
                    className="w-full p-2 bg-white border border-gray-200 rounded text-sm font-bold focus:outline-none focus:border-[#bf0000]"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={!prefecture}
                >
                    <option value="">市区町村</option>
                    {region && prefecture && AREA_DATA[region]?.[prefecture]?.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            <button
                onClick={handleSearch}
                className="w-full md:w-auto bg-gray-800 text-white font-bold px-4 py-2 rounded hover:bg-black transition text-sm flex items-center justify-center gap-1"
            >
                <MdLocationOn /> 検索
            </button>
        </div>
    );
}
