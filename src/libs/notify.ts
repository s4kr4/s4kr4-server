import axios from 'axios'

const { MASTODON_API_URL, MASTODON_TOKEN } = process.env

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
  console.log('postToBluesky')
}

export {
  postToMastodon,
  postToBluesky,
}

