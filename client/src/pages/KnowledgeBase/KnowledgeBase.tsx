import { useEffect, useState } from "react";
import UploadArea from "../../components/UploadArea/UploadArea";
import {
  deleteDocument,
  getDocuments,
  uploadDocument,
  type KnowledgeDoc,
} from "../../utils/api";
import "./KnowledgeBase.css";

export default function KnowledgeBase() {
  const [documents, setDocuments] = useState<KnowledgeDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getDocuments();
        setDocuments(res.data || []);
      } catch {
        setError("Failed to load documents.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const handleFileSelect = async (file: File) => {
    setError(null);
    setIsUploading(true);
    try {
      const res = await uploadDocument(file);
      if (res.data) setDocuments((previous) => [res.data!, ...previous]);
    } catch {
      setError("Failed to upload document.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    setError(null);
    setDeletingId(id);
    try {
      await deleteDocument(id);
      setDocuments((previousDocuments) =>
        previousDocuments.filter((doc) => doc._id !== id),
      );
    } catch {
      setError("Failed to delete document.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="knowledge-base">
      <h1 className="knowledge-base__title">Manage Your Knowledge Base</h1>

      <section className="knowledge-base__content">
        <p className="knowledge-base__label">Upload documents (PDF)</p>
        <UploadArea
          onFileSelect={handleFileSelect}
          disabled={isUploading}
          isUploading={isUploading}
        />

        {isLoading && (
          <p className="knowledge-base__message">Loading documents...</p>
        )}

        {!isLoading && error && (
          <p className="knowledge-base__message knowledge-base__message--error">
            {error}
          </p>
        )}

        {!isLoading && !error && documents.length === 0 && (
          <p className="knowledge-base__message">No documents yet.</p>
        )}

        {!isLoading && !error && documents.length > 0 && (
          <ul className="knowledge-base__list">
            {documents.map((doc) => (
              <li key={doc._id} className="knowledge-base__item">
                <div>
                  <p className="knowledge-base__file-title">{doc.title}</p>
                  <p className="knowledge-base__file-name">{doc.fileName}</p>
                </div>
                <button
                  type="button"
                  className="knowledge-base__delete"
                  aria-label={`Delete ${doc.title}`}
                  onClick={() => handleDeleteDocument(doc._id)}
                  disabled={deletingId === doc._id}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <button type="button" className="knowledge-base__save">
          Save
        </button>
      </section>
    </div>
  );
}
