import { CubeLoader } from "@/components/Loader/Loader";

export const LoadingPage = () => {
  return (
    <div className="modal-backdrop">
      <CubeLoader />
    </div>
  );
};
