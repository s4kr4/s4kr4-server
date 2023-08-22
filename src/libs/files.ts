import fs from 'fs'

const VIDEO_ID_FILE = `${process.cwd()}/video_id`

const getVideoId = () => {
  if (fs.existsSync(VIDEO_ID_FILE)) {
    return fs.readFileSync(VIDEO_ID_FILE, 'utf-8').trim()
  } else {
    // ファイルが無ければ新規作成して空文字を返す
    fs.writeFileSync(VIDEO_ID_FILE, '')
    return ''
  }
}

export { getVideoId }

