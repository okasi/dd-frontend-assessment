import { Link } from "gatsby"
import React from "react"

const SmartButton = ({
  pink = null,
  className = "",
  to,
  target = "_blank",
  type,
  children,
  onClick = null,
}) => {
  const finalClassName = `
    text-lg transition-all duration-100 ease-out font-bold text-center rounded-full text-white hover:shadow-md
    ${pink ? "bg-dd-pink" : "bg-dd-green"}
    ${!className?.includes("w-") ? "max-w-100" : ""}
    no-underline
    py-3 px-5 
    ${className ? className : ""}
  `

  return to ? (
    to.includes("://") || to.includes("mailto:") || to.includes("#") ? (
      <a
        href={to}
        className={finalClassName}
        target={target || (to.includes("#") ? "_self" : "_blank")}
        rel="noopener"
        role="button"
        aria-label={children}
        onClick={onClick}
      >
        <span>{children}</span>
      </a>
    ) : (
      <Link
        to={to}
        className={finalClassName}
        role="button"
        aria-label={children}
        onClick={onClick}
      >
        <span>{children}</span>
      </Link>
    )
  ) : (
    <button
      className={finalClassName}
      type={type || "button"}
      aria-label={children}
      onClick={onClick}
    >
      <span>{children}</span>
    </button>
  )
}

export default SmartButton
