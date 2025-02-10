import { currentUser,auth } from "@clerk/nextjs/server";

export default async function Clerk(){
  const user = await currentUser()
  const userFirstName: string | null | undefined = user?.firstName

  //To get a current users id use the auth function
  // const { userId } = auth()
  // const exampleApiCall = await apiCallName(userId!)

  const name: string = userFirstName ?? "No name found."
  //can uncomment out the <pre> tag to see all user data you can render. 
  // this only works in serverside components, and makes an API call to clerk and is subject ot rate limits. */
  return (
    <div>
      <h1>Clerk has lots of user data like your username: {name}</h1>
      {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
    </div>
  )
}