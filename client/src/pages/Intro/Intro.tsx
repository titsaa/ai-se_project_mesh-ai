import { useNavigate } from "react-router-dom";
import "./Intro.css";

const FEATURES = [
  {
    title: "Upload your documents",
    description: "Add PDFs to build a knowledge base MeshAI can search.",
  },
  {
    title: "Ask anything",
    description: "Chat with MeshAI about the content you've uploaded.",
  },
  {
    title: "Get grounded answers",
    description: "Responses are backed by your own documents, not guesses.",
  },
];

export default function Intro() {
  const navigate = useNavigate();

  return (
    <section className="intro">
      <h1 className="intro__title">Welcome to MeshAI</h1>
      <p className="intro__subtitle">
        Your documents, turned into answers.
      </p>

      <div className="intro__cards">
        {FEATURES.map((feature) => (
          <article className="intro__card" key={feature.title}>
            <div className="intro__card-icon" aria-hidden="true" />
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
