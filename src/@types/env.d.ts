/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly YOUTUBE_API_URL: string;
    readonly YOUTUBE_CHANNEL_ID: string;
    readonly YOUTUBE_API_KEY: string;

    readonly MASTODON_API_URL: string;
    readonly MASTODON_TOKEN: string;

    readonly BLUESKY_API_URL: string;
    readonly BLUESKY_IDENTIFIER: string;
    readonly BLUESKY_APP_PASSWORD: string;
  }
}
