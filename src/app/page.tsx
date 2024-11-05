import DefaultLayout from "@/components/Layouts/DefaultLaout";
import HeaderComp from "@/components/HeaderComp";
import Banner from "@/components/Banner";
import Benifits from "@/components/Benifits";
import Views from "@/components/Views";
import Works from "@/components/Works";
import HomeForm from "@/components/HomeForm";
import Testimonial from "@/components/Testimonial";
import Faq from "@/components/Faq";
import Cursor from "@/components/Cursor";
import { FooterFour } from "@/components/Footer";
import React from "react";
import Image from "next/image";
import SmoothScroll from "./Smoothscroll";

export default function Home() {
  return (
    <SmoothScroll>
      <div className="bgReport">
        <HeaderComp />
        <Banner />
        <Benifits />
        <Works />
        <Views />
        <Testimonial />
        <Faq />
        <HomeForm />
        <FooterFour />
      </div>
    </SmoothScroll>
  );
}