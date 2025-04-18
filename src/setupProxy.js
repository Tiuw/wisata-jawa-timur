const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/wisata_jawa_timur", // This is the API route that you want to proxy
    createProxyMiddleware({
      target: "http://localhost", // Change this to your backend server
      changeOrigin: true, // This will help with CORS
      pathRewrite: {
        "^/wisata_jawa_timur": "/wisata_jawa_timur", // Ensure the path is correct
      },
    })
  );
};
