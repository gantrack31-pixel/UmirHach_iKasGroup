import assert from "node:assert/strict";
import { test } from "node:test";
import { documentCheckReducer } from "../src/features/document-check/model/documentCheckReducer.ts";
import { initialDocumentCheckState } from "../src/features/document-check/model/documentCheckState.ts";
import { validateDocumentCheckInput, validateUploadedFile } from "../src/features/document-check/model/validateDocument.ts";

const file = new File(["document"], "document.pdf", { type: "application/pdf" });

test("accepts a question at the backend character limit and rejects a longer one", () => {
  assert.equal(validateDocumentCheckInput(file, "study_certificate", "a".repeat(2000)), null);
  assert.equal(validateDocumentCheckInput(file, "study_certificate", "a".repeat(2001)).target, "question");
});

test("checks file, type and question in the existing order", () => {
  assert.equal(validateDocumentCheckInput(null, "", "").target, "file");
  assert.equal(validateDocumentCheckInput(file, "", "").target, "documentType");
  assert.equal(validateDocumentCheckInput(file, "study_certificate", "   ").target, "question");
});

test("accepts PDF, PNG and JPEG with matching MIME types", () => {
  for (const [name, type] of [["file.pdf", "application/pdf"], ["file.png", "image/png"], ["file.jpg", "image/jpeg"], ["file.jpeg", "image/jpeg"]]) {
    assert.equal(validateUploadedFile(new File(["data"], name, { type })), null);
  }
});

test("rejects empty, mismatched and oversized uploads", () => {
  for (const invalid of [
    new File([], "empty.pdf", { type: "application/pdf" }),
    new File(["data"], "wrong.png", { type: "application/pdf" }),
    new File([new Uint8Array(10 * 1024 * 1024 + 1)], "large.pdf", { type: "application/pdf" }),
  ]) {
    assert.equal(typeof validateUploadedFile(invalid), "string");
  }
});

test("accepting a new upload clears the previous result and validation errors", () => {
  const state = { ...initialDocumentCheckState, result: { answer: "old" }, uploadError: "error", formError: "error", documentTypeError: "error" };
  const uploaded = { file, name: file.name, size: file.size, mimeType: file.type };
  const next = documentCheckReducer(state, { type: "file/accepted", file: uploaded });
  assert.equal(next.file, uploaded);
  assert.equal(next.result, null);
  assert.deepEqual([next.uploadError, next.formError, next.documentTypeError], ["", "", ""]);
  assert.equal(state.result.answer, "old");
});

test("rejecting a replacement leaves the previously accepted file available", () => {
  const uploaded = { file, name: file.name, size: file.size, mimeType: file.type };
  const next = documentCheckReducer({ ...initialDocumentCheckState, file: uploaded }, { type: "file/rejected", message: "Файл пустой" });
  assert.equal(next.file, uploaded);
  assert.equal(next.uploadError, "Файл пустой");
});

test("changing question or document type invalidates the previous result", () => {
  const state = { ...initialDocumentCheckState, result: { answer: "old" } };
  for (const action of [{ type: "question/changed", question: "New question" }, { type: "documentType/changed", documentType: "internship_certificate" }]) {
    assert.equal(documentCheckReducer(state, action).result, null);
  }
});

test("a successful request preserves the service result and exits processing", () => {
  const started = documentCheckReducer(initialDocumentCheckState, { type: "check/started" });
  const result = { status: "warning", answer: "Дата выдачи: не найдено" };
  const next = documentCheckReducer(started, { type: "check/succeeded", result });
  assert.equal(started.isProcessing, true);
  assert.equal(next.isProcessing, false);
  assert.equal(next.processingStep, "");
  assert.equal(next.result, result);
});

test("a failed request exits processing and exposes the service error", () => {
  const started = documentCheckReducer(initialDocumentCheckState, { type: "check/started" });
  const next = documentCheckReducer(started, { type: "check/failed", message: "Превышено время обработки вопроса" });
  assert.equal(next.isProcessing, false);
  assert.equal(next.formError, "Превышено время обработки вопроса");
  assert.equal(next.result, null);
});
