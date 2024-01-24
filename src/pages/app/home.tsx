import { Helmet } from 'react-helmet-async'

export function Home() {
  return (
    <>
      <Helmet title="Home" />
      <div className="flex h-full items-center justify-center ">
        <p>Página em construção 😄</p>
      </div>
    </>
  )
}
