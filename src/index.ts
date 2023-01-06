import express, { Response } from "express";
import serverConfiguration from "./configuration/server";

const app = express();
const port = serverConfiguration.port;

app.get("/", (_, res: Response) => {
	res.send("jacob-silvermetz-tax-scrapper");
});

app.listen(port, () => {
	console.log(`🚀 Server is running at port ${port}`);
});
