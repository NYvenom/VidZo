import { Router } from "express";
import { addToHistory, getUserHistory, login, register } from "../controllers/user.controller.js";



const router = Router();

router.route("/login").post(login)
router.route("/register").post(register)
router.route("/add_to_activity").post(addToHistory)
router.route("/get_all_activity").get(getUserHistory)

export default router;


import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectionDb = await mongoose.connect("mongodb+srv://yashgautam06001_db_user:Wz9Y4lCI3CQ2n3cV@cluster0.rphe9oa.mongodb.net/");