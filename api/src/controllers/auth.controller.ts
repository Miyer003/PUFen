import { FastifyPluginAsync } from 'fastify';
import { AppDataSource } from '../config/db';
import { User } from '../entities/User';
import { PointsAccount } from '../entities/PointsAccount';
import { hashPassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import { registerBodyDto } from '../dto/auth.dto';

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post(
    '/auth/register',
    {
      schema: {
        body: registerBodyDto,
      },
    },
    async (req, reply) => {
      const { username, phone, password } = req.body as {
        username: string;
        phone: string;
        password: string;
      };

      const userRepo = AppDataSource.getRepository(User);
      const exist = await userRepo.findOneBy({ phone });
      if (exist) {
        return reply.status(409).send({ success: false, message: '手机号已存在' });
      }

      const hashed = await hashPassword(password);

      const user = userRepo.create({ username, phone, password: hashed });
      await userRepo.save(user);

      // 自动创建积分账户
      const accountRepo = AppDataSource.getRepository(PointsAccount);
      const account = accountRepo.create({ userId: user.id });
      await accountRepo.save(account);

      const token = signToken({ userId: user.id });

      reply.status(201).send({
        success: true,
        message: '注册成功',
        data: {
          id: user.id,
          username: user.username,
          phone: user.phone,
          isNewUser: user.isNewUser,
          createdAt: user.createdAt,
        },
        token,
      });
    }
  );
};