# 🧧 Knowledge-Redpack (接财智/知识竞赛红包)

> 基于 Uni-app + Vue3 + WebSocket + 微信官方支付接口构建的熟人社交“赞助-竞赛-合规派彩”全栈解决方案。

---

## 💡 项目简介 (Project Overview)

**Knowledge-Redpack** 是一款专为春节家族聚会、熟人社交与社群破冰打造的互动小游戏平台。

项目采用 **“长辈/赞助人注入资金池 ➔ 晚辈/全员实时知识抢答 ➔ 微信零钱合规派发”** 的闭环模式，搭配 **“阳光保底 + 竞技积分 + 实时打赏”** 结算算法，将传统的单向发红包升级为全场参与的客厅互动游戏。

底层采用配置驱动（Config-driven）架构，支持在后台快速无缝切换场景（春节/暑假激励/班级复习/企业团建）与题库。

---

## ✨ 核心特性 (Key Features)

* **🎮 多人实时对决**：基于 WebSocket 实现毫秒级答题同步与实时积分排行榜。
* **💰 微信合规派彩**：直连微信官方 API（JSAPI 支付入金 + 商家转账到零钱出金），资金不经过私域资金池。
* **🧮 兼顾和谐的算法**：采用“30% 阳光保底 + 70% 竞技积分 + 100% 实时打赏”的复合分配模型。
* **🛡️ 完善的风控后台**：提供充值/提现流水核算、网络异常一键重试补发、房主原路退款及黑名单拦截。
* **📚 题库与分类管理**：支持成语/诗词/英语/家族私房题等分类的快速上下架与 Excel 批量导入。

---

## 🛠️ 技术栈 (Tech Stack)

### 前端 (Frontend)
* **小程序/客户端**：Uni-app / Vue3 / Vite
* **后台管理系统**：Vue3 / Element Plus / Axios

### 后端 (Backend)
* **API 与 通信**：WebSocket / RESTful API
* **核心依赖**：微信支付 V3 SDK (JSAPI 支付 + 商家转账到零钱)

### 数据库 (Database)
* **MySQL 8.0+**（数据表前缀：`kr_`）

---

## 🗂️ 仓库目录结构 (Project Architecture)

```text
knowledge-redpack/
├── kr-app/                # Uni-app 移动端/小程序源码
├── kr-admin/              # Vue3 后台管理系统前端
├── kr-server/             # 后端 API 与 WebSocket 实时对局服务
└── kr-db/                 # 数据库初始化 SQL 脚本 (kr_*.sql)
