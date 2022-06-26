const root = window.location.hostname.includes("localhost") ?
    "http://localhost:5001/" :
    "/";

//root path for frontend fetch (dev and production mode)
export default root;