type RuntimeEnv = {
  VITE_OCR_API_URL?: string;
  VITE_USE_DEMO_SERVICE?: string;
};

export function getRuntimeEnv(): RuntimeEnv {
  return (import.meta as unknown as { env?: RuntimeEnv }).env ?? {};
}
