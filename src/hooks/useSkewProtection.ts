import { useEffect, useState } from "react";
const pkg = require("../../package.json");

const useSkewProtection = () => {
  const [windowVersion, setWindowVersion] = useState<string | null>(null);
  const [version, setVersion] = useState<string | null>(pkg.version);
  const [isSkewed, setIsSkewed] = useState<boolean>(false);

  useEffect(() => {
    if (
      process.env.NODE_ENV === "production" &&
      // @ts-ignore - types for window
      !window.APP_VERSION
    ) {
      // @ts-ignore - types for window
      window.APP_VERSION = pkg.version;
      setIsSkewed(false);
      // @ts-ignore - types for window
      setWindowVersion(window.APP_VERSION);
    }
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      window.setInterval(async () => {
        console.info("[useSkewProtection] Checking for version skew...");
        const response = await fetch("/api/version");
        const data: { version: string } = await response.json();

        // @ts-ignore
        if (data.version !== window.APP_VERSION) {
          // @ts-ignore
          window.APP_VERSION = data.version;
          // @ts-ignore
          setWindowVersion(window.APP_VERSION);
          setVersion(pkg.version);
          setIsSkewed(true);

          // could open a refresh modal here but for now just reload
          window.location.reload();
          setIsSkewed(false);
        }
      }, 15_000);
    }
  }, []);

  return {
    isSkewed,
    version,
    windowVersion,
  };
};
export default useSkewProtection;
