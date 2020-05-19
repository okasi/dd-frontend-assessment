import React, { createContext, useContext, useState, useEffect } from "react"
import * as localForage from "localforage"
import ky from "ky-universal"
import { navigate } from "gatsby"

const authContext = createContext(null)

// Hook for child components to get the auth object and re-render when it changes.
export const useAuth = () => useContext(authContext)

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(undefined)
  const [error, setError] = useState(null)

  const signin = async (username, password) => {
    setError(null)

    try {
      const data = await ky
        .post(`${process.env.LOGIN_URL}`, { json: { username, password } })
        .json()
      console.log(data.token)
      if (data.token) {
        const user = {
          access_token: data.token,
        }
        setUser(user)
        await localForage.setItem("token", data.token)
        return user
      }
    } catch (e) {
      console.log(e)
      await localForage.removeItem("token")
      setUser(undefined)
      setError("Invalid email or password")
      return null
    }
  }

  const signout = async () => {
    setError(null)
    setUser(undefined)
    await localForage.removeItem("token")
    navigate("/")
    return null
  }

  useEffect(() => {
    ;(async function () {
      const token = await localForage.getItem("token")
      if (!token) {
        setUser(undefined)
      } else {
        const user = {
          access_token: token,
        }
        setUser(user)
      }
    })()
  }, [])

  // Return the user object and auth methods
  return {
    user,
    signin,
    signout,
    error,
  }
}

// Provider component that wraps your app and makes auth object available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}
