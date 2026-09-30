import Language from "@/components/explore/ByLanguage";

const LanguagePage = async ({ params }) => {
  const { lan } = await params;

  return <Language country={lan} />;
};

export default LanguagePage;
