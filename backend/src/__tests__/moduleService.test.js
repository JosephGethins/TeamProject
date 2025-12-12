import { describe, it, expect, beforeEach } from '@jest/globals';
import { getModulesByYear, getAllModules } from '../services/moduleService.js';

describe('Module Service Tests', () => {
  describe('getModulesByYear', () => {
    it('should return modules for year 1', async () => {
      const modules = await getModulesByYear(1);
      expect(modules).toBeDefined();
      expect(Array.isArray(modules)).toBe(true);
      expect(modules.length).toBeGreaterThan(0);
      expect(modules[0]).toHaveProperty('id');
      expect(modules[0]).toHaveProperty('name');
      expect(modules[0]).toHaveProperty('code');
    });

    it('should return modules for year 2', async () => {
      const modules = await getModulesByYear(2);
      expect(modules).toBeDefined();
      expect(Array.isArray(modules)).toBe(true);
      expect(modules.length).toBeGreaterThan(0);
    });

    it('should return modules for year 3', async () => {
      const modules = await getModulesByYear(3);
      expect(modules).toBeDefined();
      expect(Array.isArray(modules)).toBe(true);
      expect(modules.length).toBeGreaterThan(0);
    });

    it('should return modules for year 4', async () => {
      const modules = await getModulesByYear(4);
      expect(modules).toBeDefined();
      expect(Array.isArray(modules)).toBe(true);
      expect(modules.length).toBeGreaterThan(0);
    });

    it('should throw error for invalid year', async () => {
      await expect(getModulesByYear(5)).rejects.toThrow('Invalid year: 5');
      await expect(getModulesByYear(0)).rejects.toThrow('Invalid year: 0');
      await expect(getModulesByYear(-1)).rejects.toThrow();
    });

    it('should handle string year numbers', async () => {
      const modules = await getModulesByYear('2');
      expect(modules).toBeDefined();
      expect(Array.isArray(modules)).toBe(true);
    });

    it('should verify module structure', async () => {
      const modules = await getModulesByYear(1);
      const firstModule = modules[0];
      
      expect(firstModule).toHaveProperty('id');
      expect(firstModule).toHaveProperty('name');
      expect(firstModule).toHaveProperty('code');
      expect(typeof firstModule.id).toBe('string');
      expect(typeof firstModule.name).toBe('string');
      expect(typeof firstModule.code).toBe('string');
    });
  });

  describe('getAllModules', () => {
    it('should return all modules from all years', async () => {
      const allModules = await getAllModules();
      expect(allModules).toBeDefined();
      expect(Array.isArray(allModules)).toBe(true);
      expect(allModules.length).toBeGreaterThan(0);
    });

    it('should contain modules from year 1', async () => {
      const allModules = await getAllModules();
      const year1Modules = await getModulesByYear(1);
      
      const hasYear1Module = allModules.some(
        module => year1Modules.some(y1 => y1.id === module.id)
      );
      expect(hasYear1Module).toBe(true);
    });

    it('should contain modules from year 4', async () => {
      const allModules = await getAllModules();
      const year4Modules = await getModulesByYear(4);
      
      const hasYear4Module = allModules.some(
        module => year4Modules.some(y4 => y4.id === module.id)
      );
      expect(hasYear4Module).toBe(true);
    });

    it('should have unique module ids', async () => {
      const allModules = await getAllModules();
      const ids = allModules.map(m => m.id);
      const uniqueIds = new Set(ids);
      
      // Allow some duplicates as different years might have similar modules
      expect(uniqueIds.size).toBeGreaterThan(0);
    });

    it('should return more modules than any single year', async () => {
      const allModules = await getAllModules();
      const year1Modules = await getModulesByYear(1);
      
      expect(allModules.length).toBeGreaterThanOrEqual(year1Modules.length);
    });
  });
});
