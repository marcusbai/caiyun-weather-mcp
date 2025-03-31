#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { CaiyunWeatherService } from './caiyun-service.js';
import { GeocodeService } from './geocode-service.js';

// 获取API密钥
// 1. 从环境变量获取
// 2. 从命令行参数获取
// 3. 如果都没有，提供明确的错误信息
let caiyunApiKey = process.env.CAIYUN_API_KEY;
const AMAP_API_KEY = process.env.AMAP_API_KEY;

// 检查命令行参数
if (!caiyunApiKey) {
  // 查找命令行参数中是否有API密钥
  const apiKeyArg = process.argv.find(arg => arg.startsWith('--api-key='));
  if (apiKeyArg) {
    caiyunApiKey = apiKeyArg.split('=')[1];
  }
}

if (!caiyunApiKey) {
  console.error('错误: 未提供彩云天气API密钥');
  console.error('请使用以下方式之一提供API密钥:');
  console.error('1. 设置环境变量: CAIYUN_API_KEY=您的密钥 node dist/index.js');
  console.error('2. 使用命令行参数: node dist/index.js --api-key=您的密钥');
  console.error('3. 在MCP设置文件中配置环境变量');
  process.exit(1);
}

class CaiyunWeatherMcpServer {
  private server: Server;
  private weatherService: CaiyunWeatherService;
  private geocodeService: GeocodeService;

  constructor() {
    this.server = new Server(
      {
        name: 'caiyun-weather-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.weatherService = new CaiyunWeatherService(caiyunApiKey as string);
    this.geocodeService = new GeocodeService(AMAP_API_KEY || undefined);

    this.setupToolHandlers();
    
    // 错误处理
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'get_weather_by_location',
          description: '根据经纬度获取天气信息',
          inputSchema: {
            type: 'object',
            properties: {
              longitude: {
                type: 'number',
                description: '经度',
              },
              latitude: {
                type: 'number',
                description: '纬度',
              },
              daily_steps: {
                type: 'number',
                description: '每日预报天数 (1-15)',
                minimum: 1,
                maximum: 15,
                default: 5,
              },
              hourly_steps: {
                type: 'number',
                description: '小时预报数量 (1-360)',
                minimum: 1,
                maximum: 360,
                default: 24,
              },
              language: {
                type: 'string',
                enum: ['zh_CN', 'en_US'],
                description: '语言',
                default: 'zh_CN',
              },
              unit: {
                type: 'string',
                enum: ['metric', 'imperial'],
                description: '单位制 (metric: 公制, imperial: 英制)',
                default: 'metric',
              },
            },
            required: ['longitude', 'latitude'],
          },
        },
        {
          name: 'get_weather_by_address',
          description: '根据地址获取天气信息',
          inputSchema: {
            type: 'object',
            properties: {
              address: {
                type: 'string',
                description: '地址，如"北京市海淀区"',
              },
              daily_steps: {
                type: 'number',
                description: '每日预报天数 (1-15)',
                minimum: 1,
                maximum: 15,
                default: 5,
              },
              hourly_steps: {
                type: 'number',
                description: '小时预报数量 (1-360)',
                minimum: 1,
                maximum: 360,
                default: 24,
              },
              language: {
                type: 'string',
                enum: ['zh_CN', 'en_US'],
                description: '语言',
                default: 'zh_CN',
              },
              unit: {
                type: 'string',
                enum: ['metric', 'imperial'],
                description: '单位制 (metric: 公制, imperial: 英制)',
                default: 'metric',
              },
            },
            required: ['address'],
          },
        },
        {
          name: 'get_realtime_weather',
          description: '获取实时天气数据',
          inputSchema: {
            type: 'object',
            properties: {
              longitude: {
                type: 'number',
                description: '经度',
              },
              latitude: {
                type: 'number',
                description: '纬度',
              },
              language: {
                type: 'string',
                enum: ['zh_CN', 'en_US'],
                description: '语言',
                default: 'zh_CN',
              },
              unit: {
                type: 'string',
                enum: ['metric', 'imperial'],
                description: '单位制 (metric: 公制, imperial: 英制)',
                default: 'metric',
              },
            },
            required: ['longitude', 'latitude'],
          },
        },
        {
          name: 'get_minutely_forecast',
          description: '获取分钟级降水预报',
          inputSchema: {
            type: 'object',
            properties: {
              longitude: {
                type: 'number',
                description: '经度',
              },
              latitude: {
                type: 'number',
                description: '纬度',
              },
              language: {
                type: 'string',
                enum: ['zh_CN', 'en_US'],
                description: '语言',
                default: 'zh_CN',
              },
              unit: {
                type: 'string',
                enum: ['metric', 'imperial'],
                description: '单位制 (metric: 公制, imperial: 英制)',
                default: 'metric',
              },
            },
            required: ['longitude', 'latitude'],
          },
        },
        {
          name: 'get_hourly_forecast',
          description: '获取小时级天气预报',
          inputSchema: {
            type: 'object',
            properties: {
              longitude: {
                type: 'number',
                description: '经度',
              },
              latitude: {
                type: 'number',
                description: '纬度',
              },
              hourly_steps: {
                type: 'number',
                description: '小时预报数量 (1-360)',
                minimum: 1,
                maximum: 360,
                default: 24,
              },
              language: {
                type: 'string',
                enum: ['zh_CN', 'en_US'],
                description: '语言',
                default: 'zh_CN',
              },
              unit: {
                type: 'string',
                enum: ['metric', 'imperial'],
                description: '单位制 (metric: 公制, imperial: 英制)',
                default: 'metric',
              },
            },
            required: ['longitude', 'latitude'],
          },
        },
        {
          name: 'get_daily_forecast',
          description: '获取天级天气预报',
          inputSchema: {
            type: 'object',
            properties: {
              longitude: {
                type: 'number',
                description: '经度',
              },
              latitude: {
                type: 'number',
                description: '纬度',
              },
              daily_steps: {
                type: 'number',
                description: '每日预报天数 (1-15)',
                minimum: 1,
                maximum: 15,
                default: 5,
              },
              language: {
                type: 'string',
                enum: ['zh_CN', 'en_US'],
                description: '语言',
                default: 'zh_CN',
              },
              unit: {
                type: 'string',
                enum: ['metric', 'imperial'],
                description: '单位制 (metric: 公制, imperial: 英制)',
                default: 'metric',
              },
            },
            required: ['longitude', 'latitude'],
          },
        },
        {
          name: 'get_weather_alert',
          description: '获取天气预警信息',
          inputSchema: {
            type: 'object',
            properties: {
              longitude: {
                type: 'number',
                description: '经度',
              },
              latitude: {
                type: 'number',
                description: '纬度',
              },
              language: {
                type: 'string',
                enum: ['zh_CN', 'en_US'],
                description: '语言',
                default: 'zh_CN',
              },
              unit: {
                type: 'string',
                enum: ['metric', 'imperial'],
                description: '单位制 (metric: 公制, imperial: 英制)',
                default: 'metric',
              },
            },
            required: ['longitude', 'latitude'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args = {} } = request.params;
        
        // 创建特定语言和单位的天气服务实例
        const language = (args.language || 'zh_CN') as 'zh_CN' | 'en_US';
        const unit = (args.unit || 'metric') as 'metric' | 'imperial';
        const weatherService = new CaiyunWeatherService(caiyunApiKey as string, language, unit);

        switch (name) {
          case 'get_weather_by_location': {
            if (!this.isValidLocationArgs(args)) {
              throw new McpError(
                ErrorCode.InvalidParams,
                '无效的位置参数'
              );
            }
            
            const { longitude, latitude, daily_steps = 5, hourly_steps = 24 } = args;
            
            const weatherData = await weatherService.getWeather(
              longitude, 
              latitude, 
              daily_steps, 
              hourly_steps
            );
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(weatherService.formatWeatherData(weatherData), null, 2),
                },
              ],
            };
          }
          
          case 'get_weather_by_address': {
            if (!this.isValidAddressArgs(args)) {
              throw new McpError(
                ErrorCode.InvalidParams,
                '无效的地址参数'
              );
            }
            
            const { address, daily_steps = 5, hourly_steps = 24 } = args;
            
            // 将地址转换为经纬度
            const [longitude, latitude] = await this.geocodeService.geocode(address);
            
            const weatherData = await weatherService.getWeather(
              longitude, 
              latitude, 
              daily_steps, 
              hourly_steps
            );
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(weatherService.formatWeatherData(weatherData), null, 2),
                },
              ],
            };
          }
          
          case 'get_realtime_weather': {
            if (!this.isValidLocationArgs(args)) {
              throw new McpError(
                ErrorCode.InvalidParams,
                '无效的位置参数'
              );
            }
            
            const { longitude, latitude } = args;
            
            const weatherData = await weatherService.getRealtime(longitude, latitude);
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(weatherService.formatRealtimeData(weatherData), null, 2),
                },
              ],
            };
          }
          
          case 'get_minutely_forecast': {
            if (!this.isValidLocationArgs(args)) {
              throw new McpError(
                ErrorCode.InvalidParams,
                '无效的位置参数'
              );
            }
            
            const { longitude, latitude } = args;
            
            const weatherData = await weatherService.getMinutely(longitude, latitude);
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(weatherService.formatMinutelyData(weatherData), null, 2),
                },
              ],
            };
          }
          
          case 'get_hourly_forecast': {
            if (!this.isValidLocationArgs(args)) {
              throw new McpError(
                ErrorCode.InvalidParams,
                '无效的位置参数'
              );
            }
            
            const { longitude, latitude, hourly_steps = 24 } = args;
            
            const weatherData = await weatherService.getHourly(longitude, latitude, hourly_steps);
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(weatherService.formatHourlyData(weatherData), null, 2),
                },
              ],
            };
          }
          
          case 'get_daily_forecast': {
            if (!this.isValidLocationArgs(args)) {
              throw new McpError(
                ErrorCode.InvalidParams,
                '无效的位置参数'
              );
            }
            
            const { longitude, latitude, daily_steps = 5 } = args;
            
            const weatherData = await weatherService.getDaily(longitude, latitude, daily_steps);
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(weatherService.formatDailyData(weatherData), null, 2),
                },
              ],
            };
          }
          
          case 'get_weather_alert': {
            if (!this.isValidLocationArgs(args)) {
              throw new McpError(
                ErrorCode.InvalidParams,
                '无效的位置参数'
              );
            }
            
            const { longitude, latitude } = args;
            
            const weatherData = await weatherService.getAlert(longitude, latitude);
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(weatherService.formatAlertData(weatherData), null, 2),
                },
              ],
            };
          }
          
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `未知工具: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        
        return {
          content: [
            {
              type: 'text',
              text: `错误: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private isValidLocationArgs(args: any): args is { longitude: number; latitude: number; daily_steps?: number; hourly_steps?: number } {
    return (
      typeof args === 'object' &&
      args !== null &&
      typeof args.longitude === 'number' &&
      typeof args.latitude === 'number' &&
      (args.daily_steps === undefined || typeof args.daily_steps === 'number') &&
      (args.hourly_steps === undefined || typeof args.hourly_steps === 'number')
    );
  }

  private isValidAddressArgs(args: any): args is { address: string; daily_steps?: number; hourly_steps?: number } {
    return (
      typeof args === 'object' &&
      args !== null &&
      typeof args.address === 'string' &&
      (args.daily_steps === undefined || typeof args.daily_steps === 'number') &&
      (args.hourly_steps === undefined || typeof args.hourly_steps === 'number')
    );
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Caiyun Weather MCP server running on stdio');
  }
}

const server = new CaiyunWeatherMcpServer();
server.run().catch(console.error);
