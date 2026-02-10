import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export function RouterTweaks() {
  const location = useLocation();

  const currentLocation = useRef("/");

  useEffect(() => {
    const hash = location.hash;
    const getHash = (str: string) => {
      let result = str.slice(1);
      if (result?.length && result[result.length - 1] === "/") {
        result = result.slice(0, result.length - 1);
      }
      return result;
    };

    if (hash) {
      const element = document.getElementById(getHash(hash));
      element?.scrollIntoView({
        behavior: "smooth",
        // block: "end",
        inline: "nearest",
      });
    } else if (location.pathname == currentLocation.current) return;
    else {
      currentLocation.current = location.pathname;
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return null;
}
