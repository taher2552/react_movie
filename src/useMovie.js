import { useState, useEffect } from "react";

export function useMovie(query, callback){

    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const KEY = 'cf49e0c7';
    useEffect(function(){
        //to close watched movie detail secition

        callback?.();

        const controller = new AbortController();
       async function fetchMovies(){
    

    
        try{
        setIsLoading(true);
        setError("");
       
        const data = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`,{signal: controller.signal});
    
      
        
        if(!data.ok){
          throw new Error('movies not loaded.')
        }
        const response = await data.json();
    
        if(response.Response==='False'){
          throw new Error('movie not found .')
        }
    
    
        setMovies(response.Search);
        setError("");
       
        }catch(err){
    
     
          if(err.name!=="AbortError")
          setError(err.message);
          console.log(err)
    
        }finally{
          setIsLoading(false)
        }
      }
     
    
      if(query.length < 2){
        setError("");
        setMovies([]);
        return;
      }
    
    //   closeMovie();
        fetchMovies();
    
        return function(){
          controller.abort();
        }
     
        
      },[query]);

      return {movies, error, isLoading}
}