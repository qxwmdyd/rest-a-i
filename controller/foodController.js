import errors from 'restify-errors';
import bunyan from 'bunyan';
import { foods } from '../models';
import { RES_META } from '../util/util';
import { META_CODE } from '../util/const';

/**
 * Created by zhangyue on 2019/2/22.
 */


const log = bunyan.createLogger({
  name: 'foodController',
});

module.exports = {
  // Get foods
  async list(req, res, next) {
    try {
      const foodList = await foods.findAll({});
      const meta = RES_META(META_CODE.SC_200, foodList);
      log.info('get foods success!');
      res.send(meta);
      next();
    } catch (err) {
      log.error('get foods failed!');
      return next(new errors.InvalidContentError(err));
    }
  },
};
