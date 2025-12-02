import { describe, it, expect, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Mock the authentication middleware before importing routes
jest.unstable_mockModule('../middleware/authMiddleware.js', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { uid: 'test-user-123' };
    next();
  }
}));

// Import after mocking
const { moduleRouter } = await import('../routes/moduleRoutes.js');

// Create a simple test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/modules', moduleRouter);
  return app;
};

describe('Module Routes Integration Tests', () => {
  const app = createTestApp();

  describe('GET /modules/year/:year', () => {
    it('should return modules for a valid year', async () => {
      const response = await request(app)
        .get('/modules/year/1')
        .expect(200);

      expect(response.body).toHaveProperty('modules');
      expect(Array.isArray(response.body.modules)).toBe(true);
      expect(response.body.modules.length).toBeGreaterThan(0);
    });

    it('should return 400 for invalid year', async () => {
      const response = await request(app)
        .get('/modules/year/99')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid year');
    });

    it('should return modules with correct structure', async () => {
      const response = await request(app)
        .get('/modules/year/2')
        .expect(200);

      const firstModule = response.body.modules[0];
      expect(firstModule).toHaveProperty('id');
      expect(firstModule).toHaveProperty('name');
      expect(firstModule).toHaveProperty('code');
    });
  });

  describe('GET /modules/all', () => {
    it('should return all modules', async () => {
      const response = await request(app)
        .get('/modules/all')
        .expect(200);

      expect(response.body).toHaveProperty('modules');
      expect(Array.isArray(response.body.modules)).toBe(true);
      expect(response.body.modules.length).toBeGreaterThan(0);
    });

    it('should return more modules than a single year', async () => {
      const allResponse = await request(app).get('/modules/all');
      const year1Response = await request(app).get('/modules/year/1');

      expect(allResponse.body.modules.length).toBeGreaterThanOrEqual(
        year1Response.body.modules.length
      );
    });
  });
});
