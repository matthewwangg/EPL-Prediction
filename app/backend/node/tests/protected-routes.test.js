const request = require('supertest');
const app = require('../index');
let token;
describe('Protected Routes', () => {
    beforeAll(async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ username: 'testuser', password: 'password123' });

        token = response.body.token;
    });

    it('should return 401 Unauthorized for accessing /api/predict without token', async () => {
        const response = await request(app).get('/api/predict');
        expect(response.status).toBe(401);
    });

    it('should return 200 OK for accessing /api/predict with a valid token', async () => {
        const response = await request(app)
            .post('/api/predict')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
    });

    it('should return 401 Unauthorized for accessing /api/custom-predict without token', async () => {
        const response = await request(app).get('/api/custom-predict');
        expect(response.status).toBe(401);
    });

    it('should return 200 OK for accessing /api/custom-predict with a valid token', async () => {
        const response = await request(app)
            .post('/api/custom-predict')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
    });
});
