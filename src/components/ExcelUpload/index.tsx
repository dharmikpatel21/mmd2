"use client";
import { formatPrimarySkills } from "@/lib/functions";
import React, { useState, useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";

type Props = {
  setParsedJobRequirement: React.Dispatch<
    React.SetStateAction<Record<string, any>[]>
  >;
  setParsedOnBenchEmployee: React.Dispatch<
    React.SetStateAction<Record<string, any>[]>
  >;
};

const ExcelUpload = ({
  setParsedJobRequirement,
  setParsedOnBenchEmployee,
}: Props) => {
  const [uploadType, setUploadType] = useState<
    "onBenchEmployee" | "jobRequirement"
  >("onBenchEmployee");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleExcelSubmit = async (data: FieldValues) => {
    const formData = new FormData();
    formData.append("file", data.excelFile[0]);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/excelToJson`,
        {
          method: "POST",
          body: formData,
          mode: "no-cors",
        }
      );
      if (response.ok) {
        toast({
          variant: "success",
          title: "Excel Upload",
          description: "Excel uploaded successfully",
        });
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (uploadType === "onBenchEmployee") {
        const formatOnBenchEmployee = formatPrimarySkills(result);
        sessionStorage.setItem(
          "onBenchEmployee",
          JSON.stringify(formatOnBenchEmployee)
        );
        setParsedOnBenchEmployee(formatOnBenchEmployee);
        setUploadType("jobRequirement");
      }
      if (uploadType === "jobRequirement") {
        sessionStorage.setItem(
          "jobRequirement",
          JSON.stringify(result["Open JR"])
        );
        setParsedJobRequirement(result["Open JR"]);
      }
    } catch (error: any) {
      console.error("Error uploading the file:", error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: `failed to upload the file : ${error.message}`,
      });
    }
  };

  // const handleOnBenchEmployeeSubmit = async (data: FieldValues) => {
  //   const formData = new FormData();
  //   formData.append("file", data.excelFile[0]);
  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_BASE_URL}/api/excelToJson`,
  //       {
  //         method: "POST",
  //         body: formData,
  //         mode: "no-cors",
  //       }
  //     );
  //     if (response.ok) {
  //       toast({
  //         title: "onBenchEmployee",
  //         description: "Excel uploaded successfully",
  //       });
  //     }
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const result = await response.json();
  //     const formatOnBenchEmployee = formatPrimarySkills(result);
  //     sessionStorage.setItem(
  //       "onBenchEmployee",
  //       JSON.stringify(formatOnBenchEmployee)
  //     );
  //     setParsedOnBenchEmployee(formatOnBenchEmployee);
  //     toast({
  //       title: "Excel upload status",
  //       description: "Excel uploaded successfully",
  //     });
  //   } catch (error: any) {
  //     console.error("Error uploading the file:", error.message);
  //   } finally {
  //     setUploadType("jobRequirement");
  //   }
  // };

  // const handleJobRequirementSubmit = async (data: FieldValues) => {
  //   const formData = new FormData();
  //   formData.append("file", data.excelFile[0]);
  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_BASE_URL}/api/excelToJson`,
  //       {
  //         method: "POST",
  //         body: formData,
  //         mode: "no-cors",
  //       }
  //     );

  //     if (response.ok) {
  //       toast({
  //         title: "jobRequirement",
  //         description: "Excel uploaded successfully",
  //       });
  //     }
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const result = await response.json();
  //     sessionStorage.setItem(
  //       "jobRequirement",
  //       JSON.stringify(result["Open JR"])
  //     );
  //     setParsedJobRequirement(result["Open JR"]);
  //   } catch (error: any) {
  //     console.error("Error uploading the file:", error.message);
  //   }
  // };

  return (
    <div className="flex flex-col items-center justify-center">
      {uploadType === "onBenchEmployee" && (
        <form
          onSubmit={handleSubmit(handleExcelSubmit)}
          className="flex flex-col gap-4"
        >
          <p>upload the excel file for onBenchEmployee </p>
          <div>
            <Input
              type="file"
              accept=".xlsx"
              {...register("excelFile", { required: true })}
              className="cursor-pointer"
            />
            {errors.excelFile && (
              <p className="text-rose-400">Please upload an Excel file.</p>
            )}
          </div>
          <Button type="submit">Upload</Button>
        </form>
      )}

      {uploadType === "jobRequirement" && (
        <form
          onSubmit={handleSubmit(handleExcelSubmit)}
          className="flex flex-col gap-4"
        >
          <p>upload the excel file for jobRequirement </p>
          <div>
            <Input
              type="file"
              accept=".xlsx"
              {...register("excelFile", { required: true })}
              className="cursor-pointer"
            />
            {errors.excelFile && (
              <p className="text-rose-400">Please upload an Excel file.</p>
            )}
          </div>
          <Button type="submit">Submit Job Requirement Data</Button>
        </form>
      )}
    </div>
  );
};

export default ExcelUpload;
