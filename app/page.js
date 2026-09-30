
import DontMissOnNetflix from "@/components/dontmissonnetflix";
import DontMissOnPrimeVideo from "@/components/dontmissonprime";

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
import DontMissOnHotstar from "@/components/dontmissonhotstar";
export default function Home() {

  return (
    <>
    <div className="blackgreengradforp md:blackgreengrad">

   
{/* <Starfield/> */}
 <div className="relative z-10 mx-auto px-1 pt-4 sm:px-6 lg:px-20 lg:pt-6 xl:px-24">
  <div className="flex flex-col items-start gap-4 lg:gap-8 lg:grid lg:grid-cols-[minmax(0,4fr)_minmax(0,1.5fr)] lg:gap-8" >


      <div className="order-2 flex min-w-0 flex-col gap-8 lg:order-1">
      <Trending />
      <EditorsPick />
      
    
      <DontMissOnNetflix />
      <DontMissOnPrimeVideo />
      <DontMissOnHotstar/>
      
    </div>

    <div className="order-1 w-full min-w-0 lg:order-2 lg:mt-14">
      <Rightsidepanel />
    </div>

    
   
  
</div>


<div>

  {/* <ReviewsSection/> */}
</div>


</div>

 
 

 </div>

    </>
  
  );
};