# 菌鲜达 MVP

昆明野生菌同城配送平台第一版演示原型，包含 C 端市集、商品详情、菌百科及管理后台（经营概览、商品、行情、客户 CRM）。所有业务数据均为本地 Mock 数据。

## 运行

```bash
cd E:\kunming-mushroom-mvp
npm install
npm run dev
```

浏览器打开 `http://localhost:3000`；后台入口为 `http://localhost:3000/admin`。

## 技术栈

Next.js App Router、TypeScript、Tailwind CSS；组件采用可复用的轻量 UI 层，便于后续替换为 shadcn/ui 完整组件与真实接口。
