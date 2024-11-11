// import Image from "next/image";
import { Header } from './components/Header'
import { Dynamic } from './components/dynamic'

export default function Home() {

  return (
    <div className={"container mx-auto"}>
      <Header />
      <div className="m-2">
        <Dynamic />
      </div>
    </div>

  );
}
