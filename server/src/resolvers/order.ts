import { ApolloError } from 'apollo-server-express';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import {
  Order,
  CreateOrderInput,
  UdpdateOrderInput,
  DeleteOrderInput,
} from '../entities/Order';
import { ServerContext } from '../types/customTypes';
import logger from '../utils/logger';

@Resolver(Order)
export class OrderResolver {
  @Mutation(() => [Order])
  async retrieveOrders(
    @Ctx() { context: ctx, req }: ServerContext,
  ): Promise<Order[] | null> {
    try {
      const orderCollection = await ctx.prisma.order.findMany({
        where: {
          userId: req.session.userId,
        },
      });
      return orderCollection;
    } catch (err) {
      logger.error('error in retrieveOrders()');
      throw new ApolloError(err);
    }
  }

  @Mutation(() => Order)
  async createOrder(
    @Arg('options', () => CreateOrderInput)
    options: CreateOrderInput,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<Order | null> {
    try {
      const newOrder = await ctx.prisma.order.create({
        data: {
          courseId: options.courseId,
          userId: options.userId,
        },
      });
      return newOrder;
    } catch (err) {
      logger.error('error in createOrder()');
      throw new ApolloError(err);
    }
  }

  @Mutation(() => Order)
  async updateOrder(
    @Arg('options', () => UdpdateOrderInput) options: UdpdateOrderInput,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<Order | null> {
    try {
      const updatedOrder = await ctx.prisma.order.update({
        where: { id: options.id || undefined },
        data: {
          courseId: options.courseId,
          userId: options.userId,
        },
      });
      return updatedOrder;
    } catch (err) {
      logger.error('error in updateOrder()');
      throw new ApolloError(err);
    }
  }

  @Mutation(() => Order)
  async deleteOrder(
    @Arg('options', () => DeleteOrderInput) options: DeleteOrderInput,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<Order | null> {
    try {
      const deleteOrder = await ctx.prisma.order.delete({
        where: {
          id: options.id,
        },
      });
      return deleteOrder;
    } catch (err) {
      logger.error('error in deleteOrder()');
      throw new ApolloError(err);
    }
  }
}
