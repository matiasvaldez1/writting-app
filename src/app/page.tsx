"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import RedoAnimText from "./_components/anim-writting-text";
import FeaturesSection from "./_components/features-section";

export default function LandingPage() {
  return (
    <div className="pt-0 pr-10 pb-0 pl-10">
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
                Write, Organize, Publish: Your Complete Writing Companion!
              </h1>
              <p className="leading-7 text-sm xl:text-xl mt-4">
                Looking to unleash your creativity and bring your writing
                projects to life? Look no further than our Writing App! With our
                user-friendly platform, you can seamlessly organize all your
                writtings in one place.
              </p>
              <div className="flex justify-evenly p-10">
                <Link href={"/sign-in"}>
                  <Button size={"lg"}>Get started</Button>
                </Link>
                <a href={"#more"}>
                  <Button size={"lg"} variant={"link"}>
                    Read more
                  </Button>
                </a>
              </div>
            </div>
            <div className="p-10">
              <video width={"100%"} height={"100%"} autoPlay muted>
                <source src="/demo-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
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
          title="Edit Your Book"
          text="You will be able to edit your book with a bunch of different options in our built in - easy to use text editor."
        />
        <FeaturesSection
          reversed={true}
          image="managing-chapters-demo.jpg"
          title="Manage Chapters"
          text="You can easily manage the order of your books by just dragging them around changing their order, renaming their titles or descriptions."
        />
        <FeaturesSection
          reversed={false}
          image="export-as-pdf-result-demo.jpg"
          title="Export as PDF"
          text="When you finish writting your book you can click on the Generate Pdf section and this will generate a downloadable PDF for you to easily visualize your draft."
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
          &quot;The scariest moment is always just before you start.&quot; -
          Stephen King
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
                <p className="leading-7 p-8 md:p-20 text-xl">
                  Sign up to start using all the functionalities from our
                  writting app!
                </p>
                <Link href={"/sign-up"}>
                  <Button className="text-2xl" variant="link">
                    Sign up
                  </Button>
                </Link>
                <p className="leading-7 p-20 text-xl">
                  Already have an account?
                </p>
                <Link href={"/sign-in"}>
                  <Button className="text-2xl" variant="link">
                    Log in
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
