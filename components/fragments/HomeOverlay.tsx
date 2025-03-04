import Image from "next/image";

export default function HomeOverlay() {
  return (
    <>
      <div className="w-2 h-[97.5%] border-r-2 border-white absolute left-[0.5%] top-1/2 -translate-y-1/2 z-50"></div>
      <div className="w-2 h-[97.5%] border-l-2 border-white absolute right-[0.5%] top-1/2 -translate-y-1/2 z-50"></div>
      <div className="h-2 w-[97.5%] border-b-2 border-white absolute left-1/2 top-[0.5%] -translate-x-1/2 z-50"></div>
      <div className="h-2 w-[97.5%] border-t-2 border-white absolute left-1/2 bottom-[0.5%] -translate-x-1/2 z-50"></div>

      {/* top logo */}
      <div className="w-[98%] h-20 absolute top-[1%] left-1/2 -translate-x-1/2 z-50 flex ">
        <div className="w-1/3 border-b-2 border-r-2 border-white"></div>
        <div className="w-2/3 border-b-2 border-white bg-gradient-to-l from-white/100 to-white/0 flex justify-end items-center px-2 gap-2">
          <Image
            src={"/image/logo/expo.png"}
            alt="logo"
            width={100}
            height={100}
            className="h-16 w-auto"
          />
          <Image
            src={"/image/logo/paviliun.png"}
            alt="logo"
            width={100}
            height={100}
            className="h-12 w-auto"
          />
        </div>
      </div>

      {/* bottom logo */}
      <div className="w-[98%] h-20 absolute bottom-[1%] left-1/2 -translate-x-1/2 z-50 flex ">
        <div className="w-full bg-gradient-to-r from-white/100 to-white/0 flex justify-start items-center px-2 gap-2">
          <Image
            src={"/image/logo/bottom-logo.png"}
            alt="logo"
            width={1000}
            height={100}
            className="h-16 w-auto"
          />
        </div>
      </div>
    </>
  );
}
