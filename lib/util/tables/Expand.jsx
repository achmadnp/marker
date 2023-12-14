import { fetcher } from "@/lib/fetcher";
import { ErrorSection } from "@/page-components/Error/ErrorSection";
import { RenderExpanded } from "@/page-components/Expanded/Expanded";
import { ExpandedForm } from "@/page-components/Expanded/ExpandedForm";
import { LoadingPage } from "@/page-components/Loading/LoadingPage";
import { useState } from "react";
import useSWR from "swr";

const ExpandedRenderer = ({ type, data }) => {
  const [colWidth, setColWidth] = useState(300);

  // useSWR maybe?
  const {
    data: expandedData,
    error: expErr,
    isLoading,
  } = useSWR(`/api/projects/${data?.pid}`, fetcher);

  if (isLoading) return <LoadingPage />;
  if (expErr) return <ErrorSection />;
  if (expandedData.length == 0) {
    return <ExpandedForm />;
  } else {
    return <RenderExpanded />;
  }
};

export default ExpandedRenderer;
