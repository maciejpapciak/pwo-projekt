import { rule } from 'graphql-shield';
import { ServerContext } from '../types/customTypes';

export const isAuthenticated = rule({ cache: 'contextual' })(
  async (_parent, _args, { req, context: ctx }: ServerContext, _info) => {
    const actualUser = await ctx.prisma.user.findUnique({
      where: {
        id: req.session.userId,
      },
    });
    if (actualUser?.permissionLevel === 1) {
      return true;
    }
    return new Error("You dont't have permission. Access denied! ");
  },
);

export const isTeacher = rule({ cache: 'contextual' })(
  async (_parent, _args, { req, context: ctx }: ServerContext, _info) => {
    const actualUser = await ctx.prisma.user.findUnique({
      where: {
        id: req.session.userId,
      },
    });
    if (actualUser?.permissionLevel === 2) {
      return true;
    }
    return new Error("You dont't have permission. Access denied! ");
  },
);

export const isAdmin = rule({ cache: 'contextual' })(
  async (_parent, _args, { req, context: ctx }: ServerContext, _info) => {
    const actualUser = await ctx.prisma.user.findUnique({
      where: {
        id: req.session.userId,
      },
    });
    if (actualUser?.permissionLevel === 3) {
      return true;
    }
    return new Error("You dont't have permission. Access denied! ");
  },
);
