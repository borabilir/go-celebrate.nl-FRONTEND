/**
 * In storyblok, a Story has a full_slug object that includes the deployment name (basically, the
 * root folder). This function removes the deployment name from the slug.
 * @param slug
 * @returns The slug without the deployment name
 * @example
 * sanitizeStoryblokSlugs('my-deployment-name/my-page') // 'my-page'
 */
export function sanitizeStoryblokSlugs(slug: string): string {
  const regex = new RegExp(`^\/?${process.env.NEXT_PUBLIC_DEPLOYMENT_NAME}\\b`);
  return slug.replace(regex, '');
}
