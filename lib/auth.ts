import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    signIn({ account }) {
      // Only allow Oliver's GitHub account
      return account?.providerAccountId === process.env.GITHUB_ALLOWED_ACCOUNT_ID
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
})
