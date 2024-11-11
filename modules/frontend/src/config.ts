
/// a kind of workaround because NEXT_PUBLIC envs don't work in client rendered pages
// (but I like client rendered pages / components!)
// so make a unified system by bypassing it all
export function getConfig(key: string): string {
  // TODO: actually make the unified system

  const betaSettings : {[key: string]: string} = {
    AMPLIFY_USERPOOL_ID: "us-east-1_7SwoAY02u",
    AMPLIFY_WEBCLIENT_ID: "5cmu7esaum79r2h9u95piqa3tv"
  }

  const res = betaSettings[key]
  return res
}

export enum Env {
       Beta = "-beta",
       Dev = "-dev",
       Staging = "-staging",
       Prod = ""
}
