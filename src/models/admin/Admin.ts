import mongoose , { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
    email: string;
    password: string;
}

const AdminSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});

const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);
export default Admin;

