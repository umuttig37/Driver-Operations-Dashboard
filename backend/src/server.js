require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { z } = require('zod');

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

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
