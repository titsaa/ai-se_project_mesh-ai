import { Link, NavLink, useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
import { useFormWithValidation } from "../../hooks/useFormWithValidation";
import { registerUser } from "../../utils/api";
import "../../assets/css/form.css";

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
};

const initialValues: RegisterFormValues = {
  name: "",
  email: "",
  password: "",
};

function getNavLinkClass({ isActive }: { isActive: boolean }) {
  return isActive ? "auth-nav__link auth-nav__link--active" : "auth-nav__link";
}

export default function Register() {
  const navigate = useNavigate();
  const { values, errors, isValid, handleChange, handleSubmit } =
    useFormWithValidation<RegisterFormValues>(initialValues, {
      name: (value) => {
        if (!value.trim()) return "Name is required.";
        if (value.trim().length < 2)
          return "Name must be at least 2 characters.";
        if (value.trim().length > 40)
          return "Name must be 40 characters or fewer.";
        return undefined;
      },
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
        await registerUser(
          formValues.name,
          formValues.email,
          formValues.password,
        );
        navigate("/login");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Registration failed";
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

      <section className="auth-card" aria-label="Register form">
        <nav className="auth-nav" aria-label="Authentication navigation">
          <NavLink to="/login" className={getNavLinkClass}>
            Login
          </NavLink>
          <NavLink to="/register" className={getNavLinkClass}>
            Register
          </NavLink>
        </nav>

        <div className="auth-card__content">
          <h1 className="auth-card__title">Create your account</h1>
          <p className="auth-card__subtitle">
            Start building your MeshAI workspace.
          </p>

          <form className="auth-form" onSubmit={onSubmit} noValidate>
            <label className="auth-form__label" htmlFor="register-name">
              Name
            </label>
            <input
              id="register-name"
              className="auth-form__input"
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={40}
            />
            {errors.name && <p className="auth-form__error">{errors.name}</p>}

            <label className="auth-form__label" htmlFor="register-email">
              Email
            </label>
            <input
              id="register-email"
              className="auth-form__input"
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="auth-form__error">{errors.email}</p>}

            <label className="auth-form__label" htmlFor="register-password">
              Password
            </label>
            <input
              id="register-password"
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
              Create account
            </button>

            <div className="auth-form__status" aria-live="polite" />
          </form>
        </div>
      </section>
    </main>
  );
}
