# 42 Project Badge

## :placard: Overview
Generate a score badge for your 42 projects, for this I use the 42 api and the Shields.io

## :joystick: Usage

1. It's simple, just change:
- `:login42:` by your username
- `:project42:` by your project name `libft`, `get-next-line`, `born2beroot`, `push-swap`, `exam-rank-02`, `cpp-module-00`, etc..
```
[![42 Project Score](https://42-project-badge.glitch.me/users/:login42:/project/:project42:)](https://github.com/ricardoreves/42-project-badge)
``` 
2. Paste the code in your README, and it's done !
#### Demo
[![Score](https://42-project-badge.glitch.me/users/rpinto-r/project/libft)](https://github.com/ricardoreves/42-project-badge)

### Get the list of your projects
1. `:login42:` by your username
```
https://42-project-badge.glitch.me/users/:login42:/projects
```
2. Open link in new tab or use curl
```
curl https://42-project-badge.glitch.me/users/rpinto-r/projects
```

## :books: References
- [shields.io](https://shields.io/) - We serve fast and scalable informational images as badges for GitHub
- [42api](https://api.intra.42.fr/apidoc) - The 42 API provide programmatic access to read and write 42's data.
