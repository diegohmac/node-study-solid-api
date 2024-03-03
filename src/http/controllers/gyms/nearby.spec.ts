import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Nearby Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app);

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Near Gym',
        description: null,
        phone: null,
        latitude: 40.6574779,
        longitude: -7.9216167,
      });
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Far Gym',
        description: null,
        phone: null,
        latitude: 40.416217,
        longitude: -7.7052308,
      });

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: 40.6580605,
        longitude: -7.9089743,
      })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ name: 'Near Gym' }),
    ]);
  });
});
