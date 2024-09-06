const db = require('../config/db'); // Assuming your DB config is in config/db.js
const createSchema = require('../scripts/db-schema-setup');

describe('Database Schema Tests', () => {
    beforeAll(async () => {
        await createSchema();
    });

    afterAll(async () => {
        await db.end();
    });

    it('should create the "users" table with correct schema', async () => {
        const tableCheckQuery = `
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'users';
    `;

        const result = await db.query(tableCheckQuery);

        const expectedColumns = [
            { column_name: 'user_id', data_type: 'integer' },
            { column_name: 'username', data_type: 'character varying' },
            { column_name: 'password_hash', data_type: 'character varying' },
            { column_name: 'email', data_type: 'character varying' },
            { column_name: 'role', data_type: 'character varying' },
            { column_name: 'created_at', data_type: 'timestamp with time zone' }
        ];

        const actualColumns = result.rows.map(row => ({
            column_name: row.column_name,
            data_type: row.data_type,
        }));

        expectedColumns.forEach(expectedColumn => {
            expect(actualColumns).toContainEqual(expectedColumn);
        });
    });

    it('should insert a user into the "users" table', async () => {
        const insertUserQuery = `
      INSERT INTO users (username, password_hash, email, role)
      VALUES ('testuser', 'hashedpassword123', 'testuser@example.com', 'admin')
      RETURNING *;
    `;
        const result = await db.query(insertUserQuery);

        expect(result.rows.length).toBe(1);
        expect(result.rows[0].username).toBe('testuser');
        expect(result.rows[0].email).toBe('testuser@example.com');
        expect(result.rows[0].role).toBe('admin');
    });

    it('should fail to insert a duplicate username into the "users" table', async () => {
        const duplicateUserQuery = `
      INSERT INTO users (username, password_hash, email, role)
      VALUES ('testuser', 'newhashedpassword', 'newemail@example.com', 'user');
    `;

        await expect(db.query(duplicateUserQuery)).rejects.toThrow();
    });
});
