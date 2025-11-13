import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import req from 'supertest';
import app from '../index.js';
import path from 'path';
import { conn } from '../src/utils/db.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let token;
describe('Membership API', () => {
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

  test('Register failed email sudah digunakan', async () => {
    const res = await req(app)
      .post('/register')
      .send({
        "email": "user@nutech-integrasi.com",
        "first_name": "User",
        "last_name": "Nutech",
        "password": "abcdef1234"
      });
    assert.equal(res.statusCode, 409);
    assert.equal(res.body.status, "failed");
    assert.equal(res.body.message, "Email has been used");
  });

  test('Login success', async () => {
    const res = await req(app)
      .post('/login')
      .send({ email: "user@nutech-integrasi.com", password: "abcdef1234" });
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.status, 0);
    assert.equal(res.body.message, "Login Sukses");
    assert.ok(res.body.data.token);
    token = res.body.data.token;
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

  test('Profile success', async () => {
    const res = await req(app)
      .get('/profile')
      .set('Authorization', `Bearer ${token}`);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.status, 0);
    assert.equal(res.body.message, "Sukses");
    assert.equal(res.body.data.email, "user@nutech-integrasi.com");
    assert.equal(res.body.data.first_name, "User");
    assert.equal(res.body.data.last_name, "Nutech");
    assert.equal(res.body.data.profile_image, null);
  });

  test('Profile failed Unauthorized', async () => {
    const res = await req(app)
      .get('/profile')
      .set('Authorization', `Bearer ${token} + 1`);
    assert.equal(res.statusCode, 401);
    assert.equal(res.body.status, 108);
    assert.equal(res.body.message, "Token tidak tidak valid atau kadaluwarsa");
    assert.equal(res.body.data, null);
  });

  test("Profile update success", async () => {
    const res = await req(app)
      .put('/profile/update')
      .set('Authorization', `Bearer ${token}`)
      .send({ first_name: "User Edited", last_name: "Nutech Edited" });
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.status, 0);
    assert.equal(res.body.message, "Update Pofile berhasil");
    assert.equal(res.body.data.email, "user@nutech-integrasi.com");
    assert.equal(res.body.data.first_name, "User Edited");
    assert.equal(res.body.data.last_name, "Nutech Edited");
  });

  test("Profile failed Unauthorized", async () => {
    const res = await req(app)
      .put('/profile/update')
      .set('Authorization', `Bearer ${token} + 1`)
      .send({ first_name: "User Edited", last_name: "Nutech Edited" });
    assert.equal(res.statusCode, 401);
    assert.equal(res.body.status, 108);
    assert.equal(res.body.message, "Token tidak tidak valid atau kadaluwarsa");
    assert.equal(res.body.data, null);
  });

  test("Update Image Profile success", async () => {
    const res = await req(app)
      .put('/profile/image')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', path.resolve(__dirname, 'testImage/sample_Jpeg.jpeg'));
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.status, 0);
    assert.equal(res.body.message, "Update Profile Image berhasil");
    assert.equal(res.body.data.email, "user@nutech-integrasi.com");
    assert.equal(res.body.data.first_name, "User Edited");
    assert.equal(res.body.data.last_name, "Nutech Edited");
    assert.notEqual(res.body.data.profile_image, null);
  });

  test('Update Image failed Unauthorized', async () => {
    const res = await req(app)
      .put('/profile/image')
      .set('Authorization', `Bearer ${token} + 1`);
    assert.equal(res.statusCode, 401);
    assert.equal(res.body.status, 108);
    assert.equal(res.body.message, "Token tidak tidak valid atau kadaluwarsa");
    assert.equal(res.body.data, null);
  });
});

describe('Information API', () => {
  test('Banner success', async () => {
    const res = await req(app)
      .get('/banner');
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.status, 0);
    assert.equal(res.body.message, "Sukses");
    assert.notEqual(res.body.data, null);
  });
  test('Services success', async () => {
    const res = await req(app)
      .get('/services')
      .set('Authorization', `Bearer ${token}`);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.status, 0);
    assert.equal(res.body.message, "Sukses");
    assert.notEqual(res.body.data, null);
  });
  test('Services failed Unauthorized', async () => {
    const res = await req(app)
      .get('/services')
      .set('Authorization', `Bearer ${token} + 1`);
    assert.equal(res.statusCode, 401);
    assert.equal(res.body.status, 108);
    assert.equal(res.body.message, "Token tidak tidak valid atau kadaluwarsa");
    assert.equal(res.body.data, null);
  });
});

describe('Transaction API', () => {
  test('Get Balance success', async () => {
    const res = await req(app)
      .get('/balance')
      .set('Authorization', `Bearer ${token}`);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.status, 0);
    assert.equal(res.body.message, "Get Balance Berhasil");
    assert.notEqual(res.body.data.balance, null);
  });
});

describe('Transaction History API', () => {
  test('Get Balance success', async () => {
    const res = await req(app)
      .get('/balance')
      .set('Authorization', `Bearer ${token}`);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.status, 0);
    assert.equal(res.body.message, "Get Balance Berhasil");
    assert.notEqual(res.body.data.balance, null);
  });
  test('Get Balance failed Unauthorized', async () => {
    const res = await req(app)
      .get('/balance')
      .set('Authorization', `Bearer ${token} + 1`);
    assert.equal(res.statusCode, 401);
    assert.equal(res.body.status, 108);
    assert.equal(res.body.message, "Token tidak tidak valid atau kadaluwarsa");
    assert.equal(res.body.data, null);
  });
  test('Topup success', async () => {
    const res = await req(app)
      .post('/topup')
      .set('Authorization', `Bearer ${token}`)
      .send({ top_up_amount: 100000 });
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.status, 0);
    assert.equal(res.body.message, "Top Up Balance berhasil");
    assert.notEqual(res.body.data.balance, null);
  });
  test('Topup failed Top Up lebih kecil dari 0', async () => {
    const res = await req(app)
      .post('/topup')
      .set('Authorization', `Bearer ${token}`)
      .send({ top_up_amount: -1 });
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.status, 102);
    assert.equal(res.body.message, "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0");
    assert.equal(res.body.data, null);
  });
  test('Topup failed Unauthorized', async () => {
    const res = await req(app)
      .post('/topup')
      .set('Authorization', `Bearer ${token} + 1`)
      .send({ top_up_amount: 100000 });
    assert.equal(res.statusCode, 401);
    assert.equal(res.body.status, 108);
    assert.equal(res.body.message, "Token tidak tidak valid atau kadaluwarsa");
    assert.equal(res.body.data, null);
  });
  test('Transaksi Success', async () => {
    const res = await req(app)
      .post('/transaction')
      .set('Authorization', `Bearer ${token}`)
      .send({ service_code: "PULSA" });
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.status, 0);
    assert.equal(res.body.message, "Get Balance Berhasil");
    assert.notEqual(res.body.data, null);
  });
  test('Transaksi Failed Layanan Tidak Ada', async () => {
    const res = await req(app)
      .post('/transaction')
      .set('Authorization', `Bearer ${token}`)
      .send({ service_code: "Layanan Tidak Ada" });
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.status, 102);
    assert.equal(res.body.message, "Service ataus Layanan tidak ditemukan");
    assert.equal(res.body.data, null);
  });
  test('Transaksi Failed Unauthorized', async () => {
    const res = await req(app)
      .post('/transaction')
      .set('Authorization', `Bearer ${token} + 1`)
      .send({ service_code: "PULSA" });
    assert.equal(res.statusCode, 401);
    assert.equal(res.body.status, 108);
    assert.equal(res.body.message, "Token tidak tidak valid atau kadaluwarsa");
    assert.equal(res.body.data, null);
  });
  test('Transaction History success', async () => {
    const res = await req(app)
      .get('/transaction/history')
      .set('Authorization', `Bearer ${token}`);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.status, 0);
    assert.equal(res.body.message, "Get History Berhasil");
    assert.notEqual(res.body.data, null);
  });
  test('Transaction History Failed Unauthorized', async () => {
    const res = await req(app)
      .get('/transaction/history')
      .set('Authorization', `Bearer ${token} + 1`);
    assert.equal(res.statusCode, 401);
    assert.equal(res.body.status, 108);
    assert.equal(res.body.message, "Token tidak tidak valid atau kadaluwarsa");
    assert.equal(res.body.data, null);
  });
})

test.after(async () => {
  await conn.execute('SET FOREIGN_KEY_CHECKS = 0');
  await conn.execute('DELETE FROM users');
  await conn.execute('ALTER TABLE users AUTO_INCREMENT = 1');
  await conn.execute('DELETE FROM topup');
  await conn.execute('ALTER TABLE topup AUTO_INCREMENT = 1');
  await conn.execute('DELETE FROM transactions');
  await conn.execute('ALTER TABLE transactions AUTO_INCREMENT = 1');
  await conn.end();
});