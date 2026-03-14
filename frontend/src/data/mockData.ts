export interface RunningSession {
  date: string;
  distance: number;
  duration: number;
  heartRate: {
    min: number;
    max: number;
    average: number;
  };
  caloriesBurned: number;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  createdAt: string;
  age: number;
  weight: number;
  height: number;
  gender: string;
  profilePicture: string;
}

export interface UserStatistics {
  totalDistance: string;
  totalSessions: number;
  totalDuration: number;
  totalCalories: number;
}

export interface UserInfo {
  profile: UserProfile;
  statistics: UserStatistics;
}

export interface MockUser {
  id: string;
  username: string;
  password: string;
  weeklyGoal: number;
  userInfos: UserProfile & { gender: string };
  runningData: RunningSession[];
}

// Mock data mirroring the backend structure
export const mockUsers: MockUser[] = [
  {
    id: "user123",
    username: "sophiemartin",
    password: "password123",
    weeklyGoal: 2,
    userInfos: {
      firstName: "Sophie",
      lastName: "Martin",
      age: 32,
      gender: "female",
      profilePicture: "http://localhost:8000/images/sophie.jpg",
      height: 165,
      weight: 60,
      createdAt: "2025-01-01",
    },
    runningData: [
      { date: "2025-01-04", distance: 5.8, duration: 38, heartRate: { min: 140, max: 178, average: 163 }, caloriesBurned: 422 },
      { date: "2025-01-05", distance: 3.2, duration: 20, heartRate: { min: 148, max: 184, average: 171 }, caloriesBurned: 248 },
      { date: "2025-01-09", distance: 6.4, duration: 42, heartRate: { min: 140, max: 176, average: 163 }, caloriesBurned: 468 },
      { date: "2025-01-12", distance: 7.5, duration: 50, heartRate: { min: 138, max: 178, average: 162 }, caloriesBurned: 532 },
      { date: "2025-01-19", distance: 5.1, duration: 34, heartRate: { min: 141, max: 177, average: 165 }, caloriesBurned: 378 },
      { date: "2025-01-25", distance: 4.8, duration: 32, heartRate: { min: 143, max: 179, average: 166 }, caloriesBurned: 352 },
      { date: "2025-01-26", distance: 3.5, duration: 22, heartRate: { min: 146, max: 183, average: 170 }, caloriesBurned: 265 },
      { date: "2025-02-02", distance: 6.2, duration: 40, heartRate: { min: 142, max: 177, average: 164 }, caloriesBurned: 455 },
      { date: "2025-02-05", distance: 8.0, duration: 52, heartRate: { min: 140, max: 178, average: 162 }, caloriesBurned: 565 },
      { date: "2025-02-08", distance: 4.5, duration: 30, heartRate: { min: 144, max: 180, average: 167 }, caloriesBurned: 335 },
      { date: "2025-02-15", distance: 9.2, duration: 62, heartRate: { min: 138, max: 179, average: 161 }, caloriesBurned: 645 },
      { date: "2025-02-22", distance: 5.5, duration: 36, heartRate: { min: 142, max: 178, average: 165 }, caloriesBurned: 398 },
      { date: "2025-03-01", distance: 7.8, duration: 50, heartRate: { min: 140, max: 178, average: 162 }, caloriesBurned: 545 },
      { date: "2025-03-09", distance: 10.5, duration: 68, heartRate: { min: 136, max: 179, average: 159 }, caloriesBurned: 720 },
      { date: "2025-03-15", distance: 6.8, duration: 44, heartRate: { min: 141, max: 178, average: 163 }, caloriesBurned: 485 },
    ],
  },
  {
    id: "user789",
    username: "emmaleroy",
    password: "password789",
    weeklyGoal: 3,
    userInfos: {
      firstName: "Emma",
      lastName: "Leroy",
      age: 28,
      gender: "female",
      profilePicture: "http://localhost:8000/images/emma.jpg",
      height: 170,
      weight: 62,
      createdAt: "2025-02-15",
    },
    runningData: [
      { date: "2025-02-16", distance: 4.2, duration: 28, heartRate: { min: 142, max: 176, average: 162 }, caloriesBurned: 310 },
      { date: "2025-02-20", distance: 5.5, duration: 36, heartRate: { min: 140, max: 175, average: 161 }, caloriesBurned: 395 },
      { date: "2025-02-25", distance: 6.0, duration: 39, heartRate: { min: 138, max: 174, average: 160 }, caloriesBurned: 430 },
      { date: "2025-03-01", distance: 7.3, duration: 47, heartRate: { min: 136, max: 177, average: 159 }, caloriesBurned: 510 },
      { date: "2025-03-05", distance: 3.8, duration: 25, heartRate: { min: 145, max: 180, average: 167 }, caloriesBurned: 280 },
      { date: "2025-03-10", distance: 8.1, duration: 53, heartRate: { min: 137, max: 178, average: 160 }, caloriesBurned: 570 },
      { date: "2025-03-15", distance: 5.9, duration: 38, heartRate: { min: 141, max: 176, average: 163 }, caloriesBurned: 420 },
      { date: "2025-03-20", distance: 6.7, duration: 43, heartRate: { min: 139, max: 177, average: 162 }, caloriesBurned: 475 },
    ],
  },
  {
    id: "marcdubois",
    username: "marcdubois",
    password: "password456",
    weeklyGoal: 4,
    userInfos: {
      firstName: "Marc",
      lastName: "Dubois",
      age: 35,
      gender: "male",
      profilePicture: "http://localhost:8000/images/marc.jpg",
      height: 180,
      weight: 85,
      createdAt: "2025-01-10",
    },
    runningData: [
      { date: "2025-01-12", distance: 6.5, duration: 42, heartRate: { min: 138, max: 175, average: 160 }, caloriesBurned: 520 },
      { date: "2025-01-15", distance: 4.8, duration: 31, heartRate: { min: 142, max: 178, average: 164 }, caloriesBurned: 385 },
      { date: "2025-01-20", distance: 8.2, duration: 54, heartRate: { min: 135, max: 176, average: 158 }, caloriesBurned: 655 },
      { date: "2025-01-25", distance: 5.5, duration: 36, heartRate: { min: 140, max: 177, average: 162 }, caloriesBurned: 440 },
      { date: "2025-02-01", distance: 7.0, duration: 45, heartRate: { min: 137, max: 176, average: 160 }, caloriesBurned: 560 },
      { date: "2025-02-08", distance: 9.3, duration: 60, heartRate: { min: 134, max: 178, average: 158 }, caloriesBurned: 745 },
      { date: "2025-02-15", distance: 5.2, duration: 34, heartRate: { min: 141, max: 177, average: 163 }, caloriesBurned: 415 },
      { date: "2025-02-22", distance: 6.8, duration: 44, heartRate: { min: 139, max: 176, average: 161 }, caloriesBurned: 545 },
    ],
  },
];

// Mock login function
export function mockLogin(username: string, password: string) {
  const user = mockUsers.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) return null;
  return {
    token: `mock-token-${user.id}`,
    userId: user.id,
  };
}

// Mock get user info
export function mockGetUserInfo(userId: string): UserInfo | null {
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) return null;

  const totalDistance = user.runningData
    .reduce((sum, s) => sum + s.distance, 0)
    .toFixed(1);
  const totalSessions = user.runningData.length;
  const totalDuration = user.runningData.reduce(
    (sum, s) => sum + s.duration,
    0
  );
  const totalCalories = user.runningData.reduce(
    (sum, s) => sum + s.caloriesBurned,
    0
  );

  return {
    profile: {
      firstName: user.userInfos.firstName,
      lastName: user.userInfos.lastName,
      createdAt: user.userInfos.createdAt,
      age: user.userInfos.age,
      weight: user.userInfos.weight,
      height: user.userInfos.height,
      gender: user.userInfos.gender,
      profilePicture: user.userInfos.profilePicture,
    },
    statistics: {
      totalDistance,
      totalSessions,
      totalDuration,
      totalCalories,
    },
  };
}

// Mock get user activity
export function mockGetUserActivity(
  userId: string,
  startWeek: string,
  endWeek: string
): RunningSession[] {
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) return [];

  const startDate = new Date(startWeek);
  const endDate = new Date(endWeek);
  const now = new Date();

  return user.runningData
    .filter((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate >= startDate && sessionDate <= endDate && sessionDate <= now;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
