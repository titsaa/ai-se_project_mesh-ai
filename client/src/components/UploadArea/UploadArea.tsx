import "./UploadArea.css";
import uploadIcon from "../../assets/upload-icon.svg";

type Props = {
  onFileSelect: (file: File) => void | Promise<void>;
  disabled?: boolean;
  isUploading?: boolean;
};

export default function UploadArea({
  onFileSelect,
  disabled = false,
  isUploading = false,
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && !disabled) onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && !disabled) onFileSelect(file);
  };

  return (
    <div
      className="upload-area"
      aria-disabled={disabled}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <label className="upload-area__label">
        <img src={uploadIcon} alt="" aria-hidden="true" />
        {isUploading ? (
          <span>Uploading...</span>
        ) : (
          <>
            <span>Drag and drop a PDF, or </span>
            <span className="underline">Upload</span>
          </>
        )}
        <input
          type="file"
          accept=".pdf"
          className="upload-area__input"
          onChange={handleChange}
          disabled={disabled}
        />
      </label>
    </div>
  );
}
