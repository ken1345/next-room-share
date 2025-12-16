import React from 'react';

export default function SectionTitle({ title, subtitle }: { title: string, subtitle: string }) {
    return (
        <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#bf0000] rounded inline-block"></span>
                {title}
            </h2>
            <p className="text-sm text-gray-500 ml-3 mt-1">{subtitle}</p>
        </div>
    );
}
