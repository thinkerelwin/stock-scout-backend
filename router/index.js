const router = new (require("koa-router"))();
const axios = require("axios");

const instanceParts =
  process.env.NODE_ENV === "production"
    ? {
        instance: instanceGenerator("https://cloud.iexapis.com/v1/"),
        token: process.env.IEX_CLOUD_API_KEY,
      }
    : {
        instance: instanceGenerator("https://sandbox.iexapis.com/stable/"),
        token: process.env.IEX_CLOUD_API_KEY_SANDBOX,
      };

// to save data usage, collection api use sandbox type
const sandboxInstanceWithoutExtraParams = instanceWrapperWithoutExtraParams({
  instance: instanceGenerator("https://sandbox.iexapis.com/stable/"),
  token: process.env.IEX_CLOUD_API_KEY_SANDBOX,
});

const instance = instanceWrapper(instanceParts);
const instanceWithoutExtraParams =
  instanceWrapperWithoutExtraParams(instanceParts);

function instanceWrapper({ instance, token }) {
  return (ctx, next) => {
    const params = paramsWithToken(ctx.params, token);

    return baseInstance({ instance, params, ctx, next });
  };
}

function instanceWrapperWithoutExtraParams({ instance, token }) {
  return (unwantedList, ctx, next) => {
    const requestParams = paramsWithToken(ctx.params, token);

    for (let props of unwantedList) {
      delete requestParams.params[props];
    }

    return baseInstance({ instance, params: requestParams, ctx, next });
  };
}

async function baseInstance({ instance, params, ctx, next }) {
  try {
    // console.log(ctx.url, params);
    const { data } = await instance.get(ctx.url, params);
    ctx.body = data;
    return (ctx.status = 200);
  } catch (err) {
    const status = err.response ? err.response.status : 500;
    ctx.throw(status, err.message);
  }
}

function paramsWithToken(params, token) {
  return {
    params: {
      ...params,
      token,
    },
  };
}

function instanceGenerator(baseURL, timeout = 3000) {
  return axios.create({
    baseURL,
    timeout,
  });
}

// Sectors
router.get("/ref-data/sectors", async (ctx, next) => {
  return await instance(ctx, next);
});

// Collections
router.get("/stock/market/collection/:collectionType", async (ctx, next) => {
  return await sandboxInstanceWithoutExtraParams(["collectionType"], ctx, next);
});

// List
// options: ctx.params.type = mostactive, gainers, losers
// listLimit start from 0
router.get("/stock/market/list/:type/:listLimit", async (ctx, next) => {
  return await instanceWithoutExtraParams(["type"], ctx, next);
});

// Intraday Prices
router.get("/stock/:symbol/intraday-prices", async (ctx, next) => {
  ctx.params.chartIEXOnly = true;
  return await instanceWithoutExtraParams(["symbol"], ctx, next);
});

// Historical Prices
// longest availabe time period: 5 year
router.get("/stock/:symbol/chart/:range/", async (ctx, next) => {
  // ctx.params.chartCloseOnly = true;
  return await instanceWithoutExtraParams(["symbol", "range"], ctx, next);
});

// Quote
router.get("/stock/:symbol/quote", async (ctx, next) => {
  return await instanceWithoutExtraParams(["symbol"], ctx, next);
});

// Company
router.get("/stock/:symbol/company", async (ctx, next) => {
  return await instanceWithoutExtraParams(["symbol"], ctx, next);
});

// Logo
router.get("/stock/:symbol/logo", async (ctx, next) => {
  return await instanceWithoutExtraParams(["symbol"], ctx, next);
});

// News
router.get("/stock/:symbol/news/last/:articleNumber", async (ctx, next) => {
  return await instanceWithoutExtraParams(
    ["symbol", "articleNumber"],
    ctx,
    next
  );
});

// batchNews
router.get("/stock/market/batch", async (ctx, next) => {
  return await instance(ctx, next);
});

// batchOnSymbol
router.get("/stock/:symbol/batch", async (ctx, next) => {
  return await instanceWithoutExtraParams(["symbol"], ctx, next);
});

// Symbols
router.get("/ref-data/symbols", async (ctx, next) => {
  return await instance(`/ref-data/symbols`, ctx, next);
});

// health check
router.get("/heartbeat", async (ctx, next) => {
  return (ctx.status = 200);
});

module.exports = router;
