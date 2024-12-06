const express = require("express")
const { postReviewText } = require("../controllers/reviewRouter")

const router = express.Router()

router.post("/postreviewstext" ,postReviewText )


module.exports = router