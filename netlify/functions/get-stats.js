const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  const API_KEY = process.env.PLAUSIBLE_API_KEY;
  const domain = "promopilot.netlify.app";

  const headers = {
    Authorization: `Bearer ${API_KEY}`,
  };

  try {
    const realtime = await fetch(`https://plausible.io/api/v1/stats/realtime/visitors?site_id=${domain}`, {
      headers,
    }).then((res) => res.json());

    return {
      statusCode: 200,
      body: JSON.stringify(realtime),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch data" }),
    };
  }
};
