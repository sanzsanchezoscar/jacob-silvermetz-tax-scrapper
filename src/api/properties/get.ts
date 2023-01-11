import puppeteer from "puppeteer";

import properties from "../../configuration/parcels";
import { targets } from "../../configuration/puppeteer-targets";
import { toCSV } from "./utils/toCSV";

export const getProperties = async () => {
	const browser = await puppeteer.launch({
		headless: true,
	});

	const page = await browser.newPage();

	await page.goto(properties[0], {
		waitUntil: "domcontentloaded",
	});

	await page.removeAllListeners();

	// GET PARCEL INFORMATION
	const parcelInformation: Record<string, string> = {};
	for (const key in targets) {
		const value = await page.waitForXPath(targets[key as keyof typeof targets]);
		const text = await page.evaluate((el) => el?.textContent, value);
		if (text) parcelInformation[key] = text.split(":")[1];
	}

	// GET TAXES SUMMARY INFORMATION
	const rows = await page.$$("#datalet_div_0 > table:nth-child(3) > tbody > tr");

	const headers: string[] = [];
	const taxesSummaryTable: Record<string, string>[] = [];

	const header = rows.splice(0, 1);

	const headerCells = await header[0].$$("td");

	for (const cell of headerCells) {
		const text = await page.evaluate((el) => el?.textContent, cell);
		if (text) headers.push(text);
	}

	for (const row of rows) {
		const cells = await row.$$("td");

		const taxSummary: Record<string, string> = {};

		for (let i = 0; i < cells.length; i++) {
			const text = await page.evaluate((el) => el?.textContent, cells[i]);
			if (text) taxSummary[headers[i]] = text;
		}

		taxesSummaryTable.push(taxSummary);
	}

	// GET TAXES OWED INFORMATION
	const taxesOwedRows = await page.$$("#Taxes\\ Owed > tbody > tr");

	const taxesOwed: Record<string, string> = {};
	for (const row of taxesOwedRows) {
		const cells = await row.$$("td");

		const key = await page.evaluate((el) => el?.textContent, cells[0]);
		const value = await page.evaluate((el) => el?.textContent, cells[1]);

		if (key?.trim() && value?.trim()) taxesOwed[key] = value;
	}

	await page.close();
	await browser.close();

	toCSV([{ parcelInformation, taxesSummaryTable, taxesOwed }]);

	return { parcelInformation, taxesSummaryTable, taxesOwed };
};
