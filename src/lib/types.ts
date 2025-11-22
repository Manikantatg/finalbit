export interface Device {
  id: string;
  name: string;
  type: 'ac' | 'light' | 'ev' | 'heater' | 'pump' | 'motor' | 'other';
  isOn: boolean;
  baseLoad: number; // Watts
  variability: number; // Random fluctuation range
  surgeProbability: number; // 0-1
}

export interface MeterReading {
  timestamp: number;
  power: number; // Watts
  voltage: number; // Volts
  current: number; // Amps
  frequency: number; // Hz
  powerFactor: number;
  cost: number; // Accumulated cost
  co2: number; // Accumulated CO2 (kg)
  temperature: number; // Ambient temp
}

export interface BuildingFloor {
  id: string;
  name: string;
  load: number; // kW
  capacity: number; // kW
  status: 'normal' | 'warning' | 'high' | 'critical';
}

export interface IndustryMachine {
  subject: string;
  load: number; // Current load value
  fullMark: number; // Max capacity
}

export interface CityWard {
  id: number;
  load: number; // 0-100%
  stress: number; // 0-1
}

export interface MarketState {
  price: number;
  history: { time: number; price: number }[];
  walletBalance: number;
  portfolioValue: number;
}

export interface WeatherData {
  temp: number;
  humidity: number;
  condition: string;
  isDay: boolean;
}

export interface DailyStat {
  time: string;
  load: number;
  carbon: number;
}
