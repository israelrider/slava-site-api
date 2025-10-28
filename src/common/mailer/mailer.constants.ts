import { UserDto } from '@/users/dto/user.dto';

export const registrationEmail = (user: UserDto) => {
  return `<html>
            <body>
              <div>
                <p>Hi ${user.name}!</p>
                <p>You did it! You registered!, You're successfully registered.✔</p>
              </div>
            </body>
          </html>
  `;
};

export const forgotPasswordEmail = (password: string) => {
  return `<html>
            <body>
              <div>
                <p>This is your new password: <b>${password}</b></p>
              </div>
            </body>
          </html>
  `;
};

export const changePasswordEmail = (password: string) => {
  return `<html>
            <body>
              <div>
                <p>This is your new password: <b>${password}</b></p>
              </div>
            </body>
          </html>
  `;
};
