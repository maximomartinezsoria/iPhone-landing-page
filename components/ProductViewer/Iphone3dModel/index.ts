import React from "react";
import { lazyWithDelay } from "@/utils/lazyWithDelay";

export const Iphone3DModel = React.lazy(() =>
  lazyWithDelay(
    () =>
      import("./Iphone3dModel").then((module) => ({
        default: module.Iphone3dModelImpl,
      })),
    2500,
  ),
);
