const { isPG } = require("./index")
import Bottleneck from "bottleneck"

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 100,
})

let filenames = ["img1.jpg", "img2.png", "img3.jpg", "img4.jpg", "img5.jpg"]
const allImg = Array.from(document.getElementsByTagName("img"))

let body = document.querySelector("body")
body.style.filter = "blur(10px)"

const imageExists = (url) => {
  fetch(url, { method: "HEAD" })
    .then((res) => {
      if (res.ok) {
        return true
      } else {
        return false
      }
    })
    .catch((err) => console.log("Error:", err))
}

const clarifaiRun = async (imgs) => {
  await Promise.all(
    imgs.map(async (image) => {
      if (!imageExists.currentSrc.includes(".svg")) {
        const result = await limiter.schedule(() => isPG(image.currentSrc))

        console.log({ result })
        if (result === false) {
          let idx = Math.floor(Math.random() * filenames.length)
          let file = "images/art/" + filenames[idx]
          let url = chrome.runtime.getURL(file)
          image.src = url
          image.srcset = url
        }
      }
    })
  )

  body.style.removeProperty("filter")
}

clarifaiRun(allImg)
