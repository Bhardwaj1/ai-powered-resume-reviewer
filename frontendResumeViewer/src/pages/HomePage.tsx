import type { ChangeEvent } from "react";
import { useResumeReview } from "../hooks/useResumeReview";
import ReviewResult from "../components/ReviewResult";

export default function HomePage() {
  const { resumeFile, setResume, review, status, error, handleSubmit } =
    useResumeReview();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setResume(null);
      return;
    }

    if (file.type !== "application/pdf") {
      setResume(null);
      return;
    }

    setResume(file);
  };

  const selectedFileName = resumeFile?.name ?? "No PDF selected yet";
  const isLoading = status === "loading";

  return (
    <main className="page-shell">
      <section className="hero-section">
        <div className="hero-copy">
          <div className="eyebrow">AI-powered resume feedback for job seekers</div>
          <h1>Upload your resume PDF and get a sharper, more ATS-ready review in minutes.</h1>
          <p className="hero-text">
            AI Resume Reviewer scans your resume, scores its effectiveness, and shows
            strengths, weaknesses, and practical improvements so you can apply with
            more confidence.
          </p>

          <div className="hero-pills">
            <span>PDF upload workflow</span>
            <span>ATS-style scoring</span>
            <span>Clear improvement suggestions</span>
          </div>
        </div>

        <div className="hero-card">
          <div className="mini-review-card">
            <span className="mini-badge">Live review experience</span>
            <div className="mini-score-row">
              <div>
                <p className="mini-label">Candidate readiness</p>
                <strong>82/100</strong>
              </div>
              <div className="mini-score-meter">
                <span />
              </div>
            </div>
            <ul className="mini-list">
              <li>Stronger impact statements highlighted</li>
              <li>Missing keywords surfaced for ATS screening</li>
              <li>Actionable rewrite suggestions included</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <div className="primary-column">
          <div className="panel upload-panel">
            <div className="section-heading">
              <span className="section-kicker">Resume upload</span>
              <h2>Start with your latest PDF resume</h2>
              <p>
                Upload a PDF and we’ll extract the text, analyze the content, and
                generate a structured review with scoring and recommendations.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="upload-form">
              <label className={`upload-dropzone ${isLoading ? "is-disabled" : ""}`}>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
                <span className="upload-icon">PDF</span>
                <strong>Choose a resume file</strong>
                <p>Drag and drop is optional. A single PDF works best.</p>
                <span className="file-meta">{selectedFileName}</span>
              </label>

              <div className="form-actions">
                <button type="submit" className="btn" disabled={isLoading || !resumeFile}>
                  {isLoading ? "Reviewing Resume..." : "Review My Resume"}
                </button>
                <p className="helper-text">
                  Best for students, professionals, and career switchers who want fast,
                  honest resume feedback.
                </p>
              </div>
            </form>

            {status === "error" && (
              <div className="error-box">
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>

          {status === "success" && review && <ReviewResult review={review} />}
        </div>

        <aside className="secondary-column">
          <div className="panel info-panel">
            <span className="section-kicker">How it helps</span>
            <h2>What this review focuses on</h2>
            <div className="info-stack">
              <article>
                <h3>ATS alignment</h3>
                <p>
                  Spot formatting and keyword gaps that can prevent your resume from
                  performing well in applicant tracking systems.
                </p>
              </article>
              <article>
                <h3>Recruiter clarity</h3>
                <p>
                  Improve readability, structure, and impact so hiring teams can
                  understand your value quickly.
                </p>
              </article>
              <article>
                <h3>Practical next steps</h3>
                <p>
                  Get concrete suggestions you can use to rewrite bullets, strengthen
                  your summary, and sharpen your story.
                </p>
              </article>
            </div>
          </div>

          <div className="panel checklist-panel">
            <span className="section-kicker">Before you upload</span>
            <h2>Quick checklist</h2>
            <ul className="checklist">
              <li>Use your most recent resume version</li>
              <li>Export as PDF to preserve formatting</li>
              <li>Include measurable achievements where possible</li>
              <li>Keep sections clear and easy to scan</li>
            </ul>
          </div>
        </aside>
      </section>

      <section className="story-section">
        <div className="section-heading section-heading-centered">
          <span className="section-kicker">Why this website exists</span>
          <h2>Resume feedback should be fast, useful, and motivating.</h2>
          <p>
            Most people don’t need vague advice. They need a clearer view of what’s
            working, what’s getting ignored, and what to improve before the next
            application goes out.
          </p>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <h3>Upload once</h3>
            <p>
              No copy-pasting long resume text blocks. Just send the PDF you already use.
            </p>
          </article>
          <article className="feature-card">
            <h3>Understand your score</h3>
            <p>
              See a simple performance signal backed by readable feedback, not just a number.
            </p>
          </article>
          <article className="feature-card">
            <h3>Edit with purpose</h3>
            <p>
              Turn generic resume revisions into targeted updates that improve outcomes.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
