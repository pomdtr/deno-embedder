import {D, G} from "../../../../embed.ts"
import f0 from "./app.js_.ts"

const files = {
  "app.js": f0,
} as const

export const dir = D(files)
export const get = G(files)