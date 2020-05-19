import React, { useEffect, useState } from "react"
import Layout from "../atomic/03-organisms/layout"
import { useLocation } from "@reach/router"

import { gql, useQuery } from "@apollo/client"

import * as _ from "lodash"
import SEO from "../atomic/03-organisms/seo"

import { useAuth } from "../atomic/03-organisms/useAuth"
import { navigate } from "gatsby"

import Fade from "react-reveal/Fade"

const GET_MEAL_PLAN_DETAILS = gql`
  query getMealPlanDetails($slug: String!) {
    mealplanBySlug(slug: $slug) {
      title
      description
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
      schedule {
        name
        breakfast {
          recipesDetails {
            title
            images {
              default
            }
            instructionSections {
              steps
            }
          }
        }
        lunch {
          recipesDetails {
            title
            images {
              default
            }
            instructionSections {
              steps
            }
          }
        }
        dinner {
          recipesDetails {
            title
            images {
              default
            }
            instructionSections {
              steps
            }
          }
        }
      }
    }
  }
`

const PlanPage = props => {
  const auth = useAuth()
  useEffect(() => {
    if (!auth?.user) {
      return navigate("/")
    }
  }, [auth])

  // Reading slug
  const location = useLocation()
  const params = new URLSearchParams(
    typeof window !== "undefined" && location.search
  )
  const term = params.get("id")

  const { loading, error, data } = useQuery(GET_MEAL_PLAN_DETAILS, {
    variables: {
      slug: term,
    },
  })

  const [view, setView] = useState("list") // For tabs
  const [shoppingList, setShoppingList] = useState({}) // For the shopping list
  const [recipeList, setRecipeList] = useState({}) // For recipes

  useEffect(() => {
    // Organize all ingredients to their corresponding section for the Shopping list
    if (data && data.mealplanBySlug && data.mealplanBySlug.shoppingList) {
      let list = {}

      // Keys
      data.mealplanBySlug.shoppingList.map((item, index) => {
        list[item.shoppingSection] = []
      })

      // Populate arrays
      data.mealplanBySlug.shoppingList.map(item => {
        list[item.shoppingSection].push({
          title: item.ingredient.titles.singular,
          value: item.values.metric
            .filter(res => res.servingSize === 1)
            .map(el => `${el.value} ${el.unit}`)[0],
        })
      })

      setShoppingList(list)
    }

    // Organize all recipes to their corresponding mealtime
    if (data && data.mealplanBySlug && data.mealplanBySlug.schedule) {
      let list = {
        breakfast: [],
        lunch: [],
        dinner: [],
      }

      // Populate arrays
      data.mealplanBySlug.schedule.map(item => {
        if (item.breakfast.recipesDetails.length > 0) {
          list.breakfast.push(item.breakfast.recipesDetails)
        }
        if (item.lunch.recipesDetails.length > 0) {
          list.lunch.push(item.lunch.recipesDetails)
        }
        if (item.dinner.recipesDetails.length > 0) {
          list.dinner.push(item.dinner.recipesDetails)
        }
      })

      // Make arrays unique
      list.breakfast = _.uniqWith(list.breakfast, _.isEqual)
      list.lunch = _.uniqWith(list.lunch, _.isEqual)
      list.dinner = _.uniqWith(list.dinner, _.isEqual)

      list = _.flatMap(list)
      list = _.flatten(list)

      setRecipeList(list)
    }
  }, [data])

  if (error) return `Error! ${error.message}`
  return (
    <Layout>
      <SEO title="Meal plan details" />

      {data && (
        <>
          {/* Overview */}
          <h1 className="text-3xl font-bold">{data.mealplanBySlug.title}</h1>
          <p className="text-lg">{data.mealplanBySlug.description}</p>

          {/* Tabs */}
          <div className="flex flex-row border-b border-smoke-light justify-around text-center mt-4">
            <div
              className={`cursor-pointer text-lg font-bold rounded-t-lg p-3 flex-1 ${
                view === "recipes"
                  ? "bg-dd-green text-white"
                  : "bg-gray-300 text-dd-black opacity-75"
              }`}
              onClick={() => setView("recipes")}
            >
              Recipes
            </div>
            <div
              className={`cursor-pointer text-lg font-bold rounded-t-lg p-3 flex-1 ${
                view === "list"
                  ? "bg-dd-green text-white"
                  : "bg-gray-300 text-dd-black opacity-75"
              }`}
              onClick={() => setView("list")}
            >
              Shopping List
            </div>
          </div>

          {/* Shopping list body */}
          {/* The reason I hide instead of conditionally rendering is because I don't want the checkboxes to reset */}
          <div className={`${view !== "list" ? "hidden" : ""}`}>
            <>
              <div className="flex flex-row flex-wrap justify-center lg:justify-between mb-12">
                {Object.keys(shoppingList).map((section, index) => (
                  <div className="m-4 max-w-sm w-full" key={index}>
                    <h2 className="font-bold text-3xl">{section}</h2>
                    <ul>
                      {shoppingList[section].map((item, index) => (
                        <ListItem key={index}>
                          {item.title} {item.value}
                        </ListItem>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </>
          </div>

          {/* Recipes body */}
          <div className={`${view !== "recipes" ? "hidden" : ""}`}>
            <ul className="flex flex-col justify-center mt-8 mb-12 ">
              {recipeList.length > 0 &&
                recipeList.map((recipe, index) => (
                  <Fade bottom>
                    <div
                      className="items-center justify-around w-full flex flex-col md:flex-row"
                      key={index}
                    >
                      <img
                        src={`https://i.dietdoctor.com${recipe.images.default}?auto=compress%2Cformat&w=600&h=600&fit=crop`}
                        className="rounded-lg w-64 h-64 object-cover border border-outline"
                      ></img>
                      <div className="mt-4 md:mt-0 md:mx-4 w-full max-w-lg">
                        <h3 className="text-3xl font-bold">{recipe.title}</h3>
                        <div className="text-2xl">Instructions</div>
                        <ul className="mx-5 md:mx-4 mt-2">
                          {recipe.instructionSections[0].steps.map(
                            (instruction, index) => (
                              <InstructionItem key={index}>
                                {instruction}
                              </InstructionItem>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                    <hr className="border-b border-smoke-lightest my-6" />
                  </Fade>
                ))}
            </ul>
          </div>
        </>
      )}

      {loading && (
        <div className="text-dd-black italic ">Loading details...</div>
      )}
    </Layout>
  )
}

// Checklist for shopping list
const ListItem = ({ children, ...props }) => {
  const [checked, setChecked] = useState(false)
  return (
    <li className={`text-lg ${checked ? "line-through" : ""}`} key={props.key}>
      <input type="checkbox" onClick={() => setChecked(!checked)} />
      <label className="ml-4">{children}</label>
    </li>
  )
}

// Checkable instruction
const InstructionItem = ({ children, ...props }) => {
  const [checked, setChecked] = useState(false)
  return (
    <li
      className={`text-lg list-decimal mb-1 cursor-pointer ${
        checked ? "line-through opacity-75" : ""
      }`}
      key={props.key}
      onClick={() => setChecked(!checked)}
    >
      {children}
    </li>
  )
}

export default PlanPage
