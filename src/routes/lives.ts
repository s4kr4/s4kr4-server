import Router from '@koa/router'
import Parser from 'rss-parser'

const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${process.env.YOUTUBE_CHANNEL_ID}`

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

export default lives

