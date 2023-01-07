import express from "express";
import routes from "./configuration/routes";

import serverConfiguration from "./configuration/server";

const app = express();
const port = serverConfiguration.port;

app.use("/", routes);

app.listen(port, () => {
	console.log(`🚀 Server is running at port ${port}`);
});
