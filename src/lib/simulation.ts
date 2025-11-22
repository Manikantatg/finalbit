import { useState, useEffect, useRef } from 'react';
import { Device, MeterReading } from './types';
import { fetchWeather, WeatherData } from './weather';

// --- Configuration & Types ---

export const INITIAL_DEVICES: Device[] = [
  { id: '1', name: 'HVAC System', type: 'ac', isOn: true, baseLoad: 2200, variability: 150, surgeProbability: 0.05 },
  { id: '2', name: 'EV Charger', type: 'ev', isOn: false, baseLoad: 7200, variability: 50, surgeProbability: 0.01 },
  { id: '3', name: 'Smart Geyser', type: 'heater', isOn: false, baseLoad: 3000, variability: 20, surgeProbability: 0.02 },
  { id: '4', name: 'Kitchen Array', type: 'other', isOn: true, baseLoad: 450, variability: 80, surgeProbability: 0.1 },
  { id: '5', name: 'Lighting Grid', type: 'light', isOn: true, baseLoad: 120, variability: 5, surgeProbability: 0 },
];

// --- The Virtual Smart Meter Engine ---

export const useVirtualMeter = () => {
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  
  const [reading, setReading] = useState<MeterReading>({
    timestamp: Date.now(),
    power: 0,
    voltage: 230,
    current: 0,
    frequency: 50,
    powerFactor: 0.95,
    cost: 0,
    co2: 0,
    temperature: 20,
  });
  
  const [history, setHistory] = useState<MeterReading[]>([]);
  const historyLimit = 60; 

  // Accumulators
  const accumulatedCost = useRef(0);
  const accumulatedCO2 = useRef(0);

  // Fetch weather on mount
  useEffect(() => {
    fetchWeather().then(setWeather);
    // Refresh weather every 10 minutes
    const weatherInterval = setInterval(() => {
      fetchWeather().then(setWeather);
    }, 600000);
    return () => clearInterval(weatherInterval);
  }, []);

  const toggleDevice = (id: string) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, isOn: !d.isOn } : d));
  };

  // The Physics Loop (1s tick)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const currentTemp = weather?.temp ?? 22;
      
      // 1. Calculate Load
      let totalPower = 0;
      
      devices.forEach(device => {
        if (device.isOn) {
          let deviceLoad = device.baseLoad;
          
          // Physics: HVAC works harder in extreme temps
          if (device.type === 'ac') {
            const diff = Math.abs(currentTemp - 22);
            deviceLoad *= (1 + diff * 0.08); // 8% more power per degree off 22C
          }

          // Physics: Random Noise & Harmonics
          const noise = (Math.random() - 0.5) * device.variability;
          
          // Physics: Micro-Surges
          if (Math.random() < device.surgeProbability) {
             deviceLoad *= 1.4; // 40% surge spike
          }

          totalPower += deviceLoad + noise;
        }
      });

      // Phantom Load
      totalPower += 40 + Math.random() * 5;

      // 2. Electrical Characteristics
      // Grid instability simulation: Voltage dips when load is high
      const loadFactor = totalPower / 15000; // Assume 15kW max capacity
      const voltageSag = loadFactor * 5; 
      const voltageNoise = (Math.random() - 0.5) * 3;
      const voltage = 230 - voltageSag + voltageNoise;
      
      const powerFactor = 0.92 + (Math.random() * 0.07); // 0.92 - 0.99
      const current = totalPower / (voltage * powerFactor);
      const frequency = 49.95 + Math.random() * 0.1;

      // 3. Financials & Carbon
      // Dynamic Tariff: Peak hours 17:00 - 21:00
      const hour = new Date().getHours();
      const isPeak = hour >= 17 && hour <= 21;
      const rate = isPeak ? 0.35 : 0.18; // GBP per kWh
      
      const kWh = (totalPower / 1000) / 3600;
      accumulatedCost.current += kWh * rate;
      
      // Carbon Intensity (gCO2/kWh) - varies by time of day (solar curve simulation)
      // Lower during day (solar), higher at night (coal/gas base load)
      const baseCarbon = (hour > 8 && hour < 16) ? 0.15 : 0.25; 
      accumulatedCO2.current += kWh * baseCarbon;

      const newReading: MeterReading = {
        timestamp: now,
        power: Math.max(0, totalPower),
        voltage,
        current,
        frequency,
        powerFactor,
        cost: accumulatedCost.current,
        co2: accumulatedCO2.current,
        temperature: currentTemp,
      };

      setReading(newReading);
      setHistory(prev => {
        const newHistory = [...prev, newReading];
        if (newHistory.length > historyLimit) return newHistory.slice(newHistory.length - historyLimit);
        return newHistory;
      });

    }, 1000);

    return () => clearInterval(interval);
  }, [devices, weather]);

  return { devices, toggleDevice, reading, history, weather };
};
