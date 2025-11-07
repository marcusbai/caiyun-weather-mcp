# 彩云天气 MCP 服务器
[![smithery badge](https://smithery.ai/badge/@marcusbai/caiyun-weather-mcp)](https://smithery.ai/server/@marcusbai/caiyun-weather-mcp)

基于彩云天气 API 的 Model Context Protocol (MCP) 服务器，提供天气数据查询功能。

## 功能特点

- **实时天气数据**：温度、湿度、风速、气压、能见度等
- **分钟级降水预报**：未来2小时的降水情况
- **小时级天气预报**：未来24小时或更长时间的天气预报
- **每日天气预报**：未来多天的天气预报
- **天气预警信息**：各类天气预警
- **空气质量趋势**：24小时空气质量变化趋势和主要污染物分析
- **详细生活指数**：运动、旅行、洗车、穿衣等详细生活建议
- **降水类型识别**：区分雨、雪、雨夹雪、冰雹等降水类型
- **地址查询**：支持通过地址查询天气，内置35个主要城市坐标缓存，无需额外配置即可使用
- **多语言支持**：支持中文和英文
- **单位制选择**：支持公制和英制

## 安装

### 安装 Smithery

通过 [Smithery](https://smithery.ai/server/@pepperai/caiyun-weather-mcp) 安装 彩云天气 对于Claude的桌面应用：

```bash
npm install @smithery/cli -g
smithery install @pepperai/caiyun-weather-mcp
```

### 通过 NPX 使用

您可以直接通过 NPX 运行：

```bash
npx caiyun-weather-mcp --api-key=您的彩云天气API密钥
```

或者设置环境变量：

```bash
CAIYUN_API_KEY=您的密钥 npx caiyun-weather-mcp
```

### 从源码安装

1. 克隆仓库：

```bash
git clone https://github.com/marcusbai/caiyun-weather-mcp.git
cd caiyun-weather-mcp
```

2. 安装依赖：

```bash
npm install
```

> **注意**：本项目依赖于 Model Context Protocol (MCP) SDK，该SDK需要在运行环境中可用。MCP SDK通常由Claude或其他支持MCP的应用程序提供。

3. 构建项目：

```bash
npm run build
```

## 配置

在使用前，需要配置彩云天气API密钥。地址查询功能支持内置城市缓存，高德地图API密钥为推荐配置。

### 彩云天气API密钥

1. 访问 [彩云天气开发者中心](https://dashboard.caiyunapp.com/)
2. 注册并登录账号
3. 创建应用并获取API密钥

### 高德地图API密钥（推荐）

1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 注册并登录账号
3. 创建应用并获取API密钥，需要启用"地理编码"服务

> **💡 提示**：高德地图API密钥为推荐配置。系统内置了35个主要城市的坐标缓存，包括所有直辖市、省会城市和经济发达城市，无需额外配置即可使用。

## 地址解析功能

### 支持的城市

系统内置了以下35个主要城市的坐标缓存：

**直辖市**：北京、上海、天津、重庆

**省会及主要城市**：广州、深圳、杭州、南京、武汉、成都、西安、长沙、沈阳、大连、青岛、厦门、苏州、郑州、济南、哈尔滨、石家庄、太原、合肥、南昌、福州、南宁、昆明、贵阳、兰州、西宁、拉萨、呼和浩特、海口、银川、乌鲁木齐

### 智能地址匹配

支持多种地址格式和智能匹配：

- **标准格式**：`上海`、`上海市`
- **详细地址**：`上海市浦东新区`、`北京市朝阳区`
- **城市别名**：`魔都`→上海、`帝都`→北京、`羊城`→广州、`鹏城`→深圳等

### 地址解析策略

1. **缓存优先**：内置城市坐标立即返回
2. **API增强**：配置高德API后支持任意地址
3. **降级处理**：未知地址返回北京坐标并提示配置

## 配置MCP设置

编辑MCP设置文件，添加彩云天气MCP服务器配置：

```json
{
  "mcpServers": {
    "caiyun-weather": {
      "command": "node",
      "args": ["完整路径/caiyun-weather-mcp/dist/index.js"],
      "env": {
        "CAIYUN_API_KEY": "您的彩云天气API密钥",
        "AMAP_API_KEY": "您的高德地图API密钥（推荐）"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

如果您通过 NPX 安装了本服务，可以使用以下配置：

```json
{
  "mcpServers": {
    "caiyun-weather": {
      "command": "npx",
      "args": ["caiyun-weather-mcp"],
      "env": {
        "CAIYUN_API_KEY": "您的彩云天气API密钥",
        "AMAP_API_KEY": "您的高德地图API密钥（推荐）"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

## 使用示例

### 根据经纬度获取天气信息

```
<use_mcp_tool>
<server_name>caiyun-weather</server_name>
<tool_name>get_weather_by_location</tool_name>
<arguments>
{
  "longitude": 116.3976,
  "latitude": 39.9075,
  "daily_steps": 5,
  "hourly_steps": 24,
  "language": "zh_CN",
  "unit": "metric"
}
</arguments>
</use_mcp_tool>
```

### 根据地址获取天气信息

```
<use_mcp_tool>
<server_name>caiyun-weather</server_name>
<tool_name>get_weather_by_address</tool_name>
<arguments>
{
  "address": "上海市",
  "daily_steps": 5,
  "hourly_steps": 24,
  "language": "zh_CN",
  "unit": "metric"
}
</arguments>
</use_mcp_tool>
```

### 获取实时天气数据

```
<use_mcp_tool>
<server_name>caiyun-weather</server_name>
<tool_name>get_realtime_weather</tool_name>
<arguments>
{
  "longitude": 116.3976,
  "latitude": 39.9075,
  "language": "zh_CN",
  "unit": "metric"
}
</arguments>
</use_mcp_tool>
```

### 获取分钟级降水预报

```
<use_mcp_tool>
<server_name>caiyun-weather</server_name>
<tool_name>get_minutely_forecast</tool_name>
<arguments>
{
  "longitude": 116.3976,
  "latitude": 39.9075,
  "language": "zh_CN",
  "unit": "metric"
}
</arguments>
</use_mcp_tool>
```

### 获取小时级天气预报

```
<use_mcp_tool>
<server_name>caiyun-weather</server_name>
<tool_name>get_hourly_forecast</tool_name>
<arguments>
{
  "longitude": 116.3976,
  "latitude": 39.9075,
  "hourly_steps": 24,
  "language": "zh_CN",
  "unit": "metric"
}
</arguments>
</use_mcp_tool>
```

### 获取每日天气预报

```
<use_mcp_tool>
<server_name>caiyun-weather</server_name>
<tool_name>get_daily_forecast</tool_name>
<arguments>
{
  "longitude": 116.3976,
  "latitude": 39.9075,
  "daily_steps": 5,
  "language": "zh_CN",
  "unit": "metric"
}
</arguments>
</use_mcp_tool>
```

### 获取天气预警信息

```
<use_mcp_tool>
<server_name>caiyun-weather</server_name>
<tool_name>get_weather_alert</tool_name>
<arguments>
{
  "longitude": 116.3976,
  "latitude": 39.9075,
  "language": "zh_CN",
  "unit": "metric"
}
</arguments>
</use_mcp_tool>
```

### 获取空气质量趋势

```
<use_mcp_tool>
<server_name>caiyun-weather</server_name>
<tool_name>get_air_quality_trend</tool_name>
<arguments>
{
  "longitude": 116.3976,
  "latitude": 39.9075,
  "language": "zh_CN",
  "unit": "metric"
}
</arguments>
</use_mcp_tool>
```

### 获取详细生活指数

```
<use_mcp_tool>
<server_name>caiyun-weather</server_name>
<tool_name>get_detailed_life_index</tool_name>
<arguments>
{
  "longitude": 116.3976,
  "latitude": 39.9075,
  "language": "zh_CN",
  "unit": "metric"
}
</arguments>
</use_mcp_tool>
```

## 参数说明

### 通用参数

- `longitude`：经度
- `latitude`：纬度
- `address`：地址（仅用于 `get_weather_by_address`）
- `daily_steps`：每日预报天数（1-15，默认5）
- `hourly_steps`：小时预报数量（1-360，默认24）
- `language`：语言（`zh_CN` 或 `en_US`，默认 `zh_CN`）
- `unit`：单位制（`metric` 或 `imperial`，默认 `metric`）

## 许可证

MIT
