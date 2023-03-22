import logoPath from '../images/logo.svg';
import { Link, Route, Routes } from "react-router-dom";

function Header({ email, onSignOut }) {
  return (
    <header className="header">
      <img className="header__logo" src={logoPath} alt="Лого mesto" />
      <div className="header__user-info">
        {email && <p className="header__user-email">{email}</p>}
        <Routes>
          <Route
            path="/sign-up"
            element={
              <Link className="header__link" to="/sign-in">
                Войти
              </Link>
            }
          />
          <Route
            path="/sign-in"
            element={
              <Link className="header__link" to="/sign-up">
                Регистрация
              </Link>
            }
          />
          <Route
            path="/"
            element={
              <Link className="header__link" onClick={onSignOut} to="/sign-in">
                Выйти
              </Link>
            }
          />
        </Routes>
      </div>
    </header>
  );
}

export default Header;
