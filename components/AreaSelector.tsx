"use client";

import { useState, useEffect } from 'react';
import { AREA_DATA } from '@/lib/constants';

interface AreaSelectorProps {
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
}

export default function AreaSelector({ value, onChange, required = false }: AreaSelectorProps) {
    const [region, setRegion] = useState<string>("");
    const [prefecture, setPrefecture] = useState<string>("");

    // Auto-detect region and prefecture from initial string value
    useEffect(() => {
        if (value && !region && !prefecture) {
            for (const [r, prefs] of Object.entries(AREA_DATA)) {
                for (const [p, cities] of Object.entries(prefs)) {
                    if (cities.includes(value)) {
                        setRegion(r);
                        setPrefecture(p);
                        return;
                    }
                }
            }
        }
    }, [value]);

    const handleRegionChange = (newRegion: string) => {
        setRegion(newRegion);
        setPrefecture("");
        onChange(""); // Reset city
    };

    const handlePrefectureChange = (newPref: string) => {
        setPrefecture(newPref);
        onChange(""); // Reset city
    };

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Region Select */}
                <select
                    className="w-full border rounded-lg p-3 text-gray-800 focus:outline-none focus:border-[#bf0000] bg-gray-50"
                    value={region}
                    onChange={(e) => handleRegionChange(e.target.value)}
                >
                    <option value="">地域を選択</option>
                    {Object.keys(AREA_DATA).map((r) => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>

                {/* Prefecture Select */}
                <select
                    className="w-full border rounded-lg p-3 text-gray-800 focus:outline-none focus:border-[#bf0000] bg-gray-50 bg-gray-50"
                    value={prefecture}
                    onChange={(e) => handlePrefectureChange(e.target.value)}
                    disabled={!region}
                >
                    <option value="">都道府県を選択</option>
                    {region && AREA_DATA[region] && Object.keys(AREA_DATA[region]).map((p) => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
            </div>

            {/* City Select */}
            <select
                className="w-full border rounded-lg p-3 text-gray-800 focus:outline-none focus:border-[#bf0000] font-bold"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={!prefecture}
                required={required}
            >
                <option value="">市区町村を選択 (必須)</option>
                {region && prefecture && AREA_DATA[region]?.[prefecture]?.map((c) => (
                    <option key={c} value={c}>{c}</option>
                ))}
            </select>
        </div>
    );
}
