const SideOptions = () => {
    return (<div className={"mt-4  "}>
        <div className={"flex flex-col"}>
            <h1>Your Playlists</h1>
            <div className={"flex flex-col mt-4"}>

                <div className={"flex items-center cursor-pointer bg-neutral-800 p-2 rounded overflow-hidden"}>
                    <img src="/src/assets/images/user.png" alt="" className={"h-11  w-11 rounded-full"}/>
                    <h1 className={"ml-4"}>Bollywood</h1>
                </div>
            </div>

        </div>
    </div>);
};

export default SideOptions;