#!/usr/bin/env node
/**
 * Cache Management Utility for F1 ELO Project
 */

import { getCacheStats, clearSeasonCache } from './fetch-results.js';
import fs from 'fs/promises';
import path from 'path';

const RAW_DATA_DIR = 'raw-data';

/**
 * Show cache statistics for all seasons
 */
async function showCacheStats() {
    try {
        console.log('='.repeat(60));
        console.log('F1 ELO Cache Statistics');
        console.log('='.repeat(60));
        
        const files = await fs.readdir(RAW_DATA_DIR);
        const seasons = [...new Set(files.map(file => file.split('-')[0]))].sort();
        
        let totalFiles = 0;
        let totalSizeKB = 0;
        
        for (const season of seasons) {
            const stats = await getCacheStats(season);
            if (stats.cachedPages > 0) {
                // Calculate total size
                let seasonSizeKB = 0;
                for (const file of stats.cacheFiles) {
                    try {
                        const filePath = path.join(RAW_DATA_DIR, file);
                        const stat = await fs.stat(filePath);
                        seasonSizeKB += stat.size / 1024;
                    } catch (error) {
                        // Ignore missing files
                    }
                }
                
                console.log(`Season ${season}: ${stats.cachedPages} cached pages (${seasonSizeKB.toFixed(1)} KB)`);
                totalFiles += stats.cachedPages;
                totalSizeKB += seasonSizeKB;
            }
        }
        
        console.log('-'.repeat(60));
        console.log(`Total: ${totalFiles} cached files (${totalSizeKB.toFixed(1)} KB)`);
        console.log(`Cache directory: ${RAW_DATA_DIR}/`);
        console.log('='.repeat(60));
        
    } catch (error) {
        console.error('Error reading cache:', error.message);
    }
}

/**
 * Clear cache for a specific season or all seasons
 */
async function clearCache(season = null) {
    if (season) {
        const cleared = await clearSeasonCache(season);
        console.log(`Cache cleared for ${season}: ${cleared} files removed`);
    } else {
        try {
            const files = await fs.readdir(RAW_DATA_DIR);
            const seasons = [...new Set(files.map(file => file.split('-')[0]))];
            
            let totalCleared = 0;
            for (const s of seasons) {
                totalCleared += await clearSeasonCache(s);
            }
            
            console.log(`All cache cleared: ${totalCleared} files removed`);
        } catch (error) {
            console.error('Error clearing cache:', error.message);
        }
    }
}

/**
 * Main function
 */
async function main() {
    const command = process.argv[2];
    const season = process.argv[3];
    
    switch (command) {
        case 'stats':
            await showCacheStats();
            break;
            
        case 'clear':
            await clearCache(season);
            break;
            
        case 'help':
        default:
            console.log('F1 ELO Cache Manager');
            console.log('');
            console.log('Usage:');
            console.log('  node cache-manager.js stats           - Show cache statistics');
            console.log('  node cache-manager.js clear [season]  - Clear cache (all or specific season)');
            console.log('  node cache-manager.js help            - Show this help');
            console.log('');
            console.log('Examples:');
            console.log('  node cache-manager.js stats');
            console.log('  node cache-manager.js clear 2024');
            console.log('  node cache-manager.js clear');
            break;
    }
}

// Run if called directly
main().catch(console.error);
