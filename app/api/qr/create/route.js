import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { PrismaClient } from "@prisma/client";

export const runtime = "nodejs";

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function POST(request) {
  try {
    const form = await request.formData();

    const heading = String(form.get("heading") || "").trim();
    const subheading = String(form.get("subheading") || "").trim();
    const comment = String(form.get("comment") || "").trim();
    const logo = form.get("logo");

    // Validate required fields
    if (!heading) {
      return NextResponse.json(
        { error: "Heading is required." },
        { status: 400 }
      );
    }

    if (!subheading) {
      return NextResponse.json(
        { error: "Subheading is required." },
        { status: 400 }
      );
    }

    if (!comment) {
      return NextResponse.json(
        { error: "Comment is required." },
        { status: 400 }
      );
    }

    // Default logo
    let logoData = "/rta-logo.png";

    // Store uploaded logo as Base64 data
    if (logo && typeof logo.arrayBuffer === "function") {
      const bytes = Buffer.from(await logo.arrayBuffer());

      // Maximum logo size: 3 MB
      if (bytes.length > 3 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Logo must be 3 MB or smaller." },
          { status: 400 }
        );
      }

      const mimeType = logo.type || "image/png";

      logoData = `data:${mimeType};base64,${bytes.toString(
        "base64"
      )}`;
    }

    // Create a unique QR record in Neon
    const record = await prisma.qRRecord.create({
      data: {
        heading,
        subheading,
        comment,
        logoData,
      },
    });

    // URL that the QR code will open
    const baseUrl = new URL(request.url).origin;

    const verifyUrl = `${baseUrl}/verify/${record.id}`;

    // Generate a plain black-and-white QR code
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      errorCorrectionLevel: "H",
      margin: 4,
      width: 1200,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    return NextResponse.json({
      success: true,
      id: record.id,
      verifyUrl,
      qrDataUrl,
    });
  } catch (error) {
    console.error("QR generation error:", error);

    return NextResponse.json(
      {
        error: "Failed to create QR record.",
      },
      { status: 500 }
    );
  }
}