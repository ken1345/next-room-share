"use client";
import { useEffect, useState, useCallback } from "react";
import { MdClose, MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

interface ImageViewerProps {
    images: string[];
    initialIndex: number;
    isOpen: boolean;
    onClose: () => void;
}

export default function ImageViewer({ images, initialIndex, isOpen, onClose }: ImageViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    // Update internal state when initialIndex changes or modal opens
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
        }
    }, [isOpen, initialIndex]);

    // Handle Keyboard Navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isOpen) return;
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    }, [isOpen, onClose]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const showPrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const showNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm transition-opacity duration-300">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/50 rounded-full transition"
            >
                <MdClose size={32} />
            </button>

            {/* Counter */}
            <div className="absolute top-6 left-6 text-white/80 font-bold text-sm tracking-widest z-50">
                {currentIndex + 1} / {images.length}
            </div>

            {/* Main Image Container */}
            <div className="relative w-full h-full flex items-center justify-center px-4 py-12 md:px-16 md:py-8">
                {/* Navigation Buttons */}
                <button
                    onClick={(e) => { e.stopPropagation(); showPrev(); }}
                    className="absolute left-4 md:left-8 p-3 text-white/70 hover:text-white bg-black/20 hover:bg-black/50 rounded-full transition z-50"
                >
                    <MdKeyboardArrowLeft size={40} />
                </button>

                <img
                    src={images[currentIndex]}
                    alt={`Image ${currentIndex + 1}`}
                    className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
                />

                <button
                    onClick={(e) => { e.stopPropagation(); showNext(); }}
                    className="absolute right-4 md:right-8 p-3 text-white/70 hover:text-white bg-black/20 hover:bg-black/50 rounded-full transition z-50"
                >
                    <MdKeyboardArrowRight size={40} />
                </button>
            </div>

            {/* Thumbnail Strip (Bottom) - Optional but nice */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 overflow-x-auto px-4 py-2 no-scrollbar">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0 rounded overflow-hidden border-2 transition ${idx === currentIndex ? 'border-[#bf0000] opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
                            }`}
                    >
                        <img src={img} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
