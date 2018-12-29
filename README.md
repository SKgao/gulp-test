## TUTU-h5

图图教育。

### 安装依赖
```bash
$ npm install

```

### 启动项目
```bash
$ npm run dev

```

### 打包项目
```bash
$ npm run build

```

-----------------------------------------------

<font color=red>关于gulp插件打版本号的问题</font>
<font color=red>*(不推荐更新gulp-rev、gulp-rev-collector插件)*</font>

##### 打开node_modules\gulp-rev\index.js

```
  第135行 manifest[originalFile] = revisionedFile;
  更新为: manifest[originalFile] = originalFile + '?v=' + file.revHash;
```

##### node_modules\gulp-rev\node_modules\rev-path\index.js

```
  第10行 return filename + '-' + hash + ext;
  更新为: return filename + ext;
```
##### node_modules\gulp-rev-collector\index.js

```
  第40行 let cleanReplacement =  path.basename(json[key]).replace(new RegExp( opts.revSuffix ), '' );
　更新为 let cleanReplacement =  path.basename(json[key]).split('?')[0];
```
