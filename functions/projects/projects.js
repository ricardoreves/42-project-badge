// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

const axios = require("axios");

const {
  PORT,
  FT_CLIENT_ID,
  FT_CLIENT_SECRET,
  FT_AUTH_URL,
  FT_USER_URL,
  FMT_BADGE_URL,
} = process.env;

const getAccessToken = async () =>
{
  return axios.post(
    `${FT_AUTH_URL}`,
    {
      grant_type: "client_credentials",
      client_id: FT_CLIENT_ID,
      client_secret: FT_CLIENT_SECRET,
    }
  );
};

const getUser = async (userId) =>
{
  const accessTokenResponse = await getAccessToken();
  //console.log(accessTokenResponse.data);
  const accessToken = accessTokenResponse.data.access_token;
  const userResponse = await axios.get(`${FT_USER_URL}${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  //console.log(accessTokenResponse.data, userResponse.data);
  return userResponse;
};

const projectIdSanitizer = (projectId) =>
{
  return projectId
    .toLowerCase()
    .replace("42cursus-", "")
    .replace(/[\-\_\s]+/g, "");
};

const handler = async (event) =>
{
  try
  {
    const userId = event.queryStringParameters.userId
    //console.log(event.queryStringParameters);
    const userResponse = await getUser(userId);
    return {
      statusCode: 200,
      body: JSON.stringify({
        projects: userResponse.data.projects_users.map((item) =>
          projectIdSanitizer(item.project.slug)
        )
      }),
      headers: { "Cache-Control": "public, max-age=86400, must-revalidate" },
    }
  } catch (error)
  {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
