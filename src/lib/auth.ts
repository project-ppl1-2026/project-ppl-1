import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path

import { sendEmail } from "./email";
import prisma from "./prisma";

export const auth = betterAuth({
  // Uses the app URL so OAuth redirects always resolve to this Next.js app.
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  // Enables email/password sign up and requires verification before login.
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignInAfterVerification: true, // AUTO LOGIN AFTER VERIFICATION CLICK
    onExistingUserSignUp: async ({ user }) => {
      void sendEmail({
        to: user.email,
        subject: "Sign-up attempt detected",
        text: "Someone tried to sign up using your email. If this was you, try signing in instead.",
      });
    },
  },
  // Sends verification links through SMTP and avoids timing attacks by not awaiting from auth flow.
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click this link to verify your email: ${url}`,
        html: `<p>Click this link to verify your email:</p><p><a href="${url}">${url}</a></p>`,
      });
    },
  },
  // Allows implicit linking by email for trusted OAuth providers.
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
      disableImplicitLinking: false,
    },
  },
  // Configures Google OAuth and forces consent flow so refresh tokens can be issued.
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      accessType: "offline",
      prompt: "select_account consent",
    },
  },
});
