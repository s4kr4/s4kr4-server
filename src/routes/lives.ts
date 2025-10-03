import { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import Parser from "rss-parser";
import axios from "axios";
import fs from "fs";
import { getVideoId } from "../libs/files";
import { postToMastodon } from "../libs/notify";
import { getPostText } from "../libs/texts";
import Bluesky from "../libs/Bluesky";

const { YOUTUBE_CHANNEL_ID, YOUTUBE_API_KEY, YOUTUBE_API_URL } = process.env;
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;
const VIDEO_ID_FILE = `${process.cwd()}/video_id`;

const parser = new Parser();

const lives: FastifyPluginAsync = async (fastify, opts) => {
  fastify.get("/data", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const feed = await parser.parseURL(FEED_URL);
      const entries = feed.items.map((entry) => {
        const videoId = entry.id.split(":")[2];
        entry.videoId = videoId;

        return entry;
      });

      return {
        data: entries,
      };
    } catch (error) {
      console.warn(error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  /**
   * 配信通知
   * @param {string} videoId - 通知をしたい配信のID
   */
  fastify.post<{ Body: { videoId: string } }>(
    "/notify",
    async (
      request: FastifyRequest<{ Body: { videoId: string } }>,
      reply: FastifyReply,
    ) => {
      try {
        const { videoId } = request.body;

        const notifiedVideoId = getVideoId();

        if (videoId === notifiedVideoId) {
          return reply.code(200).send({
            message: "すでに通知済みの配信です",
          });
        }

        const params = {
          key: YOUTUBE_API_KEY,
          part: "snippet",
          id: videoId,
          fields: "items/snippet(title,liveBroadcastContent)",
        };

        // 指定の配信の情報を取得
        const { data: videos }: any = await axios.get(
          `${YOUTUBE_API_URL}/videos`,
          {
            params,
          },
        );
        const { title, liveBroadcastContent } = videos.items[0].snippet;

        if (liveBroadcastContent === "live") {
          const postText = getPostText(title, videoId);

          const bskyAgent = new Bluesky();
          await bskyAgent.login();
          await Promise.all([
            postToMastodon(postText),
            bskyAgent.post(postText),
          ]);

          // 最後に通知した配信のIDを記録する
          fs.writeFileSync(VIDEO_ID_FILE, videoId);

          return reply.code(200).send({
            message: "通知完了",
          });
        } else if (liveBroadcastContent === "upcoming") {
          return reply.code(200).send({
            message: "開始前の配信です",
          });
        }
      } catch (error) {
        console.warn(error);
        reply.code(500).send({ error: "Internal server error" });
      }
    },
  );
};

export default lives;
