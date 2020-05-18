import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import DietDoctorHorizontalLogo from "../01-atoms/DietDoctorHorizontalLogo"
import { useAuth } from "./useAuth"

const Header = ({ siteTitle }) => {
  const auth = useAuth()
  return (
    <header className="bg-dd-blue mb-5">
      <div className="mx-auto max-w-screen-lg p-5 flex flex-row justify-between items-center">
        <h1 style={{ margin: 0 }}>
          <Link
            to="/"
            style={{
              color: `white`,
              textDecoration: `none`,
            }}
          >
            <DietDoctorHorizontalLogo
              color="white"
              className="h-12"
            ></DietDoctorHorizontalLogo>
          </Link>
        </h1>
        {auth.user && (
          <a
            className="text-white text-lg font-bold cursor-pointer"
            onClick={() => auth.signout()}
          >
            Log Out
          </a>
        )}
      </div>
    </header>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
