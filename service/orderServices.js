import errors from 'restify-errors';
import { orders } from '../models';

/**
 * Created by zhangyue on 2019/2/22.
 */
module.exports = {
  // Get orders
  async list() {
    try {
      const orderList = await orders.findAll({});
      return orderList;
    } catch (err) {
      throw new errors.InvalidContentError(err);
    }
  },

  // Get Single order
  async getById(id) {
    try {
      const orderInfo = await orders.findById(id);
      return orderInfo;
    } catch (err) {
      throw new errors.ResourceNotFoundError(`There is no order with the id of ${id}`);
    }
  },

  // Add order
  async add(order) {
    try {
      const orderInfo = await orders.create(order);
      if (!orderInfo) {
        throw new errors.InternalError('add order failed');
      }
      return orderInfo.id;
    } catch (err) {
      throw new errors.InternalError(err.message);
    }
  },

  // Update order
  async update(id, updateItem) {
    try {
      const orderInfo = await orders.findById(id);
      if (!orderInfo) {
        throw new errors.ResourceNotFoundError(`There is no order with the id of ${id}`);
      }
      const update = await orderInfo.update(updateItem);
      if (!update) {
        throw new errors.InternalError('update order failed');
      }
    } catch (err) {
      throw new errors.InternalError(err);
    }
  },

  // Delete order
  async delete(id) {
    try {
      const orderInfo = await orders.findById(id);
      if (!orderInfo) {
        throw new errors.ResourceNotFoundError(`There is no order with the id of ${id}`);
      }
      const del = await orderInfo.destroy();
      if (!del) {
        throw new errors.InternalError('del order failed');
      }
    } catch (err) {
      throw new errors.InternalError(err);
    }
  },
};
