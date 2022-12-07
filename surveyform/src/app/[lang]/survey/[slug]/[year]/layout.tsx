import { captureException } from "@sentry/nextjs";
import { notFound } from "next/navigation";
import { EntitiesProvider } from "~/core/components/common/EntitiesContext";
import { SurveyProvider } from "~/core/components/survey/SurveyContext/Provider";
import { fetchSurveyGithub } from "~/core/server/fetchSurveyGithub";
import { fetchEntitiesRedis } from "~/modules/entities/server/fetchEntitiesRedis";
import surveys from "~/surveys";

// revalidate survey/entities every 5 minutes
const SURVEY_TIMEOUT_SECONDS = 5 * 60;
export const revalidate = SURVEY_TIMEOUT_SECONDS;

export async function generateStaticParams() {
  return surveys.map((s) => ({
    slug: s.prettySlug,
    year: String(s.year),
  }));
}
/**
 * TODO: get the list of surveys statically during getStaticParams call
 * @param param0
 * @returns
 */
export default async function SurveyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string; year: string };
}) {
  const { slug, year } = params;
  //const survey = getSurvey(slug, year);
  // First experiment getting the survey from github
  const survey = await fetchSurveyGithub(slug, year);
  if (!survey) {
    notFound();
  }
  // NOTE: if fetch entities was based on survey slug
  // we could run those queries in //
  // (not useful in static mode though)
  let entities = [];
  try {
    const redisEntities = await fetchEntitiesRedis(survey.surveyId);
    if (!redisEntities) throw new Error("Entities not found in Redis");
    entities = redisEntities;
  } catch (err) {
    captureException(err);
  }

  // Apply survey colors
  const { bgColor, textColor, linkColor, hoverColor } = survey;
  const style = `
:root {
  --bg-color: ${bgColor};
  --text-color: ${textColor};
  --link-color: ${linkColor};
  --hover-color: ${hoverColor};
}
  `;

  return (
    <SurveyProvider survey={survey}>
      <style dangerouslySetInnerHTML={{ __html: style }} />
      <EntitiesProvider entities={entities}>{children}</EntitiesProvider>
    </SurveyProvider>
  );
}
