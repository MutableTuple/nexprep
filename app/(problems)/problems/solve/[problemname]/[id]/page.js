import SolveProblemScreen from "@/app/_components/Problems/SolveProblemScreen";
import React from "react";

export default async function page({ params }) {
  const { problemname, id } = await params;
  return <SolveProblemScreen questionId={id} problemname={problemname} />;
}
