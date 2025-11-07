import axios from 'axios';
import { GeocodingResponse } from './types.js';

export class GeocodeService {
  private apiKey: string | undefined;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  /**
   * 常见城市坐标映射
   */
  private cityCoordinates: { [key: string]: [number, number] } = {
    // 直辖市
    '北京': [116.3976, 39.9075],
    '北京市': [116.3976, 39.9075],
    '上海': [121.4737, 31.2304],
    '上海市': [121.4737, 31.2304],
    '天津': [117.1901, 39.1084],
    '天津市': [117.1901, 39.1084],
    '重庆': [106.5516, 29.5630],
    '重庆市': [106.5516, 29.5630],
    
    // 省会及主要城市
    '广州': [113.2644, 23.1291],
    '广州市': [113.2644, 23.1291],
    '深圳': [114.0579, 22.5431],
    '深圳市': [114.0579, 22.5431],
    '杭州': [120.1551, 30.2741],
    '杭州市': [120.1551, 30.2741],
    '南京': [118.7969, 32.0603],
    '南京市': [118.7969, 32.0603],
    '武汉': [114.3055, 30.5928],
    '武汉市': [114.3055, 30.5928],
    '成都': [104.0665, 30.5723],
    '成都市': [104.0665, 30.5723],
    '西安': [108.9402, 34.3416],
    '西安市': [108.9402, 34.3416],
    '长沙': [112.9825, 28.1959],
    '长沙市': [112.9825, 28.1959],
    '沈阳': [123.4315, 41.8057],
    '沈阳市': [123.4315, 41.8057],
    '大连': [121.6147, 38.9140],
    '大连市': [121.6147, 38.9140],
    '青岛': [120.3826, 36.0671],
    '青岛市': [120.3826, 36.0671],
    '厦门': [118.1102, 24.4905],
    '厦门市': [118.1102, 24.4905],
    '苏州': [120.5853, 31.2989],
    '苏州市': [120.5853, 31.2989],
    '郑州': [113.6254, 34.7466],
    '郑州市': [113.6254, 34.7466],
    '济南': [117.1205, 36.6520],
    '济南市': [117.1205, 36.6520],
    '哈尔滨': [126.5358, 45.8023],
    '哈尔滨市': [126.5358, 45.8023],
    '石家庄': [114.5149, 38.0428],
    '石家庄市': [114.5149, 38.0428],
    '太原': [112.5489, 37.8706],
    '太原市': [112.5489, 37.8706],
    '合肥': [117.2272, 31.8206],
    '合肥市': [117.2272, 31.8206],
    '南昌': [115.8922, 28.6765],
    '南昌市': [115.8922, 28.6765],
    '福州': [119.3063, 26.0745],
    '福州市': [119.3063, 26.0745],
    '南宁': [108.3669, 22.8176],
    '南宁市': [108.3669, 22.8176],
    '昆明': [102.8329, 24.8801],
    '昆明市': [102.8329, 24.8801],
    '贵阳': [106.7135, 26.5783],
    '贵阳市': [106.7135, 26.5783],
    '兰州': [103.8343, 36.0611],
    '兰州市': [103.8343, 36.0611],
    '西宁': [101.7782, 36.6171],
    '西宁市': [101.7782, 36.6171],
    '拉萨': [91.1322, 29.6604],
    '拉萨市': [91.1322, 29.6604],
    '呼和浩特': [111.7519, 40.8425],
    '呼和浩特市': [111.7519, 40.8425],
    '海口': [110.3312, 20.0458],
    '海口市': [110.3312, 20.0458],
    '银川': [106.2309, 38.4872],
    '银川市': [106.2309, 38.4872],
    '乌鲁木齐': [87.6177, 43.7928],
    '乌鲁木齐市': [87.6177, 43.7928]
  };

  /**
   * 将地址转换为经纬度坐标
   * @param address 地址字符串
   * @returns 经纬度坐标 [longitude, latitude]
   */
  async geocode(address: string): Promise<[number, number]> {
    try {
      // 首先检查是否是常见城市
      const cityKey = this.normalizeCityName(address);
      if (this.cityCoordinates[cityKey]) {
        console.log(`✓ 使用内置坐标缓存: ${address} -> [${this.cityCoordinates[cityKey][0]}, ${this.cityCoordinates[cityKey][1]}]`);
        return this.cityCoordinates[cityKey];
      }

      // 如果有高德地图API密钥，使用API服务
      if (this.apiKey) {
        console.log(`🔍 使用高德地图API解析地址: ${address}`);
        const response = await axios.get<GeocodingResponse>('https://restapi.amap.com/v3/geocode/geo', {
          params: {
            address,
            key: this.apiKey,
            output: 'JSON'
          }
        });
        
        if (response.data.status === '1' && response.data.geocodes.length > 0) {
          const location = response.data.geocodes[0].location.split(',');
          const coords = [parseFloat(location[0]), parseFloat(location[1])] as [number, number];
          console.log(`✓ API解析成功: ${address} -> [${coords[0]}, ${coords[1]}]`);
          return coords;
        } else {
          console.warn(`⚠️ 高德地图API无法解析地址: ${address}`);
        }
      }

      // 如果没有API密钥且不是常见城市，返回默认坐标（北京市中心）
      console.warn(`⚠️ 无法识别地址"${address}"，使用默认坐标（北京市中心）`);
      console.warn(`💡 建议: 配置高德地图API密钥以获得更准确的地址解析`);
      console.warn(`   设置环境变量: AMAP_API_KEY=您的高德地图API密钥`);
      console.warn(`   支持的常见城市: ${Object.keys(this.cityCoordinates).filter(key => !key.endsWith('市')).join('、')}`);
      return [116.3976, 39.9075]; // 北京市中心坐标
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.warn(`❌ 地理编码API调用失败: ${error.response?.data?.info || error.message}`);
        console.warn(`💡 建议检查高德地图API密钥配置是否正确`);
      } else {
        console.warn(`❌ 地址解析出错: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      // 出错时返回默认坐标
      console.warn(`📍 使用默认坐标（北京市中心）`);
      return [116.3976, 39.9075];
    }
  }

  /**
   * 标准化城市名称，用于匹配缓存
   * @param address 原始地址
   * @returns 标准化的城市名称
   */
  private normalizeCityName(address: string): string {
    // 移除空格和特殊字符
    let normalized = address.trim();
    
    // 如果地址包含省市信息，提取主要城市名
    const cityPatterns = [
      /^(.+?)市.+$/,  // "上海市浦东新区" -> "上海市"
      /^(.+?)省.+$/,  // "浙江省杭州市" -> "浙江省杭州市"
      /^(.+?)区.+$/,  // "黄浦区南京东路" -> "黄浦区"（如果有区级数据的话）
    ];
    
    for (const pattern of cityPatterns) {
      const match = normalized.match(pattern);
      if (match) {
        normalized = match[1];
        break;
      }
    }
    
    // 处理一些常见的别名
    const aliases: { [key: string]: string } = {
      '申城': '上海市',
      '魔都': '上海市',
      '帝都': '北京市',
      '京城': '北京市',
      '羊城': '广州市',
      '鹏城': '深圳市',
      '津门': '天津市',
      '山城': '重庆市',
      '蓉城': '成都市',
      '江城': '武汉市',
      '古都': '西安市',
      '金陵': '南京市',
      '钱塘': '杭州市',
    };
    
    if (aliases[normalized]) {
      normalized = aliases[normalized];
    }
    
    return normalized;
  }

  /**
   * 获取支持的城市列表
   * @returns 支持的城市名称数组
   */
  getSupportedCities(): string[] {
    return Object.keys(this.cityCoordinates).filter(city => !city.endsWith('市'));
  }

  /**
   * 获取默认坐标（北京市中心）
   * @returns 默认坐标 [longitude, latitude]
   */
  getDefaultCoordinates(): [number, number] {
    return [116.3976, 39.9075]; // 北京市中心坐标
  }
}
