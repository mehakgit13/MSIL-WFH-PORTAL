export const getProfile = async (req, res) => {
  try {
    res.json({
      id: req.user._id,
      employeeId: req.user.employeeId,
      name: req.user.name,
      email: req.user.email,
      department: req.user.department,
      designation: req.user.designation,
      manager: req.user.manager,
      location: req.user.location,
      joiningDate: req.user.joiningDate,
      role: req.user.role,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};