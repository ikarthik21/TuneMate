import {FiSearch} from "react-icons/fi";
import {IoMdAdd, IoMdAddCircle} from "react-icons/io";
import {BiSolidPlaylist} from "react-icons/bi";
import {FaCheckCircle} from "react-icons/fa";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import useAddToPlaylist from "@/hooks/useAddToPlayList.js";
import useAddListStore from "@/store/use-addList.js";
import {useEffect, useLayoutEffect, useRef, useState} from "react";

// eslint-disable-next-line react/prop-types
const AdminAddToPlaylist = ({clickEvent}) => {

    const {hideAddToPlaylist} = useAddListStore();
    const addMenuRef = useRef(null);
    const [position, setPosition] = useState("bottom-4");

    const {
        playlists,
        error,
        isLoading,
        playlistName,
        setPlaylistName,
        showCreatePlaylist,
        handleToggleCreatePlaylist,
        selectedPlaylists,
        togglePlaylistSelection,
        handleCreatePlaylist,
        handleSaveChanges
    } = useAddToPlaylist();


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (addMenuRef.current && !addMenuRef.current.contains(event.target)) {
                hideAddToPlaylist();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [addMenuRef, hideAddToPlaylist]);

    useLayoutEffect(() => {
        const calculatePosition = () => {
            if (addMenuRef.current && clickEvent) {
                const rect = addMenuRef.current.getBoundingClientRect();
                // eslint-disable-next-line react/prop-types
                const clickY = clickEvent.clientY;
                const spaceAbove = clickY;
                const spaceBelow = window.innerHeight - clickY;
                if (spaceBelow < rect.height && spaceAbove > spaceBelow) {
                    setPosition("bottom-2");
                } else {
                    setPosition("top-2");
                }
            }
        };
        calculatePosition();
        window.addEventListener('resize', calculatePosition);
        return () => window.removeEventListener('resize', calculatePosition);
    }, [clickEvent]);


    if (isLoading) return <div><h1>Loading.....</h1></div>;
    if (error) return <div><h1>Error.....</h1></div>;

    return (<div ref={addMenuRef}
                 className={`rounded-lg w-64 z-50 bg-[#18181b] border-[#2D2E35] border p-4 absolute left-1 ${position}`}>
        <div className="flex flex-col">
            <div
                className="flex items-center justify-center bg-[#222328] border-[#606064] rounded relative mt-1 mb-3">
                <div className="p-2">
                    <FiSearch size={18}/>
                </div>
                <Input
                    className="rounded bg-[#222328] h-[35px] text-[15px] border-none focus:outline-none focus-visible:ring-0 pr-10"
                    placeholder="Find a playlist"
                />
            </div>

            {showCreatePlaylist && (<div className="flex flex-col">
                <div
                    className="flex items-center justify-center bg-[#222328] border-[#606064] rounded relative mb-3">
                    <Input
                        className="rounded bg-[#222328] h-[40px] text-[15px] border-none focus:outline-none focus-visible:ring-0 pr-10"
                        placeholder="Playlist Name"
                        onChange={(e) => setPlaylistName(e.target.value)}
                    />
                </div>
                <div className="flex items-center justify-end mt-2">
                    <Button variant="ghost" className="h-8" onClick={hideAddToPlaylist}>
                        Cancel
                    </Button>
                    {playlistName.length > 0 && (
                        <Button className="h-8 w-14 button_variant_1 text-black" onClick={handleCreatePlaylist}>
                            Save
                        </Button>)}
                </div>
            </div>)}

            {!showCreatePlaylist && (<div
                className="p-3 hover:bg-[#222328] hover:rounded border-b border-[#222328] flex items-center cursor-pointer"
                onClick={handleToggleCreatePlaylist}>
                <IoMdAdd size={20} className="mr-3"/>
                <h1>New Playlist</h1>
            </div>)}

            {/*Favorites*/}
            <div className="flex flex-col mt-2 h-36 overflow-y-scroll custom-scrollbar">

                {playlists?.map((playlist) => (<div key={playlist.id}
                                                    className="flex items-center p-3 rounded hover:bg-[#222328] cursor-pointer justify-between">
                    <div className="flex items-center">
                        {playlist.image ? (<img src={playlist.image} alt="" className={"h-8 w-8 rounded"}/>) : (
                            <BiSolidPlaylist size={20} color={"#59c2ef"}/>)}
                        <h2 className="ml-4">{playlist.name}</h2>
                    </div>
                    {selectedPlaylists.includes(playlist.id) ? (
                        <FaCheckCircle size={18} cursor="pointer" color="#59c2ef"
                                       onClick={() => togglePlaylistSelection(playlist.id)}/>) : (
                        <IoMdAddCircle size={20} cursor="pointer" color="#59c2ef"
                                       onClick={() => togglePlaylistSelection(playlist.id)}/>)}
                </div>))}
            </div>

            <div className="flex items-center justify-end mt-4">
                <Button variant="ghost" className="h-8" onClick={(e) => {
                    e.stopPropagation();
                    hideAddToPlaylist();
                }}>Cancel</Button>
                <Button className="h-8 w-14 button_variant_1 text-black" onClick={async (e) => {
                    e.stopPropagation();
                    await handleSaveChanges();
                    hideAddToPlaylist();
                }}>Save</Button>
            </div>
        </div>
    </div>);
};

export default AdminAddToPlaylist;
