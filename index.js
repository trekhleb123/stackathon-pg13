const Clarifai = require("clarifai")
const _find = require("lodash/find")
const clarifaiApp = new Clarifai.App({
  apiKey: "8c12a1098d2d42bc9f314ee73b8ff8e2",
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
    console.log(err)
  }
}

module.exports = { isPG }
