const express = require("express");
const router = express.Router();
const moduleController = require("../../controllers/admin/moduleController");
const upload = require("../../middlewares/uploadMiddleware");

router.post("/getmodulelist", moduleController.getmodulelist);

router.post("/savemodule", moduleController.savemodule);
router.post("/moduledelete", moduleController.moduledelete);
router.post("/getmodulerecord", moduleController.getmodulerecord);
router.post("/updatelimit", moduleController.updatelimit);
router.post("/getallUsersMeetinglist", moduleController.getallUsersMeetinglist);

router.post("/getallUsersDetaillist", moduleController.getallUsersDetaillist);
router.post("/mettingDelete", moduleController.mettingDelete);
router.post("/getallUserList", moduleController.getallUserList);

router.post("/getallcompnay", moduleController.getallcompnay);
module.exports = router;
