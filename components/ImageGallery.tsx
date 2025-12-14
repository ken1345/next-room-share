"use client";
import React, { useState, useRef, useEffect } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import ImageViewer from './ImageViewer';

interface ImageGalleryProps {
    images: string[];
    title?: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [viewerIndex, setViewerIndex] = useState(0);
    const rightGridRef = useRef<HTMLDivElement>(null);
    const [showScrollIndicator, setShowScrollIndicator] = useState(false);

    const openViewer = (index: number) => {
        setViewerIndex(index);
        setIsViewerOpen(true);
    };

    // Check if scroll is possible/needed
    const checkScroll = () => {
        if (rightGridRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = rightGridRef.current;
            // Show indicator if there is content below the fold
            setShowScrollIndicator(scrollTop + clientHeight < scrollHeight - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [images]);

    // If no images
    if (!images || images.length === 0) {
        return (
            <div className="w-full h-[300px] bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 font-bold">
                No Images
            </div>
        );
    }

    const mainImage = images[0];
    const secondaryImages = images.slice(1); // All remaining images

    return (
        <>
            <ImageViewer
                images={images}
                initialIndex={viewerIndex}
                isOpen={isViewerOpen}
                onClose={() => setIsViewerOpen(false)}
            />

            {/* --- Mobile View (Carousel) --- */}
            <div className="md:hidden relative group">
                <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar aspect-[4/3] w-full">
                    {images.map((img, i) => (
                        <div
                            key={i}
                            onClick={() => openViewer(i)}
                            className="flex-shrink-0 w-full h-full snap-center bg-cover bg-center cursor-pointer"
                            style={{ backgroundImage: `url('${img}')` }}
                        ></div>
                    ))}
                </div>
                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm pointer-events-none">
                    1 / {images.length}
                </div>
            </div>

            {/* --- Desktop View (Split Scrollable) --- */}
            <div className="hidden md:flex gap-2 h-[450px] rounded-2xl overflow-hidden shadow-sm">
                {/* Left: Main Image (50%) - Enhanced height */}
                <div
                    onClick={() => openViewer(0)}
                    className="w-1/2 h-full bg-cover bg-center cursor-pointer group relative hover:opacity-95 transition"
                    style={{ backgroundImage: `url('${mainImage}')` }}
                >
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition"></div>
                </div>

                {/* Right: Scrollable Grid (50%) */}
                <div className="w-1/2 h-full relative">
                    <div
                        ref={rightGridRef}
                        onScroll={checkScroll}
                        className="w-full h-full overflow-y-auto grid grid-cols-2 gap-2 pr-1 no-scrollbar pb-2"
                        // Hide scrollbar but keep functionality
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {secondaryImages.map((img, i) => (
                            <div
                                key={i + 1}
                                onClick={() => openViewer(i + 1)}
                                className="h-48 w-full bg-cover bg-center cursor-pointer relative group hover:opacity-95 transition"
                                style={{ backgroundImage: `url('${img}')` }}
                            >
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition"></div>
                            </div>
                        ))}

                        {/* Fill empty slots if very few images to maintain layout structure */}
                        {secondaryImages.length < 4 && [...Array(4 - secondaryImages.length)].map((_, i) => (
                            <div key={`empty-${i}`} className="bg-gray-50 h-48 w-full"></div>
                        ))}
                    </div>

                    {/* Scroll Indicator (Down Arrow) */}
                    {showScrollIndicator && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-none z-10 animate-bounce">
                            <div className="bg-white/90 backdrop-blur text-gray-800 p-2 rounded-full shadow-lg border border-gray-100">
                                <MdKeyboardArrowDown size={24} />
                            </div>
                        </div>
                    )}

                    {/* Shadow gradient at bottom to indicate scroll */}
                    {showScrollIndicator && (
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </>
    );
}
