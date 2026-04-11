import type { AIQuestionAnswer } from "@/lib/dashboardTypes";
import SectionCard from "@/components/dashboard/SectionCard";

type RecommendationQuestionsProps = {
  questions: string[];
  selectedQuestion: string;
  answer: AIQuestionAnswer | null;
  loading: boolean;
  error: string;
  onAsk: (question: string) => void;
};

export default function RecommendationQuestions({
  questions,
  selectedQuestion,
  answer,
  loading,
  error,
  onAsk,
}: RecommendationQuestionsProps) {
  return (
    <SectionCard
      title="Recommendation Questions"
      subtitle="Ask one-click strategic questions against the current dashboard summary."
    >
      <div className="flex flex-wrap gap-3">
        {questions.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => onAsk(question)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              selectedQuestion === question
                ? "bg-slate-950 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {question}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-4 h-28 animate-pulse rounded-2xl bg-slate-100" />
      ) : null}

      {!loading && error ? (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
          {error}
        </div>
      ) : null}

      {!loading && answer ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
          <p className="text-sm font-semibold text-slate-900">{answer.question}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">{answer.answer}</p>
        </div>
      ) : null}
    </SectionCard>
  );
}
