import { StoryblokComponent as OriginalStoryblokComponent, storyblokEditable } from '@storyblok/react/rsc'

export function StoryblokComponent(props: any) {
    const component = props.blok?.component
    console.log(`[StoryblokComponent] Rendering: ${component}`, props)

    return <OriginalStoryblokComponent {...props} {...storyblokEditable(props.blok)} />
}
/* // Content types
import { HelpArticle } from '@/components/contentTypes/HelpArticle';
import { HelpCollection } from '@/components/contentTypes/HelpCollection';

// Atoms
import { BlokImage } from '@/components/atoms/BlokImage';
import { Button } from '@/components/atoms/Button';
import { RichText } from '@/components/atoms/RichText';
import { YoutubeVideo } from '@/components/atoms/YoutubeVideo';

export function StoryblokComponent({ blok, ...rest }: any) {
  if (!blok) return <>Please provide a blok element.</>;

  const componentMap: any = {
    // Content types
    HelpArticle,
    HelpCollection,
    // Atoms
    BlokImage,
    Button,
    RichText,
    YoutubeVideo
    // Bloks
  };

  if (!componentMap) return <>No component map found.</>;
  if (typeof componentMap[blok.component] !== 'undefined') {
    const Component = componentMap[blok.component];
    return <Component blok={blok} {...rest} />;
  }
  return <>Component {blok.component} doesnt exist.</>;
}
 */
