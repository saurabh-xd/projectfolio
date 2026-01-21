import NextAuth, {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/dbconnect";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
   
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials?.email });
        if (!user) throw new Error("User not found");

        const isValid = await bcrypt.compare(
          credentials!.password,
          user.password
        );
        if (!isValid) throw new Error("Invalid password");

        return { id: user._id, email: user.email, username: user.username , userimage: user.userimage,};
      },
    }),

    // 2️⃣ Google login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    // 3️⃣ GitHub login
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],

   callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") {
        await connectDB();

        const existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          const newUser = await User.create({
            email: user.email,
            username: user.name || user.email?.split("@")[0],
            provider: account?.provider,
            userimage: user.image || null,
          });
          // Set user data for JWT
          user.id = newUser._id.toString();
          user.username = newUser.username;
          user.userimage = newUser.userimage;
        }
        else {
          // Use existing user data
          user.id = existingUser._id.toString();
          user.username = existingUser.username;
          user.userimage = existingUser.userimage || user.image;
        }
      }
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.userimage = user.userimage;
      }

      if (trigger === "update" && session?.user?.userimage) {
        token.userimage = session.user.userimage;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.userimage = token.userimage as string;
      }
      return session;
    },
  },

  session: { strategy: "jwt" },
  pages: {
    signIn: "/login", // optional custom login page
  },


};


