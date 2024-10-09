import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import LandingHeader from "./components/LandingHeader";
import HeroPage from "./components/HeroPage";
import ContentPage from "./components/ContentPage";

export default function Home() {
  return (
    <div>
       <LandingHeader/>
       <div></div>
       <HeroPage/>
       <div></div>
       <ContentPage/>
    </div>
  );
}
