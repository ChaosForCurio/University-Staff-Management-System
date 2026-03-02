import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { sql, initDB } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local file from the project root
const envPath = path.resolve(__dirname, '..', '.env.local');
const result = dotenv.config({ path: envPath });

// Initialize DB on startup
initDB().catch(err => {
    console.error('Critical Database Initialization Failure:', err.message);
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Middleware for logging requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
// Batch Initial Data Route for faster loading
app.get('/api/init', async (req, res) => {
    try {
        const [departments, staff, attendance] = await Promise.all([
            sql`SELECT * FROM departments ORDER BY name`,
            sql`
            SELECT id, name, email, department_id as "departmentId", role, phone, TO_CHAR(joining_date, 'YYYY-MM-DD') as "joiningDate", status
            FROM staff 
            ORDER BY name
        `,
            sql`
            SELECT id, staff_id as "staffId", TO_CHAR(date, 'YYYY-MM-DD') as date, status, remarks 
            FROM attendance
            ORDER BY date DESC
        `
        ]);

        res.json({
            departments,
            staff,
            attendance
        });
    } catch (err) {
        console.error('Failed to fetch initial data:', err);
        res.status(500).json({ error: 'Failed to fetch initial data' });
    }
});
app.get('/api/departments', async (req, res) => {
    try {
        const departments = await sql`SELECT * FROM departments ORDER BY name`;
        res.json(departments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch departments' });
    }
});

app.get('/api/staff', async (req, res) => {
    try {
        const staff = await sql`
            SELECT id, name, email, department_id as "departmentId", role, phone, TO_CHAR(joining_date, 'YYYY-MM-DD') as "joiningDate", status
            FROM staff 
            ORDER BY name
        `;
        res.json(staff);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch staff' });
    }
});

app.post('/api/staff', async (req, res) => {
    const { name, email, departmentId, role, phone, joiningDate, status } = req.body;

    // Simple validation
    if (!name || !email || !role) {
        return res.status(400).json({ error: 'Missing required fields: name, email, and role are mandatory' });
    }

    const id = crypto.randomUUID();
    try {
        const newStaff = await sql`
            INSERT INTO staff(id, name, email, department_id, role, phone, joining_date, status)
            VALUES(${id}, ${name}, ${email}, ${departmentId}, ${role}, ${phone}, ${joiningDate}, ${status})
            RETURNING id, name, email, department_id as "departmentId", role, phone, TO_CHAR(joining_date, 'YYYY-MM-DD') as "joiningDate", status
        `;
        res.status(201).json(newStaff[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create staff' });
    }
});

app.put('/api/staff/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, departmentId, role, phone, joiningDate, status } = req.body;
    try {
        const updatedStaff = await sql`
            UPDATE staff
            SET name = COALESCE(${name}, name),
        email = COALESCE(${email}, email),
        department_id = COALESCE(${departmentId}, department_id),
        role = COALESCE(${role}, role),
        phone = COALESCE(${phone}, phone),
        joining_date = COALESCE(${joiningDate}, joining_date),
        status = COALESCE(${status}, status)
            WHERE id = ${id}
            RETURNING id, name, email, department_id as "departmentId", role, phone, TO_CHAR(joining_date, 'YYYY-MM-DD') as "joiningDate", status
        `;
        if (updatedStaff.length === 0) return res.status(404).json({ error: 'Staff not found' });
        res.json(updatedStaff[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update staff' });
    }
});

app.delete('/api/staff/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Delete related attendance records first
        await sql`DELETE FROM attendance WHERE staff_id = ${id} `;

        const deletedStaff = await sql`DELETE FROM staff WHERE id = ${id} RETURNING id`;

        if (deletedStaff.length === 0) return res.status(404).json({ error: 'Staff not found' });
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete staff' });
    }
});

app.get('/api/attendance', async (req, res) => {
    try {
        const attendance = await sql`
            SELECT id, staff_id as "staffId", TO_CHAR(date, 'YYYY-MM-DD') as date, status, remarks 
            FROM attendance
            ORDER BY date DESC
        `;
        res.json(attendance);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch attendance' });
    }
});

app.post('/api/attendance', async (req, res) => {
    const { staffId, date, status, remarks } = req.body;

    if (!staffId || !date || !status) {
        return res.status(400).json({ error: 'Missing required fields: staffId, date, and status are mandatory' });
    }

    const id = crypto.randomUUID();

    try {
        // Check if record exists for this date and staff
        const existing = await sql`SELECT id FROM attendance WHERE staff_id = ${staffId} AND date = ${date} `;

        if (existing.length > 0) {
            // Update existing
            const updated = await sql`
                UPDATE attendance
                SET status = ${status}, remarks = ${remarks}
                WHERE id = ${existing[0].id}
                RETURNING id, staff_id as "staffId", TO_CHAR(date, 'YYYY-MM-DD') as date, status, remarks
        `;
            res.json(updated[0]);
        } else {
            // Insert new
            const newRecord = await sql`
                INSERT INTO attendance(id, staff_id, date, status, remarks)
    VALUES(${id}, ${staffId}, ${date}, ${status}, ${remarks})
                RETURNING id, staff_id as "staffId", TO_CHAR(date, 'YYYY-MM-DD') as date, status, remarks
        `;
            res.status(201).json(newRecord[0]);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to record attendance' });
    }
});

app.put('/api/attendance/:id', async (req, res) => {
    const { id } = req.params;
    const { status, remarks } = req.body;

    try {
        const updated = await sql`
            UPDATE attendance
            SET status = COALESCE(${status}, status),
        remarks = COALESCE(${remarks}, remarks)
            WHERE id = ${id}
            RETURNING id, staff_id as "staffId", TO_CHAR(date, 'YYYY-MM-DD') as date, status, remarks
        `;
        if (updated.length === 0) return res.status(404).json({ error: 'Attendance record not found' });
        res.json(updated[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update attendance' });
    }
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
        path: req.path,
        method: req.method
    });

    res.status(500).json({
        error: 'An internal server error occurred',
        message: process.env.NODE_ENV === 'production' ? null : err.message
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
