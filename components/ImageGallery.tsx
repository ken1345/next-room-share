import React, { useState } from 'react';
import { MdKeyboardArrowDown, MdApps } from 'react-icons/md';
import ImageViewer from './ImageViewer';
import FullPageGallery from './FullPageGallery';

interface ImageGalleryProps {
    images: string[];
    title?: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [viewerIndex, setViewerIndex] = useState(0);
    const [isFullPageOpen, setIsFullPageOpen] = useState(false);

    // If no images
    if (!images || images.length === 0) {
        return (
            <div className="w-full h-[300px] bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 font-bold overflow-hidden">
                <img src="/nophoto-text.webp" alt="No Image" className="w-full h-full object-cover opacity-80" />
            </div>
        );
    }

    const mainImage = images[0];
    // Show max 4 sub-images for the grid
    const subImages = images.slice(1, 5);
    const remainingCount = images.length > 5 ? images.length - 5 : 0;

    const openViewer = (index: number) => {
        setViewerIndex(index);
        setIsViewerOpen(true);
    };

    const openFullPage = () => {
        setIsFullPageOpen(true);
    };

    return (
        <>
            <ImageViewer
                images={images}
                initialIndex={viewerIndex}
                isOpen={isViewerOpen}
                onClose={() => setIsViewerOpen(false)}
            />

            {isFullPageOpen && (
                <FullPageGallery
                    images={images}
                    onClose={() => setIsFullPageOpen(false)}
                    onImageClick={(index) => {
                        setIsFullPageOpen(false); // Close full page
                        openViewer(index); // Open slider
                    }}
                />
            )}

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

            {/* --- Desktop View (Mosaic Grid) --- */}
            <div className="hidden md:flex gap-2 h-[400px] rounded-2xl overflow-hidden relative group">
                {/* Left: Main Image (50%) */}
                <div
                    onClick={() => openViewer(0)}
                    className="w-1/2 h-full bg-cover bg-center cursor-pointer relative hover:opacity-95 transition"
                    style={{ backgroundImage: `url('${mainImage}')` }}
                >
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition"></div>
                </div>

                {/* Right: Grid (50%) */}
                <div className="w-1/2 h-full grid grid-cols-2 gap-2">
                    {subImages.map((img, i) => (
                        <div
                            key={i + 1}
                            onClick={() => openViewer(i + 1)}
                            className="h-full w-full bg-cover bg-center cursor-pointer relative hover:opacity-95 transition"
                            style={{ backgroundImage: `url('${img}')` }}
                        >
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition"></div>
                        </div>
                    ))}

                    {/* Fill empty slots if needed to keep layout clean (optional, but good for structure) */}
                    {subImages.length < 4 && [...Array(4 - subImages.length)].map((_, i) => (
                        <div key={`empty-${i}`} className="bg-gray-50 h-full w-full"></div>
                    ))}
                </div>

                {/* 'Show all photos' Button */}
                <button
                    onClick={openFullPage}
                    className="absolute bottom-6 right-6 bg-white text-gray-800 font-bold px-4 py-2 rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition flex items-center gap-2 text-sm z-10"
                >
                    <MdApps /> すべての写真を表示
                </button>
            </div>
        </>
    );
}
