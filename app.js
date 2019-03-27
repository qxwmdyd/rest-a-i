/**
 * Created by zhangyue on 2019/2/14.
 */
import restify from 'restify';
import errors from 'restify-errors';
import orderController from './controller/orderController';
import foodController from './controller/foodController';
import { RES_META } from './util/util';
import { META_CODE } from './util/const';
import config from './config/config';

const server = restify.createServer({
  name: 'rest-api',
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.authorizationParser());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.pre((req, res, next) => {
  res.header('Allow', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  return next();
});

server.get('/hello', (req, res, next) => {
  res.send('Hello World');
  return next();
});

server.get('/error/502', (req, res, next) => {
  next(new errors.BadGatewayError('502!'));
  return next();
});

server.get('/error/404', (req, res, next) => {
  next(new errors.NotFoundError('not found'));
  return next();
});

server.on('restifyError', (req, res, err, cb) => {
  const meta = RES_META(META_CODE.SC_500, err.stack);
  res.send(meta);
  return cb();
});

/* oreder Router */
server.get('/orders', orderController.list);
server.get('/orders/:id', orderController.getById);
server.post('/orders', orderController.add);
server.put('/orders/:id', orderController.updateDetail);
server.put('/payment/orders/:id', orderController.pay);
server.put('/preparation/orders/:id', orderController.prepare);
server.del('/orders/:id', orderController.delete);
server.opts('/orders/:id', orderController.options);

/* food Router */
server.get('/foods', foodController.list);

server.on('error', err => console.log(err));

server.listen(config.PORT, config.URL, () => {
  console.log('%s listening at %s ', server.name, server.url);
});
