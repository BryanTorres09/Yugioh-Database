import {Link} from "react-router-dom";


function Navbar() {
    return (
      <nav className="flex justify-between items-center bg-blue-400 p-2">
        <Link to="/">
          <div className="flex item-center space-x-4">
            <span>
              <img src="/images/chibi_neos.png" alt="Chibi Neos" className="w-20 h-15 "/>
            </span>
            <span className="text-5xl font-bold ">Yugioh Card Data</span>
          </div>
        </Link>

        <Link to="/cardlist">
          <div className="flex space-x-6">
            <h1 className="text-2xl font-bold  cursor-pointer hover:text-fuchsia-600 transition-colors duration-300 ">
              Full list
            </h1>
          </div>
        </Link>
      </nav>
    );
}
export default Navbar;