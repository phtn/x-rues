"use client";

import React, { ReactNode } from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Image from "next/image";
import { ClassName } from "@/app/types";

interface Props {
  children: ReactNode;
  className?: ClassName;
}
export const HyperCard3D = ({ children, className }: Props) => {
  return (
    <CardContainer
      className={`${className} dark:bg-card-origin/40 bg-indigo-400 border-xy/60 h-fit place-content-center w-[64rem] aspect-square relative rounded-2xl overflow-hidden group cursor-pointer transition-shadow shadow-md dark:inset-shadow-[0_0.5px_rgb(255_255_255/0.20)]`}
    >
      <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-10 border">
        <CardItem as="div" translateZ="100" className="w-full">
          <Image
            alt="thumbnail"
            src="https://media.ed.edmunds-media.com/hyundai/n-vision-74/hero/hyundai_n-vision-74_prf_hero_714221_1280.jpg"
            height={0}
            width={0}
            unoptimized
            className="h-full w-auto aspect-auto object-cover rounded-xl group-hover/card:shadow-xl"
          />
          {children}
        </CardItem>
      </CardBody>
    </CardContainer>
  );
};

export const CardExtras = () => (
  <div className="flex justify-between items-center mt-20">
    <CardItem
      translateZ={20}
      as="a"
      href="https://twitter.com/mannupaaji"
      className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
    >
      Try now →
    </CardItem>
    <CardItem
      translateZ={20}
      as="button"
      className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
    >
      Sign up
    </CardItem>
  </div>
);
