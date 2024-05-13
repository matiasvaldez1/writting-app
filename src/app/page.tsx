"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import RedoAnimText from "./_components/anim-writting-text";

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
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ ease: "easeInOut" }}
      >
        <div>
          <div className="grid grid-cols-1 xl:grid-cols-2 rounded-md">
            <p className="leading-7 p-20 text-xl">
              Looking to unleash your creativity and bring your writing projects
              to life? Look no further than our Writing App! With our
              user-friendly platform, you can seamlessly organize your thoughts,
              craft compelling stories, and effortlessly structure your
              narrative. Gone are the days of juggling multiple documents or
              struggling to keep track of your ideas. Our app empowers you to
              create books, divide them into chapters, and arrange them in the
              perfect order, all within one convenient interface. Whether
              you&apos;re a seasoned author or just starting your writing
              journey, our app provides the tools you need to streamline your
              process and turn your ideas into polished manuscripts. Say goodbye
              to writer&apos;s block and hello to a world of limitless
              storytelling possibilities with our Writing App.
            </p>
            <p className="leading-7 p-20 text-xl">
              Don&apos;t let the fear of a blank page hold you back any longer.
              Our Writing App is designed to kickstart your creativity and keep
              it flowing. With features like customizable templates, character
              and plot development tools, and easy-to-use editing functions,
              you&apos;ll find yourself inspired to write like never before.
              Plus, our cloud-based platform ensures that your work is always
              accessible, whether you&apos;re at home, in the office, or on the
              go. And with seamless integration with popular publishing
              platforms, sharing your masterpiece with the world has never been
              easier. Join the thousands of writers who have already discovered
              the power of our Writing App and take your storytelling to new
              heights today!
            </p>
          </div>
        </div>
      </motion.div>
      <div className="h-1 my-32" />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ delay: 0.5 }}
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
