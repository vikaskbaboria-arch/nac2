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
    <div className="lg:hidden">
      <Rightsidepanel  classN={"block"}/>
     </div>
 
 <div className="relative  z-10    mx-auto px-4 lg:20 xl:px-24 pt-4 lg:pt-6">
  <div className="lg:grid lg:grid-cols-[minmax(0,4fr)_minmax(0,1.5fr)] sm:gap-4 lg:gap-8 items-start" >


      <div className="flex flex-col gap-8">
      <Trending />
      <EditorsPick />
      
    
      <DontMissOnNetflix />
      <DontMissOnPrimeVideo />
    
      
    </div>

    <div className="mt-14">
      <Rightsidepanel classN={"lg:block"}/>
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