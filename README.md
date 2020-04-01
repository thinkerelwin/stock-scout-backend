# stock-scout-backend

simple server for stock-scout web app, built on koa framework.

## Prerequisites

to run it locally, please add a `.env` file in your root folder with the following info inside:

```javascript
PORT=5000
IEX_CLOUD_API_KEY_SANDBOX=your_sandbox_key_on_IEX_CLOUD 
IEX_CLOUD_API_KEY=your_real_key 
```

[How to get the IEX Cloud key?](https://iexcloud.io/) click 'get started' button to register a free tier account

### Installing

1. clone the project down
2. run command `npm i`
3. add the `.env` file from 'Prerequisites' section
4. change the 'AcceptedUrl' variable to where your production app lives
5. use `npm run dev` for development(you get mock data, but unlimited calls), `npm run prod`(real data, but limited calls)

## License

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
