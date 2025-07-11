const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const pickUpRoutes = require("./pickupRoutes");
const notificationRoutes = require("./notificationRoutes");
const locationRoutes = require("./locationRoutes");
const badgeRoutes = require("./badgeRoutes");
const rewardRoutes = require("./awardRoutes");
const campaignRoutes = require("./campaignRoutes");
const dropOffLocationRoutes = require("./dropOffLocationRoutes");
const dropOffRoutes = require("./dropOffRoutes");
const materialRoutes = require("./materialRoutes");
// SimpleDropOff routes
const simpleDropOffLocationRoutes = require("./simpleDropOffLocationRoutes");
const simpleDropOffRoutes = require("./simpleDropOffRoutes");

//THINGS MATCH IMPORTS
const thingsMatchAuthRoutes = require("./thingsMatch/auth.route");
const thingsMatchItemRoutes = require("./thingsMatch/item.route");
const thingsMatchMatchRoutes = require("./thingsMatch/match.route.js");
const thingsMatchMessageRoutes = require("./thingsMatch/message.route.js");
const thingsMatchAdminRoutes = require("./thingsMatch/admin/admin.routes.js");
const thingsMatchUsersRoutes = require("./thingsMatch/TMUsers.route.js");

router.use("/auth", authRoutes);
router.use("/profile", userRoutes);
router.use("/pickup", pickUpRoutes);
router.use("/notifications", notificationRoutes);
router.use("/location", locationRoutes);
router.use("/badges", badgeRoutes);
router.use("/reward", rewardRoutes);
router.use("/campaigns", campaignRoutes);
router.use("/dropOff-location", dropOffLocationRoutes);
router.use("/dropOff", dropOffRoutes);
router.use("/materials", materialRoutes);
// SimpleDropOff routes
router.use("/simple-dropoff-locations", simpleDropOffLocationRoutes);
router.use("/simple-dropoffs", simpleDropOffRoutes);

//thingsmatch routes
const thingsMatchPrefix = "/thingsMatch";
router.use(`${thingsMatchPrefix}/auth`, thingsMatchAuthRoutes);
router.use(`${thingsMatchPrefix}/items`, thingsMatchItemRoutes);
router.use(`${thingsMatchPrefix}/matches`, thingsMatchMatchRoutes);
router.use(`${thingsMatchPrefix}/messages`, thingsMatchMessageRoutes);
router.use(`${thingsMatchPrefix}/users`, thingsMatchUsersRoutes);
//TM admin routes
router.use(`${thingsMatchPrefix}/TMadmin`, thingsMatchAdminRoutes);

module.exports = router;
