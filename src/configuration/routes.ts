import { getProperties } from "../api/properties/get";
import Router from "express";

const router = Router();

router.get("/", (_, res) => {
	res.send("jacob-silvermetz-tax-scrapper");
});

router.get("/properties", async (_, res) => {
	const properties = await getProperties();
	res.send(properties);
});

export default router;
