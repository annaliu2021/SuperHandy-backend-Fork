const userRouter = require('./users');
const accountRouter = require('./account');
const homeRouter = require('./home');
const generalRouter = require('./general');
const postTaskRouter = require('./postTask');
const findTaskRouter = require('./findTask');
const notifyRouter = require('./notify');
const tasksRouter = require('./tasksManage');
const { isAuth, isMember } = require('../middleware/auth');
/** 生成 Swagger 套件 */
const swaggerUI = require('swagger-ui-express');
const swaggerFile = require('../swagger-output.json');

module.exports = (app) => {
    app.use('/', userRouter);
    app.use('/account', isAuth, accountRouter);
    app.use('/home', homeRouter);
    app.use('/general', generalRouter);
    app.use('/find-task', findTaskRouter);
    app.use('/post-task', isAuth, postTaskRouter);
    app.use('/notifications', isAuth, notifyRouter);
    app.use('/tasks/management', isAuth, tasksRouter);
    app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerFile));
};
