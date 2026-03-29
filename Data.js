const initialProblems = [
  {
    id: 1,
    title: "Two Sum",
    pattern: "Arrays & Hashing",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    approach: "Use a hash map to store the value and its index. For each number, check if target - number exists in the map.",
    code: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`,
    timestamp: new Date().getTime()
  },
  {
    id: 2,
    title: "Minimum Difference Between K Scores",
    pattern: "Sliding Window",
    difficulty: "Easy",
    description: "Pick k students such that the difference between the highest and lowest scores is minimized.",
    approach: "Sort the array and check all windows of size k. The difference will always be between the first and last element of a sorted window.",
    code: `def minimumDifference(nums, k):
    nums.sort()
    mini = float("inf")
    for i in range(len(nums) - k + 1):
        mini = min(mini, nums[i + k - 1] - nums[i])
    return mini`,
    timestamp: new Date().getTime() - 100000
  }
];

// Load from localStorage or use initial data
function loadProblems() {
  const stored = localStorage.getItem('dsa_problems');
  if (stored) {
    return JSON.parse(stored);
  } else {
    localStorage.setItem('dsa_problems', JSON.stringify(initialProblems));
    return initialProblems;
  }
}

function saveProblems(problemsArray) {
  localStorage.setItem('dsa_problems', JSON.stringify(problemsArray));
}