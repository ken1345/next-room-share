"use client";
import React, { useEffect } from 'react';
import { MdArrowBack, MdClose } from 'react-icons/md';

interface FullPageGalleryProps {
    images: string[];
    onClose: () => void;
    onImageClick: (index: number) => void;
}

export default function FullPageGallery({ images, onClose, onImageClick }: FullPageGalleryProps) {
    // Prevent background scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <header className="flex-shrink-0 h-16 border-b flex items-center px-4 bg-white sticky top-0 z-10">
                <button
                    onClick={onClose}
                    className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition"
                    aria-label="Close gallery"
                >
                    <MdArrowBack size={24} className="text-gray-700" />
                </button>
                <div className="ml-4 font-bold text-gray-800">写真一覧 ({images.length}枚)</div>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto bg-white">
                <div className="max-w-3xl mx-auto py-8 px-4 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {images.map((img, index) => (
                            <div
                                key={index}
                                onClick={() => onImageClick(index)}
                                className={`cursor-pointer group relative overflow-hidden rounded-lg bg-gray-100 ${
                                    // Make every 3rd item span 2 columns for variation (optional, mimics Airbnb somewhat)
                                    // index % 3 === 0 ? 'md:col-span-2 aspect-video' : 'aspect-[4/3]'
                                    'aspect-[4/3] md:aspect-[3/2]'
                                    }`}
                            >
                                <img
                                    src={img}
                                    alt={`Gallery image ${index + 1}`}
                                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
