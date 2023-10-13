// Function to render the index/home page
exports.homePage = (req, res) => {
  res.render("index");
};

// Function to render the contact page
exports.contactPage = (req, res) => {
  res.render("contact");
};

// Function to render the about page
exports.aboutPage = (req, res) => {
  res.render("about");
};