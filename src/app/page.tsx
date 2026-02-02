"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
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
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-16 flex flex-col gap-6 lg:gap-8 max-w-2xl mx-auto">
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                {t("heroTitle")}
              </h1>
              <p className="leading-7 text-base xl:text-lg text-muted-foreground mt-4">
                {t("heroDescription")}
              </p>
              <div className="flex flex-col sm:flex-row justify-evenly gap-4 pt-6">
                <SignedOut>
                  <Link href={"/sign-in"}>
                    <Button size={"lg"}>{t("getStarted")}</Button>
                  </Link>
                </SignedOut>
                <SignedIn>
                  <Link href={"/dashboard"}>
                    <Button size={"lg"}>{t("goToDashboard")}</Button>
                  </Link>
                </SignedIn>
                <a href={"#more"}>
                  <Button size={"lg"} variant={"link"}>
                    {t("readMore")}
                  </Button>
                </a>
              </div>
            </div>
            <div className="p-8 flex items-center">
              <video
                width={"100%"}
                height={"100%"}
                autoPlay
                muted
                className="rounded-xl shadow-lg"
              >
                <source src="/demo-video.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </motion.div>
      <div id="more" className="h-1 my-16 md:my-24 scroll-smooth" />
      <div className="px-4 md:px-10 flex flex-col gap-16">
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
      <div className="h-1 my-10 md:my-16" />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        className="flex justify-center my-6"
      >
        <blockquote className="mt-6 border-l-2 pl-6 italic text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          {t("quote")}
        </blockquote>
      </motion.div>
      <div className="h-1 my-10 md:my-16" />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ ease: "easeInOut" }}
      >
        <div className="flex flex-col justify-center text-center px-4 py-8 md:py-12 max-w-2xl mx-auto">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl min-h-16">
            <RedoAnimText />
          </h1>
          <SignedOut>
            <p className="leading-7 py-6 md:py-8 text-xl text-muted-foreground">
              {t("ctaTitle")}
            </p>
            <div>
              <Link href={"/sign-up"}>
                <Button size="lg">{tc("signUp")}</Button>
              </Link>
            </div>
            <p className="leading-7 py-6 md:py-8 text-lg text-muted-foreground">
              {t("ctaAlreadyHaveAccount")}
            </p>
            <div>
              <Link href={"/sign-in"}>
                <Button variant="link">{tc("logIn")}</Button>
              </Link>
            </div>
          </SignedOut>
          <SignedIn>
            <p className="leading-7 py-6 md:py-8 text-xl text-muted-foreground">
              {t("ctaTitle")}
            </p>
            <div>
              <Link href={"/dashboard"}>
                <Button size="lg">{t("goToDashboard")}</Button>
              </Link>
            </div>
          </SignedIn>
        </div>
      </motion.div>
    </div>
  );
}
