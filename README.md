# Using functions to fetch external API data
[![Netlify Status](https://api.netlify.com/api/v1/badges/edb02750-097f-4c60-ae5d-08ea313485bc/deploy-status)](https://app.netlify.com/sites/42-project-badge/deploys)

## How to test serverless functions locally

1. Set local node version environement
```
nvm use 12
```
2. Install Netlify CLI
```
npm install netlify-cli -g
```
3. Start local development server in repo directory
```
netlify dev
```

Edit variables environement
- https://app.netlify.com/sites/42badge/settings/deploys#environment


## Test links
- http://localhost:8888/badge?userId=rpinto-r&projectId=libft
- http://localhost:8888/badge?userId=rpinto-r&projectId=badlibft
- http://localhost:8888/badge?userId=baduser&projectId=libft
- http://localhost:8888/badge?userId=baduser&projectId=badproject
- https://42-project-badge.netlify.app/api/users/rpinto-r/projects/libft

## References
- [netlify.com](https://www.netlify.com/blog/2021/12/12/how-to-test-serverless-functions-locally/) - How to test serverless functions locally

- https://docs.netlify.com/functions/build-with-javascript/
- https://answers.netlify.com/t/set-response-headers-in-redirect-in-netlify-function/10046
- https://www.netlify.com/blog/2021/12/13/setting-up-redirects-on-netlify/
- https://answers.netlify.com/t/querystringparameters-not-working-with-redirect-on-production/3828/33
- https://answers.netlify.com/t/querystringparameters-not-working-with-redirect-on-production/3828/3
- https://docs.netlify.com/functions/build-with-javascript/
- https://flaviocopes.com/netlify-functions-query-parameters/
- https://api.intra.42.fr/apidoc
- https://helpful-otter-33d500.netlify.app/.netlify/functions/hello
- https://developer.mozilla.org/fr/docs/Web/HTTP/Headers/Cache-Control
- https://docs.netlify.com/routing/redirects/#syntax-for-the-netlify-configuration-file
