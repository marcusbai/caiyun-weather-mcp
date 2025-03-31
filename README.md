# 彩云天气 MCP 服务器

基于彩云天气 API 的 Model Context Protocol (MCP) 服务器，提供天气数据查询功能。

## 功能特点

- **实时天气数据**：温度、湿度、风速、气压等
- **分钟级降水预报**：未来2小时的降水情况
- **小时级天气预报**：未来24小时或更长时间的天气预报
- **每日天气预报**：未来多天的天气预报
- **天气预警信息**：各类天气预警
- **地址查询**：支持通过地址查询天气（需配置高德地图API）
- **多语言支持**：支持中文和英文
- **单位制选择**：支持公制和英制

## 安装

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

在使用前，需要配置彩云天气API密钥。如果需要地址查询功能，还需要配置高德地图API密钥。

### 彩云天气API密钥

1. 访问 [彩云天气开发者中心](https://dashboard.caiyunapp.com/)
2. 注册并登录账号
3. 创建应用并获取API密钥

### 高德地图API密钥（可选）

1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 注册并登录账号
3. 创建应用并获取API密钥，需要启用"地理编码"服务

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
        "AMAP_API_KEY": "您的高德地图API密钥（可选）"
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
  "address": "北京市海淀区",
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
