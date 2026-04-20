import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "completedTasks";

/** Hämta ALLA avklarade tasks */
export async function getCompletedTasks(): Promise<Record<string, boolean>> {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

/** Kolla om en task är klar */
export async function isTaskCompleted(taskId: string): Promise<boolean> {
  const tasks = await getCompletedTasks();
  return !!tasks[taskId];
}

/** Toggle task (klar / inte klar) */
export async function toggleTask(taskId: string): Promise<boolean> {
  const tasks = await getCompletedTasks();

  if (tasks[taskId]) {
    delete tasks[taskId];
  } else {
    tasks[taskId] = true;
  }

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  return !!tasks[taskId];
}