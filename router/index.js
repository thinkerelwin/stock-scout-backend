"use strict";

const router = new (require("koa-router"))();

router.get("/", async ctx => {
  return (ctx.status = 200);
});

module.exports = router;
