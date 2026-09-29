"use client";

import { useState } from "react";

export default function Home() {
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [comment, setComment] = useState("");
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("/rta-logo.png");
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleLogo(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Please upload an image file.");
      return;
    }
    setLogo(file);
    setLogoPreview(URL.createObjectURL(file));
    setMessage("");
  }

  async function generateQR() {
    if (!heading.trim()) {
      setMessage("Please enter the heading.");
      return;
    }
    if (!subheading.trim()) {
      setMessage("Please enter the subheading.");
      return;
    }
    if (!comment.trim()) {
      setMessage("Please enter the comment.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const form = new FormData();
      form.append("heading", heading);
      form.append("subheading", subheading);
      form.append("comment", comment);
      if (logo) form.append("logo", logo);

      const res = await fetch("/api/qr/create", {
        method: "POST",
        body: form
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to create QR.");

      setQr(data);
    } catch (e) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="container">
        <section className="panel">
          <img className="logo" src={logoPreview} alt="RTA logo" />
          <h1>Unique QR Generator</h1>
          <p className="subtitle">
            Create a unique QR that displays your selected logo and information when scanned.
          </p>

          {message && <div className="error">{message}</div>}

          <label>Heading to Display</label>
          <input
            value={heading}
            onChange={e => setHeading(e.target.value)}
            placeholder="Approved by Road Traffic Authority, Papua New Guinea"
          />

          <label>Upload Logo</label>
          <input type="file" accept="image/*" onChange={handleLogo} />

          <label>Subheading</label>
          <input
            value={subheading}
            onChange={e => setSubheading(e.target.value)}
            placeholder="The Original Card"
          />

          <label>Comment</label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="This is the original card issued by Road Traffic Authority in the month of November"
          />

          <button onClick={generateQR} disabled={loading}>
            {loading ? "Generating..." : "Generate Unique QR"}
          </button>

          {qr && (
            <div className="result">
              <div className="success">Unique QR generated successfully.</div>
              <img className="qr" src={qr.qrDataUrl} alt="Generated unique QR code" />
              <p><strong>QR ID:</strong> {qr.id}</p>
              <p className="url">{qr.verifyUrl}</p>
              <a href={qr.verifyUrl} target="_blank" rel="noreferrer">Open verification page</a>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
