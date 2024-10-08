export const formatPrimarySkills = (result: any) => {
  const mergedData: any[] = [];
  const empMap = new Map();
  const key = Object.keys(result)[0];

  result[key].forEach((item: Record<string, any>) => {
    if (item.EmpID) {
      if (!empMap.has(item.EmpID)) {
        empMap.set(item.EmpID, {
          ...item,
          "Primary Skills ": item["Primary Skills "]
            ? [item["Primary Skills "]]
            : [],
        });
      }
    } else if (item["Primary Skills "]) {
      const lastEmp = Array.from(empMap.values()).pop();
      if (lastEmp) {
        lastEmp["Primary Skills "].push(item["Primary Skills "]);
      }
    }
  });

  empMap.forEach((emp) => mergedData.push(emp));

  return mergedData;
};

export const getEmployeesFromSkills = ({
  skills,
  parsedOnBenchEmployee,
}: {
  skills: string[];
  parsedOnBenchEmployee: Record<string, any>[];
}) => {
  const employeesArray = Object.values(parsedOnBenchEmployee || {});
  // const matchingEmployees = employeesArray.filter((employee) =>
  //   skills.some(
  //     (skill: string) => employee["Primary Skills "]?.includes(skill)
  //     // employee["Skills"]?.includes(skill)
  //   )
  // );
  const matchingEmployees = employeesArray.filter((employee) =>
    skills.some((skill: string) => {
      const lowerCaseSkill = skill.toLowerCase();
      const employeeSkills = [
        ...(employee["Primary Skills "] || []),
        employee["Skills"],
      ].map((s) => s.toLowerCase());
      return employeeSkills.some((empSkill) =>
        empSkill.includes(lowerCaseSkill)
      );
    })
  );
  return matchingEmployees;
};
