import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { ApiDocumentCheckService } from "../src/features/document-check/services/ApiDocumentCheckService.ts";

afterEach(() => mock.restoreAll());

function responseFixture() {
  return {
    document_type: "study_certificate",
    ocr_text: "ФИО студента: Иванов Иван Иванович\nДата выдачи: 01.09.2026",
    fields: {
      student_name: "Иванов Иван Иванович",
      issue_date: "2026-09-01",
      signature_present: true,
      seal_present: true,
    },
    validation: {
      status: "document_ok",
      missing_fields: [],
      sources: ["rule:3.1", "rule:3.2", "rule:3.3"],
    },
    classification: { intent: "field", field: "issue_date" },
  };
}

async function analyze(payload, status = 200, headers = {}, manualFields = undefined) {
  mock.method(globalThis, "fetch", async () => Response.json(payload, { status, headers }));
  return new ApiDocumentCheckService().analyze({
    file: new File(["test PDF"], "document.pdf", { type: "application/pdf" }),
    documentType: "study_certificate",
    question: "Когда выдали справку?",
    manualFields,
  }, () => {});
}

test("answers a classified field question and preserves OCR text", async () => {
  const payload = responseFixture();
  const result = await analyze(payload);
  assert.match(result.answer, /Дата выдачи: 2026-09-01/);
  assert.deepEqual(result.answerSources, ["field:issue_date"]);
  assert.equal(result.sourceExcerpt, payload.ocr_text);
});

test("uses backend validation status and lists missing field labels", async () => {
  const payload = responseFixture();
  payload.classification = { intent: "validation", field: null };
  payload.validation = {
    status: "missing_fields", missing_fields: ["issue_date"], sources: ["rule:3.1"],
  };
  const result = await analyze(payload);
  assert.equal(result.status, "warning");
  assert.match(result.answer, /Дата выдачи/);
  assert.deepEqual(result.answerSources, ["rule:3.1"]);
});

test("keeps the document status separate from an unanswered field question", async () => {
  const payload = responseFixture();
  payload.fields.issue_date = "не найдено";
  payload.validation = {
    status: "missing_fields", missing_fields: ["issue_date"], sources: ["rule:3.1"],
  };
  const result = await analyze(payload);
  assert.equal(result.status, "warning");
  assert.equal(result.answerable, false);
  assert.match(result.answer, /не найдено/i);
  assert.deepEqual(result.answerSources, []);
});

test("answers false boolean flags without treating them as an unanswered question", async () => {
  const payload = responseFixture();
  payload.fields.signature_present = false;
  payload.classification = { intent: "field", field: "signature_present" };
  payload.validation = {
    status: "missing_fields", missing_fields: ["signature_present"], sources: ["rule:3.2"],
  };
  const result = await analyze(payload);
  assert.equal(result.answerable, true);
  assert.match(result.answer, /Подпись: отсутствует/i);
  assert.deepEqual(result.answerSources, ["field:signature_present"]);
});

test("explains complete validation without claiming the document is accepted", async () => {
  const payload = responseFixture();
  payload.classification = { intent: "validation", field: null };
  const result = await analyze(payload);
  assert.equal(result.status, "success");
  assert.match(result.answer, /все обязательные сведения/i);
  assert.match(result.answer, /сотрудник деканата/i);
  assert.deepEqual(result.answerSources, payload.validation.sources);
  assert.deepEqual(result.validation.actions, []);
});

test("offers actions for missing fields even when the question asks about a found field", async () => {
  const payload = responseFixture();
  payload.fields.student_name = "не найдено";
  payload.fields.signature_present = false;
  payload.fields.seal_present = false;
  payload.validation = {
    status: "missing_fields",
    missing_fields: ["student_name", "signature_present", "seal_present"],
    sources: ["rule:3.1", "rule:3.2", "rule:3.3"],
  };

  const result = await analyze(payload);

  assert.deepEqual(result.validation.actions.map((action) => action.fieldId), payload.validation.missing_fields);
  assert.match(result.validation.actions[0].description, /оригинал/);
  assert.match(result.validation.actions[1].description, /уполномоченного сотрудника вуза/);
  assert.match(result.validation.actions[2].description, /печати вуза/);
  assert.deepEqual(result.validation.actions.map((action) => action.sources), [["rule:3.1"], ["rule:3.2"], ["rule:3.3"]]);
});

test("offers the student's signature action for academic leave without a seal requirement", async () => {
  const payload = responseFixture();
  payload.document_type = "academic_leave_application";
  payload.fields = { student_name: "Иванов Иван Иванович", signature_present: false };
  payload.classification = { intent: "validation", field: null };
  payload.validation = { status: "missing_fields", missing_fields: ["signature_present"], sources: ["rule:4.2"] };

  const result = await analyze(payload);

  assert.equal(result.validation.actions.length, 1);
  assert.match(result.validation.actions[0].description, /подписи студента/);
  assert.deepEqual(result.validation.actions[0].sources, ["rule:4.2"]);
});

test("offers actions for the internship supervisor's signature and organization's seal", async () => {
  const payload = responseFixture();
  payload.document_type = "internship_certificate";
  payload.classification = { intent: "validation", field: null };
  payload.validation = {
    status: "missing_fields", missing_fields: ["signature_present", "seal_present"], sources: ["rule:5.2", "rule:5.3"],
  };

  const result = await analyze(payload);

  assert.match(result.validation.actions[0].description, /руководителя практики/);
  assert.match(result.validation.actions[1].description, /печати организации/);
  assert.deepEqual(result.validation.actions.map((action) => action.sources), [["rule:5.2"], ["rule:5.3"]]);
});

test("answers who makes the decision with the relevant rule", async () => {
  const payload = responseFixture();
  payload.classification = { intent: "decision", field: null };
  const result = await analyze(payload);
  assert.match(result.answer, /сотрудник деканата/i);
  assert.deepEqual(result.answerSources, ["rule:1.3"]);
});

test("does not turn an unsupported question into a positive answer on a complete document", async () => {
  const payload = responseFixture();
  payload.classification = { intent: "unsupported", field: null };
  const result = await analyze(payload);
  assert.equal(result.status, "success");
  assert.equal(result.answerable, false);
  assert.match(result.answer, /нет информации/i);
  assert.deepEqual(result.answerSources, []);
});

test("still renders fields when OCR text is omitted", async () => {
  const payload = responseFixture();
  delete payload.ocr_text;
  const result = await analyze(payload);
  assert.equal(result.fields.length, 4);
  assert.equal(result.sourceExcerpt, "Нет распознанного текста.");
});

test("rejects a malformed success response with a readable contract error", async () => {
  await assert.rejects(analyze({ fields: null }), /Некорректный ответ сервера/);
});

test("reports classifier timeout when a gateway returns a non-JSON 504", async () => {
  mock.method(globalThis, "fetch", async () => new Response("Gateway Timeout", { status: 504 }));
  await assert.rejects(new ApiDocumentCheckService().analyze({
    file: new File(["test"], "document.pdf", { type: "application/pdf" }),
    documentType: "study_certificate", question: "Вопрос",
  }, () => {}), /время обработки вопроса/i);
});

test("preserves backend classifier errors", async () => {
  await assert.rejects(analyze({ detail: "Классификатор временно недоступен" }, 503), /Классификатор временно недоступен/);
});

test("handles validation error arrays without showing an object to the user", async () => {
  await assert.rejects(analyze({ detail: [{
    loc: ["body", "prompt"], type: "string_too_long", msg: "String should have at most 2000 characters",
  }] }, 422), /2000/);
});

test("sends the original file, question and document type as multipart form data", async () => {
  await analyze(responseFixture());
  const [url, request] = globalThis.fetch.mock.calls[0].arguments;
  assert.equal(url, "/ocr-api/analyze");
  assert.equal(request.body.get("photos").name, "document.pdf");
  assert.equal(request.body.get("prompt"), "Когда выдали справку?");
  assert.equal(request.body.get("document_type"), "study_certificate");
});

for (const question of ["", "   ", "\t\n"]) {
  test(`sends the completeness question for blank input ${JSON.stringify(question)} and preserves corrections`, async () => {
    const payload = responseFixture();
    payload.classification = { intent: "validation", field: null };
    const corrections = [{ id: "issue_date", value: "2026-09-01" }];
    mock.method(globalThis, "fetch", async () => Response.json(payload));

    const result = await new ApiDocumentCheckService().analyze({
      file: new File(["test"], "document.pdf", { type: "application/pdf" }),
      documentType: "study_certificate",
      question,
      manualFields: corrections,
    }, () => {});

    const request = globalThis.fetch.mock.calls[0].arguments[1];
    assert.equal(request.body.get("prompt"), "Содержит ли документ все обязательные сведения?");
    assert.deepEqual(JSON.parse(request.body.get("manual_fields")), corrections);
    assert.equal(result.status, "success");
    assert.equal(result.answerTitle, "Предварительная проверка");
    assert.deepEqual(result.answerSources, payload.validation.sources);
  });
}

test("sends manual field corrections and restores their source from the response", async () => {
  const payload = responseFixture();
  payload.manual_fields = ["issue_date"];
  const corrections = [{ id: "issue_date", value: "2026-10-15" }];

  const result = await analyze(payload, 200, {}, corrections);
  const request = globalThis.fetch.mock.calls[0].arguments[1];

  assert.deepEqual(JSON.parse(request.body.get("manual_fields")), corrections);
  assert.equal(result.fields.find((field) => field.id === "issue_date").status, "manual");
  assert.equal(result.fields.find((field) => field.id === "issue_date").source, "manual");
});

test("preserves the original nonblank question including surrounding whitespace", async () => {
  const question = "  Когда выдали справку?  ";
  mock.method(globalThis, "fetch", async () => Response.json(responseFixture()));

  await new ApiDocumentCheckService().analyze({
    file: new File(["test"], "document.pdf", { type: "application/pdf" }),
    documentType: "study_certificate",
    question,
  }, () => {});

  const request = globalThis.fetch.mock.calls[0].arguments[1];
  assert.equal(request.body.get("prompt"), question);
});
