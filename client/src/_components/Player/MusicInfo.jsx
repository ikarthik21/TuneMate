// eslint-disable-next-line react/prop-types
const MusicInfo = ({song}) => {

    return (<div className={"flex items-center"}>
        <div>
            <img src={song?.image[1].url} alt="" className={"h-14 w-14 rounded-xl"}/>
        </div>
        <div className={"flex flex-col ml-4 justify-center"}>
            <h3 className={"mt-1 mb-1 nunito-sans-bold"}>{song?.name}</h3>

            <div className={"flex items-center"}>
                {song?.artists.primary.map((artist) => {
                    return <p className={"text-xs mr-1"} key={artist.id}> {artist.name}</p>
                })}
            </div>
        </div>
    </div>);
};

export default MusicInfo;