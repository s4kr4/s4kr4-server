import { RichText } from '@atproto/api';
import ogs from 'open-graph-scraper';
import sharp from 'sharp';

export type OgInfo = {
  siteUrl: string;
  ogImageUrl: string;
  type: string;
  description: string;
  title: string;
  imageData: Uint8Array;
};

export const findUrlInRichText = (richText: RichText): string | null => {
  if (!richText.facets || richText.facets.length < 1) {
    return null
  }

  for (const facet of richText.facets) {
    if (facet.features.length < 1) {
      continue
    }

    for (const feature of facet.features) {
      if (feature.$type != "app.bsky.richtext.facet#link") {
        continue
      } else if (feature.uri == null) {
        continue;
      }

      return feature.uri as string;
    }
  }
  return null;
}

/**
 * 指定したURLのOGP情報を取得する
 * @param {string} url - OGPを取得したいURL
 * @returns {OgInfo} - OGP情報
 */
export const getOgInfo = async (url: string): Promise<OgInfo | null> => {
  const { result } = await ogs({ url })

  const image = result.ogImage?.at(0)
  if (!image) {
    return null
  }

  const imageRes = await fetch(image.url)
  const buffer = await imageRes.arrayBuffer()

  const compressedImage = await sharp(buffer)
    .resize(800, null, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80, progressive: true})
    .toBuffer()

  return {
    siteUrl: url,
    ogImageUrl: image.url,
    type: image.type || '',
    description: result.ogDescription || '',
    title: result.ogTitle || '',
    imageData: new Uint8Array(compressedImage)
  }
}
