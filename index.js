const Clarifai = require("clarifai")
const _find = require("lodash/find")
const clarifaiApp = new Clarifai.App({
  apiKey: "API_KEY_PLACEHOLDER",
})

const isArt = async (url) => {
  try {
    const res = await clarifaiApp.models.predict(Clarifai.GENERAL_MODEL, url)
    const artConcept = _find(res.outputs[0].data.concepts, { name: "art" })
    if (artConcept && artConcept.value > 0.8) return true
    return false
  } catch (err) {
    console.log(err)
  }
}

const isPG = async (url) => {
  try {
    const response = await clarifaiApp.models.predict(
      "d16f390eb32cad478c7ae150069bd2c6",
      url
    )

    const safeConcept = _find(response.outputs[0].data.concepts, {
      name: "safe",
    })
    if (safeConcept && safeConcept.value > 0.2) {
      return true
    } else {
      const result = await isArt(url)
      return result
    }
  } catch (err) {
    console.log(err, url)
  }
}

module.exports = { isPG }
