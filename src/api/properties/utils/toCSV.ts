import { mkdirSync, existsSync } from "fs";
import XLSX from "xlsx";

interface IProperty {
	parcelInformation: Record<string, string>;
	taxesSummaryTable: Record<string, string>[];
	taxesOwed: Record<string, string>;
}

export const toCSV = (data: IProperty[]) => {
	try {
		if (!existsSync("output")) {
			mkdirSync("output");
		}
	} catch (err) {
		throw new Error("Could not create output directory");
	}

	try {
		for (const property of data) {
			const workBook = XLSX.utils.book_new();
			const parcelInformation = XLSX.utils.json_to_sheet([property.parcelInformation]);
			const taxesSummary = XLSX.utils.json_to_sheet(property.taxesSummaryTable);
			const taxesOwed = XLSX.utils.json_to_sheet([property.taxesOwed]);

			XLSX.utils.book_append_sheet(workBook, parcelInformation, "Parcel Information");
			XLSX.utils.book_append_sheet(workBook, taxesSummary, "Taxes Summary");
			XLSX.utils.book_append_sheet(workBook, taxesOwed, "Taxes Owed");

			XLSX.writeFile(workBook, `output/${property.parcelInformation.pin}.xlsx`);
		}
	} catch (err) {
		throw new Error("Could not write to file");
	}

	return true;
};
