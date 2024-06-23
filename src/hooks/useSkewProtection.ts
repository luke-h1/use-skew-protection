import { useEffect, useState } from "react";
const pkg = require("../../package.json");

/* 
 We're using a version from our package.json file to check if the client is on an old tab and needs to be refreshed.
  This is useful for when we deploy a new version and we want to make sure the user is not going to be requesting old static assets js/css etc.
  which may result in broken behavior. We're using the version from the package.json but this could be anything, i.e. a uuid from a static file that's 
  generated on every deploy etc.
*/

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
