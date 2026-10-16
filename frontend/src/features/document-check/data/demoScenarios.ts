import type { DocumentCheckResult, DocumentType } from "../types/documentCheck";

export const demoScenarios: Record<DocumentType, DocumentCheckResult> = {
  study_certificate: {
    status: "success",
    fields: [
      { id: "student_name", label: "ФИО", value: "Иванов Иван Иванович", status: "found" },
      { id: "university", label: "Вуз", value: "Московский государственный университет", status: "found" },
      { id: "study_period", label: "Период обучения", value: "01.09.2023 — 30.06.2027", status: "found" },
      { id: "issue_date", label: "Дата выдачи", value: "15.04.2025", status: "found" },
      { id: "signature", label: "Подпись", value: "Присутствует", status: "found" },
      { id: "seal", label: "Печать", value: "Присутствует", status: "found" },
    ],
    answer: "В демонстрационном сценарии справка содержит основные сведения об обучении. Для реальной проверки нужно подключить распознавание документа.",
    sourceTitle: "Демонстрационное основание",
    sourceReference: "Справка об обучении · пример",
    sourceExcerpt: "Показан пример результата интерфейса. Это не официальное заключение и не проверка по нормативному документу.",
  },
  academic_leave_application: {
    status: "warning",
    fields: [
      { id: "student_name", label: "ФИО заявителя", value: "Иванов Иван Иванович", status: "found" },
      { id: "group", label: "Учебная группа", value: "ПИ-21", status: "found" },
      { id: "leave_reason", label: "Причина отпуска", value: "По семейным обстоятельствам", status: "found" },
      { id: "application_date", label: "Дата заявления", value: "Не указана в демо-сценарии", status: "review" },
      { id: "signature_present", label: "Подпись", value: "Требует ручной проверки", status: "review" },
    ],
    answer: "Демонстрационный сценарий показывает замечания к заявлению на академический отпуск. Фактическое содержание загруженного файла в браузере не распознаётся.",
    sourceTitle: "Демонстрационное основание",
    sourceReference: "Заявление на академический отпуск · пример проверки",
    sourceExcerpt: "Для реальной оценки заявления требуется согласованный перечень требований и распознавание его содержимого.",
  },
  internship_certificate: {
    status: "warning",
    fields: [
      { id: "student_name", label: "ФИО", value: "Иванов Иван Иванович", status: "found" },
      { id: "organization", label: "Организация", value: "Не указана в демо-сценарии", status: "missing" },
      { id: "internship_period", label: "Период практики", value: "01.06.2025 — 30.06.2025", status: "found" },
      { id: "signature_and_seal", label: "Подпись и печать", value: "Требуют ручной проверки", status: "review" },
    ],
    answer: "В демонстрационном сценарии не все данные справки о практике подтверждены. Используйте результат только для знакомства с интерфейсом.",
    sourceTitle: "Демонстрационное основание",
    sourceReference: "Справка о практике · пример проверки",
    sourceExcerpt: "Реальные требования к справке о практике необходимо сверить с официальными правилами организации и университета.",
  },
};
