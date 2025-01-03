// eslint-disable-next-line react/prop-types
const BlockWrapper = ({ children, rounded, background, margin }) => {
  return (
    <div
      className={`rounded-xl min-h-screen ${margin} ${rounded}`}
      style={{ backgroundColor: background || "#1a1a1a" }}
    >
      {children}
    </div>
  );
};

export default BlockWrapper;
