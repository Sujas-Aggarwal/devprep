/**
 * pages/QuestionDetail.jsx — dynamic starter code
 */
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { questionsApi } from "../api/questions";
import { submissionsApi } from "../api/submissions";
import CodeEditor from "../components/CodeEditor";
import ResultPanel from "../components/ResultPanel";
import { DifficultyBadge, TagChip } from "../components/Badge";
import Spinner from "../components/Spinner";

function md(text = "") {
  let html = text
    .replace(/```[\w]*\n?([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br/>");

  html = html.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");
  return html;
}

const PlayIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
const BackIcon = () => (
  <svg
    width="12"
    height="12"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    viewBox="0 0 24 24"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

export default function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState(""); // Start empty
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    questionsApi
      .get(id)
      .then((r) => {
        const q = r.data.question;
        setQuestion(q);
        // Only set code if it's currently empty (to avoid overwriting user edits if they stay on page)
        if (q?.starter_code) {
          let sc =
            "//Write your Code Here and Click on Run & Submit for Evaluation.\n\n";
          sc += q.starter_code;
          setCode(sc);
        }
      })
      .catch(() => setToast({ type: "error", msg: "Failed to load question." }))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  async function handleSubmit() {
    if (!code.trim()) {
      return setToast({ type: "error", msg: "Solution cannot be empty." });
    }
    setSubmitting(true);
    setResult(null);
    try {
      const r = await submissionsApi.submit({
        question_id: id,
        code,
        language: "javascript",
      });
      setResult(r.data);
      setTimeout(
        () => resultsRef.current?.scrollIntoView({ behavior: "smooth" }),
        80,
      );
      setToast({
        type: r.data.status === "accepted" ? "success" : "error",
        msg:
          r.data.status === "accepted"
            ? `Success: ${r.data.total}/${r.data.total} passed`
            : `Failed: ${r.data.passed}/${r.data.total} passed`,
      });
    } catch (err) {
      setToast({
        type: "error",
        msg: err.response?.data?.error ?? "Submission failed.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-56px)] bg-light-bg dark:bg-dark-bg">
        <Spinner size={24} />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-56px)] bg-light-bg dark:bg-dark-bg overflow-hidden page-enter">
      {/* Description */}
      <div className="w-[45%] shrink-0 flex flex-col overflow-hidden border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
        <div className="px-6 pt-6 pb-5 border-b border-zinc-100 dark:border-zinc-800/50 shrink-0">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-zinc-400 hover:text-accent-600 transition-colors mb-5"
          >
            <BackIcon /> Problems
          </Link>
          <h1 className="text-lg font-bold text-zinc-900 dark:text-white leading-tight mb-4">
            {question.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <DifficultyBadge difficulty={question.difficulty} />
            {question.tags.map((t) => (
              <TagChip key={t} tag={t} />
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
          <div
            className="prose-custom"
            dangerouslySetInnerHTML={{
              __html: `<p>${md(question.description)}</p>`,
            }}
          />
          <div className="mt-10 space-y-4">
            <h3 className="section-label text-zinc-500">Examples</h3>
            {question.test_cases.slice(0, 2).map((tc, i) => (
              <div
                key={i}
                className="example-block p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 space-y-3"
              >
                <div className="flex gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 w-12 shrink-0 mt-1">
                    Input
                  </span>
                  <code className="text-[12px] font-mono text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-950 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800">
                    {tc.input}
                  </code>
                </div>
                <div className="flex gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 w-12 shrink-0 mt-1">
                    Output
                  </span>
                  <code className="text-[12px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-white dark:bg-zinc-950 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800">
                    {tc.expected_output}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 shrink-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[10px] uppercase tracking-widest text-zinc-400 px-2 py-1 rounded bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
              JavaScript
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="btn-ghost h-8 text-[11px] font-bold uppercase tracking-wider"
              onClick={() => {
                setCode(
                  "//Write your Code Here and Click on Run & Submit for Evaluation.\n\n" +
                    question.starter_code,
                );
                setResult(null);
              }}
              disabled={submitting}
            >
              Reset
            </button>
            <button
              id="submit-btn"
              className="btn-primary h-8 px-5 text-[11px] font-bold uppercase tracking-wider"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <Spinner size={12} />
              ) : (
                <>
                  <PlayIcon /> Run Code
                </>
              )}
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <CodeEditor value={code} onChange={setCode} disabled={submitting} />
        </div>
        {result && (
          <div
            ref={resultsRef}
            className="shrink-0 max-h-80 overflow-y-auto border-t border-zinc-200 dark:border-zinc-800"
          >
            <ResultPanel result={result} />
          </div>
        )}
      </div>

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg shadow-xl border animate-fade-up max-w-xs text-xs font-bold uppercase tracking-wider ${toast.type === "success" ? "bg-emerald-50 dark:bg-zinc-900 border-emerald-500/20 text-emerald-700" : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"}`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
