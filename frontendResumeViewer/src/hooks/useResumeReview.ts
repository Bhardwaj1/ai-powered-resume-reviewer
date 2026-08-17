import { useState } from "react";
import { reviewResume } from "../api/resume.api";
import type { ReviewData, ReviewStatus } from "../types/resume.types";

export function useResumeReview() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [review, setReview] = useState<ReviewData | null>(null);
  const [status, setStatus] = useState<ReviewStatus>("idle");
  const [error, setError] = useState("");

  const setResume = (file: File | null) => {
    setResumeFile(file);
    setError("");

    if (file) {
      setStatus("idle");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) return;

    setStatus("loading");
    setError("");
    setReview(null);

    try {
      const result = await reviewResume(resumeFile);
      setReview(result);
      setStatus("success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to get review");
      setStatus("error");
    }
  };

  return { resumeFile, setResume, review, status, error, handleSubmit };
}
