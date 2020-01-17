"use strict";

const router = new (require("koa-router"))();
const axios = require("axios");

const instance = axios.create({
  baseURL: "https://cloud.iexapis.com/v1/",
  timeout: 2500
});

const instanceSandbox = axios.create({
  baseURL: "https://sandbox.iexapis.com/stable/",
  timeout: 2500
});

async function proxyInstance(method, ctx, next) {
  try {
    const { data } = await instance.get(
      `${method}token=${process.env.IEX_CLOUD_API_KEY}`
    );
    ctx.body = data;
    return (ctx.status = 200);
  } catch (err) {
    const status = err.response ? err.response.status : 500;
    ctx.throw(status, err.message);
  }
}

async function proxyInstanceSandBox(method, ctx, next) {
  try {
    const { data } = await instanceSandbox.get(
      `${method}token=${process.env.IEX_CLOUD_API_KEY_SANDBOX}`
    );

    ctx.body = data;
    return (ctx.status = 200);
  } catch (err) {
    const status = err.response ? err.response.status : 500;
    ctx.throw(status, err.message);
  }
}

router.get("/query-sectors", proxyInstance.bind(this, "/ref-data/sectors?"));
router.get("/query-list/:type", async (ctx, next) => {
  return await proxyInstanceSandBox(
    `/stock/market/list/${ctx.params.type}?`,
    ctx,
    next
  );
});
// router.get(
//   "/query-USexchange",
//   proxyInstance.bind(this, "/ref-data/market/us/exchanges?")
// );

module.exports = router;
