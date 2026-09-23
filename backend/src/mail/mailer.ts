import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const MAIL_FROM =
  process.env.MAIL_FROM ?? "GritSkool <noreply@gritskool.com>";

/**
 * Fire-and-forget: a failed confirmation email does not block registration.
 */
export function sendWaitlistConfirmation(
  name: string | null,
  email: string
): void {
  const greeting = name ? `Hi ${name},` : 'Hi there,';
  void resend.emails
    .send({
      from: MAIL_FROM,
      to: email,
      subject: "You're on the GritSkool waitlist!",
      text: `${greeting}

You're successfully registered for the GritSkool waitlist. We'll email you as launch day gets closer.

- Team GritSkool`,
      html: `
        <p>${greeting}</p>
        <p>
          You're <strong>successfully registered</strong> for the GritSkool
          waitlist. We'll email you as launch day gets closer.
        </p>
        <p>- Team GritSkool</p>
      `,
    })
    .then(({ data, error }) => {
      if (error) {
        console.error(
          `Failed to send waitlist confirmation email to ${email}:`,
          error
        );
        return;
      }

      console.log(
        `Waitlist confirmation email sent to ${email}`,
        data?.id ? `(ID: ${data.id})` : ""
      );
    })
    .catch((error: unknown) => {
      console.error(
        `Failed to send waitlist confirmation email to ${email}:`,
        error
      );
    });
}

/**
 * OTP email.
 *
 * This function is awaited by the registration flow.
 * If Resend fails, the error is thrown so registration does not
 * continue as if the OTP was successfully delivered.
 */
export async function sendOtpEmail(
  firstName: string,
  email: string,
  otp: string
): Promise<void> {
  console.log("[MAIL] RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);
  console.log("[MAIL] MAIL_FROM:", MAIL_FROM);
  console.log("[MAIL] Sending OTP to:", email);
  const { data, error } = await resend.emails.send({
    from: MAIL_FROM,
    to: email,
    subject: "Your GritSkool verification code",
    text: `Hi ${firstName},

Your GritSkool verification code is ${otp}. It expires in 10 minutes.

- Team GritSkool`,
    html: `
      <p>Hi ${firstName},</p>

      <p>Your GritSkool verification code is:</p>

      <p style="
        font-size:28px;
        font-weight:700;
        letter-spacing:4px;
      ">
        ${otp}
      </p>

      <p>It expires in 10 minutes.</p>

      <p>- Team GritSkool</p>
    `,
  });

  if (error) {
    console.error(
      `Failed to send OTP email to ${email}:`,
      error
    );

    throw new Error(`Failed to send OTP email: ${error.message}`);
  }

  console.log(
    `OTP email sent to ${email}`,
    data?.id ? `(ID: ${data.id})` : ""
  );
}

/**
 * Fire-and-forget: a failed confirmation email does not block registration.
 */
export function sendRegistrationConfirmation(
  firstName: string,
  email: string
): void {
  void resend.emails
    .send({
      from: MAIL_FROM,
      to: email,
      subject: "Welcome to GritSkool!",
      text: `Hi ${firstName},

Your GritSkool account was created successfully. You're all set to sign in.

- Team GritSkool`,
      html: `
        <p>Hi ${firstName},</p>
        <p>
          Your GritSkool account was
          <strong>created successfully</strong>.
          You're all set to sign in.
        </p>
        <p>- Team GritSkool</p>
      `,
    })
    .then(({ data, error }) => {
      if (error) {
        console.error(
          `Failed to send registration confirmation email to ${email}:`,
          error
        );
        return;
      }

      console.log(
        `Registration confirmation email sent to ${email}`,
        data?.id ? `(ID: ${data.id})` : ""
      );
    })
    .catch((error: unknown) => {
      console.error(
        `Failed to send registration confirmation email to ${email}:`,
        error
      );
    });
}