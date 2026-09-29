const contactHandler = require("../api/contact");

// Only used by `npm start`; on Vercel, api/contact.js is deployed as a serverless function.
module.exports = function setupProxy(app) {
  app.post("/api/contact", contactHandler);
};
