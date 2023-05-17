var express = require('express');
var router = express.Router();
const tasksManageController = require('../controller/tasksManageController');

/* 列出發案歷史紀錄 */
router.get('/poster', function (req, res, next) {
    /**
     * #swagger.tags = ['Tasks']
     * #swagger.summary = '列出發案歷史紀錄 (Get all posted tasks history records)'
     * #swagger.security=[{"Bearer": []}]
    /**
    #swagger.responses[200] = {
      description: '取得成功',
      schema: { $ref: '#/definitions/getPostedTasksHist' }
    }
    #swagger.responses[500] = {
      description: '系統錯誤',
      schema: { $ref: '#/definitions/Error500' }
    }
  */
    tasksManageController.getPostedTasksHist(req, res, next);
});
/* 列出接案歷史紀錄 */
router.get('/helper', function (req, res, next) {
    /**
     * #swagger.tags = ['Tasks']
     * #swagger.summary = '列出接案歷史紀錄 (Get all applied tasks history records)'
     * #swagger.security=[{"Bearer": []}]
    /**
     #swagger.responses[200] = {
        description: '取得成功',
        schema: { $ref: '#/definitions/getAppliedTasksHist' }
    }
    #swagger.responses[500] = {
        description: '系統錯誤',
        schema: { $ref: '#/definitions/Error500' }
    }
*/
  tasksManageController.getAppliedTasksHist(req, res, next);
});

/* 取得任務詳情 */
router.get('/:taskId', function (req, res, next) {
  /**
   * #swagger.tags = ['Tasks']
   * #swagger.summary = '取得任務詳情 (Get task details)'
   * #swagger.security=[{"Bearer": []}]
  /**
   #swagger.responses[200] = {
      description: '取得成功'
  }
  #swagger.responses[500] = {
      description: '系統錯誤',
      schema: { $ref: '#/definitions/Error500' }
  }
*/
  tasksManageController.markRead(req, res, next);
});

/* 刪除任務 */
router.delete('/:taskId', function (req, res, next) {
  /**
   * #swagger.tags = ['Tasks']
   * #swagger.summary = '刪除任務 (Delete task)'
   * #swagger.security=[{"Bearer": []}]
  /**
   #swagger.responses[200] = {
      description: '刪除成功'
  }
  #swagger.responses[500] = {
      description: '系統錯誤',
      schema: { $ref: '#/definitions/Error500' }
  }
*/
  tasksManageController.markRead(req, res, next);
});

/* 案主確認驗收 */
router.post('/confirm-acceptance/:taskId', function (req, res, next) {
  /**
   * #swagger.tags = ['Tasks']
   * #swagger.summary = '案主確認驗收 (Confirm acceptance)'
   * #swagger.security=[{"Bearer": []}]
  /**
   #swagger.responses[200] = {
      description: '確認成功'
  }
  #swagger.responses[500] = {
      description: '系統錯誤',
      schema: { $ref: '#/definitions/Error500' }
  }
*/
  tasksManageController.markRead(req, res, next);
});

/* 幫手上傳驗收內容 */
router.post('/upload-acceptance/:taskId', function (req, res, next) {
  /**
   * #swagger.tags = ['Tasks']
   * #swagger.summary = '幫手上傳驗收內容 (Upload acceptance)'
   * #swagger.security=[{"Bearer": []}]
  /**
   #swagger.responses[200] = {
      description: '上傳成功'
  }
  #swagger.responses[500] = {
      description: '系統錯誤',
      schema: { $ref: '#/definitions/Error500' }
  }
*/
  tasksManageController.markRead(req, res, next);
});

/* 案主確認幫手人選 */
router.post('/confirm-helper/:taskId', function (req, res, next) {
  /**
   * #swagger.tags = ['Tasks']
   * #swagger.summary = '案主確認幫手人選 (Confirm selected helper)'
   * #swagger.security=[{"Bearer": []}]
  /**
   #swagger.responses[200] = {
      description: '確認成功'
  }
  #swagger.responses[500] = {
      description: '系統錯誤',
      schema: { $ref: '#/definitions/Error500' }
  }
*/
  tasksManageController.markRead(req, res, next);
});

module.exports = router;
