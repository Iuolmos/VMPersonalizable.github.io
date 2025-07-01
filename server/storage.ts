import { configurations, type Configuration, type InsertConfiguration } from "@shared/schema";

export interface IStorage {
  createConfiguration(config: InsertConfiguration): Promise<Configuration>;
  getConfiguration(id: number): Promise<Configuration | undefined>;
}

export class MemStorage implements IStorage {
  private configurations: Map<number, Configuration>;
  private currentId: number;

  constructor() {
    this.configurations = new Map();
    this.currentId = 1;
  }

  async createConfiguration(insertConfig: InsertConfiguration): Promise<Configuration> {
    const id = this.currentId++;
    
    // Calculate total cost
    const PRICING = {
      cpu: 15.00,
      ram: 2.50,
      disk: 0.10
    };
    
    const totalCost = (insertConfig.cpu * PRICING.cpu) + 
                     (insertConfig.ram * PRICING.ram) + 
                     (insertConfig.disk * PRICING.disk);
    
    const config: Configuration = { 
      ...insertConfig, 
      id, 
      totalCost 
    };
    
    this.configurations.set(id, config);
    return config;
  }

  async getConfiguration(id: number): Promise<Configuration | undefined> {
    return this.configurations.get(id);
  }
}

export const storage = new MemStorage();
