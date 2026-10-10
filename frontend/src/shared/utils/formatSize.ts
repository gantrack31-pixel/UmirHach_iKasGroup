export function formatSize(size: number) {
  return size >= 1024 * 1024
    ? `${(size / (1024 * 1024)).toFixed(1)} МБ`
    : `${Math.max(1, Math.round(size / 1024))} КБ`;
}