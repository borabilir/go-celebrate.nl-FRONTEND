// wrapper to wrap around fetching data for stories end point. 

import qs from 'qs'
// @ts-ignore
import { getStoryblokApi } from '@storyblok/react/rsc'

import { GetStoriesParams, GetStoriesResponse } from '@/@types/storyblok'
import { getErrorMessage } from '@/utils/errors'
import { logWithContext } from '@/utils/logger';

/**
 * If a slug is provided, fetch a single story. Otherwise, fetch multiple stories.
 * The response will be an array of stories if multiple stories are fetched, or a single story
 * if a slug is provided.
 */
export async function fetchStories(params: GetStoriesParams): Promise<GetStoriesResponse> {
    logWithContext('fetchStories.ts: ', "Inside fetchStories async function");
    logWithContext('fetchStories.ts: ', "Params received:", JSON.stringify(params, null, 2));
    // if (process.env.NEXT_PUBLIC_INFO_LOGGING_MODE === 'true') {
    //     console.log("Inside fetchStories async function");
    //     console.log("Params received:", JSON.stringify(params, null, 2));
    // }
    const { slug, cv, ...storyblokApiParams } = params
    const storyblokApi = getStoryblokApi()
    const sbParams: any = {
        /**
         * In dev mode, we want to fetch the latest, uncached data. We can achieve that by
         * passing the current time.
         */
        cv: cv ? cv : process.env.NODE_ENV === 'production' ? undefined : Date.now(),
        token: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
    }
    logWithContext('fetchStories.ts: ', "Storyblok API params:", JSON.stringify(sbParams, null, 2));
    // if (process.env.NEXT_PUBLIC_INFO_LOGGING_MODE === 'true') {
    //     console.log("Storyblok API params:", JSON.stringify(sbParams, null, 2));
    // }
    /**
     * Transform each field from the params object into valid a query string.
     */
    Object.entries(storyblokApiParams).map(([key, value]) => {
        if (value) {
            // We handle languagers differently, in the story slug, so we skip it here.
            if (key === 'language') return
            sbParams[key] =
                ['string', 'number'].indexOf(typeof value) > -1
                    ? value
                    : Array.isArray(value)
                    ? value.join(',')
                    : qs.stringify(value, { arrayFormat: 'comma' })
        }
    })
    let storyUrl = `cdn/stories/${process.env.NEXT_PUBLIC_DEPLOYMENT_NAME}/`
    logWithContext('fetchStories.ts: ', "Initial deployment name:", process.env.NEXT_PUBLIC_DEPLOYMENT_NAME);
    logWithContext('fetchStories.ts: ', "Initial storyUrl:", storyUrl);
    // if (process.env.NEXT_PUBLIC_INFO_LOGGING_MODE === 'true') {
    //     console.log("Initial deployment name:", process.env.NEXT_PUBLIC_DEPLOYMENT_NAME);
    //     console.log("Initial storyUrl:", storyUrl);
    // }
    // if (params.language && params.language !== process.env.NEXT_PUBLIC_DEFAULT_LOCALE) {
    if (params.language) {
        storyUrl += `${params.language}/`
    }
    logWithContext('fetchStories.ts: ', "Language param:", params.language);
    logWithContext('fetchStories.ts: ', "StoryUrl after adding language:", storyUrl);
    // if (process.env.NEXT_PUBLIC_INFO_LOGGING_MODE === 'true') {
    //     console.log("Language param:", params.language);
    //     console.log("StoryUrl after adding language:", storyUrl);
    // }
    if (slug) {
        /**
         * We need to get rid of the deployment name from the slug, that is prepended in preview mode
         * in the Storyblok editor.
         */
        const cleanedSlug = slug?.filter((s) => s !== process.env.NEXT_PUBLIC_DEPLOYMENT_NAME) || []
        logWithContext('fetchStories.ts: ', "Raw slug param:", slug);
        logWithContext('fetchStories.ts: ', "Cleaned slug:", cleanedSlug);
        logWithContext('fetchStories.ts: ', "StoryUrl after adding slug:", storyUrl);
        // if (process.env.NEXT_PUBLIC_INFO_LOGGING_MODE === 'true') {
        //     console.log("Raw slug param:", slug);
        //     console.log("Cleaned slug:", cleanedSlug);
        //     console.log("StoryUrl after adding slug:", storyUrl);
        // }
        /**
         * Add the deployment name manually to ensure both production (without deployment name in the
         * slug) and preview mode (with deployment name prepended in the slug) work.
         */
        storyUrl += `${cleanedSlug?.join('/')}`
    }
    logWithContext('fetchStories.ts: ', "Final storyUrl:", storyUrl);
    // if (process.env.NEXT_PUBLIC_INFO_LOGGING_MODE === 'true') {
    //     console.log("Final storyUrl:", storyUrl);
    // }
    // chatgpt's guess of the usage of storyblokApi.get function
    // Generic wrapper used when the slug is optional (used widely across the app).
    try {
        logWithContext('fetchStories.ts: ', "Attempting to fetch from Storyblok with URL:", storyUrl);
        logWithContext('fetchStories.ts: ', "Params:", JSON.stringify(sbParams, null, 2));
        // if (process.env.NEXT_PUBLIC_INFO_LOGGING_MODE === 'true') {
        //     console.log("Attempting to fetch from Storyblok with URL:", storyUrl);
        //     console.log("Params:", JSON.stringify(sbParams, null, 2));
        // }
        const response = await storyblokApi.get(storyUrl, sbParams)
        logWithContext('fetchStories.ts: ', "✅ Response from Storyblok: ",
            JSON.stringify(response.data, null, 2));
        // if (process.env.NEXT_PUBLIC_INFO_LOGGING_MODE === 'true') {
        //     console.log("✅ Response from Storyblok: ", JSON.stringify(response.data, null, 2));
        // }
        const data = await response?.data
        return data
    } catch (error) {
        console.error('[error] FetchStories', { 
            storyUrl,
            params: sbParams,
            error: error instanceof Error ? error.message : error
        })
        return {
            stories: [],
            story: null,
            cv: null,
            rels: [],
            links: [],
            error: getErrorMessage(error),
        }
    }
}
