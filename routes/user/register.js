const express = require("express");
const router = express.Router();
const registerController = require("../../controllers/user/registerController");
const uploadDocsMiddleware = require("../../middlewares/uploadDocsMiddleware");

// Define the POST /login route
router.post("/getallcountry", registerController.getallcountry);
router.post("/userRegister", registerController.userRegister);
router.post("/userLogin", registerController.userLogin);
router.post("/getModules", registerController.getModules);
router.post("/registerforZoom", registerController.registerforZoom);
router.post("/selectModule", registerController.selectModule);
router.post("/joinZoomMeeting", registerController.joinZoomMeeting);
router.post("/videolimitsave", registerController.videolimitsave);
router.post("/getcategories", registerController.getcategories);
router.post(
  "/uploadDocuments",
  uploadDocsMiddleware.array("documents"),
  registerController.uploadDocuments
);
router.post("/checkCompanyEmail", registerController.checkCompanyEmail);
router.post(
  "/getallSubscriptionPlan",
  registerController.getallSubscriptionPlan
);
router.post("/usersubscription", registerController.usersubscription);
router.post(
  "/checkmodulesubscription",
  registerController.checkmodulesubscription
);

module.exports = router;
