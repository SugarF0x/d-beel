import Fuse from "fuse.js"
import emojiShortcutToImageUrlMap from "~/const/hots/emojiShortcutToImageUrlMap"

export default new Fuse(Object.keys(emojiShortcutToImageUrlMap), { threshold: .2 })
