import Image from "next/image";
import First from "@/components/home";
import DontMissOnNetflix from "@/components/dontmissonnetflix";
import DontMissOnPrimeVideo from "@/components/dontmissonprime";
import HomeSkeleton from "@/components/HomeSkeleton";
import MostInterested from "@/components/mostInterested";
import { Footer } from "@/components/footer";
import EditorsPick from "@/components/EditorsPick";
import NacCollection from "@/components/NacCollection";
import { AuroraText } from "@/components/ui/aurora-text";
import Navbar from "@/components/Navbar";
import { ReviewsSection } from "@/components/homereviews";
import Movie from "@/components/movie";
import Series from "@/components/series";
import Trending from "@/components/Trending";
import Starfield from "@/components/starfield";
import Rightsidepanel from "@/components/rightsidepanel";
import TrendingonNac from "@/components/TrendingonNac";
export default function Home() {

  return (
    <>
    <div className="blackgreengradforp lg:blackgreengrad">

   
{/* <Starfield/> */}
 <div className="relative z-10 mx-auto px-4 pt-4 sm:px-6 lg:px-20 lg:pt-6 xl:px-24">
  <div className="flex flex-col items-start gap-8 lg:grid lg:grid-cols-[minmax(0,4fr)_minmax(0,1.5fr)] lg:gap-8" >


      <div className="order-2 flex min-w-0 flex-col gap-8 lg:order-1">
      <Trending />
      <EditorsPick />
      
    
      <DontMissOnNetflix />
      <DontMissOnPrimeVideo />
    
      
    </div>

    <div className="order-1 w-full min-w-0 lg:order-2 lg:mt-14">
      <Rightsidepanel />
    </div>

    
   
  
</div>


<div>

  {/* <ReviewsSection/> */}
</div>


</div>

    <Footer/>
 

 </div>

    </>
  
  );
};