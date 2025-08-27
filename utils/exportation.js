import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

export function exportToPdf(data, columns, fileName = "export") {
	const orientation = columns.length > 6 ? "landscape" : "portrait";
	const doc = new jsPDF({
		orientation,
		format: "a4"
	});
	const logoUrl = '/images/timo.png';
	doc.addImage(logoUrl, 'PNG', 10, 10, 30, 15);
	doc.setFont("courier", "bold"); // font face, style
	doc.setFontSize(14);
	doc.setTextColor(40);
	doc.text(`Liste des ${fileName}`, 15, 30);

	autoTable(doc, {
		head: [columns],
		body: data.map(row => columns.map(col => row[col] ?? "")),
		startY: 37,
	});
	doc.save(`${fileName}.pdf`);
}

export function exportToExcel(data, fileName = "export") {
	const worksheet = XLSX.utils.json_to_sheet(data);
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, "Données");

	const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
	const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
	saveAs(blob, `${fileName}.xlsx`);
}

export const handleExport = async (type, format) => {
	const toastId = toast.loading("Préparation du téléchargement...");

	try {
		let data = [];

		if (type === "Employés") {
			const res = await fetch("/api/employes/export");
			data = await res.json();
		} else if (type === "Dépenses") {
			const res = await fetch("/api/depenses/export");
			data = await res.json();
		} else if (type === "Clients") {
			const res = await fetch("/api/clients/export");
			data = await res.json();
		} else if (type === "Projets") {
			const res = await fetch("/api/projets/export");
			data = await res.json();
		} else if (type === "Congés") {
			const res = await fetch("/api/conges/export");
			data = await res.json();
		}

		if (!data.length) {
			toast.error("Aucune donnée à exporter.", { id: toastId });
			return;
		}

		const today = new Date().toISOString().slice(0, 10); // Date du jour pour le nom du fichier
		const fileName = `${type}|${today}`;

		if (format === "excel") {
			exportToExcel(data, fileName);
		} else if (format === "pdf") {
			const columns = Object.keys(data[0]);
			exportToPdf(data, columns, fileName);
		}

		toast.success("Téléchargement prêt !", { id: toastId });
	} catch (error) {
		console.error("Erreur lors de l'export :", error);
		toast.error("Erreur lors de l'exportation.", { id: toastId });
	}
};