// 彩云天气API响应类型
export interface CaiyunWeatherResponse {
  status: string;
  api_version: string;
  api_status: string;
  lang: string;
  unit: string;
  tzshift: number;
  timezone: string;
  server_time: number;
  location: [number, number];
  result: {
    realtime?: RealtimeData;
    minutely?: MinutelyData;
    hourly?: HourlyData;
    daily?: DailyData;
    alert?: AlertData;
    primary?: number;
    forecast_keypoint?: string;
  };
}

// 实时天气数据
export interface RealtimeData {
  status: string;
  temperature: number;
  humidity: number;
  cloudrate: number;
  skycon: string;
  visibility: number;
  dswrf: number;
  wind: {
    speed: number;
    direction: number;
  };
  pressure: number;
  apparent_temperature: number;
  precipitation: {
    local: {
      status: string;
      datasource: string;
      intensity: number;
    };
    nearest?: {
      status: string;
      distance: number;
      intensity: number;
    };
  };
  air_quality: {
    pm25: number;
    pm10: number;
    o3: number;
    so2: number;
    no2: number;
    co: number;
    aqi: {
      chn: number;
      usa: number;
    };
    description: {
      chn: string;
      usa: string;
    };
  };
  life_index: {
    ultraviolet: {
      index: number;
      desc: string;
    };
    comfort: {
      index: number;
      desc: string;
    };
  };
}

// 分钟级降水数据
export interface MinutelyData {
  status: string;
  datasource: string;
  precipitation_2h: number[];
  precipitation: number[];
  probability: number[];
  description: string;
}

// 小时级天气数据
export interface HourlyData {
  status: string;
  description: string;
  precipitation: Array<{
    datetime: string;
    value: number;
    probability?: number;
  }>;
  temperature: Array<{
    datetime: string;
    value: number;
  }>;
  apparent_temperature: Array<{
    datetime: string;
    value: number;
  }>;
  wind: Array<{
    datetime: string;
    speed: number;
    direction: number;
  }>;
  humidity: Array<{
    datetime: string;
    value: number;
  }>;
  cloudrate: Array<{
    datetime: string;
    value: number;
  }>;
  skycon: Array<{
    datetime: string;
    value: string;
  }>;
  pressure: Array<{
    datetime: string;
    value: number;
  }>;
  visibility: Array<{
    datetime: string;
    value: number;
  }>;
  dswrf: Array<{
    datetime: string;
    value: number;
  }>;
  air_quality: {
    aqi: Array<{
      datetime: string;
      value: {
        chn: number;
        usa: number;
      };
    }>;
    pm25: Array<{
      datetime: string;
      value: number;
    }>;
  };
}

// 天级别天气数据
export interface DailyData {
  status: string;
  astro: Array<{
    date: string;
    sunrise: {
      time: string;
    };
    sunset: {
      time: string;
    };
  }>;
  precipitation: Array<{
    date: string;
    max: number;
    min: number;
    avg: number;
    probability: number;
  }>;
  temperature: Array<{
    date: string;
    max: number;
    min: number;
    avg: number;
  }>;
  temperature_08h_20h?: Array<{
    date: string;
    max: number;
    min: number;
    avg: number;
  }>;
  temperature_20h_32h?: Array<{
    date: string;
    max: number;
    min: number;
    avg: number;
  }>;
  wind: Array<{
    date: string;
    max: {
      speed: number;
      direction: number;
    };
    min: {
      speed: number;
      direction: number;
    };
    avg: {
      speed: number;
      direction: number;
    };
  }>;
  wind_08h_20h?: Array<{
    date: string;
    max: {
      speed: number;
      direction: number;
    };
    min: {
      speed: number;
      direction: number;
    };
    avg: {
      speed: number;
      direction: number;
    };
  }>;
  wind_20h_32h?: Array<{
    date: string;
    max: {
      speed: number;
      direction: number;
    };
    min: {
      speed: number;
      direction: number;
    };
    avg: {
      speed: number;
      direction: number;
    };
  }>;
  humidity: Array<{
    date: string;
    max: number;
    min: number;
    avg: number;
  }>;
  cloudrate: Array<{
    date: string;
    max: number;
    min: number;
    avg: number;
  }>;
  pressure: Array<{
    date: string;
    max: number;
    min: number;
    avg: number;
  }>;
  visibility: Array<{
    date: string;
    max: number;
    min: number;
    avg: number;
  }>;
  dswrf: Array<{
    date: string;
    max: number;
    min: number;
    avg: number;
  }>;
  air_quality: {
    aqi: Array<{
      date: string;
      max: {
        chn: number;
        usa: number;
      };
      avg: {
        chn: number;
        usa: number;
      };
      min: {
        chn: number;
        usa: number;
      };
    }>;
    pm25: Array<{
      date: string;
      max: number;
      avg: number;
      min: number;
    }>;
  };
  skycon: Array<{
    date: string;
    value: string;
  }>;
  skycon_08h_20h: Array<{
    date: string;
    value: string;
  }>;
  skycon_20h_32h: Array<{
    date: string;
    value: string;
  }>;
  life_index: {
    ultraviolet: Array<{
      date: string;
      index: string;
      desc: string;
    }>;
    carWashing: Array<{
      date: string;
      index: string;
      desc: string;
    }>;
    dressing: Array<{
      date: string;
      index: string;
      desc: string;
    }>;
    comfort: Array<{
      date: string;
      index: string;
      desc: string;
    }>;
    coldRisk: Array<{
      date: string;
      index: string;
      desc: string;
    }>;
  };
}

// 预警数据
export interface AlertData {
  status: string;
  content: Array<{
    province: string;
    status: string;
    code: string;
    description: string;
    regionId: string;
    county: string;
    pubtimestamp: number;
    latlon: [number, number];
    city: string;
    alertId: string;
    title: string;
    adcode: string;
    source: string;
    location: string;
    request_status: string;
  }>;
  adcodes?: {
    [key: string]: {
      status: string;
      request_status: string;
    };
  };
}

// 高德地图地理编码响应
export interface GeocodingResponse {
  status: string;
  info: string;
  infocode: string;
  count: string;
  geocodes: Array<{
    formatted_address: string;
    country: string;
    province: string;
    citycode: string;
    city: string;
    district: string;
    township: string;
    neighborhood: {
      name: string;
      type: string;
    };
    building: {
      name: string;
      type: string;
    };
    adcode: string;
    street: string;
    number: string;
    location: string;
    level: string;
  }>;
}

// 天气图标映射
export const skyconMap: Record<string, string> = {
  CLEAR_DAY: '晴天',
  CLEAR_NIGHT: '晴夜',
  PARTLY_CLOUDY_DAY: '多云',
  PARTLY_CLOUDY_NIGHT: '多云',
  CLOUDY: '阴',
  LIGHT_HAZE: '轻度雾霾',
  MODERATE_HAZE: '中度雾霾',
  HEAVY_HAZE: '重度雾霾',
  LIGHT_RAIN: '小雨',
  MODERATE_RAIN: '中雨',
  HEAVY_RAIN: '大雨',
  STORM_RAIN: '暴雨',
  FOG: '雾',
  LIGHT_SNOW: '小雪',
  MODERATE_SNOW: '中雪',
  HEAVY_SNOW: '大雪',
  STORM_SNOW: '暴雪',
  DUST: '浮尘',
  SAND: '沙尘',
  WIND: '大风'
};

// 英文天气图标映射
export const skyconMapEn: Record<string, string> = {
  CLEAR_DAY: 'Clear Day',
  CLEAR_NIGHT: 'Clear Night',
  PARTLY_CLOUDY_DAY: 'Partly Cloudy Day',
  PARTLY_CLOUDY_NIGHT: 'Partly Cloudy Night',
  CLOUDY: 'Cloudy',
  LIGHT_HAZE: 'Light Haze',
  MODERATE_HAZE: 'Moderate Haze',
  HEAVY_HAZE: 'Heavy Haze',
  LIGHT_RAIN: 'Light Rain',
  MODERATE_RAIN: 'Moderate Rain',
  HEAVY_RAIN: 'Heavy Rain',
  STORM_RAIN: 'Storm Rain',
  FOG: 'Fog',
  LIGHT_SNOW: 'Light Snow',
  MODERATE_SNOW: 'Moderate Snow',
  HEAVY_SNOW: 'Heavy Snow',
  STORM_SNOW: 'Storm Snow',
  DUST: 'Dust',
  SAND: 'Sand',
  WIND: 'Wind'
};
