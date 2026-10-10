# Document check feature

The feature is split into UI, state/validation, service contracts, and data providers:

- `components/` renders the form and result panels; it does not import scenarios or call an API.
- `model/` owns the reducer, initial state, and pure validation rules.
- `types/` defines the UI result model and the service boundaries.
- `data/` contains demo scenarios, status copy, and the static document-type catalog.
- `services/DemoDocumentCheckService.ts` is the current local implementation.
- `hooks/` coordinates state with injected services.

## Replacing the demo with the backend

1. Implement `DocumentCheckService` and `DocumentTypeCatalog` from `types/service.ts` using the agreed backend contract.
2. Map the backend response into `DocumentCheckResult` in that adapter; keep HTTP details and DTOs out of UI components.
3. Inject the API implementations in `pages/DocumentCheckerPage.tsx` in place of the demo service/catalog.
4. Once the API supplies document types and statuses, remove the matching static values from `data/`.

The selected browser `File` is retained in feature state and is passed to `DocumentCheckService.analyze`, ready for multipart upload. The present demo adapter deliberately does not upload or inspect it.