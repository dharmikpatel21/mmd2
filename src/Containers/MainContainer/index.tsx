"use client";
import ExcelUpload from "@/components/ExcelUpload";
import SelectJob from "@/components/SelectJob";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
const MapWithEmployeeMarkers = dynamic(
  () => import("@/components/MapWithEmployeeMarkers"),
  { ssr: false }
);
type Props = {};

const MainContainer = (props: Props) => {
  const [empDataWithCoordinates, setEmpDataWithCoordinates] = useState<
    Record<string, any>[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [parsedJobRequirement, setParsedJobRequirement] = useState<
    Record<string, any>[]
  >([]);
  const [parsedOnBenchEmployee, setParsedOnBenchEmployee] = useState<
    Record<string, any>[]
  >([]);

  useEffect(() => {
    const storedJobRequirement = sessionStorage.getItem("jobRequirement");
    if (storedJobRequirement) {
      setParsedJobRequirement(JSON.parse(storedJobRequirement));
    }
    const storedOnBenchEmployee = sessionStorage.getItem("onBenchEmployee");
    if (storedOnBenchEmployee) {
      setParsedOnBenchEmployee(JSON.parse(storedOnBenchEmployee));
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 p-10">
      <ExcelUpload
        setParsedJobRequirement={setParsedJobRequirement}
        setParsedOnBenchEmployee={setParsedOnBenchEmployee}
      />
      {parsedJobRequirement.length > 0 && (
        <SelectJob
          parsedOnBenchEmployee={parsedOnBenchEmployee}
          parsedJobRequirement={parsedJobRequirement}
          setEmpDataWithCoordinates={setEmpDataWithCoordinates}
          setLoading={setLoading}
        />
      )}

      <MapWithEmployeeMarkers
        empDataWithCoordinates={empDataWithCoordinates}
        loading={loading}
      />
    </div>
  );
};

export default MainContainer;
