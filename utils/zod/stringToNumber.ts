import { z, RefinementCtx } from "zod"

export default function (val: string, ctx: RefinementCtx) {
  const parsed = parseInt(val)
  if (!isNaN(parsed)) return parsed

  ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Not a number" })
  return z.NEVER
}
