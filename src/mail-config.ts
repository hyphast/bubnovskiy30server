export const mailConfig = {
  defaults: {
    from: process.env.smtpUser,
  },
  transport: {
    host: process.env.smtpHost,
    port: parseInt(process.env.smtpPort),
    secure: false,
    auth: {
      user: process.env.smtpUser,
      pass: process.env.smtpPassword,
    },
  },
}
