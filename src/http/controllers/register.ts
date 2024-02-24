import { FastifyReply, FastifyRequest } from 'fastify';
import { hash } from 'bcryptjs';
import { z } from 'zod';

import { PrismaUserRepository } from '@/repositories/prisma-user-repository';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  const prismaUserRepository = new PrismaUserRepository();

  const userWithSameEmail = await prismaUserRepository.findByEmail(email);

  if (userWithSameEmail) {
    return reply.status(409).send();
  }

  const passwordHash = await hash(password, 6);

  await prismaUserRepository.create({
    name,
    email,
    passwordHash,
  });

  return reply.status(201).send();
}
