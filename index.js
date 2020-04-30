const jsdom = require("jsdom")
const { JSDOM } = jsdom
const fs = require("fs")
const got = require("got")
const Clarifai = require("clarifai")
const _find = require("lodash/find")
const clarifaiApp = new Clarifai.App({
  apiKey: "698a9578efec4ea9af9b83e09c691501",
})

const wikiUrl = "https://en.wikipedia.org/wiki/Sexual_intercourse"

got(wikiUrl)
  .then((response) => {
    const dom = new JSDOM(response.body)
    dom.window.document
      .querySelectorAll("img")
      .forEach((el) => console.log(el.src))
  })
  .catch((err) => {
    console.log(err)
  })

const isArt = async (url) => {
  try {
    const res = await clarifaiApp.models.predict(Clarifai.GENERAL_MODEL, url)
    //console.log(JSON.stringify(generalConcepts, null, 2))
    const artConcept = _find(res.outputs[0].data.concepts, { name: "art" })
    if (artConcept && artConcept.value > 0.8) return true
    return false
  } catch (err) {
    console.log(err)
  }
}

const imageURL =
  "https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Semi-protection-shackle.svg/20px-Semi-protection-shackle.svg.png"

const isPG = async (url) => {
  try {
    const response = await clarifaiApp.models.predict(
      "d16f390eb32cad478c7ae150069bd2c6",
      url
    )

    const safeConcept = _find(response.outputs[0].data.concepts, {
      name: "safe",
    })
    if (safeConcept && safeConcept.value > 0.8) {
      console.log(true)
      return true
    } else {
      const result = await isArt(url)
      console.log(result)
      return result
    }
  } catch (err) {
    console.log(err)
  }
}

isPG(imageURL)
