const MAX_CHARS = 12_000;

export async function extractResumeText(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<string> {
  const lower = filename.toLowerCase();
  const mime = mimeType.toLowerCase();

  if (mime.includes("text/plain") || lower.endsWith(".txt")) {
    return trimResumeText(buffer.toString("utf8"));
  }

  if (mime.includes("pdf") || lower.endsWith(".pdf")) {
    try {
      const { PDFParse } = await import("pdf-parse");
      const parser = new PDFParse({ data: buffer });
      const parsed = await parser.getText();
      await parser.destroy();
      return trimResumeText(parsed.text ?? "");
    } catch {
      throw new Error("Could not read this PDF. Try a .txt export or paste your resume text.");
    }
  }

  throw new Error("Upload a PDF or TXT resume (max 2 MB).");
}

function trimResumeText(raw: string): string {
  const text = raw.replace(/\0/g, " ").replace(/\s+/g, " ").trim();
  if (!text) {
    throw new Error("No text found in the file.");
  }
  return text.slice(0, MAX_CHARS);
}
