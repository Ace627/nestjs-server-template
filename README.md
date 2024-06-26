# NestJS Server Template

## 项目安装

```bash
git clone https://github.com/Ace627/nestjs-server-template.git

cd nestjs-server-template

pnpm install

pnpm start:dev
```

## 目录参考

```bash
|-src
| |-config                              # 环境变量配置目录
|   |-config.development.ts             # 测试环境配置文件
|   |-config.production.ts              # 正式环境配置文件
|   |-defineConfig.ts                   # 用于智能提示 & 环境变量类型接口定义
```

## 使用须知

- 请务必在 `src/config` 目录下，修改 `MySQL` 和 `Redis` 的配置为自己当前的配置，否则无法启动

## 参考文献

- [NestJS 中文文档](http://nestjs.inode.club)
- [MySQL Community Downloads](https://dev.mysql.com/downloads/installer)
- [formData 混合表单 axios 提交，后台无法读取 req.body](https://www.jianshu.com/p/896179ff84e9)
