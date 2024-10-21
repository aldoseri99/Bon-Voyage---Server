const axios = require("axios")

const getLocation = async (req, res) => {
  const country = req.params.country

  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: country,
          format: "json",
          limit: 1,
        },
      }
    )

    if (response.data.length > 0) {
      const { lat, lon } = response.data[0]
      res.json({ latitude: lat, longitude: lon })
    } else {
      res.json({ message: "Country not found" })
    }
  } catch (error) {
    console.error("Error fetching location data:", error.message)
    res.json({ message: "Error fetching location data" })
  }
}

module.exports = { getLocation }
