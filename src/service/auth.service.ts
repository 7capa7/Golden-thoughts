import { User } from "../entity/User";

export async function createUser(data: Partial<User>){
        const user = User.create({
                name: data.name,
                email: data.email,
                password: data.password
        });
        
        return await user.save();
}