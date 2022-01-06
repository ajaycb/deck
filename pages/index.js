import styles from "./index.module.css";
import Sock from "../components/Hello";

const Home = () => (
  <div className={styles.container}>
    <Sock />
    Hi{" "}
  </div>
);

export default Home;
