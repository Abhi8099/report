import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import HeaderComp from "@/components/HeaderComp";
import Banner from "@/components/Banner";
import Benifits from "@/components/Benifits";
import Views from "@/components/Views";
import Works from "@/components/Works";
import HomeForm from "@/components/HomeForm";
import Testimonial from "@/components/Testimonial";
import Faq from "@/components/Faq";
import { FooterFour } from "@/components/Footer";
import React from "react";
import Image from "next/image";




export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Home page for NextAdmin Dashboard Kit",
};


export default function Home() {


  return (
    <div className="bgReport">
      <HeaderComp/>
<Banner/>
<Benifits/>
<Works/>
<Views/>
<Testimonial/>
<Faq/>
<HomeForm/>
      <FooterFour/>
</div>
  );
}
