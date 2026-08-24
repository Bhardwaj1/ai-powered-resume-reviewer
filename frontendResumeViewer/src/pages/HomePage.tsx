import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { useResumeReview } from "../hooks/useResumeReview";
import ReviewResult from "../components/ReviewResult";

function FloatingOrbs() {
  return (
    <div className="orbs" aria-hidden>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />
    </div>
  );
}

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        let start = 0;
        const step = () => {
          start += Math.ceil((target - start) / 8) || 1;
          setCount(Math.min(start, target));
          if (start < target) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}</span>;
}

export default function HomePage() {
  const { resumeFile, setResume, review, status, error, handleSubmit } = useResumeReview();
  const [dragOver, setDragOver] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setResume(file?.type === "application/pdf" ? file : null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type === "application/pdf") setResume(file);
  };

  const isLoading = status === "loading";
  const selectedFileName = resumeFile?.name ?? null;

  return (
    <main className={`page-shell ${mounted ? "is-mounted" : ""}`}>
      <FloatingOrbs />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-left">
          <div className="badge-pill">
            <span className="badge-dot" />
            AI-Powered Resume Intelligence
          </div>

          <h1 className="hero-title">
            Land your <span className="gradient-text">dream job</span> with a
            smarter resume
          </h1>

          <p className="hero-sub">
            Upload your PDF and get an instant ATS score, keyword gaps, impact
            analysis, and actionable rewrites — all in under 30 seconds.
          </p>

          <div className="hero-stats">
            {[
              { value: 94, suffix: "%", label: "ATS pass rate" },
              { value: 30, suffix: "s", label: "Avg. review time" },
              { value: 12, suffix: "k+", label: "Resumes reviewed" },
            ].map(({ value, suffix, label }) => (
              <div className="stat-item" key={label}>
                <strong>
                  <AnimatedCounter target={value} />
                  {suffix}
                </strong>
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="hero-tags">
            {["PDF Upload", "ATS Scoring", "Keyword Analysis", "Rewrite Tips"].map((t) => (
              <span className="tag" key={t}>{t}</span>
            ))}
          </div>
        </div>

        <div className="hero-right">
          <div className="score-preview">
            <div className="score-preview-header">
              <span className="live-dot" />
              Live preview
            </div>
            <div className="score-ring-wrap">
              <svg viewBox="0 0 120 120" className="score-ring">
                <defs>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
                <circle cx="60" cy="60" r="52" className="ring-track" />
                <circle cx="60" cy="60" r="52" className="ring-fill" />
              </svg>
              <div className="score-ring-inner">
                <strong>82</strong>
                <span>/100</span>
              </div>
            </div>
            <p className="score-preview-label">Candidate Readiness Score</p>
            <ul className="preview-list">
              <li><span className="check">✓</span> Strong impact statements</li>
              <li><span className="check">✓</span> ATS keyword gaps surfaced</li>
              <li><span className="check">✓</span> Rewrite suggestions ready</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── UPLOAD + SIDEBAR ── */}
      <section className="content-grid">
        <div className="primary-col">
          <div className="glass-panel upload-panel">
            <div className="panel-header">
              <span className="kicker">Resume Upload</span>
              <h2>Drop your resume, get instant feedback</h2>
              <p>We extract, analyze, and score your PDF in seconds.</p>
            </div>

            <form onSubmit={handleSubmit} className="upload-form">
              <label
                className={`dropzone ${dragOver ? "drag-active" : ""} ${isLoading ? "is-disabled" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
                <div className="dropzone-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <polyline points="9 15 12 12 15 15" />
                  </svg>
                </div>
                <strong className="dropzone-title">
                  {dragOver ? "Release to upload" : "Drag & drop your PDF here"}
                </strong>
                <p className="dropzone-sub">or click to browse files</p>
                {selectedFileName ? (
                  <div className="file-chip">
                    <span className="file-chip-icon">📄</span>
                    {selectedFileName}
                  </div>
                ) : (
                  <span className="dropzone-hint">PDF files only · Max 10 MB</span>
                )}
              </label>

              <div className="form-footer">
                <button
                  type="submit"
                  className={`cta-btn ${isLoading ? "is-loading" : ""}`}
                  disabled={isLoading || !resumeFile}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner" />
                      Analyzing Resume…
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      Review My Resume
                    </>
                  )}
                </button>
                <p className="form-hint">Free · No sign-up required · Instant results</p>
              </div>
            </form>

            {status === "error" && (
              <div className="error-banner">
                <span>⚠</span> {error}
              </div>
            )}
          </div>

          {status === "success" && review && <ReviewResult review={review} />}
        </div>

        <aside className="secondary-col">
          <div className="glass-panel">
            <span className="kicker">How It Helps</span>
            <h2>What we analyze</h2>
            <div className="info-cards">
              {[
                { icon: "🎯", title: "ATS Alignment", desc: "Spot formatting and keyword gaps that block ATS screening." },
                { icon: "👁", title: "Recruiter Clarity", desc: "Improve structure so hiring teams grasp your value instantly." },
                { icon: "✏️", title: "Actionable Rewrites", desc: "Concrete bullet rewrites, summary improvements, and more." },
              ].map(({ icon, title, desc }) => (
                <div className="info-card" key={title}>
                  <span className="info-icon">{icon}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel checklist-panel">
            <span className="kicker">Before You Upload</span>
            <h2>Quick checklist</h2>
            <ul className="checklist">
              {[
                "Use your most recent resume version",
                "Export as PDF to preserve formatting",
                "Include measurable achievements",
                "Keep sections clear and scannable",
              ].map((item) => (
                <li key={item}>
                  <span className="check-mark">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section">
        <div className="features-header">
          <span className="kicker">Why It Works</span>
          <h2>Resume feedback that's fast, honest, and actionable</h2>
          <p>No vague advice. Just a clear view of what's working and what to fix.</p>
        </div>

        <div className="features-grid">
          {[
            { num: "01", title: "Upload Once", desc: "No copy-pasting. Send the PDF you already use and we handle the rest." },
            { num: "02", title: "Understand Your Score", desc: "A performance signal backed by readable feedback, not just a number." },
            { num: "03", title: "Edit With Purpose", desc: "Turn generic revisions into targeted updates that improve outcomes." },
          ].map(({ num, title, desc }) => (
            <div className="feature-card" key={num}>
              <span className="feature-num">{num}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
