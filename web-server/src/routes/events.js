const Router = require('koa-router');
const jwt = require('koa-jwt');
const { tokenSecret } = require('../config');
const router = new Router({ prefix: '/api/events' });
const {
  findAll,
  update,
  create,
  delete: del,
  checkAuthUser,
  isExistEventTitle,
} = require('../controllers/events');

const auth = jwt({ secret: tokenSecret });

router.post('/create', auth, checkAuthUser, isExistEventTitle, create);
router.get('/list', findAll);
router.post('/update', auth, checkAuthUser, update);
router.post('/delete', auth, checkAuthUser, del);

module.exports = router;
