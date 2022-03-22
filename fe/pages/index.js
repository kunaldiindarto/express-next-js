import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="container font-inter">
        <h1 className="text-3xl font-bold underline text-red-700">
          Hello world!
        </h1>
      </div>
    </>
  );
}
