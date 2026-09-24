import PersonFilmography from "@/components/PersonFilmography";

const PersonPage = async ({ params }) => {
  const { personId } = await params;

  return <PersonFilmography personId={personId} />;
};

export default PersonPage;
