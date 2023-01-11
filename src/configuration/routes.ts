import { getProperties } from "../api/properties/get";
import Router from "express";

const router = Router();

router.get("/", (_, res) => {
	res.send("jacob-silvermetz-tax-scrapper");
});

router.get("/properties", async (_, res) => {
	try {
		const properties = await getProperties();
		res.send(properties);
	} catch (error) {
		console.log(error);
		res.status(500);
	}
});

export default router;
