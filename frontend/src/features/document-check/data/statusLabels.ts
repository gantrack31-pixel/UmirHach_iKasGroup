import type { CheckStatus, StatusContent } from "../types/documentCheck";

export const checkStatuses: CheckStatus[] = ["success", "warning", "unknown"];

export const statusContent: Record<CheckStatus, StatusContent> = {
  success: {
    label: "Соответствует требованиям",
    title: "Ответ помощника деканата",
    answer: "Документ подходит. В справке указаны обязательные данные: ФИО, вуз, период обучения, дата выдачи, подпись и печать.",
    icon: "✓",
  },
  warning: {
    label: "Есть замечания",
    title: "Найдены замечания",
    answer: "Основные данные распознаны, но перед подачей проверьте документ: некоторые сведения могут потребовать подтверждения в деканате.",
    icon: "!",
  },
  unknown: {
    label: "Недостаточно данных",
    title: "Нужно уточнить документ",
    answer: "Не всех данных достаточно для уверенной проверки. Загрузите более чёткий документ или уточните вопрос у деканата.",
    icon: "?",
  },
};