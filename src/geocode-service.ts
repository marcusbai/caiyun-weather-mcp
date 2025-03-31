import axios from 'axios';
import { GeocodingResponse } from './types.js';

export class GeocodeService {
  private apiKey: string | undefined;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  /**
   * 将地址转换为经纬度坐标
   * @param address 地址字符串
   * @returns 经纬度坐标 [longitude, latitude]
   */
  async geocode(address: string): Promise<[number, number]> {
    try {
      // 如果没有高德地图API密钥，使用默认坐标（北京市中心）
      if (!this.apiKey) {
        console.warn('No AMap API key provided, using default coordinates for Beijing');
        return [116.3976, 39.9075]; // 北京市中心坐标
      }

      const response = await axios.get<GeocodingResponse>('https://restapi.amap.com/v3/geocode/geo', {
        params: {
          address,
          key: this.apiKey,
          output: 'JSON'
        }
      });
      
      if (response.data.status === '1' && response.data.geocodes.length > 0) {
        const location = response.data.geocodes[0].location.split(',');
        return [parseFloat(location[0]), parseFloat(location[1])];
      }
      
      throw new Error(`无法找到地址: ${address}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`地理编码错误: ${error.response?.data?.info || error.message}`);
      }
      throw error;
    }
  }

  /**
   * 获取默认坐标（北京市中心）
   * @returns 默认坐标 [longitude, latitude]
   */
  getDefaultCoordinates(): [number, number] {
    return [116.3976, 39.9075]; // 北京市中心坐标
  }
}
