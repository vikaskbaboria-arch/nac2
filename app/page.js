import Image from "next/image";
import First from "@/components/home";
import Navbar from "@/components/Navbar";
import Movie from "@/components/movie";
import Series from "@/components/series";
export default function Home() {
  return (
    <>

     <div>
<First/>
     </div>



    <div className="">
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



    </>
  
  );
};
