# 安装 lerna

- `yarn global add lerna` / `npm install -g lerna`
- `lerna init --independent`

这步会在`lerna.json`里添加 "version": "independent"

# 使用 yarn workspace

修改 lerna.json 增加：

```json
"npmClient": "yarn",
"useWorkspaces": true
```

修改 package.json

```json
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

# 创建两个示例包 `app`,`log`

两个示例包都是 `Typescript` 的，我们使用 `Babel` 编译，`rollup` 打包，需要下边这些依赖。

```json
"devDependencies": {
    "typescript": "^3.7.2",
    "@babel/cli": "^7.7.0",
    "@babel/core": "^7.7.2",
    "@babel/plugin-proposal-class-properties": "^7.7.0",
    "@babel/plugin-proposal-numeric-separator": "^7.2.0",
    "@babel/plugin-proposal-object-rest-spread": "^7.6.2",
    "@babel/preset-typescript": "^7.7.2",
    "rimraf": "^3.0.0",
    "rollup": "^1.27.2",
    "rollup-plugin-babel": "^4.3.3",
    "rollup-plugin-generate-html-template": "^1.6.0",
    "rollup-plugin-node-resolve": "^5.2.0",
    "rollup-plugin-terser": "^5.1.2"
  }
```

`/packages/app/package.json`

```json
{
  "name": "@ts-lernarepo/app",
  "version": "0.0.1",
  "module": "dist/index",
  "types": "dist/index",
  "devDependencies": {
    "typescript": "^3.7.2",
    "@babel/cli": "^7.7.0",
    "@babel/core": "^7.7.2",
    "@babel/plugin-proposal-class-properties": "^7.7.0",
    "@babel/plugin-proposal-numeric-separator": "^7.2.0",
    "@babel/plugin-proposal-object-rest-spread": "^7.6.2",
    "@babel/preset-typescript": "^7.7.2",
    "rimraf": "^3.0.0",
    "rollup": "^1.27.2",
    "rollup-plugin-babel": "^4.3.3",
    "rollup-plugin-generate-html-template": "^1.6.0",
    "rollup-plugin-node-resolve": "^5.2.0",
    "rollup-plugin-terser": "^5.1.2"
  }
}
```

`/packages/log/package.json`

```json
{
  "name": "@ts-lernarepo/log",
  "version": "0.0.1",
  "module": "dist/index",
  "types": "dist/index",
  "devDependencies": {
    "typescript": "^3.7.2",
    "@babel/cli": "^7.7.0",
    "@babel/core": "^7.7.2",
    "@babel/plugin-proposal-class-properties": "^7.7.0",
    "@babel/plugin-proposal-numeric-separator": "^7.2.0",
    "@babel/plugin-proposal-object-rest-spread": "^7.6.2",
    "@babel/preset-typescript": "^7.7.2",
    "rimraf": "^3.0.0",
    "rollup": "^1.27.2",
    "rollup-plugin-babel": "^4.3.3",
    "rollup-plugin-generate-html-template": "^1.6.0",
    "rollup-plugin-node-resolve": "^5.2.0",
    "rollup-plugin-terser": "^5.1.2"
  }
}
```

运行 `lerna bootstrap` 安装依赖 , 因为是`workspace`模式，所以所有依赖都会装在根目录，两个项目不会装两次。

```
├── lerna.json
├── package.json
└── packages
    ├── app
    │   ├── package.json
    │   └── src
    │       └── index.ts
    └── log
        ├── package.json
        └── src
              └── index.ts
```

# TypeScript 编译配置

在根目录运行 `tsc --init` 并改名为 `tsconfig.base.json`，所有子包都会继承这个配置

```json
{
  "compilerOptions": {
    "baseUrl": "./packages",
    "paths": {
      "@ts-lernarepo/*": ["*/src/index"] //子包映射到对应目录
    },
    "target": "ESNEXT",  
    "module": "ESNEXT",  
    "declaration": true,
    "sourceMap": true,
    "strict": false,
    "esModuleInterop": true 
  }
}
```

`app` 和 `log` 子包里建立 `tsconfig.json` ，两个子包用同样的内容

```json
{
    "extends": "../../tsconfig.base.json"
}
```

由于我们用`Babel`编译，而不是`tsc`，所以需要`.babelrc` 文件

```json
{
    "presets": [
        "@babel/typescript"
    ],
    "plugins": [
        "@babel/plugin-proposal-numeric-separator",
        "@babel/proposal-class-properties",
        "@babel/proposal-object-rest-spread"
    ]
}
```

目前的目录结构

```
├── lerna.json
├── package.json
├── packages
│   ├── app
│   │   ├── package.json
│   │   ├── src
│   │   │   └── index.ts
│   │   └── tsconfig.json
│   └── log
│       ├── package.json
│       ├── src
│       │   └── index.ts
│       └── tsconfig.json
└── tsconfig.base.json
```

# rollup 打包

在 `app` 与 `log` 中分别建立相同的 `rollup.config.js`

```javascript
import pkg from './package.json';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

const extensions = ['.ts'];

export default [{
    input: './src/index.ts',
    external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [
        resolve({ extensions }),
        babel({ extensions, include: ['./src/**/*'] }),
    ],
    output: [
        { file: pkg.module, format: 'es' },
    ],
    watch: {
        chokidar: {
            usePolling: true
        }
    }
}];
```

`app` 和 `log` 包的 `package.json` 中加入编译命令

```json
  "scripts": {
    "build": "rimraf dist/* && rollup -c",
    "watch": "rimraf dist/* && rollup -c -w"
  } 
```

再加入`.gitignore` ，新目录如下

```
├── lerna.json
├── package.json
├── yarn.lock
├── .gitignore 
├── packages
│   ├── app
│   │   ├── src
│   │   │   └── index.ts
│   │   ├── .babelrc
│   │   ├── package.json
│   │   ├── rollup.config.js
│   │   └── tsconfig.json
│   └── log
│       ├── src
│       │   └── index.ts
│       ├── .babelrc
│       ├── package.json
│       ├── rollup.config.js
│       └── tsconfig.json
└── tsconfig.base.json
```

# 子包之间的依赖

由于 `app` 是依赖 `log` 的，所以在 `app` 的 `package.json` 下应该有依赖 `log`

```json
  "dependencies": {
    "@ts-lernarepo/log": "0.0.1"
  }
```