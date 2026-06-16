export const uploadReport = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Upload API working"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};