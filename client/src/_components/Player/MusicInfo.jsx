import {truncateString, decodeHtmlEntities} from "@/utils/MusicUtils.js";

const MusicInfo = ({song}) => {

    const getAllArtists = (song) => {
        const artists = song?.artists.primary.map(artist => artist.name).join("  ") || "";
        return truncateString(artists, 50);
    };

    return (
        <div className="flex items-center">
            <div>
                <img src={song?.image[1].url} alt={`song img`} className="h-14 w-14 rounded-xl"/>
            </div>
            <div className="flex flex-col ml-4 justify-center">
                <h3 className="mt-1 mb-1 nunito-sans-bold">{decodeHtmlEntities(song?.name)}</h3>
                <div className="flex items-center">
                    <p className="text-xs mr-1">{truncateString(decodeHtmlEntities(getAllArtists(song)))}</p>
                </div>
            </div>
        </div>);
};

export default MusicInfo;
