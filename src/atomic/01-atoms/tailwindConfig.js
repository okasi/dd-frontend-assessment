import resolveConfig from "tailwindcss/resolveConfig"
import tailwindConfig from "../../../tailwind.config"
let fullConfig = resolveConfig(tailwindConfig)
fullConfig = JSON.parse(JSON.stringify(fullConfig).replace(/px/g, ""))
const tw = fullConfig.theme
export { tw }
