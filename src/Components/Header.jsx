import logo from "../assets/russian-doll-logo.svg";

export default function Header() {
  return (
    <header className="flex justify-center items-center">
      <nav>
        <ul className="flex items-center">
          <li>
            <img src={logo} className="h-20" alt="logo" />
          </li>
          <li>
            <h1 className="text-3xl font-bold">Russian Doll Tic Tac Toe</h1>
          </li>
        </ul>
      </nav>
    </header>
  );
}
