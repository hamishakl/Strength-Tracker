import styles from "~/styles/home.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

function Home() {
  return (
    <div className="">
      <h1>Strength Tracker</h1>
      <p>Track your personal records with ease</p>
    </div>
  );
}
    
export default Home;
