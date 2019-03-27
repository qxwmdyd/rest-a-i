import errors from 'restify-errors';
import orderService from '../service/orderServices';
import { RES_META } from '../util/util';
import { META_CODE, ORDER_STATUS } from '../util/const';

/**
 * Created by zhangyue on 2019/2/22.
 */
module.exports = {
  // Get orders
  async list(req, res, next) {
    try {
      const orderList = await orderService.list();
      const meta = RES_META(META_CODE.SC_200, orderList);
      res.send(meta);
      next();
    } catch (err) {
      return next(err);
    }
  },

  // Get Single order
  async getById(req, res, next) {
    try {
      const orderInfo = await orderService.getById(req.params.id);
      const meta = RES_META(META_CODE.SC_200, orderInfo);
      res.send(meta);
      next();
    } catch (err) {
      return next(err);
    }
  },

  // Add order
  async add(req, res, next) {
    // Check for JSON
    if (!req.is('application/json')) {
      return next(new errors.InvalidContentError("Expects 'application/json'"));
    }

    try {
      const { order_detail: orderDetail } = req.body;
      const id = await orderService.add({
        order_detail: JSON.stringify(orderDetail),
        status: ORDER_STATUS.ORDERED,
      });
      const meta = RES_META(META_CODE.SC_200, { order_id: id });
      res.send(meta);
      next();
    } catch (err) {
      return next(err);
    }
  },

  // Update order
  async updateDetail(req, res, next) {
    // Check for JSON
    if (!req.is('application/json')) {
      return next(new errors.InvalidContentError("Expects 'application/json'"));
    }

    try {
      const { order_detail: orderDetail } = req.body;
      const { id } = req.params;
      await orderService.update(id, { order_detail: JSON.stringify(orderDetail) });
      const meta = RES_META(META_CODE.SC_200, { order_id: id });
      res.send(meta);
      next();
    } catch (err) {
      return next(err);
    }
  },

  // 付款
  async pay(req, res, next) {
    try {
      const { id } = req.params;
      await orderService.update(id, { status: ORDER_STATUS.PAYMENT });
      const meta = RES_META(META_CODE.SC_200, { order_id: id });
      res.send(meta);
      next();
    } catch (err) {
      return next(err);
    }
  },

  // 准备食物
  async prepare(req, res, next) {
    try {
      const { id } = req.params;
      await orderService.update(id, { status: ORDER_STATUS.PREPARING });
      const meta = RES_META(META_CODE.SC_200, { order_id: id });
      res.send(meta);
      next();
    } catch (err) {
      return next(err);
    }
  },

  // Delete order
  async delete(req, res, next) {
    try {
      await orderService.delete(req.params.id);
      const meta = RES_META(META_CODE.SC_204, '');
      res.send(meta);
      next();
    } catch (err) {
      return next(err);
    }
  },

  // Options
  async options(req, res, next) {
    try {
      const orderInfo = await orderService.getById(req.params.id);
      if (!orderInfo) {
        return next(new errors.ResourceNotFoundError(`There is no order with the id of ${id}`));
      }
      let msg = '';
      if (orderInfo && orderInfo.status === ORDER_STATUS.PREPARING) {
        msg = {
          Allow: 'GET',
        };
      } else {
        msg = {
          Allow: 'PUT,GET',
        };
      }
      const meta = RES_META(META_CODE.SC_204, msg);
      res.send(meta);
      next();
    } catch (err) {
      return next(err);
    }
  },
};
