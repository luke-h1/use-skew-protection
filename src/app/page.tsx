"use client";
import Image from "next/image";
import styles from "./page.module.css";
import useSkewProtection from "@/hooks/useSkewProtection";
const version = require("../../package.json").version;

export default function Home() {
  const { isSkewed, version, windowVersion } = useSkewProtection();

  return (
    <main className={styles.main}>
      <p>Current package.json version: {version}. </p>
      <p>
        Current window version is:
        {windowVersion}
      </p>
      <p>Is the window version skewed? {isSkewed ? "Yes" : "No"}</p>
    </main>
  );
}
