- `yarn global add lerna` / `npm install -g lerna`
- `lerna init --independent`

这步会在`lerna.json`里添加 "version": "independent"

## 使用 yarn workspace

修改 lerna.json 增加：

```
"npmClient": "yarn",
"useWorkspaces": true
```

修改 package.json

```
{
  "name": "ts-lernarepo",
  "private": true, // 必须为true
  "devDependencies": {
    "lerna": "^3.19.0"
  },
  // 增加workspaces
  "workspaces": [
    "packages/*"
  ]
}
```