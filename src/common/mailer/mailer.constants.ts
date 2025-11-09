export const registrationEmail = (name: string, url: string) => {
  return `
  <html>
    <body>
      <div>
        <p>Hi ${name}!</p>
        <p>You registered, please confirm your email by clicking the link below:</p>
        <a href="${url}">Confirm Email</a>
      </div>
    </body>
  </html>
  `;
};

export const forgotPasswordEmail = (password: string) => {
  return `
    <html>
      <body>
        <div>
          <p>This is your new password: <b>${password}</b></p>
        </div>
      </body>
    </html>
  `;
};

export const changePasswordEmail = (password: string) => {
  return `
    <html>
      <body>
        <div>
          <p>This is your new password: <b>${password}</b></p>
        </div>
      </body>
    </html>
  `;
};
