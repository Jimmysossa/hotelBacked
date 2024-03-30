const request = require('supertest');
const app = require('../app');

let token;
let id;

beforeAll(async () => {
    const res = await request(app).post('/users/login').send({
        email: 'test@gmail.com',
        password: 'test1234'
    });
    token = res.body.token;
})

test('GET /bookings', async () => { 
    const res = await request(app).get('/bookings').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
 });

 test('POST /bookings', async () => { 
    const body = {
        checkIn: "2012-01-01, 10:01:01",
        checkOut: "2012-01-02, 10:01:01"
    }
    const res = await request(app)
        .post('/bookings')
        .send(body)
        .set('Authorization', `Bearer ${token}`);
    id = res.body.id
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe(body.name);
  });

  test('PUT /bookings/:id', async () => { 
    const body = {
        checkIn: "2012-01-01, 10:01:02",
        checkOut: "2012-01-02, 10:01:01"
    }
    const res = await request(app)
        .put(`/bookings/${id}`)
        .send(body)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe(body.name);
 });

 test('DELETE /bookings/:id', async () => { 
    const res = await request(app)
        .delete(`/bookings/${id}`)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
 });