import User from "../model/user";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { ResponseData } from "../utils/ResponseData";
import { sendEmail } from "../utils/sendEmail";

type RegisterParam = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

type LoginParam = {
    email: string;
    password: string;
}

type VerifyEmailParam = {
    token: string,
    _id: string;
}

type ForgotPasswordParam = {
    email: string;
}

type ResetPasswordParam = {
    newPassword: string;
    confirmNewPassword: string;
    token: string;
    _id: string;
}

type UpdateUserPayload = {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: number;
    image: string;
}

export class UserServices {
    static async registerUser (payload: RegisterParam) {
        let data;

        const {firstName, lastName, email, password} = payload;
        if(!firstName || !lastName || !email || !password){
            data = new ResponseData("error", 400, "Invalid payload", null);

            return data;
        }
        const user = await User.findOne({email: email});
        if(user){
            data = new ResponseData("error", 400, "Email is already registered, please try logging in.", null);

            return data;
        }

        const hashedPassword = await this.hashPassword(password);
        const token = this.generateJWTToken(email);

        const newUser = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
        });

        data = new ResponseData("success", 200, "Signed up successfully", {user: newUser, token: token});

        return data;
    }

    static async loginUser(payload: LoginParam){
        let data;
        const {email, password} = payload;
        if(!email || !password){
            data = new ResponseData("error", 400, "Invalid payload", null);

            return data;
        }

        const user = await User.findOne({email: email});
        if(!user){
            data = new ResponseData("error", 400, "This email is not registered, please sign up first", null);

            return data;
        }

        const validatePassword = this.validatePassword(password, user?.password);
        if(!validatePassword){
            data = new ResponseData("error", 400, "Incorrect password, please enter correct password to continue", null);

            return data;
        }

        const token = this.generateJWTToken(email);

        data = new ResponseData("success", 200, "User signed in.", {user: user, token: token});

        return data;
    }

    static async logoutUser() {
        const data = new ResponseData("success", 200, "Logged out successfully", null); 

        return data;
    }

    static async hashPassword(password: string){
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(password, salt);
    }

    static async storeTokenForEmailVerification (payload: {email: string}) {
        let data;
        const {email} = payload
        if(!email){
            data = new ResponseData("error", 400, "Invalid payload", null);

            return data;
        }
        const user = await User.findOne({email: email});
        if(!user){
            data = new ResponseData("error", 400, "This email is not registered, please signup first", null)

            return data;
        }

        const token = this.generateToken(email);
        const expire = this.getExpireTime();

        await user.updateOne({
            verifyEmailToken: token,
            verifyEmailTokenExpire: expire
        });

        await user.save();

        const verifyUrl = `http://localhost:5500/verify-email?token=${token}&id=${user?._id}`

        data = new ResponseData("success", 200, "An email has been sent to your account", null);

        return data;
    }

    static async validateVerifyEmailToken (payload: VerifyEmailParam) {
        let data;
        const {token, _id} = payload;
        if(!token || !_id){
            data = new ResponseData("error", 400, "Invalid payload", null);
            
            return data;
        }
        const user = await User.findById(_id);
        if(!user){
            data = new ResponseData("error", 400, "Invalid user id", null);

            return data;
        }

        const time = Date.now();
        if(time > user.verifyEmailTokenExpire){
            data = new ResponseData("error", 400, "Your verification code has expired, pleae generate a new code to continue.", null);

            return data;
        }

        if(token !== user.verifyEmailToken){
            data = new ResponseData("error", 400, "Invalid token, please enter correct token to continue", null)

            return data;
        }

        await user.updateOne({
            isEmailValid: true,
            verifyEmailToken: null,
            verifyEmailTokenExpire: null
        })

        await user.save();

        data = new ResponseData("success", 200, "Your email has been verified", null);

        return data;
    }

    static async forgotPassword(payload: ForgotPasswordParam){
        let data;
        const {email} = payload;
        if(!email){
            data = new ResponseData("error", 400, "Invalid payload", null);
            
            return data;
        }

        const user = await User.findOne({email: email});
        if(!user){
            data = new ResponseData("error", 400, "This email is not registered, please signup first", null)

            return data;
        }

        const token = this.generateToken(email);
        const expire = this.getExpireTime();

        await user.updateOne({
            passwordResetToken: token,
            passwordResetTokenExpiry: expire
        });

        await user.save();

        const verifyUrl = `http://localhost:5500/reset-password?token=${token}&id=${user?._id}`

        sendEmail(verifyUrl, email);

        data = new ResponseData("success", 200, "A mail has been sent to your registered email", null);

        return data;
    }

    static async resetPassword (payload: ResetPasswordParam) {
        let data;
        const {newPassword, confirmNewPassword, token, _id} = payload;
        if(!newPassword || !confirmNewPassword || !token || !_id){
            data = new ResponseData("error", 400, "Invalid payload", null);

            return data;
        }
        const user = await User.findById(_id);
        if(!user){
            data = new ResponseData("error", 400, "Invalid user id", null);

            return data;
        }
        const time = Date.now();
        if(time > user.passwordResetTokenExpiry){
            data = new ResponseData("error", 400, "Your token has expired, please generate another token to continue", null);

            return data;
        }

        if(token !== user?.passwordResetToken){
            data = new ResponseData("error", 400, "Invalid token, please enter correct token to continue", null);

            return data;
        }

        if(newPassword !== confirmNewPassword){
            data = new ResponseData("error", 400, "Password do not match, both passwords should be same.", null);

            return data;
        }

        const hashPassword = this.hashPassword(newPassword);

        await user.updateOne({
            password: hashPassword,
            passwordResetToken: null,
            passwordResetTokenExpiry: null
        });

        await user.save();

        data = new ResponseData("success", 200, "Password has been updated successfully.", null);

        return data;
    }

    static async getUser (payload: string) {
        let data;
        if(!payload){
            data = new ResponseData("error", 400, "Invalid payload", null);

            return data;
        }

        const user = await User.findById(payload);
        if(!user){
            data = new ResponseData("error", 400, "Invalid user id", null);

            return data;
        }

        data = new ResponseData("success", 200, "Success", user)

        return data;
    }
    
    static async updateUser (payload: UpdateUserPayload) {
        let data;
        const {userId, firstName, lastName, email, phoneNumber, image} = payload;
        if(!firstName && !lastName && !email && !phoneNumber && !image){
            data = new ResponseData("error", 400, "Invalid payload", null);
        }
        const user = await User.findOneAndUpdate(
            {_id: userId}, 
            {$set: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phoneNumber: phoneNumber,
                image: image,
            }}, 
            {new: true});
        if(!user){
            data = new ResponseData("error", 400, "Invalid user id", null);

            return data;
        }

        if(email){
            user?.updateOne({
                isEmailValid: false,
            });

            await user?.save();
        }

        if(phoneNumber){
            await user?.updateOne({
                isPhoneNumberValid: false
            })

            await user?.save();
        }

        data = new ResponseData("success", 200, "User updated successfully", user);

        return data;
    }

    static async deleteUser (payload: string) {
        let data;
        const user = await User.findByIdAndDelete(payload)
        if(!user){
            data = new ResponseData("error", 400, "Invalid user id", null);

            return data;
        }

        data = new ResponseData("success", 200, "Account deleted", null);

        return data;
    }

    static async validatePassword(password: string, oldPassword: string){
        return bcrypt.compare(password, oldPassword)
    }

    static generateJWTToken(payload: string){
        return jwt.sign(payload, process.env.JWT_SECRET as string);
    }

    static generateToken (payload: string){
        return crypto.createHash('sha256').update(payload);
    }

    static getExpireTime (){
        return Date.now() + 1000 * 60 * 15;
    }
}