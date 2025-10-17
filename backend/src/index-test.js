import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    ok: true, 
    service: 'backend-test', 
    env: 'test',
    timestamp: new Date().toISOString(),
    message: 'Backend is running in test mode. Set up Firebase credentials to enable full functionality.'
  });
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    endpoints: [
      'GET /health - Health check',
      'GET /test - This test endpoint'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend test server listening on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`Test endpoint: http://localhost:${port}/test`);
  console.log('');
  console.log('⚠️  This is a test server. To enable full functionality:');
  console.log('1. Get Firebase service account credentials');
  console.log('2. Add them to .env file');
  console.log('3. Run: npm run dev');
});
