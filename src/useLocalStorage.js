import { useState, useEffect } from "react";


export function useLocalStorage(initialState , key ){
     const [value, setValue] = useState(function(){
    const storredValue = localStorage.getItem(key);
    return storredValue ? JSON.parse(storredValue) : initialState;
  });

  useEffect(()=>{
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue]
}