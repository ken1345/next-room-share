"use client";
import React from 'react';

// Honeypot component to catch bots who fill out invisible fields
// Accessibility: Hidden from screen readers via aria-hidden if irrelevant, 
// or labeled "Do not fill" for screen readers that might access it.
// Best practice: tabIndex -1 to skip in navigation.

interface HoneypotProps {
    onChange: (value: string) => void;
}

export default function Honeypot({ onChange }: HoneypotProps) {
    return (
        <div
            style={{
                opacity: 0,
                position: 'absolute',
                top: 0,
                left: 0,
                height: 0,
                width: 0,
                zIndex: -1,
                overflow: 'hidden'
            }}
            aria-hidden="true"
        >
            <label htmlFor="hp-website">Website</label>
            <input
                id="hp-website"
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
