import PageHeading from "@/components/ui/page-header";
import { getUserAnalitics } from "../_actions/books";
import { SessionDurationChart } from "../_components/dashboard-charts";

export default async function Dashboard() {
  const { userAnalytics } = await getUserAnalitics();
  return (
    <div className="flex flex-col gap-10">
      <PageHeading title="Dashboard" />
      <SessionDurationChart userAnalytics={userAnalytics} />
    </div>
  );
}
