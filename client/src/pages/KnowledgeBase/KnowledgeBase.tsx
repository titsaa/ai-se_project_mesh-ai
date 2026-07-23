import { useEffect, useState } from "react";
import UploadArea from "../../components/UploadArea/UploadArea";
import { getDocuments, type KnowledgeDoc } from "../../utils/api";
import "./KnowledgeBase.css";

export default function KnowledgeBase() {
  const [documents, setDocuments] = useState<KnowledgeDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleFileSelect = (file: File) => {
    const newDoc: KnowledgeDoc = {
      _id: Date.now().toString(),
      title: file.name,
      fileName: file.name,
      userId: "local",
      createdAt: new Date().toISOString(),
    };

    setDocuments((previousDocuments) => [newDoc, ...previousDocuments]);
  };

  return (
    <div className="knowledge-base">
      <h1 className="knowledge-base__title">Manage Your Knowledge Base</h1>

      <section className="knowledge-base__content">
        <p className="knowledge-base__label">Upload documents (PDF)</p>
        <UploadArea onFileSelect={handleFileSelect} />

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
