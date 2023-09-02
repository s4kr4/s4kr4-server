import Router from '@koa/router'
import Parser from 'rss-parser'
import axios from 'axios'
import fs from 'fs'
import { getVideoId } from '../libs/files'
import { postToMastodon } from '../libs/notify'
import { getPostText } from '../libs/texts'
import Bluesky from '../libs/Bluesky'

const { YOUTUBE_CHANNEL_ID, YOUTUBE_API_KEY, YOUTUBE_API_URL } = process.env
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`
const VIDEO_ID_FILE = `${process.cwd()}/video_id`

const parser = new Parser()
const lives = new Router()

lives.get('/data', async (ctx, next) => {

  try {
    const feed = await parser.parseURL(FEED_URL)
    const entries = feed.items.map((entry) => {
      const videoId = entry.id.split(':')[2]
      entry.videoId = videoId

      return entry
    })

    ctx.body = {
      data: entries,
    }
  } catch (error) {
    console.warn(error)
  }
})

/**
 * 配信通知
 * @param {string} videoId - 通知をしたい配信のID
 */
lives.post('/notify', async (ctx, next) => {
  try {
    const { videoId } = ctx.request.body

    const notifiedVideoId = getVideoId()

    if (videoId === notifiedVideoId) {
      ctx.body = {
        message: 'すでに通知済みの配信です',
      }
      ctx.status = 200
      return
    }

    const params = {
      key: YOUTUBE_API_KEY,
      part: 'snippet',
      id: videoId,
      fields: 'items/snippet(title,liveBroadcastContent)'
    }

    // 指定の配信の情報を取得
    const { data: videos }: any = await axios.get(`${YOUTUBE_API_URL}/videos`, {
      params
    })
    const { title, liveBroadcastContent } = videos.items[0].snippet

    if (liveBroadcastContent === 'live') {

      const postText = getPostText(title, videoId)

      const bskyAgent = new Bluesky()
      await bskyAgent.login()
      await Promise.all([
        postToMastodon(postText),
        bskyAgent.post(postText)
      ])

      // 最後に通知した配信のIDを記録する
      fs.writeFileSync(VIDEO_ID_FILE, videoId)

      ctx.body = {
        message: '通知完了'
      }
      ctx.status = 200
    } else if (liveBroadcastContent === 'upcoming') {
      ctx.body = {
        message: '開始前の配信です'
      }
      ctx.status = 200
    }
  } catch (error) {
    console.warn(error)
  }
})

export default lives

