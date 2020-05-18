import React, { useState, useEffect } from "react"
import { navigate } from "gatsby"

import Layout from "../atomic/03-organisms/layout"
import SEO from "../atomic/03-organisms/seo"
import SmartButton from "../atomic/01-atoms/SmartButton"
import { useAuth } from "../atomic/03-organisms/useAuth"

const IndexPage = () => {
  const auth = useAuth()
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)

  useEffect(() => {
    if (auth?.user?.access_token) {
      navigate("/plans")
    }
  }, [auth])

  return (
    <Layout>
      <SEO title="Start" />
      <form
        className="flex flex-col items-center"
        onSubmit={async e => {
          e.preventDefault()
          if (e.key !== "Enter") {
            ;(await auth.signin(email, password)) && navigate("/plans")
          }
        }}
        onKeyPress={e => {
          if (e.target.keyCode === 13) {
            e.preventDefault()
          }
        }}
      >
        <div>
          <label className="text-md font-semibold" htmlFor="email">
            <span>Email</span>
          </label>
          <input
            id="email"
            type="text"
            inputMode="email"
            minLength="6"
            maxLength="100"
            pattern="^([a-zA-Z0-9_\-\.\+]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$"
            required
            className="p-3 block transition-all duration-150 rounded-lg border-2 outline-none shadow focus:shadow-md leading-tight text-lg placeholder-smoke focus:placeholder-smoke-light"
            onChange={e => setEmail(e.target.value)}
          ></input>
        </div>
        <div className="mt-4">
          <label className="text-md font-semibold" htmlFor="password">
            <span>Password</span>
          </label>
          <input
            id="password"
            type="password"
            inputMode="text"
            minLength="6"
            maxLength="100"
            required
            className="p-3 block transition-all duration-150 rounded-lg border-2 outline-none shadow focus:shadow-md leading-tight text-lg placeholder-smoke focus:placeholder-smoke-light"
            onChange={e => setPassword(e.target.value)}
          ></input>

          <div
            className={`text-red-600 text-md ${
              auth.error ? "" : "invisible"
            } mt-2`}
          >
            {auth.error || "."}
          </div>

          <SmartButton className="mt-2 w-full inline-block" type="submit">
            Log In
          </SmartButton>
        </div>
      </form>
    </Layout>
  )
}

export default IndexPage
