import test from 'node:test';
import assert from 'node:assert/strict';
import req from 'supertest';
import app from '../index.js';
import { conn } from '../src/utils/db.js';

let token;

test('Register success', async () => {
  const res = await req(app)
    .post('/register')
    .send({
      "email": "user@nutech-integrasi.com",
      "first_name": "User",
      "last_name": "Nutech",
      "password": "abcdef1234"
    });
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, 0);
  assert.equal(res.body.message, "Registrasi berhasil silahkan login");
  assert.equal(res.body.data, null);
});

test('Register failed email tidak sesuai format', async () => {
  const res = await req(app)
    .post('/register')
    .send({
      "email": "user",
      "first_name": "User",
      "last_name": "Nutech",
      "password": "abcdef1234"
    });
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.status, 102);
  assert.equal(res.body.message, "Paramter email tidak sesuai format");
  assert.equal(res.body.data, null);
});

test('Register success', async () => {
  const res = await req(app)
    .post('/register')
    .send({
      "email": "user@nutech-integrasi.com",
      "first_name": "User",
      "last_name": "Nutech",
      "password": "abcdef1234"
    });
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, 0);
  assert.equal(res.body.message, "Registrasi berhasil silahkan login");
  assert.equal(res.body.data, null);
});

test('Login success', async () => {
  const res = await req(app)
    .post('/login')
    .send({ email: "user@nutech-integrasi.com", password: "abcdef1234" });
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, 0);
  assert.equal(res.body.message, "Login Sukses");
  assert.ok(res.body.data.token);
  token = res.body.data.token; // Menyimpan token untuk authorization
});

test('Login failed parameter email tidak sesuai', async () => {
  const res = await req(app)
    .post('/login')
    .send({ email: "users", password: "abcdef123" });
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.status, 102);
  assert.equal(res.body.message, "Paramter email tidak sesuai format");
  assert.equal(res.body.data, null);
});

test('Login failed Unauthorized', async () => {
  const res = await req(app)
    .post('/login')
    .send({ email: "users12390@nutcsinegrasi.com", password: "abcdef123" });
  assert.equal(res.statusCode, 401);
  assert.equal(res.body.status, 103);
  assert.equal(res.body.message, "Username atau password salah");
  assert.equal(res.body.data, null);
});

test('GET /profile returns JSON', async () => {
  const res = await req(app)
    .get('/profile')
    .set('Authorization', `Bearer ${token}`);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.message, "Sukses");
  assert.ok(res.body.message);
});


test('GET /banner returns JSON', async () => {
  const res = await req(app).get('/banner');
  assert.equal(res.statusCode, 200);
  assert.ok(res.body.message);
});

test.after(async () => {
  await conn.execute('DELETE FROM users');
  await conn.execute('ALTER TABLE users AUTO_INCREMENT = 1');
  await conn.end();
});