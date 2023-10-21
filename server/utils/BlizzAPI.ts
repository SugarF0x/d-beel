import { BlizzAPI } from "blizzapi"

export const blizz = new BlizzAPI({
  region: "eu",
  clientId: process.env.WOW_CLIENT_ID,
  clientSecret: process.env.WOW_CLIENT_SECRET,
})
