import React, { useEffect, useState } from "react"
import { Link, navigate } from "gatsby"

import Layout from "../atomic/03-organisms/layout"
import SEO from "../atomic/03-organisms/seo"

import { gql, useQuery } from "@apollo/client"
import { useAuth } from "../atomic/03-organisms/useAuth"

import Fade from "react-reveal/Fade"

const GET_MEAL_PLANS = gql`
  query getMealPlans($perPage: Int) {
    memberMealplans(perPage: $perPage) {
      title
      description
      slug
      schedule {
        name
        dinner {
          recipesDetails {
            images {
              default
            }
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

  const [perPage, setPerPage] = useState(5)

  const { loading, error, data } = useQuery(GET_MEAL_PLANS, {
    variables: {
      perPage: perPage,
    },
  })

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  if (error) return `Error! ${error.message}`
  return (
    <Layout>
      <SEO title="Meal plans" />

      {data && (
        <ul>
          {data.memberMealplans.map(plan => (
            <>
              <Fade bottom cascade>
                <div>
                  <li key={plan.slug} className="mt-4">
                    <p className="font-bold text-2xl">{plan.title}</p>
                    <p className="text-md">{plan.description}</p>
                    <Link
                      to={`/plan?id=${plan.slug}`}
                      className="text-dd-blue font-semibold mt-2 inline-block"
                    >
                      Full meal plan →
                    </Link>
                    <div className="-mx-1">
                      <div className="flex flex-row w-full flex-wrap justify-center md:justify-start mt-2 mx-auto">
                        {[
                          "monday",
                          "tuesday",
                          "wednesday",
                          "thursday",
                          "friday",
                          "saturday",
                          "sunday",
                        ].map((day, index) => (
                          <div className="h-48 md:flex-1 relative" key={index}>
                            {/* These images would really like some optimization, they are too heavy, createRemoteFileNode is not an option because authentication is needed */}
                            <img
                              src={plan.schedule
                                .filter(res => res.name === day)
                                .map(
                                  ele =>
                                    `https://www.dietdoctor.com${ele.dinner.recipesDetails[0]?.images?.default}`
                                )}
                              className="max-w-full h-full block p-1 object-cover"
                            ></img>
                            <div className="absolute inset-0 text-xl text-dd-black opacity-75 m-2">
                              {capitalizeFirstLetter(day.slice(0, 3))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </li>
                </div>
              </Fade>
              <hr className="border-b border-smoke-lightest mt-6" />
            </>
          ))}
        </ul>
      )}
      <div className="mt-4 mb-12">
        {loading && (
          <div className="text-dd-black italic">Loading meal plans...</div>
        )}
        {data && !loading && (
          <a
            onClick={() => setPerPage(perPage + 10)}
            className="cursor-pointer font-bold text-blue-500"
          >
            Load more
          </a>
        )}
      </div>
    </Layout>
  )
}

export default PlansPage
