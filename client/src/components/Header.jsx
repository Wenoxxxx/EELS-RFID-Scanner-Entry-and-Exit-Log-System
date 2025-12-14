import './Header.css';

function Header() {
  return (
    <header className="header">
      <h1 className="logo">ENTRY AND EXIT LOG SYSTEM</h1>

      <nav>
        <ul className="nav-list">
          <li><a href="/" className="nav-btn">Home</a></li>
          <li><a href="/logs" className="nav-btn">Logs</a></li>
          <li><a href="/stats" className="nav-btn">Stats</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
