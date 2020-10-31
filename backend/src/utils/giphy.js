
const giphy = require('giphy-api')(process.env.GIFHY_API_KEY);



const getGif= async (subject) => {
    const gif = await  giphy.random({
        tag: subject,
        rating: 'g'
    })
    return gif.data.image_original_url
}


module.exports = {
    getGif
}