import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Device, MeterReading, BuildingFloor, IndustryMachine, CityWard, MarketState, WeatherData, DailyStat } from '../lib/types';
import { fetchWeather } from '../lib/weather';

// --- Initial Data ---
const INITIAL_DEVICES: Device[] = [
  { id: '1', name: 'HVAC System', type: 'ac', isOn: true, baseLoad: 2200, variability: 150, surgeProbability: 0.05 },
  { id: '2', name: 'EV Charger', type: 'ev', isOn: false, baseLoad: 7200, variability: 50, surgeProbability: 0.01 },
  { id: '3', name: 'Smart Geyser', type: 'heater', isOn: false, baseLoad: 3000, variability: 20, surgeProbability: 0.02 },
  { id: '4', name: 'Kitchen Array', type: 'other', isOn: true, baseLoad: 450, variability: 80, surgeProbability: 0.1 },
  { id: '5', name: 'Lighting Grid', type: 'light', isOn: true, baseLoad: 120, variability: 5, surgeProbability: 0 },
];

const INITIAL_FLOORS: BuildingFloor[] = [
  { id: 'R', name: 'Roof / HVAC', load: 185, capacity: 200, status: 'critical' },
  { id: '5', name: 'Floor 5', load: 45, capacity: 100, status: 'normal' },
  { id: '4', name: 'Floor 4', load: 82, capacity: 100, status: 'warning' },
  { id: '3', name: 'Floor 3', load: 95, capacity: 100, status: 'warning' },
  { id: '2', name: 'Floor 2', load: 30, capacity: 100, status: 'normal' },
  { id: '1', name: 'Floor 1', load: 55, capacity: 100, status: 'normal' },
  { id: 'G', name: 'Lobby / Retail', load: 120, capacity: 150, status: 'high' },
  { id: 'B', name: 'Basement / EV', load: 160, capacity: 180, status: 'high' },
];

const INITIAL_MACHINES: IndustryMachine[] = [
  { subject: 'Motor A', load: 120, fullMark: 150 },
  { subject: 'Pump B', load: 98, fullMark: 150 },
  { subject: 'Compressor', load: 86, fullMark: 150 },
  { subject: 'Conveyor', load: 99, fullMark: 150 },
  { subject: 'HVAC Ind.', load: 85, fullMark: 150 },
  { subject: 'Lighting', load: 65, fullMark: 150 },
];

// Generate 24h Mock Data
const generateDailyStats = (): DailyStat[] => {
  return Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    // Base curve: low at night, high morning, dip afternoon, peak evening
    let baseLoad = 300;
    if (hour > 6 && hour < 10) baseLoad = 800; // Morning peak
    if (hour >= 10 && hour < 17) baseLoad = 600; // Work day
    if (hour >= 17 && hour < 22) baseLoad = 950; // Evening peak
    
    return {
      time: `${hour.toString().padStart(2, '0')}:00`,
      load: baseLoad + Math.random() * 100,
      carbon: (baseLoad / 1000) * (hour > 16 ? 0.4 : 0.2) // Higher carbon intensity in evening
    };
  });
};

interface EnergyContextType {
  // Home
  devices: Device[];
  toggleDevice: (id: string) => void;
  reading: MeterReading;
  history: MeterReading[];
  weather: WeatherData | null;
  isPeakHour: boolean;
  
  // Building
  floors: BuildingFloor[];
  dailyStats: DailyStat[];
  
  // Industry
  machines: IndustryMachine[];
  voltageSpikes: { time: number; voltage: number; load: number }[];
  
  // City
  wards: CityWard[];
  
  // Market
  market: MarketState;
  tradeCarbon: (amount: number, type: 'buy' | 'sell') => void;
}

const EnergyContext = createContext<EnergyContextType | undefined>(undefined);

export const EnergyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [reading, setReading] = useState<MeterReading>({
    timestamp: Date.now(), power: 0, voltage: 230, current: 0, frequency: 50, powerFactor: 0.95, cost: 0, co2: 0, temperature: 20
  });
  const [history, setHistory] = useState<MeterReading[]>([]);
  
  // Specialized Dashboard State
  const [floors, setFloors] = useState<BuildingFloor[]>(INITIAL_FLOORS);
  const [machines, setMachines] = useState<IndustryMachine[]>(INITIAL_MACHINES);
  const [voltageSpikes, setVoltageSpikes] = useState<{ time: number; voltage: number; load: number }[]>([]);
  const [wards, setWards] = useState<CityWard[]>(Array.from({ length: 24 }, (_, i) => ({ id: i + 1, load: Math.random() * 100, stress: Math.random() })));
  const [market, setMarket] = useState<MarketState>({ price: 13.42, history: [], walletBalance: 24.50, portfolioValue: 1200 });
  const [dailyStats] = useState<DailyStat[]>(generateDailyStats());

  // Refs for accumulation
  const accumulatedCost = useRef(0);
  const accumulatedCO2 = useRef(0);
  const tickCount = useRef(0);

  // Derived
  const isPeakHour = new Date().getHours() >= 17 && new Date().getHours() <= 21;

  // Weather Init
  useEffect(() => {
    fetchWeather().then(setWeather);
    const interval = setInterval(() => fetchWeather().then(setWeather), 600000);
    return () => clearInterval(interval);
  }, []);

  const toggleDevice = (id: string) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, isOn: !d.isOn } : d));
  };

  const tradeCarbon = (amount: number, type: 'buy' | 'sell') => {
    setMarket(prev => {
      const cost = amount * prev.price;
      if (type === 'buy') {
        if (prev.walletBalance < cost) return prev; // Insufficient funds logic could be better handled in UI
        return { ...prev, walletBalance: prev.walletBalance - cost, portfolioValue: prev.portfolioValue + cost };
      } else {
        return { ...prev, walletBalance: prev.walletBalance + cost, portfolioValue: prev.portfolioValue - cost };
      }
    });
  };

  // THE MASTER PHYSICS LOOP (1s Tick)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      tickCount.current++;
      const currentTemp = weather?.temp ?? 22;

      // --- 1. HOME SIMULATION ---
      let totalPower = 0;
      devices.forEach(device => {
        if (device.isOn) {
          let deviceLoad = device.baseLoad;
          // Physics: Temp effect
          if (device.type === 'ac') {
            const diff = Math.abs(currentTemp - 22);
            deviceLoad *= (1 + diff * 0.08);
          }
          // Physics: Noise
          deviceLoad += (Math.random() - 0.5) * device.variability;
          // Physics: Surge
          if (Math.random() < device.surgeProbability) deviceLoad *= 1.4;
          
          totalPower += deviceLoad;
        }
      });
      totalPower += 40 + Math.random() * 5; // Phantom

      // Grid Physics
      const voltage = 230 - (totalPower / 15000) * 5 + (Math.random() - 0.5) * 3;
      const pf = 0.92 + (Math.random() * 0.07);
      const current = totalPower / (voltage * pf);
      
      // Financials
      const rate = isPeakHour ? 0.35 : 0.18;
      const kWh = (totalPower / 1000) / 3600;
      accumulatedCost.current += kWh * rate;
      accumulatedCO2.current += kWh * (isPeakHour ? 0.25 : 0.15);

      const newReading = {
        timestamp: now,
        power: Math.max(0, totalPower),
        voltage,
        current,
        frequency: 49.95 + (Math.random() - 0.5) * 0.1,
        powerFactor: pf,
        cost: accumulatedCost.current,
        co2: accumulatedCO2.current,
        temperature: currentTemp
      };

      setReading(newReading);
      setHistory(prev => {
        const next = [...prev, newReading];
        return next.length > 60 ? next.slice(next.length - 60) : next;
      });

      // --- 2. BUILDING SIMULATION (Update every 3s) ---
      if (tickCount.current % 3 === 0) {
        setFloors(prev => prev.map(f => {
          const change = (Math.random() - 0.5) * 10;
          let newLoad = Math.max(0, Math.min(f.capacity * 1.2, f.load + change));
          let status: BuildingFloor['status'] = 'normal';
          const ratio = newLoad / f.capacity;
          if (ratio > 1.1) status = 'critical';
          else if (ratio > 0.9) status = 'high';
          else if (ratio > 0.75) status = 'warning';
          return { ...f, load: parseFloat(newLoad.toFixed(1)), status };
        }));
      }

      // --- 3. INDUSTRY SIMULATION (Update every 2s) ---
      if (tickCount.current % 2 === 0) {
        setMachines(prev => prev.map(m => ({
          ...m,
          load: Math.min(m.fullMark, Math.max(0, m.load + (Math.random() - 0.5) * 15))
        })));
        
        // Add spike data
        setVoltageSpikes(prev => {
            const next = [...prev, { 
                time: now, 
                voltage: 400 + (Math.random() - 0.5) * 15, 
                load: 800 + (Math.random() > 0.8 ? 200 : 0) 
            }];
            return next.length > 30 ? next.slice(next.length - 30) : next;
        });
      }

      // --- 4. CITY SIMULATION (Update every 5s) ---
      if (tickCount.current % 5 === 0) {
        setWards(prev => prev.map(w => ({
            ...w,
            load: Math.min(100, Math.max(0, w.load + (Math.random() - 0.5) * 10)),
            stress: Math.min(1, Math.max(0, w.stress + (Math.random() - 0.5) * 0.1))
        })));
      }

      // --- 5. MARKET SIMULATION (Update every 1s) ---
      setMarket(prev => {
        const change = (Math.random() - 0.5) * 0.05;
        const newPrice = Math.max(5, prev.price + change);
        const newHistory = [...prev.history, { time: now, price: newPrice }];
        if (newHistory.length > 30) newHistory.shift();
        return { ...prev, price: newPrice, history: newHistory };
      });

    }, 1000);

    return () => clearInterval(interval);
  }, [devices, weather, isPeakHour]);

  return (
    <EnergyContext.Provider value={{ 
      devices, toggleDevice, reading, history, weather, isPeakHour,
      floors, dailyStats,
      machines, voltageSpikes, 
      wards, 
      market, tradeCarbon
    }}>
      {children}
    </EnergyContext.Provider>
  );
};

export const useEnergy = () => {
  const context = useContext(EnergyContext);
  if (context === undefined) {
    throw new Error('useEnergy must be used within an EnergyProvider');
  }
  return context;
};
