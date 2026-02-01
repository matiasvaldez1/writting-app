"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import RedoAnimText from "./_components/anim-writing-text";
import FeaturesSection from "./_components/features-section";

export default function LandingPage() {
  const t = useTranslations("landing");
  const tc = useTranslations("common");
  return (
    <div className="px-4 md:px-10">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ ease: "easeInOut" }}
      >
        <div className="rounded-md">
          <div className="grid grid-cols-1 2xl:grid-cols-2 rounded-md">
            <div className="p-10 2xl:p-24 flex flex-col gap-10 2xl:gap-6">
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                {t("heroTitle")}
              </h1>
              <p className="leading-7 text-sm xl:text-xl mt-4">
                {t("heroDescription")}
              </p>
              <div className="flex flex-col sm:flex-row justify-evenly gap-4 p-10">
                <Link href={"/sign-in"}>
                  <Button size={"lg"}>{t("getStarted")}</Button>
                </Link>
                <a href={"#more"}>
                  <Button size={"lg"} variant={"link"}>
                    {t("readMore")}
                  </Button>
                </a>
              </div>
            </div>
            <div className="p-10">
              <video width={"100%"} height={"100%"} autoPlay muted>
                <source src="/demo-video.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </motion.div>
      <div id="more" className="h-1 my-32 scroll-smooth" />
      <div className="p-10 2xl:p-20 flex flex-col gap-20">
        <FeaturesSection
          reversed={false}
          image="edit-your-book-content-demo.png"
          title={t("featureEditTitle")}
          text={t("featureEditText")}
        />
        <FeaturesSection
          reversed={true}
          image="managing-chapters-demo.jpg"
          title={t("featureManageTitle")}
          text={t("featureManageText")}
        />
        <FeaturesSection
          reversed={false}
          image="export-as-pdf-result-demo.jpg"
          title={t("featureExportTitle")}
          text={t("featureExportText")}
        />
      </div>
      <div className="h-1 my-32" />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        className="flex justify-center my-6"
      >
        <blockquote className="mt-6 border-l-2 pl-6 italic">
          {t("quote")}
        </blockquote>
      </motion.div>
      <div className="h-1 my-40" />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ ease: "easeInOut" }}
      >
        <div>
          <div className="rounded-md">
            <div className="flex flex-col justify-center text-center md:p-24">
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl min-h-16">
                <RedoAnimText />
              </h1>
              <div>
                <p className="leading-7 p-8 md:p-20 text-xl">{t("ctaTitle")}</p>
                <Link href={"/sign-up"}>
                  <Button className="text-2xl" variant="link">
                    {tc("signUp")}
                  </Button>
                </Link>
                <p className="leading-7 p-20 text-xl">
                  {t("ctaAlreadyHaveAccount")}
                </p>
                <Link href={"/sign-in"}>
                  <Button className="text-2xl" variant="link">
                    {tc("logIn")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
