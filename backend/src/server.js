require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { drivers, jobs } = require('./data');

const app = express();
const PORT = Number(process.env.PORT || 4000);
const loginUser = {
  id: 1,
  email: process.env.LOGIN_EMAIL || 'umut@test.com',
  password: process.env.LOGIN_PASSWORD || '123456',
  name: 'Umut',
};

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  }),
);
app.use(express.json());

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'missing token' });
  }

  const token = authHeader.slice(7);

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || '-');
    return next();
  } catch {
    return res.status(401).json({ message: 'bad token' });
  }
}

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/login', (req, res) => {
  const parsed = z
    .object({
      email: z.email(),
      password: z.string().min(6),
    })
    .safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'bad request' });
  }

  const { email, password } = parsed.data;

  if (email !== loginUser.email || password !== loginUser.password) {
    return res.status(401).json({ message: 'wrong email or password' });
  }

  const token = jwt.sign(
    {
      sub: loginUser.id,
      email: loginUser.email,
      name: loginUser.name,
    },
    process.env.JWT_SECRET || '-',
    { expiresIn: '8h' },
  );

  return res.json({
    token,
    user: {
      id: loginUser.id,
      email: loginUser.email,
      name: loginUser.name,
    },
  });
});

app.get('/me', requireAuth, (req, res) => {
  res.json({
    user: req.user,
  });
});

app.get('/drivers', requireAuth, (_req, res) => {
  res.json(drivers);
});

app.get('/jobs', requireAuth, (_req, res) => {
  const items = jobs.map((job) => ({
    ...job,
    driver: drivers.find((driver) => driver.id === job.driverId)?.name || '-',
  }));

  res.json(items);
});

app.get('/analytics/kpis', requireAuth, (_req, res) => {
  res.json({
    openJobs: jobs.filter((job) => job.status === 'open').length,
    activeDrivers: drivers.filter((driver) => driver.status === 'active').length,
    doneJobs: jobs.filter((job) => job.status === 'done').length,
  });
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
