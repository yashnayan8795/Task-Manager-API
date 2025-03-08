import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_KEY } from './env.config.js';

const aj = arcjet({
  key: ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: [ "CATEGORY:SEARCH_ENGINE" ],
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 10, // Refill 10 tokens per interval
      interval: 10, // Refill every 10 seconds
      capacity: 100, // Bucket capacity of 100 tokens
    }),
  ],
});

export default aj;