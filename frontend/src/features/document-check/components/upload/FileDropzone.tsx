import { useRef, useState } from "react";
import { Icon } from "../../../../shared/components/Icon";

type FileDropzoneProps = {
  isProcessing: boolean;
  onFileAdd: (file?: File) => void;
};

export function FileDropzone({ isProcessing, onFileAdd }: FileDropzoneProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      className={`dropzone${isDragging ? " is-dragging" : ""}`}
      onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => { event.preventDefault(); setIsDragging(false); onFileAdd(event.dataTransfer.files[0]); }}
    >
      <span className="upload-symbol"><Icon name="upload" size={30} /></span>
      <strong>Перетащите файл сюда</strong>
      <span className="drop-hint">или выберите на компьютере</span>
      <span className="format-hint">PDF, JPG, PNG <i>·</i> до 10 МБ</span>
      <button className="button button-primary upload-button" type="button" disabled={isProcessing} onClick={() => fileInput.current?.click()}>
        <Icon name="folder" size={19} /> Выбрать файл
      </button>
      <input
        ref={fileInput}
        className="visually-hidden"
        type="file"
        disabled={isProcessing}
        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
        onChange={(event) => {
          onFileAdd(event.target.files?.[0]);
          event.currentTarget.value = "";
        }}
      />
    </div>
  );
}
