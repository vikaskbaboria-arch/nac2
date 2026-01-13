import Image from "next/image";
import First from "@/components/home";
import { AuroraText } from "@/components/ui/aurora-text";
import Navbar from "@/components/Navbar";
import Movie from "@/components/movie";
import Series from "@/components/series";
import Trending from "@/components/Trending";
import Starfield from "@/components/starfield";
import Rightsidepanel from "@/components/rightsidepanel";
export default function Home() {
  return (
    <>
    <div className="">

   
<Starfield/>
     <div>
<First/>
     </div>
 <div className="relative  z-10  mx-auto px-30 mt-6">
  <div className="hidden lg:grid grid-cols-[4fr_2fr] gap-6 items-start" >
    <Trending />
    <Rightsidepanel />
  </div>
</div>

    
    <div className=" px-4 sm:px-0.5">
      <Series movie={35}/>
          <Movie movie ={28}/>
    <Movie movie ={12}/>
    <Movie movie ={16}/>
    <Movie movie ={35}/>
    <Movie movie ={80}/>
    {/* <Movie movie ={99}/>
    <Movie movie ={18}/>
    <Movie movie ={10751}/> */}
    {/* <Movie movie ={14}/>
    <Movie movie ={36}/>
    <Movie movie ={27}/>
    <Movie movie ={10402}/> */}
    <Movie movie ={878}/>
    <Movie movie ={10749}/>
    <Movie movie ={53}/>
    </div>

 </div>

    </>
  
  );
};
