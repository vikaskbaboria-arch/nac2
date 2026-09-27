import Country from "@/components/explore/country";
 
const CountryPage = async ({ params }) => {
  const { countryCode } = await params;
 
  return <Country country={countryCode} />;
};
 
export default CountryPage;
 