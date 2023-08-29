import axios from 'axios'
import { BskyAgent, RichText } from '@atproto/api'

const {
  MASTODON_API_URL,
  MASTODON_TOKEN,
  BLUESKY_API_URL,
  BLUESKY_IDENTIFIER,
  BLUESKY_APP_PASSWORD,
} = process.env

/**
 * Mastodonにポストする
 * @param {string} text - 投稿本文
 */
const postToMastodon = async (text: string) => {
  try {
    const params = {
      access_token: MASTODON_TOKEN,
      status: text,
      visibility: 'public'
    }
    await axios.post(`${MASTODON_API_URL}/statuses`, params)
  } catch (error) {
    console.warn(error)
    throw Error('マストドンへの投稿に失敗しました')
  }
}

/**
 * Blueskyにポストする
 * @param {string} text - 投稿本文
 */
const postToBluesky = async (text: string) => {
  const agent = new BskyAgent({
    service: BLUESKY_API_URL
  })
  await agent.login({
    identifier: BLUESKY_IDENTIFIER,
    password: BLUESKY_APP_PASSWORD,
  })

  await agent.post({
    text,
  })
}

export {
  postToMastodon,
  postToBluesky,
}

