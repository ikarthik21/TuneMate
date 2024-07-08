import {FiSearch} from "react-icons/fi";
import {IoMdAdd} from "react-icons/io";

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import useAddToPlaylist from "@/hooks/useAddToPlayList.js";
import useAddListStore from "@/store/use-addList.js";

import {useEffect, useRef} from "react";

const AdminAddToPlaylist = () => {
    const {hideAddToPlaylist, songId} = useAddListStore();
    const addMenuRef = useRef(null);

    const {
        error, isLoading, playlistName, setPlaylistName, showCreatePlaylist, handleToggleCreatePlaylist,

        handleCreatePlaylist, handleSaveChanges
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
    }, [addMenuRef, hideAddToPlaylist])


    if (isLoading) return <div><h1>Loading.....</h1></div>;
    if (error) return <div><h1>Error.....</h1></div>;

    return (<div ref={addMenuRef}
                 className="rounded-lg w-72 z-50 bg-[#18181b] border-[#2D2E35] border p-4 absolute bottom-4 left-1">
        <div className="flex flex-col">
            <h3 className="nunito-sans-bold text-sm">Add To Playlist</h3>
            <div
                className="flex items-center justify-center bg-[#222328] border-[#606064] rounded relative mt-3 mb-3">
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
                    className="flex items-center justify-center bg-[#222328] border-[#606064] rounded relative mt-3 mb-3">
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
                className="p-3 hover:bg-[#222328] hover:rounded mt-2 border-b border-[#222328] flex items-center cursor-pointer"
                onClick={handleToggleCreatePlaylist}>
                <IoMdAdd size={20} className="mr-3"/>
                <h1>New Playlist</h1>
            </div>)}


            <div className="flex items-center justify-end mt-4">
                <Button variant="ghost" className="h-8" onClick={(e) => {
                    e.stopPropagation()
                    hideAddToPlaylist()
                }}>Cancel</Button>
                <Button className="h-8 w-14 button_variant_1 text-black"
                        onClick={async (e) => {
                            e.stopPropagation()
                            await handleSaveChanges()
                            hideAddToPlaylist()
                        }}>Save</Button>
            </div>
        </div>
    </div>);
};

export default AdminAddToPlaylist;
