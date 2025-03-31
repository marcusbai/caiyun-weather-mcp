import axios from 'axios';
import { CaiyunWeatherResponse, skyconMap, skyconMapEn } from './types.js';

export class CaiyunWeatherService {
  private apiKey: string;
  private baseUrl = 'https://api.caiyunapp.com/v2.6';
  private language: 'zh_CN' | 'en_US';
  private unit: 'metric' | 'imperial';

  constructor(apiKey: string, language: 'zh_CN' | 'en_US' = 'zh_CN', unit: 'metric' | 'imperial' = 'metric') {
    this.apiKey = apiKey;
    this.language = language;
    this.unit = unit;
  }

  /**
   * 获取实时天气数据
   * @param longitude 经度
   * @param latitude 纬度
   * @returns 实时天气数据
   */
  async getRealtime(longitude: number, latitude: number): Promise<CaiyunWeatherResponse> {
    try {
      const url = `${this.baseUrl}/${this.apiKey}/${longitude},${latitude}/realtime`;
      const response = await axios.get<CaiyunWeatherResponse>(url, {
        params: {
          lang: this.language,
          unit: this.unit
        }
      });
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`彩云天气API错误: ${error.response?.data?.error || error.message}`);
      }
      throw error;
    }
  }

  /**
   * 获取分钟级降水预报
   * @param longitude 经度
   * @param latitude 纬度
   * @returns 分钟级降水预报数据
   */
  async getMinutely(longitude: number, latitude: number): Promise<CaiyunWeatherResponse> {
    try {
      const url = `${this.baseUrl}/${this.apiKey}/${longitude},${latitude}/minutely`;
      const response = await axios.get<CaiyunWeatherResponse>(url, {
        params: {
          lang: this.language,
          unit: this.unit
        }
      });
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`彩云天气API错误: ${error.response?.data?.error || error.message}`);
      }
      throw error;
    }
  }

  /**
   * 获取小时级天气预报
   * @param longitude 经度
   * @param latitude 纬度
   * @param hourlysteps 小时数（1-360）
   * @returns 小时级天气预报数据
   */
  async getHourly(longitude: number, latitude: number, hourlysteps: number = 24): Promise<CaiyunWeatherResponse> {
    try {
      const url = `${this.baseUrl}/${this.apiKey}/${longitude},${latitude}/hourly`;
      const response = await axios.get<CaiyunWeatherResponse>(url, {
        params: {
          hourlysteps: Math.min(Math.max(hourlysteps, 1), 360),
          lang: this.language,
          unit: this.unit
        }
      });
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`彩云天气API错误: ${error.response?.data?.error || error.message}`);
      }
      throw error;
    }
  }

  /**
   * 获取每日天气预报
   * @param longitude 经度
   * @param latitude 纬度
   * @param dailysteps 天数（1-15）
   * @returns 每日天气预报数据
   */
  async getDaily(longitude: number, latitude: number, dailysteps: number = 5): Promise<CaiyunWeatherResponse> {
    try {
      const url = `${this.baseUrl}/${this.apiKey}/${longitude},${latitude}/daily`;
      const response = await axios.get<CaiyunWeatherResponse>(url, {
        params: {
          dailysteps: Math.min(Math.max(dailysteps, 1), 15),
          lang: this.language,
          unit: this.unit
        }
      });
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`彩云天气API错误: ${error.response?.data?.error || error.message}`);
      }
      throw error;
    }
  }

  /**
   * 获取天气预警信息
   * @param longitude 经度
   * @param latitude 纬度
   * @returns 天气预警信息
   */
  async getAlert(longitude: number, latitude: number): Promise<CaiyunWeatherResponse> {
    try {
      const url = `${this.baseUrl}/${this.apiKey}/${longitude},${latitude}/weather`;
      const response = await axios.get<CaiyunWeatherResponse>(url, {
        params: {
          alert: true,
          dailysteps: 1,
          hourlysteps: 1,
          lang: this.language,
          unit: this.unit
        }
      });
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`彩云天气API错误: ${error.response?.data?.error || error.message}`);
      }
      throw error;
    }
  }

  /**
   * 获取综合天气数据
   * @param longitude 经度
   * @param latitude 纬度
   * @param dailysteps 天数（1-15）
   * @param hourlysteps 小时数（1-360）
   * @param alert 是否包含预警信息
   * @returns 综合天气数据
   */
  async getWeather(
    longitude: number, 
    latitude: number, 
    dailysteps: number = 5, 
    hourlysteps: number = 24,
    alert: boolean = true
  ): Promise<CaiyunWeatherResponse> {
    try {
      const url = `${this.baseUrl}/${this.apiKey}/${longitude},${latitude}/weather`;
      const response = await axios.get<CaiyunWeatherResponse>(url, {
        params: {
          dailysteps: Math.min(Math.max(dailysteps, 1), 15),
          hourlysteps: Math.min(Math.max(hourlysteps, 1), 360),
          alert,
          lang: this.language,
          unit: this.unit
        }
      });
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`彩云天气API错误: ${error.response?.data?.error || error.message}`);
      }
      throw error;
    }
  }

  /**
   * 将天气代码转换为可读文本
   * @param skycon 天气代码
   * @returns 天气描述文本
   */
  getSkyconText(skycon: string): string {
    return this.language === 'zh_CN' 
      ? skyconMap[skycon] || skycon
      : skyconMapEn[skycon] || skycon;
  }

  /**
   * 格式化实时天气数据
   * @param data 彩云天气API响应
   * @returns 格式化后的实时天气数据
   */
  formatRealtimeData(data: CaiyunWeatherResponse) {
    const realtime = data.result.realtime;
    if (!realtime) {
      throw new Error('没有实时天气数据');
    }

    return {
      location: data.location,
      server_time: new Date(data.server_time * 1000).toISOString(),
      temperature: realtime.temperature,
      apparent_temperature: realtime.apparent_temperature,
      humidity: realtime.humidity,
      weather: this.getSkyconText(realtime.skycon),
      weather_code: realtime.skycon,
      wind: {
        speed: realtime.wind.speed,
        direction: realtime.wind.direction
      },
      pressure: realtime.pressure,
      visibility: realtime.visibility,
      precipitation: {
        local: realtime.precipitation.local.intensity,
        nearest: realtime.precipitation.nearest?.intensity || 0,
        nearest_distance: realtime.precipitation.nearest?.distance || 0
      },
      air_quality: {
        aqi: realtime.air_quality.aqi.chn,
        pm25: realtime.air_quality.pm25,
        pm10: realtime.air_quality.pm10,
        o3: realtime.air_quality.o3,
        so2: realtime.air_quality.so2,
        no2: realtime.air_quality.no2,
        co: realtime.air_quality.co,
        description: realtime.air_quality.description.chn
      },
      life_index: {
        comfort: realtime.life_index.comfort.desc,
        ultraviolet: realtime.life_index.ultraviolet.desc
      }
    };
  }

  /**
   * 格式化分钟级降水预报数据
   * @param data 彩云天气API响应
   * @returns 格式化后的分钟级降水预报数据
   */
  formatMinutelyData(data: CaiyunWeatherResponse) {
    const minutely = data.result.minutely;
    if (!minutely) {
      throw new Error('没有分钟级降水预报数据');
    }

    return {
      location: data.location,
      server_time: new Date(data.server_time * 1000).toISOString(),
      description: minutely.description,
      precipitation: minutely.precipitation,
      precipitation_2h: minutely.precipitation_2h,
      probability: minutely.probability
    };
  }

  /**
   * 格式化小时级天气预报数据
   * @param data 彩云天气API响应
   * @returns 格式化后的小时级天气预报数据
   */
  formatHourlyData(data: CaiyunWeatherResponse) {
    const hourly = data.result.hourly;
    if (!hourly) {
      throw new Error('没有小时级天气预报数据');
    }

    return {
      location: data.location,
      server_time: new Date(data.server_time * 1000).toISOString(),
      description: hourly.description,
      forecast: hourly.temperature.map((temp, index) => ({
        time: temp.datetime,
        temperature: temp.value,
        apparent_temperature: hourly.apparent_temperature?.[index]?.value,
        weather: this.getSkyconText(hourly.skycon[index].value),
        weather_code: hourly.skycon[index].value,
        wind: {
          speed: hourly.wind[index].speed,
          direction: hourly.wind[index].direction
        },
        humidity: hourly.humidity[index].value,
        cloudrate: hourly.cloudrate[index].value,
        pressure: hourly.pressure[index].value,
        visibility: hourly.visibility[index].value,
        precipitation: {
          value: hourly.precipitation[index].value,
          probability: hourly.precipitation[index].probability
        },
        air_quality: {
          aqi: hourly.air_quality.aqi[index].value.chn,
          pm25: hourly.air_quality.pm25[index].value
        }
      }))
    };
  }

  /**
   * 格式化每日天气预报数据
   * @param data 彩云天气API响应
   * @returns 格式化后的每日天气预报数据
   */
  formatDailyData(data: CaiyunWeatherResponse) {
    const daily = data.result.daily;
    if (!daily) {
      throw new Error('没有每日天气预报数据');
    }

    return {
      location: data.location,
      server_time: new Date(data.server_time * 1000).toISOString(),
      forecast: daily.temperature.map((temp, index) => ({
        date: temp.date,
        temperature: {
          max: temp.max,
          min: temp.min,
          avg: temp.avg
        },
        temperature_day: daily.temperature_08h_20h?.[index] ? {
          max: daily.temperature_08h_20h[index].max,
          min: daily.temperature_08h_20h[index].min,
          avg: daily.temperature_08h_20h[index].avg
        } : undefined,
        temperature_night: daily.temperature_20h_32h?.[index] ? {
          max: daily.temperature_20h_32h[index].max,
          min: daily.temperature_20h_32h[index].min,
          avg: daily.temperature_20h_32h[index].avg
        } : undefined,
        weather: this.getSkyconText(daily.skycon[index].value),
        weather_code: daily.skycon[index].value,
        weather_day: this.getSkyconText(daily.skycon_08h_20h[index].value),
        weather_day_code: daily.skycon_08h_20h[index].value,
        weather_night: this.getSkyconText(daily.skycon_20h_32h[index].value),
        weather_night_code: daily.skycon_20h_32h[index].value,
        wind: {
          speed: daily.wind[index].avg.speed,
          direction: daily.wind[index].avg.direction
        },
        wind_day: daily.wind_08h_20h?.[index] ? {
          speed: daily.wind_08h_20h[index].avg.speed,
          direction: daily.wind_08h_20h[index].avg.direction
        } : undefined,
        wind_night: daily.wind_20h_32h?.[index] ? {
          speed: daily.wind_20h_32h[index].avg.speed,
          direction: daily.wind_20h_32h[index].avg.direction
        } : undefined,
        humidity: daily.humidity[index].avg,
        cloudrate: daily.cloudrate[index].avg,
        pressure: daily.pressure[index].avg,
        visibility: daily.visibility[index].avg,
        precipitation: {
          max: daily.precipitation[index].max,
          min: daily.precipitation[index].min,
          avg: daily.precipitation[index].avg,
          probability: daily.precipitation[index].probability
        },
        air_quality: {
          aqi: daily.air_quality.aqi[index].avg.chn,
          pm25: daily.air_quality.pm25[index].avg
        },
        astro: {
          sunrise: daily.astro[index].sunrise.time,
          sunset: daily.astro[index].sunset.time
        },
        life_index: {
          comfort: daily.life_index.comfort[index].desc,
          ultraviolet: daily.life_index.ultraviolet[index].desc,
          carWashing: daily.life_index.carWashing[index].desc,
          dressing: daily.life_index.dressing[index].desc,
          coldRisk: daily.life_index.coldRisk[index].desc
        }
      }))
    };
  }

  /**
   * 格式化天气预警信息
   * @param data 彩云天气API响应
   * @returns 格式化后的天气预警信息
   */
  formatAlertData(data: CaiyunWeatherResponse) {
    const alert = data.result.alert;
    if (!alert) {
      return {
        location: data.location,
        server_time: new Date(data.server_time * 1000).toISOString(),
        alerts: []
      };
    }

    return {
      location: data.location,
      server_time: new Date(data.server_time * 1000).toISOString(),
      alerts: alert.content.map(item => ({
        title: item.title,
        description: item.description,
        code: item.code,
        source: item.source,
        location: item.location,
        region: {
          province: item.province,
          city: item.city,
          county: item.county,
          adcode: item.adcode
        },
        pub_time: new Date(item.pubtimestamp * 1000).toISOString()
      }))
    };
  }

  /**
   * 格式化综合天气数据
   * @param data 彩云天气API响应
   * @returns 格式化后的综合天气数据
   */
  formatWeatherData(data: CaiyunWeatherResponse) {
    const result: any = {
      location: data.location,
      server_time: new Date(data.server_time * 1000).toISOString(),
      forecast_keypoint: data.result.forecast_keypoint
    };

    if (data.result.realtime) {
      result.realtime = this.formatRealtimeData(data).temperature ? 
        this.formatRealtimeData(data) : undefined;
    }

    if (data.result.minutely) {
      result.minutely = this.formatMinutelyData(data).description ? 
        this.formatMinutelyData(data) : undefined;
    }

    if (data.result.hourly) {
      result.hourly = this.formatHourlyData(data).forecast?.length ? 
        this.formatHourlyData(data) : undefined;
    }

    if (data.result.daily) {
      result.daily = this.formatDailyData(data).forecast?.length ? 
        this.formatDailyData(data) : undefined;
    }

    if (data.result.alert) {
      result.alert = this.formatAlertData(data);
    }

    return result;
  }
}
