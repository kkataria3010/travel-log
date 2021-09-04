const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Invalid Route',
  });
};
module.exports = notFound;
