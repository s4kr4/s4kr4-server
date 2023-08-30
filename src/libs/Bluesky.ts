import { BskyAgent, RichText } from "@atproto/api"
import { findUrlInRichText, getOgInfo } from "./images"

const {
  BLUESKY_API_URL,
  BLUESKY_IDENTIFIER,
  BLUESKY_APP_PASSWORD,
} = process.env

export default class Bluesky {
  agent: BskyAgent | null

  constructor() {
    this.agent = null
  }

  /**
   * Blueskyにログインし、agentインスタンスを返す
   */
  async login() {
    const agent = new BskyAgent({
      service: BLUESKY_API_URL
    })

    try {
      await agent.login({
        identifier: BLUESKY_IDENTIFIER,
        password: BLUESKY_APP_PASSWORD,
      })
    } catch (error) {
      console.warn('ログインに失敗しました')
      console.warn(error)
    }

    this.agent = agent
  }

  /**
   * Blueskyにポストする
   * @param {string} text - 投稿本文
   */
  async post(text: string) {
    if (!this.agent) {
      return
    }

    const richText = new RichText({
      text,
    })
    await richText.detectFacets(this.agent)

    // 本文にURLが含まれている場合、OGP情報を取得する
    let embed
    const url = findUrlInRichText(richText)
    if (url) {
      embed = await this.uploadImage(url)
      console.log(JSON.stringify(embed, null, 2))
    }

    await this.agent.post({
      text: richText.text,
      facets: richText.facets,
      embed,
    })
  }

  /**
   * Blueskyに画像をアップロードし、ポストに埋め込む情報を返す
   * @param {Uint8Array} imageData - 画像情報
   * @returns 
   */
  async uploadImage(url: string) {
    if (!this.agent) {
      return
    }

    const ogInfo = await getOgInfo(url)

    if (ogInfo) {
      const imageRes = await this.agent.uploadBlob(ogInfo.imageData, {
        encoding: 'image/jpeg',
      })

      return {
        $type: 'app.bsky.embed.external',
        external: {
          uri: ogInfo.siteUrl,
          thumb: {
            $type: 'blob',
            ref: {
              $link: imageRes.data.blob.ref.toString(),
            },
            mimeType: imageRes.data.blob.mimeType,
            size: imageRes.data.blob.size,
          },
          title: ogInfo.title,
          description: ogInfo.description,
        },
      }
    }
  }
}