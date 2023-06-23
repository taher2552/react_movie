import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import StarRating from "./StarRating.js";

import "./index.css";

import App_api from "./App_api.js";

// function Test(){
//   const [review, testReview] = useState(0);
//   return(
//     <>

//     <StarRating color={"#1a5"} size={64} maxRating={5} messages={["terribe" , "bad", "Okay", "Good", "amazing"]} rateFunc={testReview}/>
//     <p>The movie was rated {review} </p>
//     </>
//   )
// }

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(

    /* <StarRating maxRating={5} />
    <StarRating maxRating={5} size={80} color={"green"} messages={["terribe" , "bad", "Okay", "Good", "amazing"] } className="test"/>
    <Test /> */

    <App_api/>


);
