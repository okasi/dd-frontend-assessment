// Gatsby supports TypeScript natively!
import React, { useEffect } from "react"
import { Link, navigate } from "gatsby"

import Layout from "../atomic/03-organisms/layout"
import SEO from "../atomic/03-organisms/seo"

import { gql, useQuery } from "@apollo/client"
import { useAuth } from "../atomic/03-organisms/useAuth"

const GET_MEAL_PLANS = gql`
  query getMealPlans {
    memberMealplans(perPage: 5) {
      id
      title
      description
      slug
      shoppingList {
        shoppingSection
        ingredient {
          id
          titles {
            singular
          }
        }
        values {
          metric {
            servingSize
            value
            unit
          }
        }
      }
    }
  }
`

const PlansPage = props => {
  const auth = useAuth()
  useEffect(() => {
    if (!auth?.user) {
      return navigate("/")
    }
  }, [auth])

  const { loading, error, data } = useQuery(GET_MEAL_PLANS)

  if (loading) return "Loading..."
  if (error) return `Error! ${error.message}`
  return (
    <Layout>
      <SEO title="Meal plans" />
      <h1>Hi from {props.path}</h1>
      <ul>
        {data.memberMealplans.map(plan => (
          <li key={plan.id} className="mt-4">
            <p className="font-bold">{plan.title}</p>
            <p>{plan.description}</p>
          </li>
        ))}
      </ul>
      <Link to="/">Go back to the homepage</Link>
    </Layout>
  )
}

export default PlansPage
