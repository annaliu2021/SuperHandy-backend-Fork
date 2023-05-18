const mongoose = require('mongoose');
const { appError, handleErrorAsync } = require('../utils/errorHandler');
const getHttpResponse = require('../utils/successHandler');
const Notify = require('../models/notifyModel');
const User = require('../models/userModel');
const Task = require('../models/taskModel');
const TaskTrans = require('../models/taskTransModel');

const statusMapping = {
    draft: '草稿',
    published: '媒合中',
    inProgressed: '進行中',
    submitted: '進行中',
    confirmed: '已完成',
    completed: '已完成',
    unpublished: '已下架',
    deleted: '未成立',
};

const tasks = {
    getPostedTasksHist: handleErrorAsync(async (req, res, next) => {
        const userId = req.user._id;
        const tasks = await Task.find({ userId: userId }).populate({
            path: 'helpers.helperId',
            select: 'lastName firstName',
        });
        const formattedData = tasks.map((task) => {
            const helper = task.helpers.find((helper) => helper.status === 'paired');
            const helperName = helper ? `${helper.helperId.lastName}${helper.helperId.firstName}` : '';
            return {
                taskId: task._id,
                title: task.title,
                isUrgent: task.isUrgent,
                status: statusMapping[task.status] || task.status,
                salary: task.salary,
                address: `${task.location.city}${task.location.dist}${task.location.address}`,
                createdAt: task.time.createdAt,
                publishedAt: task.time.publishedAt,
                expiredAt: task.time.expiredAt,
                helper: helperName,
            };
        });
        res.status(200).json(
            getHttpResponse({
                message: '取得成功',
                data: formattedData,
            }),
        );
    }),
    getAppliedTasksHist: handleErrorAsync(async (req, res, next) => {
        const userId = req.user._id;
        const tasks = await Task.find({
            helpers: {
                $elemMatch: {
                    helperId: userId,
                    status: 'paired',
                },
            },
        }).populate({
            path: 'userId',
            select: 'lastName firstName',
        });
        const formattedTasks = tasks.map((task) => {
            const posterName = task.userId ? `${task.userId.lastName}${task.userId.firstName}` : '';
            return {
                taskId: task._id,
                title: task.title,
                isUrgent: task.isUrgent,
                status: statusMapping[task.status] || task.status,
                salary: task.salary,
                address: `${task.location.city}${task.location.dist}${task.location.address}`,
                createdAt: task.time.createdAt,
                publishedAt: task.time.publishedAt,
                expiredAt: task.time.expiredAt,
                poster: posterName,
            };
        });
        res.status(200).json(
            getHttpResponse({
                message: '取得成功',
                data: formattedTasks,
            }),
        );
    }),
    getTaskDetails: handleErrorAsync(async (req, res, next) => {
        const userId = req.user._id;
        const taskId = req.params.taskId;
        let role;
        if (!mongoose.isValidObjectId(taskId)) {
            return next(appError(400, '40104', 'Id 格式錯誤'));
        }
        const task = await Task.findOne({ _id: taskId })
            .populate({
                path: 'helpers.helperId',
                select: 'lastName firstName',
            })
            .populate({
                path: 'userId',
                select: 'lastName firstName',
            });
        if (!task) {
            return next(appError(404, '40212', '查無此任務'));
        }
        const disallowedStatuses = ['draft', 'deleted'];
        if (disallowedStatuses.includes(task.status)) {
            return next(appError(400, '40214', '任務狀態錯誤'));
        }
        const isTaskOwner = task.userId._id.toString() === userId.toString();
        const isTaskHelper = task.helpers.some((helper) => {
            return helper.status === 'paired' && helper.helperId._id.toString() === userId.toString();
        });
        const helper = task.helpers.find((helper) => helper.status === 'paired');
        const helperName = helper ? `${helper.helperId.lastName}${helper.helperId.firstName}` : '';
        const posterName = task.userId ? `${task.userId.lastName}${task.userId.firstName}` : '';
        let formatHelpers;
        if (isTaskOwner) {
            role = '案主';
            formatHelpers = task.helpers.map((helper) => ({
                helperId: helper.helperId._id,
                status: helper.status,
                lastName: helper.helperId.lastName,
            }));
        } else if (isTaskHelper) {
            role = '幫手';
            formatHelpers = task.helpers
                .filter((helper) => helper.status === 'paired')
                .map((helper) => ({
                    helperId: helper.helperId._id,
                    status: helper.status,
                    lastName: helper.helperId.lastName,
                }));
        } else {
            return next(appError(400, '40212', '查無此任務'));
        }
        const formattedTask = {
            taskId: task._id,
            role: role,
            publishedAt: task.time.publishedAt,
            status: statusMapping[task.status] || '',
            helper: helperName,
            poster: posterName,
            progressBar: {
                publishedAt: task.time.publishedAt,
                inProgressAt: task.time.inProgressAt,
                submittedAt: task.time.submittedAt,
                confirmedAt: task.time.confirmedAt,
                completedAt: task.time.completedAt,
            },
            title: task.title,
            isUrgent: task.isUrgent,
            salary: task.salary,
            address: `${task.location.city}${task.location.dist}${task.location.address}`,
            category: task.category,
            description: task.description,
            imgUrls: task.imgUrls,
            helpers: formatHelpers,
        };
        res.status(200).json(
            getHttpResponse({
                message: '取得成功',
                data: formattedTask,
            }),
        );
    }),
    deleteTask: handleErrorAsync(async (req, res, next) => {
        const userId = req.user._id;
        const taskId = req.params.taskId;
        if (!mongoose.isValidObjectId(taskId)) {
            return next(appError(400, '40104', 'Id 格式錯誤'));
        }
        if (!task) {
            return next(appError(400, '40212', '查無此任務'));
        }
        if (task.userId.toString() !== req.user._id.toString()) {
            return next(appError(400, '40302', '沒有權限'));
        }
        if (!["published", "unpublished"].includes(task.status)) {
            return next(appError(400, '40214', `任務狀態錯誤： ${task.status}`));
        }
        const tasks = await Task.find({ _id: taskId })

        const formattedData = tasks.map((task) => {
            const helper = task.helpers.find((helper) => helper.status === 'paired');
            const helperName = helper ? `${helper.helperId.lastName}${helper.helperId.firstName}` : '';
            return {
                taskId: task._id,
                title: task.title,
                isUrgent: task.isUrgent,
                status: statusMapping[task.status] || task.status,
                salary: task.salary,
                address: `${task.location.city}${task.location.dist}${task.location.address}`,
                createdAt: task.time.createdAt,
                publishedAt: task.time.publishedAt,
                expiredAt: task.time.expiredAt,
                helper: helperName,
            };
        });
        res.status(200).json(
            getHttpResponse({
                message: '刪除成功',
                data: formattedData,
            }),
        );
    }),
};

module.exports = tasks;
