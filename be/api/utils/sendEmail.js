const nodemailer = require("nodemailer");

module.exports = async (req, res, next) => {
  try {
    // console.log(req.parseData.saveUser.email);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "solidthomas30@gmail.com",
        pass: "d4rulh1k4m",
      },
    });
    let info = await transporter.sendMail({
      from: "solidthomas30@gmail.com",
      to: req.parseData.saveUser.email,
      subject: "Token e-commerce",
      text: `Hello, ${req.parseData.saveUser.email} \n
            This is your token to login and will be expire in 1 hours \n
            http://localhost:3000/user/login \n
            email: ${req.parseData.saveUser.email}\n
            token: \n ${req.parseData.token}`,
    });
    console.log(info);
    res.status(201).json({
      message: "User created, the token had sent to email",
      email: req.parseData.saveUser.email,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
