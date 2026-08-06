import { useNavigate } from "react-router-dom";
import "./Intro.css";

const FEATURES = [
  {
    title: "Upload your documents",
    description: "Add PDFs to build a knowledge base MeshAI can search.",
    icon: "upload",
    iconBackground: "#F4E8FF",
    iconColor: "#7C5CFF",
  },
  {
    title: "Ask anything",
    description: "Chat with MeshAI about the content you've uploaded.",
    icon: "chat",
    iconBackground: "#E8F5FF",
    iconColor: "#2575FF",
  },
  {
    title: "Get grounded answers",
    description: "Responses are backed by your own documents, not guesses.",
    icon: "shield",
    iconBackground: "#F5F7FF",
    iconColor: "#383FEE",
  },
];

export default function Intro() {
  const navigate = useNavigate();

  return (
    <section className="intro">
      <h1 className="intro__title">
        Welcome to MeshAI
        <span className="intro__title-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            width="18"
            height="18"
            aria-hidden="true"
          >
            <path
              d="M12 4v16M4 12h16"
              stroke="#7C5CFF"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </h1>
      <p className="intro__subtitle">Your documents, turned into answers.</p>
      <p className="intro__start-by">
        Start by uploading your first document to create a searchable knowledge
        base.
      </p>

      <div className="intro__cards">
        {FEATURES.map((feature) => (
          <article className="intro__card" key={feature.title}>
            <div
              className="intro__card-icon"
              aria-hidden="true"
              style={{
                backgroundColor: feature.iconBackground,
                color: feature.iconColor,
              }}
            >
              {feature.icon === "upload" ? (
                <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
                  <path
                    d="M12 4v10M8 10l4-4 4 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 18h12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : feature.icon === "chat" ? (
                <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
                  <path
                    d="M4 7a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v6a5 5 0 0 1-5 5H9l-5 3V7Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
                  <path
                    d="M5 11.5a7 7 0 1 1 14 0c0 4.5-4.5 8.5-7 11-2.5-2.5-7-6.5-7-11Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 12.5l2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <h2 className="intro__card-title">{feature.title}</h2>
            <p className="intro__card-description">{feature.description}</p>
          </article>
        ))}
      </div>

      <button
        type="button"
        className="intro__start"
        onClick={() => navigate("/knowledge")}
      >
        Start
      </button>
    </section>
  );
}
