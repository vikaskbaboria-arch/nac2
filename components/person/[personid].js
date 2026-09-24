// app/person/[personId]/page.js
// Thin server component, same pattern as app/movie/[moviename]/page.js and
// app/series/[moviename]/page.js: unwrap the route param and hand off to a
// client component that does the actual data fetching + rendering.

import PersonFilmography from "@/components/PersonFilmography";

const PersonPage = async ({ params }) => {
  const { personId } = await params;

  return <PersonFilmography personId={personId} />;
};

export default PersonPage;