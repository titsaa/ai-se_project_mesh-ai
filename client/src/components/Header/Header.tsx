import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Header.css";

type Props = {
  onMenuOpen: () => void;
  onMenuClose: () => void;
  isMobileMenuOpen: boolean;
};

export default function Header({
  onMenuOpen,
  onMenuClose,
  isMobileMenuOpen,
}: Props) {
  const { currentUser, logout } = useAuth();

  function getNavLinkClass({ isActive }: { isActive: boolean }) {
    return isActive ? "header__link header__link--active" : "header__link";
  }

  return (
    <header className={isMobileMenuOpen ? "header header_mobile" : "header"}>
      <button
        type="button"
        className="header__menu-btn"
        aria-label="Open menu"
        onClick={onMenuOpen}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M3 6h18M3 12h18M3 18h18"
            stroke="#1c1c1c"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <span className="header__logo">MeshAI</span>

      {currentUser && (
        <div className="header__user-menu">
          <button type="button" className="header__user-btn">
            {currentUser.name}
          </button>
          <button type="button" className="header__logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      )}

      <nav
        className={
          isMobileMenuOpen ? "header__nav header__nav_mobile" : "header__nav"
        }
      >
        <NavLink
          to="/knowledge"
          className={getNavLinkClass}
          onClick={onMenuClose}
        >
          Knowledge Base
        </NavLink>
        <NavLink to="/chat" className={getNavLinkClass} onClick={onMenuClose}>
          Chat
        </NavLink>
      </nav>
    </header>
  );
}
