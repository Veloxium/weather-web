import React, { useEffect, useState } from "react";

export default function useDebounce(value: string = "Mataram", delay: number = 500) {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const time = setTimeout(() => {
      console.log("Setting new timeout");
      setDebounceValue(value);
    }, delay);

    return () => {
      console.log("Clearing timeout ");
      clearTimeout(time);
    };
  }, [value, delay]);

  return debounceValue;
}
