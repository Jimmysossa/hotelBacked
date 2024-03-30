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

test('GET /review', async () => { 
    const res = await request(app).get('/reviews');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
 });

 test('POST /reviews', async () => { 
    const body = {
        rating: "5",
        comment: "perfect",
    }
    const res = await request(app)
        .post('/reviews')
        .send(body)
        .set('Authorization', `Bearer ${token}`);
    id = res.body.id
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe(body.name);
  });

 test('DELETE /reviews/:id', async () => { 
    const res = await request(app)
        .delete(`/reviews/${id}`)
        .set('Authorization', `Bearer ${token}`);
    console.log(res.body);
    expect(res.status).toBe(204);
 });