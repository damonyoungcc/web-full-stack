const Router = require('koa-router');
const jwt = require('koa-jwt');
const router = new Router({ prefix: '/api/users' });
const { tokenSecret } = require('../config');
const {
  register,
  findAll,
  findByUserName,
  delete: del,
  checkUserExist,
  update,
  login,
  checkAdmin,
  getUserInfo,
} = require('../controllers/users');

const auth = jwt({ secret: tokenSecret });

router.post('/register', findByUserName, register); //注册
router.get('/list', auth, checkAdmin, findAll); // 查询所有已注册用户
router.post('/findByUserName', findByUserName); // 用户名查找特定用户
router.post('/delete', auth, checkAdmin, checkUserExist, del); // 删除
router.post('/update', auth, checkAdmin, checkUserExist, update); // 更新权限
router.post('/login', login); // 登录
router.get('/info', auth, getUserInfo);
module.exports = router;
