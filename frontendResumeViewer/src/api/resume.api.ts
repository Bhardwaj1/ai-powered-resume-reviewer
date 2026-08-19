import type { ReviewApiResponse, ReviewData } from "../types/resume.types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function reviewResume(resumeFile: File): Promise<ReviewData> {
  const formData = new FormData();
  formData.append("resume", resumeFile);

  const res = await fetch(`${BASE_URL}/review`, {
    method: "POST",
    body: formData,
  });

  const data = (await res.json().catch(() => null)) as ReviewApiResponse | null;

  if (!res.ok || !data?.success) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data.data;
}
