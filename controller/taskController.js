const mongoose = require('mongoose');
const getHttpResponse = require('../utils/successHandler');
const { appError, handleErrorAsync } = require('../utils/errorHandler');
const User = require('../models/userModel');
const Task = require('../models/taskModel');
const TaskTrans = require('../models/taskTransModel');
const TaskValidator = require('../service/taskValidator');
const getexposurePlanPrices = require('../service/exposurePlan');
const geocoding = require('../utils/geocoding');

const timeFields = {
    published: 'publishedAt',
    unpublished: 'publishedAt',
    closed: 'closedAt',
    deleted: 'deletedAt',
    inProgress: 'inProgressAt',
    submitted: 'submittedAt',
    confirmed: 'confirmedAt',
    completed: 'completedAt',
    expired: 'expiredAt',
};

const taskStatusRole = {
    draft: ['draft', 'published', 'deleted'],
    published: ['unpublished', 'deleted', 'inProgress', 'expired'],
    unpublished: ['published', 'deleted', 'expired'],
    deleted: [],
    inProgress: ['submitted'],
    submitted: ['confirmed'],
    confirmed: ['completed'],
    completed: [],
    expired: [],
};

const tasks = {
    /* 確認地理資訊 */
    checkGeocoding: handleErrorAsync(async (req, res, next) => {
        const { address } = req.query;
        const geocodingResult = await geocoding(address);
        if (geocodingResult.status === 'OK') {
            return res.status(200).json(getHttpResponse({ data: geocodingResult }));
        } else {
            return next(appError(404, '40400', '找不到該地址'));
        }
    }),
    /* 儲存草稿 */
    saveDraft: handleErrorAsync(async (req, res, next) => {
        const validatorResult = TaskValidator.checkDraft(req.body);
        if (!validatorResult.status) {
            return next(appError(400, '40102', validatorResult.msg));
        }
        const draftModel = await Task.create({
            userId: req.user._id,
            title: req.body.title,
            status: 'draft',
            category: req.body.category || null,
            description: req.body.description || null,
            salary: req.body.salary || null,
            exposurePlan: req.body.exposurePlan || null,
            imagesUrl: req.body.imagesUrl || null,
            contactInfo: req.body.contactInfo || null,
            location: req.body.location || null,
            time: {
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
        });
        return res.status(200).json(
            getHttpResponse({
                message: '儲存草稿成功',
                data: {
                    taskId : draftModel._id
                }
            }),
        );
    }),
    /* 發佈草稿 */
    publishDraft: handleErrorAsync(async (req, res, next) => {
        const validatorResult = TaskValidator.checkPublish(req.body);
        if (!validatorResult.status) {
            return next(appError(400, '40102', validatorResult.msg));
        }
        const { title, category, taskTrans, description, salary, exposurePlan, imagesUrl, contactInfo, location } = req.body;
        const userId = req.user._id;
        const taskId = req.params.taskId;
        const address = location.address;
        const geocodingResult = await geocoding(address);
        const task = await Task.findOne({ _id: taskId });
        if (!task) {
            return next(appError(400, '40212', '查無此 TaskId'));
        }
        if (task.status!=='draft') {
            return next(appError(405, '40500', `任務狀態錯誤： ${task.status}`));
        }
        const user = await User.findOne({ _id: userId });
        if (taskTrans.superCoin >= user.superCoin) {
            return next(appError(400, '40211', `超人幣不足： ${user.superCoin}`));
        }
        if (taskTrans.helperCoin >= user.helperCoin) {
            return next(appError(400, '40211', `幫手幣不足： ${user.helperCoin}`));
        }
        if (geocodingResult.status !== 'OK') {
            return next(appError(404, '40400', '找不到該地址'));
        }
        // 更新使用者點數
        user.superCoin -= taskTrans.superCoin ;
        user.helperCoin -= taskTrans.helperCoin ;
        await user.save();
        // 新增一筆交易資訊
        await TaskTrans.create({
            taskId: taskId,
            userId: userId,
            tag: '刊登任務',
            salary: salary,
            exposurePlan: getexposurePlanPrices(exposurePlan),
            platform: 0,
            superCoin: -taskTrans.superCoin,
            helperCoin: -taskTrans.helperCoin,
            desc: ['預扣薪水', exposurePlan],
            role: '案主',
        });
        const locationFormat = {
            city: req.body.location.city,
            dist: req.body.location.dist,
            address: req.body.location.address,
            longitude: geocodingResult.location.lng,
            latitude: geocodingResult.location.lat
        }
        // 將草稿更新為正式發佈
        await Task.findByIdAndUpdate(
            {
                _id: req.params.taskId,
            },
            {
            userId: userId,
            title: title,
            status: 'publish',
            category: category,
            description: description,
            salary: salary,
            exposurePlan: exposurePlan,
            imagesUrl: imagesUrl,
            contactInfo: contactInfo,
            location: locationFormat,
            time: {
              updatedAt: Date.now(),
              publishedAt: Date.now()
            },
        });
        res.status(200).json(
            getHttpResponse({
                message: '發佈草稿成功'
            }),
        );
    }),
    /* 取得草稿 */
    getDraft: handleErrorAsync(async (req, res, next) => {
        const taskId = req.params.taskId;
        const task = await Task.findOne({ _id: taskId }).lean();
        if (!task) {
            return next(appError(400, '40212', '查無此 TaskId'));
        }
        if (task.status!=='draft') {
            return next(appError(405, '40500', `任務狀態錯誤： ${task.status}`));
        }
        delete task.__v;
        task.taskId = task._id;
        delete task._id;
        delete task.location.landmark;
        delete task.location.longitude;
        delete task.location.latitude;
        res.status(200).json(
            getHttpResponse({
                message: '取得草稿成功',
                data: task,
            }),
        );
    }),
    /* 更新草稿 */
    updateDraft: handleErrorAsync(async (req, res, next) => {
        const taskId = req.params.taskId;
        const validatorResult = TaskValidator.checkDraft(req.body);
        if (!validatorResult.status) {
            return next(appError(400, '40102', validatorResult.msg));
        }
        const task = await Task.findOne({ _id: taskId, userId: req.user._id });
        if (!task) {
            return next(appError(404, '40401', '找不到任務'));
        }
        if (task.status !== 'draft') {
            return next(appError(405, '40500', `任務狀態錯誤 ${task.status}`));
        }
        await Task.findOneAndUpdate(
            { _id: taskId },
            {
                $set: {
                    title: req.body.title,
                    category: req.body.category || null,
                    description: req.body.description || null,
                    salary: req.body.salary || null,
                    exposurePlan: req.body.exposurePlan || null,
                    imagesUrl: req.body.imagesUrl || null,
                    contactInfo: req.body.contactInfo || null,
                    location: req.body.location || null,
                    'time.updatedAt': Date.now(),
                },
            },
            { new: true },
        );
        return res.status(200).json(
            getHttpResponse({
                message: '更新草稿成功'
            }),
        );
    }),
};

module.exports = tasks;
