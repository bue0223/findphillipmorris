const axios = require('axios')
exports.pages = async (req, res) => {
  let toFindData = await axios.post(`${req.protocol}://${req.get('host')}/api/week`)
  console.log(toFindData.data.payload)
  res.render('pages', {
    layout : false,
    data : toFindData.data.payload,
    toFindCount : parseInt(toFindData.data.payload.week) + 2,
    
  });
};
  