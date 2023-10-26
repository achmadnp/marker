export const CubeLoader = ({ text = "Retrieving..." }) => {
  return (
    <div className={`w-full absolute top-[50%] left-[50%] banter-loader`}>
      <div className="banter-loader__box"></div>
      <div className="banter-loader__box"></div>
      <div className="banter-loader__box"></div>
      <div className="banter-loader__box"></div>
      <div className="banter-loader__box"></div>
      <div className="banter-loader__box"></div>
      <div className="banter-loader__box"></div>
      <div className="banter-loader__box"></div>
      <div className="banter-loader__box"></div>
      <div className="inline-block text-center">{text}</div>
    </div>
  );
};
