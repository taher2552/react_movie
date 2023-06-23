import { useEffect, useState } from "react";
import StarRating from "./StarRating.js";



const KEY = 'cf49e0c7';
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);



export default function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("inception");
  const [selectedId, setSelectedId] = useState("123456");
  // const [watched, setWatched] = useState([]);
  const [watched, setWatched] = useState(function(){
    const storredValue = localStorage.getItem('watched');
    return JSON.parse(storredValue);
  });

  function handleWatched(movie){
    setWatched(watched=>[...watched, movie]);
    // localStorage.setItem("watched", JSON.stringify([...watched,movie]));//can use it in use effect also
  }

  function removeMovie(id){
    setWatched(watched=>watched.filter((watched)=>watched.imdbID!==id));
  }

  useEffect(()=>{
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched])






  // useEffect(()=>{

  //   fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=cf49e0c7&s=${query}`).then(res=>res.json()).then(data=>setMovies(data.Search))

  // },[]);

  // useEffect(()=>{
  //   console.log("only on mount")
  // },[])

  // useEffect(()=>{
  //   console.log("when query changes")
  // }, [query])

  // console.log("during render");


function selectIdFunc(id){
  setSelectedId(selectedid=> id===selectedid ? null : id);
}

function closeMovie(){
  setSelectedId(null);
}



useEffect(()=>{
  setSelectedId(selectedId=>null);
},[])



  useEffect(function(){

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

  closeMovie();
    fetchMovies();

    return function(){
      controller.abort();
    }
 
    
  },[query])



  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </Navbar>
      <Main>
        <ListMovies>
          {isLoading &&  <Loader /> }
          {!isLoading && !error && <MovieToWatch movies={movies} selectIdFunc={selectIdFunc} />}
          {error && <ErrorFunc message={error}/>}
        </ListMovies>
        <ListMovies>
        {
          selectedId ? <MovieDetails watched={watched} selectedId={selectedId} closeMovie={closeMovie} onAddWatched={handleWatched}  />  : <>
          <Summary watched={watched} />
          <ListOfWatchedMovies watched={watched} onDeleteMovie={removeMovie} />
          </>
        }

        </ListMovies>
      </Main>
    </>
  );
}

function MovieDetails({selectedId , closeMovie, onAddWatched, watched }){

  const [movieObj, setMovieObj] = useState({});
  const[isLoading , setIsLoading] = useState(false);  
  const [userRating, setUserRating] = useState('');
  
  const isWatched = watched.map(movies=>movies.imdbID).includes(selectedId);

  const userRatingVal= watched.find(val=>val.imdbID===selectedId)?.userRating;






 
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movieObj;

  function addWatch(){

    const detailsObj={
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime:Number(runtime.split(' ').at(0)),
      userRating
    }

 

    onAddWatched(detailsObj);
    closeMovie();
  }

  useEffect(function(){

    function callback(e){
      if(e.code==="Escape"){
        closeMovie();
        console.log("Close")
       }

    }

    document.addEventListener('keydown' , callback);

    return function(){
      document.removeEventListener('keydown', callback)
    }
  
  },[closeMovie])

  useEffect(function(){
    async function fetchMovieDetails(){
 
    setIsLoading(true);
 
     const data = await fetch(`http://www.omdbapi.com/?i=${selectedId}&apikey=${KEY}`);
 
   
     const response = await data.json();
 
 
   setMovieObj(response);
   setIsLoading(false);
    
    
   }
  
 
  
 
 
   fetchMovieDetails();
  
     
   },[selectedId]);

   useEffect(()=>{
    if(title) document.title=`Movie | ${title}`;

    return ()=>{
      document.title='usePopcorn';
    }

    //clean up function
   },[title])


   return(
    <div className="details">
    {
      isLoading ? <Loader /> :(
        <>
        <header>
    <button className="btn-back" onClick={closeMovie}>&larr;</button>
      <img src={poster} alt={`poster of ${title}`} />
      <div className="details-overview">
        <h2>{title}</h2>
        <p>{released} &bull; {runtime}</p>
        <p>{genre}</p>
        <p><span>⭐</span> {imdbRating} IMDb Rating</p>
      </div>
      </header>
      <section>
      <div className="rating">
      {
        !isWatched ? (
          <>
          <StarRating maxRating={10} size={24 } rateFunc={setUserRating} />
      {
        userRating && (
          <button className="btn-add" onClick={addWatch}>+ Add to List</button>
        )
      }
            
          </>
        ) :
      (
        <p>You already rate this movie {userRatingVal}</p>
      )
      }



      </div>
        <p><em>{plot}</em></p>
        <p>Starring: {actors}</p>
        <p>Directed by: {director}</p>
      </section>
        </>
      )
    }

    </div>
   )



}

function Navbar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length}</strong> results
    </p>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({query, setQuery}) {
 
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function ListMovies({ children }) {
  const [isOpen1, setIsOpen1] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && children}
    </div>
  );
}

function MovieToWatch({ movies,selectIdFunc }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <Movies movie={movie} key={movie.imdbID} selectIdFunc={selectIdFunc} />
      ))}
    </ul>
  );
}

function Movies({ movie,selectIdFunc }) {
  return (
    <li onClick={()=>selectIdFunc(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

// function WatchedMovies() {
//   const [watched, setWatched] = useState(tempWatchedData);
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <Summary watched={watched} />
//           <ListOfWatchedMovies watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }

function Summary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched?.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>

  );
}

function ListOfWatchedMovies({ watched , onDeleteMovie }) {
  return (
    <ul className="list list-movies">
      {watched.map((movie) => (
        <LiComponentOfWatchedMovies key={movie.imdbID} movie={movie} onDeleteMovie={onDeleteMovie} />
      ))}
    </ul>
 
  );
}

function LiComponentOfWatchedMovies({ movie, onDeleteMovie }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
      <button className="btn-delete" onClick={()=>onDeleteMovie(movie.imdbID)}>X</button>
    </li>
  );
}

function Loader(){
  return(
    <p className="loader">Loading...</p>
  )
}

function ErrorFunc({message}){
  return(
    <p className="error">

     <span>📗 </span>{message} 
    </p>
  )
}
