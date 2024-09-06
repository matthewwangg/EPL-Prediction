const request = require('supertest');
const app = require('../index');

describe('Auth Routes', () => {
    it('should return 401 Unauthorized for accessing /api/predict without token', async () => {
        const response = await request(app).get('/api/predict');
        expect(response.status).toBe(401);
    });

    it('should return 200 OK and a token for valid login', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ username: 'testuser', password: 'password123' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });
});
