/**
 * In storyblok, a Story has a full_slug object that includes the deployment name (basically, the
 * root folder). This function removes the deployment name from the slug.
 * @param slug
 * @returns The slug without the deployment name
 * @example
 * sanitizeStoryblokSlugs('my-deployment-name/my-page') // 'my-page'
 */
export function sanitizeStoryblokSlugs(slug: string): string {
  const deployment = process.env.NEXT_PUBLIC_DEPLOYMENT_NAME;
  const locales = process.env.NEXT_PUBLIC_ACTIVE_LANGUAGES?.split(',') || [];

  let cleaned = slug;

  // Remove deployment name prefix
  if (deployment && cleaned.startsWith(`${deployment}/`)) {
    cleaned = cleaned.replace(`${deployment}/`, '');
  }

  // Remove locale prefix (if exists)
  for (const locale of locales) {
    if (cleaned.startsWith(`${locale}/`)) {
      cleaned = cleaned.replace(`${locale}/`, '');
    }
  }

  return cleaned;
}