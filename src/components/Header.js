import logoPath from '../images/logo.svg';

function Header(props) {
  return (
    <header className="header">
      <img className="header__logo" src={logoPath} alt="Лого mesto" />
    </header>
  );
}

export default Header;
