import { useEffect, useMemo, useState } from "react";
import type { ReviewData } from "../types/resume.types";

interface ReviewResultProps {
  review: ReviewData;
}

export default function ReviewResult({ review }: ReviewResultProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [visibleEntries, setVisibleEntries] = useState<string[]>([]);
  const [activeEntryIndex, setActiveEntryIndex] = useState<number | null>(null);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const sections = [
    { title: "Strengths", items: review.strengths },
    { title: "Weaknesses", items: review.weaknesses },
    { title: "Suggestions", items: review.suggestions },
  ];
  const entries = useMemo(
    () => [
      {
        key: "summary",
        section: "Summary",
        text: review.summary,
      },
      ...sections.flatMap((section) =>
        section.items.map((item, index) => ({
          key: `${section.title}-${index}`,
          section: section.title,
          kind: "item",
          text: item,
        })),
      ),
    ],
    [review],
  );

  useEffect(() => {
    setDisplayScore(0);

    let frameId = 0;
    let startTime = 0;
    const duration = 900;

    const animateScore = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setDisplayScore(Math.round(review.score * progress));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animateScore);
      }
    };

    frameId = window.requestAnimationFrame(animateScore);

    return () => window.cancelAnimationFrame(frameId);
  }, [review.score]);

  useEffect(() => {
    setVisibleEntries(entries.map(() => ""));
    setActiveEntryIndex(entries.length > 0 ? 0 : null);
    setIsTypingComplete(entries.length === 0);

    let timeoutId = 0;
    let entryIndex = 0;
    let charIndex = 0;

    const typeNextCharacter = () => {
      if (entryIndex >= entries.length) {
        setActiveEntryIndex(null);
        setIsTypingComplete(true);
        return;
      }

      setActiveEntryIndex(entryIndex);

      const currentText = entries[entryIndex].text;
      const nextValue = currentText.slice(0, charIndex + 1);

      setVisibleEntries((previous) => {
        const next = [...previous];
        next[entryIndex] = nextValue;
        return next;
      });

      charIndex += 1;

      if (charIndex < currentText.length) {
        const currentChar = currentText[charIndex];
        const delay = currentChar === " " ? 18 : 30;
        timeoutId = window.setTimeout(typeNextCharacter, delay);
        return;
      }

      entryIndex += 1;
      charIndex = 0;

      if (entryIndex < entries.length) {
        timeoutId = window.setTimeout(typeNextCharacter, 180);
      } else {
        setActiveEntryIndex(null);
        setIsTypingComplete(true);
      }
    };

    timeoutId = window.setTimeout(typeNextCharacter, 160);

    return () => window.clearTimeout(timeoutId);
  }, [entries]);

  const scoreClassName =
    review.score >= 75
      ? "score-card score-good"
      : review.score >= 45
        ? "score-card score-medium"
        : "score-card score-low";

  return (
    <div className="result-box">
      <h2>Review Feedback</h2>
      <div className="review-content">
        <div className={scoreClassName}>
          <div className="score-copy">
            <span className="score-label">ATS Score</span>
            <p className="score-caption">
              {review.score >= 75
                ? "Strong match for ATS parsing"
                : review.score >= 45
                  ? "Decent base, but needs optimization"
                  : "Needs major resume improvements"}
            </p>
          </div>
          <strong className="score-value">{displayScore}/100</strong>
        </div>

        <div className="review-section">
          <h3>Summary</h3>
          <p className="typing-line">
            {visibleEntries[0]}
            {activeEntryIndex === 0 ? (
              <span className="typing-caret" aria-hidden="true" />
            ) : null}
          </p>
        </div>

        {sections.map((section) => {
          const sectionEntries = entries.filter((entry) => entry.section === section.title);
          const sectionVisibleEntries = sectionEntries
            .map((entry) => {
              const entryListIndex = entries.findIndex((item) => item.key === entry.key);

              return {
                key: entry.key,
                text: visibleEntries[entryListIndex] ?? "",
                isActive: activeEntryIndex === entryListIndex,
                fullText: entry.text,
              };
            })
            .filter((entry) => entry.text);

          return (
            <div className="review-section" key={section.title}>
              <h3>{section.title}</h3>
              {section.items.length > 0 ? (
                <ul>
                  {sectionVisibleEntries.map((entry) => (
                    <li className="typing-line" key={entry.key}>
                      {entry.text}
                      {entry.isActive && entry.text.length < entry.fullText.length ? (
                        <span className="typing-caret" aria-hidden="true" />
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : isTypingComplete ? (
                <p>No items available.</p>
              ) : null}
              {section.items.length > 0 && sectionVisibleEntries.length === 0 ? (
                <div className="typing-spacer" aria-hidden="true" />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
