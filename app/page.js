import Image from "next/image";
import First from "@/components/home";
import DontMissOnNetflix from "@/components/dontmissonnetflix";
import DontMissOnPrimeVideo from "@/components/dontmissonprime";
import HomeSkeleton from "@/components/HomeSkeleton";
import MostInterested from "@/components/mostInterested";
import { Footer } from "@/components/footer";
import EditorsPick from "@/components/EditorsPick";
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
    <div className="blackgreengrad">

   
{/* <Starfield/> */}
     <div className=" sm:hidden">
<First/>
     </div>
 
 <div className="relative  z-10    mx-auto px-8 lg:px-24 lg:pt-6">
  <div className=" lg:grid grid-cols-[4fr_2fr] gap-8 items-start" >


      <div className="flex flex-col gap-8">
      <Trending />
      <EditorsPick />
      <TrendingonNac />
      <DontMissOnNetflix />
      <DontMissOnPrimeVideo />
    
      
    </div>

    <div className="mt-14">
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