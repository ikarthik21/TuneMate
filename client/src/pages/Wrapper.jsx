// eslint-disable-next-line react/prop-types
const Wrapper = ({children}) => {

    return (<div className="flex flex-col ml-80">

        <div className={"mt-20 mb-20"}>
            {children}
        </div>

    </div>);
};

export default Wrapper;
