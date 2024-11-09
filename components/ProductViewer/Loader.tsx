import { Html } from "@react-three/drei";

export function Loader() {
  return (
    <Html>
      <div className="absolute top-0 left-0 -translate-x-1/2 flex flex-col items-center">
        <div className="text-nowrap font-medium text-2xl mb-5">
          Click and turn to explore iPhone.
        </div>
        <div className="w-32 h-full">
          <div className="relative block h-2 w-full rounded-lg overflow-hidden bg-gray-100">
            <div
              id="loader"
              className="absolute top-0 left-0 h-full w-0 bg-white"
            ></div>
          </div>
        </div>
      </div>
    </Html>
  );
}
