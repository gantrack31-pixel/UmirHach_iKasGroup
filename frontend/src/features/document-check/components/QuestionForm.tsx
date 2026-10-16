import type { FormEvent } from "react";
import { Icon } from "../../../shared/components/Icon";
import { MAX_QUESTION_LENGTH } from "../model/validateDocument";

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
        <h2 id="question-heading">Проверить документ</h2>
        <span>Ответим по правилам университета</span>
      </div>
      <p className="question-footnote" id="question-hint">
        Вопрос необязателен. Оставьте поле пустым, чтобы проверить комплектность документа.
      </p>
      <form className="question-form" onSubmit={handleSubmit}>
        <label className="visually-hidden" htmlFor="student-question">Ваш вопрос (необязательно)</label>
        <input
          id="student-question"
          name="student-question"
          autoComplete="off"
          value={question}
          disabled={isProcessing}
          maxLength={MAX_QUESTION_LENGTH}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "question-hint question-error" : "question-hint"}
          onChange={(event) => onQuestionChange(event.target.value)}
          placeholder="Например: Какая дата выдачи справки?"
        />
        <button className="button button-primary submit-button" type="submit" disabled={isProcessing}>
          <Icon name="send" size={19} />
          {isProcessing ? "Проверяем…" : question.trim() ? "Задать вопрос" : "Проверить комплектность"}
        </button>
      </form>
      {error && <p className="inline-error" id="question-error" role="alert">{error}</p>}
      
    </section>
  );
}
