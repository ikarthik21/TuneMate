import Home from "@/pages/Home";
import Album from "@/pages/Album.jsx";
import SearchResults from "@/pages/SearchResults.jsx";
import Artist from "@/pages/Artist.jsx";
import Playlist from "@/pages/Playlist.jsx";

const routesConfig = [
    {path: "/", element: <Home/>},
    {path: "/albums/:id", element: <Album/>},
    {path: "/artists/:id", element: <Artist/>},
    {path: "/playlists/:id", element: <Playlist/>},
    {path: "/search", element: <SearchResults/>}

]


export default routesConfig;