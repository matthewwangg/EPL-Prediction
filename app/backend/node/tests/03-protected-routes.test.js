const request = require('supertest');
const app = require('../index');
const bcrypt = require('bcrypt');
let token;
const { Pool } = require('pg');

const db = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: String(process.env.DB_PASSWORD),
    port: 5432,
});

describe('Protected Routes', () => {
    beforeAll(async () => {
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                user_id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE,
                role VARCHAR(100),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Hash password using real bcrypt
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Insert a test user
        await db.query(`
            INSERT INTO users (username, password_hash, email, role)
            VALUES ('testuser', $1, 'testuser@example.com', 'admin')`,
            [hashedPassword]
        );

        const response = await request(app)
            .post('/api/auth/login')
            .send({ username: 'testuser', password: 'password123' });

        token = response.body.token;
    });

    afterAll(async () => {
        await db.query('DROP TABLE IF EXISTS users');
        await db.end();
    });

    it('should return 401 Unauthorized for accessing /api/predict without token', async () => {
        const response = await request(app)
            .post('/api/predict')
            .set('Authorization', `Bearer `);
        expect(response.status).toBe(401);
    });

    it('should return 500 for accessing /api/predict with a valid token but with Flask not running', async () => {
        const response = await request(app)
            .post('/api/predict')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(500);
    });

    it('should return 401 Unauthorized for accessing /api/custom-predict without token', async () => {
        const response = await request(app)
            .post('/api/custom-predict/predict-custom')
            .set('Authorization', `Bearer `);
        expect(response.status).toBe(401);
    });

    it('should return 500 for accessing /api/custom-predict with a valid token but with Flask not running', async () => {
        const response = await request(app)
            .post('/api/custom-predict/predict-custom')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(500);
    });
});
