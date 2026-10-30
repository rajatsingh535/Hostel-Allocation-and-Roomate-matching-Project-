
const WEIGHTS = {
  sleepSchedule: 20,
  foodPreference: 15,
  cleanliness: 20,
  studyHabits: 20,
  socialHabits: 10,
  noiseTolerance: 15
};

function calculateCompatibility(student1, student2) {
  const p1 = student1.roommatePreferences || {};
  const p2 = student2.roommatePreferences || {};

  let earnedPoints = 0;
  let totalWeight = 0;
  const breakdown = {};

  for (const [field, weight] of Object.entries(WEIGHTS)) {
    const value1 = p1[field];
    const value2 = p2[field];

    // Skip preferences missing from either student
    if (!value1 || !value2) continue;

    totalWeight += weight;

    // Flexible preferences match every option
    const isMatch =
      value1 === value2 ||
      value1 === "Flexible" ||
      value2 === "Flexible";

    if (isMatch) {
      earnedPoints += weight;
    }

    breakdown[field] = {
      student1: value1,
      student2: value2,
      match: isMatch,
      weight
    };
  }

  const score =
    totalWeight === 0
      ? 0
      : Math.round((earnedPoints / totalWeight) * 100);

  let category = "Low";

  if (score >= 80) category = "Excellent";
  else if (score >= 60) category = "Good";
  else if (score >= 40) category = "Average";

  return {
    score,
    category,
    breakdown
  };
}

module.exports = { calculateCompatibility };
