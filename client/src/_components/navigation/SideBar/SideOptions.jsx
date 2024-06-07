import {Link} from 'react-router-dom';
import {MdFavorite} from "react-icons/md";


const SideOptions = () => {
    return (<div className={"mt-4  "}>
        <div className={"flex flex-col"}>
            <h1>Your Playlists</h1>
            <div className={"flex flex-col mt-4"}>


                <Link to={"/favorites"}>
                    <div className={"flex items-center cursor-pointer bg-[#222328] px-2 py-3 rounded overflow-hidden"}>
                        <MdFavorite size={30} cursor={"pointer"} color={"#59c2ef"}/>
                        <h1 className={"ml-4"}>Favorites</h1>
                    </div>
                </Link>

            </div>

        </div>
    </div>);
};

export default SideOptions;