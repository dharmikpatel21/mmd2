"use client";
import { formatPrimarySkills } from "@/lib/functions";
import React, { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { toast, useToast } from "../ui/use-toast";

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
  const onSubmit = async (data: FieldValues) => {
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
      }
      if (uploadType === "jobRequirement") {
        sessionStorage.setItem(
          "jobRequirement",
          JSON.stringify(result["Open JR"])
        );
        setParsedJobRequirement(result["Open JR"]);
      }
      if (result) {
        toast({
          title: "Excel upload status",
          description: "excel uploaded successfully",
        });
      }
    } catch (error: any) {
      console.error("Error uploading the file:", error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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

        {/* <div className="flex flex-col">
        <label>
          <input
            type="radio"
            value="onBenchEmployee"
            checked={uploadType === "onBenchEmployee"}
            onChange={() => setUploadType("onBenchEmployee")}
          />
          Upload On Bench Employee Data
        </label>
        <label>
          <input
            type="radio"
            value="jobRequirement"
            checked={uploadType === "jobRequirement"}
            onChange={() => setUploadType("jobRequirement")}
          />
          Upload Job Requirement Data
        </label>
      </div> */}
        <RadioGroup
          value={uploadType}
          onValueChange={(value) =>
            setUploadType(value as "onBenchEmployee" | "jobRequirement")
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="onBenchEmployee" id="onBenchEmployee" />
            <Label htmlFor="onBenchEmployee">
              Upload On Bench Employee Data
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="jobRequirement" id="jobRequirement" />
            <Label htmlFor="jobRequirement">Upload Job Requirement Data</Label>
          </div>
        </RadioGroup>
        {/* <button>Upload and Convert</button> */}
        <Button type="submit">Upload and Convert</Button>
      </form>
    </div>
  );
};

export default ExcelUpload;
