/**
 * 
 * This helper takes note in a JSON file on the local disk about where each URL we generate is coming from.
 * 
 * This is necessary since we have content (pages) from the CMS and generated entities from the MDM (e.g., categories).
 * 
 * In order to prevent unnecesarry API calls we tell our system where each URL is coming from and also it gives us
 * an oppoertunity to prioritize content for each URL (in case we want to have CMS content for a MDM generated URL).
 * 
 */

import {
    writeFileSync,
    readFileSync,
} from 'fs'
import path from 'path'

const CACHE_FOLDER_PATH =  path.join(process.cwd(), '.cache')

export function cachePaths(source, paths) {
    /**
     * source - string, a unique key to identify a source. E.g., "storyblok"
     * paths - array of URL segments (slugs). E.g., ["about", "blog/article"]
     */
    if (!source || !paths || !Array.isArray(paths) || paths.length === 0) return
    const existingCache = readCache()
    let output
    /** 
     *  Check if we have already an existing cache file for the paths and wether we have links for the source
     */
    if (existingCache && existingCache[source]) {
        // If so, let's merge then
        existingCache[source] = [
            ...existingCache[source],
            ...paths
        ]
        output = existingCache
    } else if (existingCache) {
        // Otherwise these are the very first urls on this source
        existingCache[source] = paths
        output = existingCache
    } else {
        // Or we don't yet have the cache file
        output = {}
        output[source] = paths
    }
    console.log('-----------------------')
    console.log(source, 'Arrived with paths:')
    console.log(paths)
    console.log('Output will be written as')
    console.log(output)
    console.log('-----------------------')
    try {
        writeFileSync(`${CACHE_FOLDER_PATH}/paths.json`, JSON.stringify(output))
    } catch (err) {
        console.error(err)
    }
}

export function readCache() {
    try {
        const result = readFileSync(`${CACHE_FOLDER_PATH}/paths.json`, 'utf8')
        if (!result) return {}
        return JSON.parse(result)
    } catch (err) {
        console.warn(err)
    }
    return null
}
