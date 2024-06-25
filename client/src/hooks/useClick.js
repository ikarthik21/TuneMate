import {useState} from "react";


const useClick = () => {
    const [clickedItemId, setClickedItemId] = useState(null);

    return {clickedItemId, setClickedItemId};
};

export default useClick;