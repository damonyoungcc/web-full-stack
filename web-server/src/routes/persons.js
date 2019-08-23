const Router = require('koa-router');
const jwt = require('koa-jwt');
const router = new Router({ prefix: '/api/persons' });
const {
  findAll,
  create,
  delete: del,
  update,
  checkAuthUser,
  checkPersonExist,
} = require('../controllers/persons');
const { tokenSecret } = require('../config');

// 登录认证
const auth = jwt({ secret: tokenSecret });

router.get('/list', findAll);
router.post('/create', auth, checkAuthUser, create);
router.post('/delete', auth, checkAuthUser, checkPersonExist, del);
router.post('/update', auth, checkAuthUser, checkPersonExist, update);
module.exports = router;

