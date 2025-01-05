import Home from "@/pages/Home";
import Album from "@/pages/Album.jsx";
import SearchResults from "@/pages/search/SearchResults.jsx";
import Artist from "@/pages/Artist.jsx";
import Playlist from "@/pages/Playlist.jsx";
import Favorites from "@/pages/Favorites.jsx";
import UserPlaylists from "@/pages/UserPlaylists.jsx";
import UserRecents from "@/pages/UserRecents.jsx";
import MobileSearch from "@/pages/search/MobileSearch";
import UserLibrary from "@/pages/UserLibrary";

const routesConfig = [{path: "/", element: <Home/>}, {path: "/albums/:id", element: <Album/>}, {
    path: "/artists/:id", element: <Artist/>
}, {path: "/playlists/:id", element: <Playlist/>}, {path: "/search", element: <SearchResults/>},  {path: "/m/search", element: <MobileSearch/>},{
    path: "/recents", element: <UserRecents/>
}, {path: "/favorites", element: <Favorites/>}, {
    path: "/u/playlists/:id", element: <UserPlaylists/>
}, {path: "/recommended/:id", element: <UserPlaylists/>}, {path: "/your-library", element: <UserLibrary/>}]


export default routesConfig;