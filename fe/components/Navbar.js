import Link from "next/link";
import Image from "next/image";

function Navbar() {
  return (
    <nav className="flex justify-around items-center bg-slate-600 h-14 position: absolute w-screen">
      <div className="tracking-wider text-white">
        <h3>Kun-shop</h3>
      </div>
      <ul className="w-3/6 bg-orange-300 flex justify-around sm:w-screen sm:h-72 sm:position: absolute sm:right-0 sm:top-14 sm: flex-col sm:items-center">
        <Link href="/">
          <a className="sm:w-80 sm:h-10 sm:bg-[#bada55] sm:flex sm:items-center sm:justify-center sm:rounded-xl sm:border sm:border-black">
            Home
          </a>
        </Link>
        <Link href="/about">
          <a>About</a>
        </Link>
        <Link href="/cart">
          <a>Cart</a>
        </Link>
        <Link href="/order">
          <a>Order</a>
        </Link>
      </ul>
      <div className="flex flex-col gap-1">
        <input type="checkbox" className="position: absolute w-6 h-6" />
        <span className="w-7 h-1 bg-white"></span>
        <span className="w-7 h-1 bg-white"></span>
        <span className="w-7 h-1 bg-white"></span>
      </div>
    </nav>
  );
}

export default Navbar;
