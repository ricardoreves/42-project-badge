// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

const axios = require("axios");

const RED = "ff0000";
const BLUE = "0000FF";
const GREEN = "2aae48";

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
  const accessToken = accessTokenResponse.data.access_token;
  const userResponse = await axios.get(`${FT_USER_URL}${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return userResponse;
};

const projectIdSanitizer = (projectId) =>
{
  return projectId.toLowerCase()
    .replace("42cursus-", "")
    .replace(/[\-\_\s]+/g, "");
};

const findProject = (projects, projectId) =>
{
  return projects.find(item => projectIdSanitizer(item.project.slug) === projectId);
}

const replyBadge = (label, message, color) =>
{
  return {
    statusCode: 301,
    headers: {
      Location: FMT_BADGE_URL
        .replace("LABEL", label.charAt(0).toUpperCase() + label.slice(1))
        .replace("MESSAGE", message)
        .replace("COLOR", color),
      "Cache-Control": "public, max-age=86400, must-revalidate",
    }
  };
}

const handler = async (event) =>
{
  try
  {
    let { userId, projectId } = event.queryStringParameters;
    projectId = projectIdSanitizer(projectId);
    const userResponse = await getUser(userId);
    if (userResponse.data.projects_users)
    {
      const project = findProject(userResponse.data.projects_users, projectId);
      if (!project)
        return replyBadge("project", "not_found", RED);
      if (project.final_mark)
        return replyBadge(projectId, `${project.final_mark}`, GREEN);
      return replyBadge(projectId, 0, BLUE);
    }
  } catch (error)
  {
    if (error.response && error.response.status == 404)
      return replyBadge("user", "not_found", RED);
    return replyBadge("badge", "error", RED);
  }
}

module.exports = { handler }
