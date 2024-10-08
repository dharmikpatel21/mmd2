import jsonData from "../../db.json";
export const getSkillsfromJobTitle = async (jobTitle: string) => {
  try {
    const skillsDataFiltered = jsonData.skills.filter(
      (skill) => skill.title === jobTitle
    );

    if (skillsDataFiltered.length > 0) {
      const skills = skillsDataFiltered[0].skills;
      console.log("Skills for the job title:", jobTitle, skills);
      return skills;
    } else {
      console.log("No skills found for the job title:", jobTitle);
      return [];
    }
  } catch (error: any) {
    console.error("Error processing skills data", error.message);
  }
};
