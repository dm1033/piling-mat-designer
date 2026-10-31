import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  defaults,
  runCalculation,
  decodeProjects,
  STORAGE_KEY,
  type Form,
  type Calculation,
  type Project,
} from "./model";
import "./style.css";

function App() {
  const [form, setForm] = useState<Form>({ ...defaults });
  const [calculation, setCalculation] = useState<Calculation | null>(null);
  const [tab, setTab] = useState<"design" | "projects" | "about">("design");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  function change<K extends keyof Form>(key: K, value: Form[K]) {
    setForm(previous => ({ ...previous, [key]: value }));
    setCalculation(null);
    setError("");
    setMessage("Inputs changed. Calculate to update the result.");
  }
  function navigate(next: typeof tab) {
    setError("");
    setMessage("");
    setPendingDelete(null);
    if (next === "projects") {
      try {
        setProjects(decodeProjects(localStorage.getItem(STORAGE_KEY)));
      } catch {
        setError(
          "Saved projects could not be read. Existing data has been left untouched."
        );
      }
    }
    setTab(next);
  }
  function calculate(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    setCalculation(null);
    try {
      setCalculation(runCalculation(form));
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Calculation could not be completed."
      );
    }
  }
  function save() {
    if (!calculation) return;
    if (!form.name.trim()) {
      setError("Enter a project name before saving.");
      return;
    }
    try {
      const current = decodeProjects(localStorage.getItem(STORAGE_KEY));
      const next = [
        {
          id: crypto.randomUUID(),
          savedAt: new Date().toISOString(),
          form: { ...form },
        },
        ...current,
      ];
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: 1, projects: next })
      );
      setProjects(next);
      setError("");
      setMessage("Project snapshot saved on this device.");
    } catch {
      setError(
        "Project could not be saved. Storage may be full, unavailable or damaged. Existing data has been left untouched."
      );
    }
  }
  function remove(id: string) {
    try {
      const next = decodeProjects(localStorage.getItem(STORAGE_KEY)).filter(
        p => p.id !== id
      );
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: 1, projects: next })
      );
      setProjects(next);
      setPendingDelete(null);
      setMessage("Project deleted.");
    } catch {
      setError("Could not delete the project. Please try again.");
    }
  }
  function field(key: keyof Form, label: string, help?: string) {
    return (
      <label className="field" key={key}>
        <span>{label}</span>
        <input
          type="number"
          step="any"
          inputMode="decimal"
          required
          value={String(form[key])}
          onChange={e => change(key, e.target.value as never)}
        />
        {help && <small>{help}</small>}
      </label>
    );
  }
  const r = calculation?.result;
  return (
    <>
      <header>
        <div className="brand-mark" aria-hidden="true">
          TW
        </div>
        <div>
          <strong>Piling Mat Designer</strong>
          <small>Temporary Works Consulting &amp; Design Ltd</small>
        </div>
        <span className="offline">OFFLINE</span>
      </header>
      <nav aria-label="Main navigation">
        {(["design", "projects", "about"] as const).map(t => (
          <button
            key={t}
            aria-current={tab === t ? "page" : undefined}
            onClick={() => navigate(t)}
          >
            {t === "design"
              ? "Calculate"
              : t === "projects"
                ? "Saved projects"
                : "About & privacy"}
          </button>
        ))}
      </nav>
      <main>
        {error && (
          <div className="error no-print" role="alert">
            {error}
          </div>
        )}
        {message && (
          <p className="notice no-print" role="status">
            {message}
          </p>
        )}
        {tab === "design" && (
          <>
            <div className="intro no-print">
              <p className="eyebrow">WORKING PLATFORMS / BR 470</p>
              <h1>
                From site data
                <br />
                to a clear calculation.
              </h1>
              <p>
                Compare platform options, retain project inputs and print a
                draft calculation record.
              </p>
            </div>
            <div className="scope no-print">
              <strong>Design aid • Draft outputs</strong>
              <p>
                Use verified ground investigation and plant load cases. A
                calculated thickness is not construction approval, an
                independent check or a Working Platform Certificate.
              </p>
            </div>
            <form onSubmit={calculate} className="no-print">
              <section>
                <h2>
                  01 <span>Project &amp; ground</span>
                </h2>
                <label className="field">
                  <span>Project name</span>
                  <input
                    maxLength={120}
                    value={form.name}
                    onChange={e => change("name", e.target.value)}
                    placeholder="e.g. Norwich — rig platform A"
                  />
                </label>
                <label className="field">
                  <span>Subgrade type</span>
                  <select
                    value={form.subgradeType}
                    onChange={e =>
                      change(
                        "subgradeType",
                        e.target.value as Form["subgradeType"]
                      )
                    }
                  >
                    <option value="cohesive">Cohesive — clay / silt</option>
                    <option value="granular">Granular — sand / gravel</option>
                  </select>
                </label>
                {form.subgradeType === "cohesive" ? (
                  field(
                    "cu",
                    "Undrained shear strength, cu (kPa)",
                    "Tool range: 20–80 kPa. Use project-specific evidence."
                  )
                ) : (
                  <>
                    {field(
                      "phiSubgrade",
                      "Subgrade friction angle (°)",
                      "Tool range: 25–45°."
                    )}
                    {field(
                      "gammaSubgrade",
                      "Subgrade unit weight (kN/m³)",
                      "Enter the effective value appropriate to the groundwater condition. The engine uses this value directly."
                    )}
                    <label className="check">
                      <input
                        type="checkbox"
                        checked={form.waterTableNear}
                        onChange={e =>
                          change("waterTableNear", e.target.checked)
                        }
                      />
                      Water table within 2 × track width of surface
                    </label>
                    <p className="hint">
                      The groundwater box records the condition; it does not
                      reduce unit weight automatically. Verify the effective
                      unit weight against the project ground model.
                    </p>
                  </>
                )}
              </section>
              <section>
                <h2>
                  02 <span>Platform material</span>
                </h2>
                <div className="grid">
                  {field(
                    "phiPlatform",
                    "Platform friction angle (°)",
                    "35–45°; confirm material properties."
                  )}
                  {field("gammaPlatform", "Platform unit weight (kN/m³)")}
                </div>
                <label className="check">
                  <input
                    type="checkbox"
                    checked={form.useReinforcement}
                    onChange={e => change("useReinforcement", e.target.checked)}
                  />
                  Assess geosynthetic reinforcement
                </label>
                {form.useReinforcement && (
                  <>
                    {field("Tult", "Ultimate tensile strength, Tult (kN/m)")}
                    <p className="hint">
                      The legacy engine uses Td = Tult / 2. Product suitability,
                      reduction factors, installation and the reinforced model
                      need project-specific engineering verification.
                    </p>
                  </>
                )}
              </section>
              <section>
                <h2>
                  03 <span>Verified plant loading</span>
                </h2>
                <p>
                  Use the manufacturer's project load cases and effective loaded
                  dimensions. Nominal average ground pressure is insufficient.
                </p>
                <div className="grid">
                  {field("W", "Track width, W (m)")}
                  {field("L1", "Case 1 effective length, L1 (m)")}
                  {field("L2", "Case 2 effective length, L2 (m)")}
                  {field("q1k", "Case 1 pressure, q1k (kPa)")}
                  {field("q2k", "Case 2 pressure, q2k (kPa)")}
                </div>
              </section>
              <button type="submit" className="primary calculate">
                Calculate draft thickness <span aria-hidden="true">→</span>
              </button>
            </form>
            {calculation && r && (
              <article className="report" aria-label="Calculation result">
                <p className="draft">DRAFT — NOT FOR CONSTRUCTION</p>
                <h2>{form.name || "Untitled project"}</h2>
                <p className="hint">
                  Calculated{" "}
                  {new Date(calculation.calculatedAt).toLocaleString("en-GB")} •
                  App 0.1.0
                </p>
                <div className={`result ${r.status}`}>
                  <span>
                    {r.status === "fail"
                      ? "Review required — no usable design"
                      : "Calculated platform thickness"}
                  </span>
                  <strong>
                    {r.status === "fail" ? "—" : `${r.designThicknessMm} mm`}
                  </strong>
                  <p>{r.summary}</p>
                </div>
                {!r.platformRequired && (
                  <p className="scope">
                    A zero thickness bearing result does not remove the need to
                    assess trafficability, drainage, surface protection, buried
                    features, stability and working-platform management.
                  </p>
                )}
                {r.status !== "fail" && r.designThicknessMm > 0 && (
                  <figure>
                    <svg
                      viewBox="0 0 400 170"
                      role="img"
                      aria-label="Schematic working platform cross-section, not to scale"
                    >
                      <rect
                        x="10"
                        y="90"
                        width="380"
                        height="70"
                        fill="#d1d7cb"
                      />
                      <rect
                        x="10"
                        y="45"
                        width="380"
                        height="45"
                        fill="#d8ad65"
                      />
                      <rect
                        x="160"
                        y="25"
                        width="80"
                        height="20"
                        rx="5"
                        fill="#294d49"
                      />
                      <text x="200" y="73" textAnchor="middle">
                        Platform: {r.designThicknessMm} mm
                      </text>
                      <text x="200" y="131" textAnchor="middle">
                        {form.subgradeType} subgrade
                      </text>
                      {form.useReinforcement && (
                        <line
                          x1="10"
                          y1="88"
                          x2="390"
                          y2="88"
                          stroke="#9c4420"
                          strokeWidth="3"
                          strokeDasharray="8 4"
                        />
                      )}
                    </svg>
                    <figcaption>
                      Schematic only; extent, edge details and construction
                      specification require design.
                    </figcaption>
                  </figure>
                )}
                <h3>Input record</h3>
                <dl className="inputs">
                  {Object.entries(calculation.inputs)
                    .filter(([, v]) => v !== undefined)
                    .map(([k, v]) => (
                      <React.Fragment key={k}>
                        <dt>{k}</dt>
                        <dd>{String(v)}</dd>
                      </React.Fragment>
                    ))}
                </dl>
                <h3>Calculation trace</h3>
                {r.steps.map(step => (
                  <section className="step" key={step.id}>
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>
                    {step.formula && <p className="formula">{step.formula}</p>}
                    <dl className="inputs">
                      {Object.entries(step.values).map(([key, value]) => (
                        <React.Fragment key={key}>
                          <dt>{key}</dt>
                          <dd>{String(value)}</dd>
                        </React.Fragment>
                      ))}
                    </dl>
                    <strong>
                      {String(step.result)} {step.unit} · {step.status}
                    </strong>
                  </section>
                ))}
                <p className="scope">
                  Software calculation only. Not a signed design, independent
                  check, permit to load or Working Platform Certificate. Verify
                  the method, assumptions, ground model, rig loads, drainage,
                  edges and adjacent excavations before any construction use.
                  Source engine: c4495a8. Android conversion has not
                  independently validated BR 470 compliance.
                </p>
                <div className="actions no-print">
                  <button onClick={save}>Save project snapshot</button>
                  <button
                    onClick={() => {
                      if (location.host === "appassets.androidplatform.net")
                        location.href = "twcd://print";
                      else window.print();
                    }}
                  >
                    Print / Save draft PDF
                  </button>
                </div>
              </article>
            )}
          </>
        )}
        {tab === "projects" && (
          <>
            <p className="eyebrow">YOUR DEVICE / YOUR PROJECTS</p>
            <h1>Saved projects</h1>
            <p>
              Snapshots remain on this device. Loading restores inputs and
              requires a fresh calculation. Uninstalling or clearing app data
              removes saved projects.
            </p>
            {projects.length === 0 && (
              <section>
                No saved projects yet. Calculate and save a named project to
                start.
              </section>
            )}
            {projects.map(p => (
              <section key={p.id}>
                <h2>{p.form.name}</h2>
                <p>{new Date(p.savedAt).toLocaleString("en-GB")}</p>
                <div className="actions">
                  <button
                    onClick={() => {
                      setForm({ ...p.form });
                      setCalculation(null);
                      setTab("design");
                      setError("");
                      setMessage(
                        "Project loaded. Calculate to generate a fresh result."
                      );
                    }}
                  >
                    Load
                  </button>
                  <button onClick={() => setPendingDelete(p.id)}>Delete</button>
                </div>
                {pendingDelete === p.id && (
                  <div role="alert">
                    <p>Delete this saved snapshot permanently?</p>
                    <div className="actions">
                      <button onClick={() => remove(p.id)}>
                        Confirm delete
                      </button>
                      <button onClick={() => setPendingDelete(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </section>
            ))}
          </>
        )}
        {tab === "about" && (
          <>
            <p className="eyebrow">TWCD / MOBILE EDITION</p>
            <h1>Made for site work.</h1>
            <section>
              <h2>About this edition</h2>
              <p>
                Piling Mat Designer 0.1.0 is an offline calculation aid for
                competent temporary works practitioners. It reuses the existing
                website calculation engine for cohesive and granular subgrades,
                with an optional reinforcement calculation.
              </p>
              <p>
                One paid download is the proposed sales model. This build
                contains no subscription, advertising, account login or in-app
                purchases. The purchase does not include a formal engineering
                appointment or a signed design certificate.
              </p>
              <p>
                BR 470 is a reference to the published guidance; this product is
                not represented as endorsed or certified by BRE.
              </p>
            </section>
            <section>
              <h2>Privacy policy</h2>
              <p>Provider: Temporary Works Consulting &amp; Design Ltd.</p>
              <p>
                This Android edition has no internet permission, analytics or
                advertising SDK. It does not transmit your project data to us.
                Saved project names and inputs are stored locally in the app's
                private storage; Android app backup is disabled.
              </p>
              <p>
                You can delete individual snapshots in Saved projects or remove
                all local data using Android Settings. Data is lost when the app
                is uninstalled. Printed or exported PDFs are saved or shared
                only through the Android print service you select; its handling
                of data is governed by that service.
              </p>
              <p>
                Google Play processes download purchases under Google's own
                policies. If you contact support, we receive the information you
                choose to send and use it to respond to your enquiry.
              </p>
              <p>
                Privacy and support contact: david@temporaryworksconsulting.com
              </p>
              <p>
                Policy date: 30 October 2026. Applies only to this offline
                Android edition.
              </p>
            </section>
          </>
        )}
      </main>
      <footer className="no-print">
        Temporary Works Consulting &amp; Design Ltd · 0.1.0
        <br />
        Engineering judgement remains essential.
      </footer>
    </>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
