export async function getExercises() {
  const url1 =
    "https://raw.githubusercontent.com/davejt/exercise/master/data/exercises";
  let res = await fetch(url1);
  return res;
}
