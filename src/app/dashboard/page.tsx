import PageHeading from "@/components/ui/page-header";
import { getUserAnalyticsAction } from "../_actions/books";
import { SessionDurationChart } from "../_components/dashboard-charts";
import { NothingToSeeYet } from "../_components/nothing-to-see-yet";

export default async function Dashboard() {
  const { userAnalytics } = await getUserAnalyticsAction();

  if (userAnalytics.length === 0) {
    return <NothingToSeeYet />;
  }
  return (
    <div className="flex flex-col gap-10">
      <PageHeading title="Dashboard" />
      <SessionDurationChart userAnalytics={userAnalytics} />
    </div>
  );
}
