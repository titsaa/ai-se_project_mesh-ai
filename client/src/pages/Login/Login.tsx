import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useFormWithValidation } from "../../hooks/useFormWithValidation";
import { loginUser } from "../../utils/api";
import "../../assets/css/form.css";

type LoginFormValues = {
  email: string;
  password: string;
};

type LoginLocationState = {
  from?: {
    pathname?: string;
    search?: string;
    hash?: string;
  };
};

const initialValues: LoginFormValues = {
  email: "",
  password: "",
};

function getNavLinkClass({ isActive }: { isActive: boolean }) {
  return isActive ? "auth-nav__link auth-nav__link--active" : "auth-nav__link";
}

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { values, errors, isValid, handleChange, handleSubmit } =
    useFormWithValidation<LoginFormValues>(initialValues, {
      email: (value) => {
        if (!value.trim()) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Enter a valid email address.";
        }
        return undefined;
      },
      password: (value) => {
        if (!value) return "Password is required.";
        if (value.length < 8) {
          return "Password must be at least 8 characters.";
        }
        return undefined;
      },
    });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    handleSubmit(event, async (formValues) => {
      try {
        const res = await loginUser(formValues.email, formValues.password);
        if (res.data) {
          login(res.data.token, res.data.user);
          const state = location.state as LoginLocationState | null;
          const destination = state?.from
            ? `${state.from.pathname ?? "/knowledge"}${state.from.search ?? ""}${state.from.hash ?? ""}`
            : "/knowledge";
          navigate(destination, { replace: true });
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Login failed";
        const status = document.querySelector(".auth-form__status");
        if (status) {
          status.textContent = message;
        }
      }
    });
  };

  return (
    <main className="auth-page">
      <header className="header auth-header">
        <Link to="/" aria-label="MeshAI home">
          <img className="header__logo" alt="MeshAI logo" src="/favicon.png" />
        </Link>
      </header>

      <section className="auth-card" aria-label="Login form">
        <nav className="auth-nav" aria-label="Authentication navigation">
          <NavLink to="/login" className={getNavLinkClass}>
            Login
          </NavLink>
          <NavLink to="/register" className={getNavLinkClass}>
            Register
          </NavLink>
        </nav>

        <div className="auth-card__content">
          <h1 className="auth-card__title">Welcome back</h1>
          <p className="auth-card__subtitle">
            Access your knowledge workspace.
          </p>

          <form className="auth-form" onSubmit={onSubmit} noValidate>
            <label className="auth-form__label" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              className="auth-form__input"
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="auth-form__error">{errors.email}</p>}

            <label className="auth-form__label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              className="auth-form__input"
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              required
              minLength={8}
            />
            {errors.password && (
              <p className="auth-form__error">{errors.password}</p>
            )}

            <button
              type="submit"
              className="auth-form__submit"
              disabled={!isValid}
            >
              Log in
            </button>

            <div className="auth-form__status" aria-live="polite" />
          </form>
        </div>
      </section>
    </main>
  );
}
