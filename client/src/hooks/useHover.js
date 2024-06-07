import {useState} from "react";


const useHover = () => {
    const [hoveredItemId, setHoveredItemId] = useState(null);

    const handleMouseEnter = (itemId) => {
        setHoveredItemId(itemId);
    };

    const handleMouseLeave = () => {
        setHoveredItemId(null);
    };

    return {hoveredItemId, handleMouseEnter, handleMouseLeave};
};

export default useHover;