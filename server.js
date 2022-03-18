/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: rpinto-r <marvin@42lausanne.ch>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/03/16 16:32:57 by rpinto-r          #+#    #+#             */
/*   Updated: 2022/03/18 04:52:04 by rpinto-r         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const app = require("express")();
const axios = require("axios");
const axiosApiInstance = axios.create();
const cachios = require("cachios");
const fs = require("fs");
require("dotenv").config();
const {
  PORT,
  FT_CLIENT_ID,
  FT_CLIENT_SECRET,
  FT_AUTH_URL,
  FT_USER_URL,
  FMT_BADGE_URL,
} = process.env;

const sanitizeProjectSlug = (slug) => {
  return slug
    .toLowerCase()
    .replace("42cursus-", "")
    .replace(/[\-\_\s]+/g, "");
};

const createBadgeUrl = (label, message, color, options) => {
  let logo = "42";
  if (options && options.nologo == "") logo = "";
  if (options && options.nolabel == "") label = "";
  return FMT_BADGE_URL.replace("LOGO", logo)
    .replace("LABEL", label)
    .replace("MESSAGE", message)
    .replace("COLOR", color);
};

const replyBadge = (reply, label, message, color, options) => {
  reply.status(301).redirect(createBadgeUrl(label, message, color, options));
};

const refreshAccessToken = async () => {
  return cachios.post(
    `${FT_AUTH_URL}`,
    {
      grant_type: "client_credentials",
      client_id: FT_CLIENT_ID,
      client_secret: FT_CLIENT_SECRET,
    },
    {
      ttl: 3600,
    }
  );
};

const getUserData = async (userName) => {
  const accessTokenResult = await refreshAccessToken();
  const accessToken = accessTokenResult.data.access_token;
  const result = await cachios.get(`${FT_USER_URL}${userName}`, {
    ttl: 3600,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return result;
};

app.get("/users/:userName/project/:projectSlug", async (request, reply) => {
  try {
    let { userName, projectSlug } = request.params;
    const result = await getUserData(userName);
    const sanitizeProjectSlug = sanitizeProjectSlug(projectSlug);

    if (result.data.projects_users) {
      const projects = result.data.projects_users;
      const project = projects.find(
        (item) => sanitizeProjectSlug(item.project.slug) === sanitizeProjectSlug
      );
      if (project) {
        if (project.final_mark)
          return replyBadge(
            reply,
            projectSlug,
            `${project.final_mark}`,
            "2aae48",
            request.query
          );
        else
          return replyBadge(reply, projectSlug, `0`, "blue", request.query);
      } else
        return replyBadge(reply, "project", "invalid", "red", request.query);
    }
  } catch (error) {
    if (error.response.status == 404)
      return replyBadge(reply, "user", "invalid", "red");
    else return replyBadge(reply, "error", "unexpected", "red");
  }
});

app.get("/users/:userName/projects", async (request, reply) => {
  try {
    let { userName } = request.params;
    const result = await getUserData(userName);
    reply.json(
      result.data.projects_users.map((item) =>
        sanitizeProjectSlug(item.project.slug)
      )
    );
  } catch (error) {
    console.log("error:", error.message);
    reply.json(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
