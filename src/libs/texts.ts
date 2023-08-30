const getPostText = (title: string, videoId: string) => {
  return `
配信を開始しました。
${title}
youtu.be/${videoId}
`
}

export {
  getPostText,
}

