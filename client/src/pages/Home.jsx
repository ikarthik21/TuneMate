import Wrapper from "./Wrapper";
import Player from "@/_components/Player/Player.jsx";
import SearchResults from "@/pages/SearchResults.jsx";
import useSearchStore from "@/store/use-search.js";

const Home = () => {
    const {search} = useSearchStore();
    return (<Wrapper>
        {search && < div className={"ml-52 mt-20"}>
            <SearchResults/>
        </div>}
        <Player/>
    </Wrapper>)
}

export default Home