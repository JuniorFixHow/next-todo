import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDb } from '@/utils/db';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { NextResponse } from 'next/server';

const handler = NextAuth({
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),

        CredentialsProvider({
            id:'credentials',
            name:'Credentials',

            async authorize(credentials){
                await connectDb();

                try {
                    const {email, password} = credentials;
                    const user = await User.findOne({email});
                    // console.log(credentials, user)
                    if(user){
                        const checkPassword = await bcrypt.compare(password, user.password);
                        if(checkPassword){
                            // console.log(user)
                            return user;
                        }else{
                            throw new Error('Incorrect email or password');
                        }
                    }
                    else{

                        throw new Error('Incorrect email or password');
                    }

                } catch (error) {
                    throw new Error(error.message);
                }
            }
        })
    ],

    callbacks:{

        async session({session}){
            // await connectDb();
            try {
                const sessionUser = await User.findOne({email:session.user.email});
                if(sessionUser){

                    const sesUser = {
                        _id:sessionUser._id,
                        username: sessionUser.username,
                        email: sessionUser.email,
                        image: sessionUser.image
                    }
                    session.user = sesUser;
                    // console.log(session.user);
                    return session;
                }
            } catch (error) {
                console.log(error)
                return false;
            }
        },
    
        async signIn({profile, credentials}){
        //   console.log('profile: => ',profile)
        //   console.log('credentials: => ',credentials)
              await connectDb();
              try {
                const userEmail = profile?.email || credentials?.email
                  const userExists = await User.findOne({email:userEmail});
                //   console.log(!userExists && profile);
                  if(!userExists && profile){
                      await User.create({
                          email: profile?.email,
                          username: profile?.given_name,
                          image:profile?.picture,
                          password: '1234'
                      })
                  }
                 return true;
              } catch (error) {
                  console.log(error)
                  return false
              }
          
         
        },
    },


    pages:{
        error:'/login'
    }
})

export {handler as GET, handler as POST};