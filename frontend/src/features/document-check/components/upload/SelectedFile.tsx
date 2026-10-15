import type { UploadedDocument } from "../../types/documentCheck";
import { formatSize } from "../../../../shared/utils/formatSize";
import { Icon } from "../../../../shared/components/Icon";

type SelectedFileProps = {
  file: UploadedDocument | null;
  isProcessing: boolean;
  onFileRemove: () => void;
};

export function SelectedFile({ file, isProcessing, onFileRemove }: SelectedFileProps) {
  if (!file) {
    return <div className="empty-file"><span>Файл ещё не выбран</span><span>Загрузите документ, чтобы начать проверку</span></div>;
  }

  return (
    <div className="file-card">
      <span className="file-icon"><Icon name="file" size={22} /></span>
      <div className="file-details">
        <strong title={file.name}>{file.name}</strong>
        <span>{file.name.split(".").pop()?.toUpperCase()} <i>·</i> {formatSize(file.size)}</span>
      </div>
      <span className="file-check" aria-label="Файл загружен"><Icon name="check" size={16} /></span>
      <button className="icon-button remove-file" type="button" disabled={isProcessing} aria-label="Удалить файл" onClick={onFileRemove}>
        <Icon name="close" size={19} />
      </button>
    </div>
  );
}
