// This is the index file for lib/storyblok. Looks like this helps 
// export everything from the other storyblok files, such as fetchLinks, fetchStories etc.
// This could create circular import kind of issues... 
export * from './fetchLinks';
export * from './fetchStories';
// export * from './initStoryblok';
import { initStoryblok } from './initStoryblok';
export { initStoryblok };

