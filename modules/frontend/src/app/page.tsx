// import Image from "next/image";
import { Header } from './components/Header'
import dynamic from 'next/dynamic'

const Dynamic = dynamic( () => import("./components/dynamic"), { ssr: false })

export default function Home() {

  return (
    <div className={"container mx-auto"}>
      <Header hideExplaination={false}/>
      <div className="m-2">
        <Dynamic />
      </div>
    </div>

  );
}
