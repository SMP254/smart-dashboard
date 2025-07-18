const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  const API_KEY = process.env.PLAUSIBLE_API_KEY;
  const domain = "promopilot.netlify.app";

  const headers = {
    Authorization: `Bearer ${API_KEY}`,
  };

  try {
    const urls = [
      `https://plausible.io/api/v1/stats/breakdown?site_id=${domain}&period=day&property=event:page`,
      `https://plausible.io/api/v1/stats/breakdown?site_id=${domain}&period=day&property=visit:source`,
      `https://plausible.io/api/v1/stats/breakdown?site_id=${domain}&period=day&property=visit:device`,
      `https://plausible.io/api/v1/stats/breakdown?site_id=${domain}&period=day&property=visit:country`,
    ];

    const [pages, sources, devices, countries] = await Promise.all(
      urls.map((url) => fetch(url, { headers }).then((res) => res.json()))
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ pages, sources, devices, countries }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch breakdown data" }),
    };
  }
};
