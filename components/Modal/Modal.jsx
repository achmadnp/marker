import { MdOutlineClose } from "react-icons/md";

export const BasicModal = ({ children, shown, close, header, status }) => {
  return shown ? (
    <div
      className="modal-backdrop"
      onClick={() => {
        close();
      }}
    >
      <div
        className="relative min-w-[40%] min-h-[20rem] bg-white p-6 rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="absolute right-5" onClick={() => close()}>
          <MdOutlineClose className="text-black w-7 h-7" />
        </button>
        <div className="text-lg font-semibold tracking-wide text-center text-black text">
          {header}
        </div>
        <div
          className={`w-full mt-2 border-2 border-b ${
            status === "success"
              ? "border-[#09d31ada]"
              : status === "error"
              ? "border-[#d30909da]"
              : "border-slate-400"
          }`}
        ></div>
        {children}
      </div>
    </div>
  ) : null;
};
