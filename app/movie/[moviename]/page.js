import SeriesR from "@/components/result";
import { fetchProviders } from "@/fetch/providers";

const SearchPage = async ({ params, searchParams}) => {
  const { moviename } = await params;   // ✅ NO await

     
  const { type } = await searchParams;
    // console.log(providers)
    console.log("movietypw",type)
 const providers = await fetchProviders({
    media_type: type,
    id: moviename,})

  return (
    <>
      <SeriesR movie={moviename} streamer ={providers}  type={type}/>
    </>
  );
};

export default SearchPage;
