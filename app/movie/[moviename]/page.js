import Search from "@/components/result";
import { fetchProviders } from "@/fetch/providers";

const SearchPage = async ({ params }) => {
  const { moviename } = await params;   // ✅ NO await

     const providers = await fetchProviders({
    media_type: "movie",
    id: moviename,})

    console.log(providers)
 


  return (
    <>
      <Search movie={moviename} streamer ={providers}  />
    </>
  );
};

export default SearchPage;
