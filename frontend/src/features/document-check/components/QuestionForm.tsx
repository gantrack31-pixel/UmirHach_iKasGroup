import type { FormEvent } from "react";
import { Icon } from "../../../shared/components/Icon";

type QuestionFormProps = {
  question: string;
  isProcessing: boolean;
  error: string;
  onQuestionChange: (question: string) => void;
  onSubmit: () => void;
};

export function QuestionForm({ question, isProcessing, error, onQuestionChange, onSubmit }: QuestionFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <section className="question-panel" aria-labelledby="question-heading">
      <div className="question-title">
        <Icon name="chat" size={28} />
        <h2 id="question-heading">Вопрос студента</h2>
        <span>Ответим по правилам университета</span>
      </div>
      <form className="question-form" onSubmit={handleSubmit}>
        <label className="visually-hidden" htmlFor="student-question">Ваш вопрос</label>
        <input
          id="student-question"
          name="student-question"
          autoComplete="off"
          value={question}
          disabled={isProcessing}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "question-error" : undefined}
          onChange={(event) => onQuestionChange(event.target.value)}
          placeholder="Например: Хватит ли этой справки для перевода на второй курс?"
        />
        <button className="button button-primary submit-button" type="submit" disabled={isProcessing}>
          <Icon name="send" size={19} />
          {isProcessing ? "Проверяем…" : "Проверить"}
        </button>
      </form>
      {error && <p className="inline-error" id="question-error" role="alert">{error}</p>}
      
    </section>
  );
}
