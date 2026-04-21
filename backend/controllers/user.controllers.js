import User from "../models/user.model.js"

export const getCurrentUser=async (req,res) => {
    try {
        const userId=req.userId
        if(!userId){
            return res.status(400).json({message:"userId is not found"})
        }
        const user=await User.findById(userId)
        if(!user){
               return res.status(400).json({message:"user is not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message:`get current user error ${error}`})
    }
}

export const updateUserLocation=async (req,res) => {
    try {
        const {lat,lon}=req.body
        const user=await User.findByIdAndUpdate(req.userId,{
            location:{
                type:'Point',
                coordinates:[lon,lat]
            }
        },{new:true})
         if(!user){
               return res.status(400).json({message:"user is not found"})
        }
        
        return res.status(200).json({message:'location updated'})
    } catch (error) {
           return res.status(500).json({message:`update location user error ${error}`})
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullName, email, mobile } = req.body
        const userId = req.userId

        if (!fullName || !email || !mobile) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const existingEmail = await User.findOne({ email, _id: { $ne: userId } })
        if (existingEmail) {
            return res.status(400).json({ message: "Email is already in use by another account" })
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { fullName, email, mobile },
            { new: true }
        )

        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        return res.status(200).json({ message: "Profile updated successfully", user })
    } catch (error) {
        return res.status(500).json({ message: `update profile error ${error}` })
    }
}
