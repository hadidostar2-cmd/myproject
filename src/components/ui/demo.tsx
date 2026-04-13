import Loader from "./3d-box-loader-animation";

const DemoOne = () => {
  return (
    <div className="flex w-full items-center justify-center min-h-[400px] bg-background rounded-[40px] border border-burgundy/10 shadow-2xl overflow-hidden">
      <Loader />
    </div>
  );
};

export { DemoOne };
