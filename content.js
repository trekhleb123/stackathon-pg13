const { isPG } = require("./index")
import Bottleneck from "bottleneck"

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 100,
})

console.log("Chrome extension ready to go")

let filenames = ["img1.jpg", "img2.png", "img3.jpg", "img4.jpg", "img5.jpg"]
const allImg = Array.from(document.getElementsByTagName("img"))

console.log(allImg)

let body = document.querySelector("body")
body.style.filter = "blur(5px)"

function imageExists(url) {
  fetch(url, { method: "HEAD" })
    .then((res) => {
      if (res.ok) {
        //console.log(true)
        return true
      } else {
        // console.log(false)
        return false
      }
    })
    .catch((err) => console.log("Error:", err))
}

const clarifaiRun = async (imgs) => {
  await Promise.all(
    imgs.map(async (image) => {
      // let exists
      // if (image.currentSrc.length) {
      //   console.log("img exists", imageExists(image.currentSrc))
      //   exists = imageExists(image.currentSrc)
      // } else {
      //   exists = imageExists(`${window.location.protocol}${image.src}`)
      // }
      // if (!exists) {
      //   console.log(exists)
      // }

      const result = await limiter.schedule(
        () => isPG(image.currentSrc)
        // if (image.currentSrc.length) {
        //   return isPG(image.currentSrc)
        // } else if (image.src.length) {
        //   return image.src.includes("http")
        //     ? isPG(image.src)
        //     : isPG(`${window.location.protocol}${image.src}`)
        // }
      )

      console.log({ result })
      // console.log("in the loop result", result)
      if (result === false) {
        console.log("it's false")
        console.log(image)
        // let idx = Math.floor(Math.random() * filenames.length)
        // let file = "images/art/" + filenames[idx]
        // let url = chrome.runtime.getURL(file)
        image.src =
          "https://www.moma.org/media/W1siZiIsIjQ2NzUxNyJdLFsicCIsImNvbnZlcnQiLCItcXVhbGl0eSA5MCAtcmVzaXplIDIwMDB4MjAwMFx1MDAzZSJdXQ.jpg?sha=314ebf8cc678676f"
        image.srcset =
          "https://www.moma.org/media/W1siZiIsIjQ2NzUxNyJdLFsicCIsImNvbnZlcnQiLCItcXVhbGl0eSA5MCAtcmVzaXplIDIwMDB4MjAwMFx1MDAzZSJdXQ.jpg?sha=314ebf8cc678676f"
      }
    })
  )
  // let divNode = document.querySelectorAll("#wrap")[0]
  // divNode.replaceWith(...divNode.childNodes)
  body.style.removeProperty("filter")
}

clarifaiRun(allImg)
