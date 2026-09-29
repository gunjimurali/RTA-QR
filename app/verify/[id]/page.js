import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default async function Verify({ params }) {
  const { id } = await params;

  // Find the QR record from Neon PostgreSQL
  const record = await prisma.qRRecord.findUnique({
    where: {
      id,
    },
  });

  // If the QR ID doesn't exist
  if (!record) {
    notFound();
  }

  return (
    <main className="verify">
      <section className="verify-card">
        {/* Uploaded logo */}
        <img
          className="verify-logo"
          src={record.logoData}
          alt="Verification logo"
        />

        {/* Heading */}
        <h1>{record.heading}</h1>

        {/* Subheading */}
        <h2>{record.subheading}</h2>

        {/* Comment */}
        <div className="comment">
          {record.comment}
        </div>

        {/* Unique QR ID */}
        <div className="qr-id">
          Verification ID: {record.id}
        </div>
      </section>
    </main>
  );
}