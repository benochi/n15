import { currentUser } from "@clerk/nextjs/server";

export default async function Clerk(){
  const user = await currentUser()
  const userFirstName: string | null | undefined = user?.firstName

  const name: string = userFirstName ?? "No name found."
  //can uncomment out the <pre> tag to see all user data you can render. 
  return (
    <div>
      <h1>Clerk has lots of user data like your username: {name}</h1>
      {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
    </div>
  )
}