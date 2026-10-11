
import DontMissOnNetflix from "@/components/home/dontmissonnetflix";
import DontMissOnPrimeVideo from "@/components/home/dontmissonprime";

import { Footer } from "@/components/layout/footer";
import EditorsPick from "@/components/home/EditorsPick";
import NacCollection from "@/components/collections/NacCollection";
import { AuroraText } from "@/components/ui/aurora-text";
import Navbar from "@/components/layout/Navbar";
import { ReviewsSection } from "@/components/reviews/homereviews";
import Movie from "@/components/media/movie";
import Series from "@/components/media/series";
import Trending from "@/components/home/Trending";
import Starfield from "@/components/layout/starfield";
import Rightsidepanel from "@/components/home/rightsidepanel";
import TrendingonNac from "@/components/home/TrendingonNac";
import DontMissOnHotstar from "@/components/home/dontmissonhotstar";
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