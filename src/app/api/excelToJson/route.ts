import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

export const runtime = "nodejs"; // Or 'experimental-edge' if using edge runtime

export async function POST(req: NextRequest) {
  try {
    // Extract the file from the request body
    const formData = await req.formData();
    const file = formData.get("file") as Blob;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert the Blob to an ArrayBuffer, then to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Use XLSX to parse the Excel file
    const workbook = XLSX.read(buffer, { type: "buffer" });

    // Initialize an object to store JSON data from all sheets
    const sheetsData: { [sheetName: string]: any[] } = {};

    // Iterate over each sheet and convert to JSON
    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      sheetsData[sheetName] = jsonData;
    });

    // Return the JSON data for all sheets
    return NextResponse.json(sheetsData);
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      { message: "Error processing file" },
      { status: 500 }
    );
  }
}
