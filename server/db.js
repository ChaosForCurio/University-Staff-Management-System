import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Required for Neon serverless pool in Node.js
neonConfig.webSocketConstructor = ws;

export const pool = new Pool({ connectionString: process.env.neon_db_url || 'postgresql://neondb_owner:npg_LBol94mWHKtS@ep-royal-mode-aitaukod-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require' });

// Create a helper that mimics the previous `sql` tagged template literal
export const sql = async (strings, ...values) => {
    const text = strings.reduce((prev, curr, i) => prev + curr + (i < values.length ? `$${i + 1}` : ''), '');
    const { rows } = await pool.query(text, values);
    return rows;
};

export const initDB = async () => {
    console.log('Initializing database tables...');
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS departments (
                id VARCHAR(50) PRIMARY KEY,
                name VARCHAR(100) NOT NULL
            );
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS staff (
                id VARCHAR(50) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(200) NOT NULL,
                department_id VARCHAR(50) REFERENCES departments(id),
                role VARCHAR(100) NOT NULL,
                phone VARCHAR(50) NOT NULL,
                joining_date DATE NOT NULL,
                status VARCHAR(20) NOT NULL
            );
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS attendance (
                id VARCHAR(50) PRIMARY KEY,
                staff_id VARCHAR(50) REFERENCES staff(id),
                date DATE NOT NULL,
                status VARCHAR(20) NOT NULL,
                remarks TEXT,
                UNIQUE(staff_id, date)
            );
        `;

        // Seed initial data if departments table is empty
        const deptsCount = await sql`SELECT COUNT(*) FROM departments`;
        if (parseInt(deptsCount[0].count) === 0) {
            console.log('Seeding initial data...');
            await sql`
                INSERT INTO departments (id, name) VALUES
                ('d1', 'Computer Science'),
                ('d2', 'Mathematics'),
                ('d3', 'Administration'),
                ('d4', 'Student Services'),
                ('d5', 'Library')
            `;

            await sql`
                INSERT INTO staff (id, name, email, department_id, role, phone, joining_date, status) VALUES
                ('s1', 'Dr. Alan Turing', 'alan@university.edu', 'd1', 'Professor', '555-0101', '2015-08-15', 'Active'),
                ('s2', 'Ada Lovelace', 'ada@university.edu', 'd1', 'Associate Professor', '555-0102', '2018-01-10', 'Active'),
                ('s3', 'Carl Gauss', 'carl@university.edu', 'd2', 'Professor', '555-0103', '2010-09-01', 'Active'),
                ('s4', 'Grace Hopper', 'grace@university.edu', 'd3', 'Registrar', '555-0104', '2020-03-15', 'Active'),
                ('s5', 'Tim Berners-Lee', 'tim@university.edu', 'd5', 'Head Librarian', '555-0105', '2019-11-20', 'Active')
            `;

            const today = new Date().toISOString().split('T')[0];
            await sql`
                INSERT INTO attendance (id, staff_id, date, status, remarks) VALUES
                ('a1', 's1', ${today}, 'Present', NULL),
                ('a2', 's2', ${today}, 'Late', 'Traffic'),
                ('a3', 's3', ${today}, 'Present', NULL),
                ('a4', 's4', ${today}, 'Absent', 'Sick leave')
            `;
        }
        console.log('Database initialized successfully.');
    } catch (err) {
        console.error('Error initializing database:', err);
        throw err;
    }
};
