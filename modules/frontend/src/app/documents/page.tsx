
import { DynamicConnected } from './components/dynamic'

import { Header } from '@/app/components/Header'

export default function Documents() {

  return (<div className={"container mx-auto"}>
     <Header hideExplaination={true} />
     <div className="m-2">
        <DynamicConnected />
     </div>
  </div>)
}
