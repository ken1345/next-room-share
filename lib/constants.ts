import areaData from '../data/generated-area-data.json';

// Export the raw hierarchical data for the 3-level selector
export const AREA_DATA = areaData as Record<string, Record<string, string[]>>;

// Flatten the region-grouped data into a single object of { Prefecture: [Cities] }
export const PREFECTURES = Object.values(areaData).reduce((acc, regionPrefs) => {
    return { ...acc, ...regionPrefs };
}, {}) as Record<string, string[]>;
