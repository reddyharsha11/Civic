import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdmin extends Document {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  userType: "admin";
  role: "super_admin" | "admin" | "moderator";
  department: string;
  employeeId: string;
  permissions: string[];
  isActive: boolean;
  avatar?: string;
  lastLogin?: Date;
  loginHistory: {
    timestamp: Date;
    ipAddress?: string;
    userAgent?: string;
  }[];
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: {
        validator: function (email: string) {
          // Admin emails should typically be government emails
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
        },
        message: "Please enter a valid email",
      },
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      validate: {
        validator: function (phone: string) {
          return /^\d{10}$/.test(phone);
        },
        message: "Please enter a valid 10-digit phone number",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Admin password must be at least 8 characters"],
      select: false, // Don't include password in queries by default
    },
    userType: {
      type: String,
      default: "admin",
      immutable: true, // Cannot be changed after creation
    },
    role: {
      type: String,
      enum: ["super_admin", "admin", "moderator"],
      default: "admin",
      required: true,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      enum: [
        "IT Department",
        "GHMC",
        "HMWS&SB", // Hyderabad Metropolitan Water Supply & Sewerage Board
        "TSSPDCL", // Telangana State Southern Power Distribution Company Limited
        "TSNPDCL", // Telangana State Northern Power Distribution Company Limited
        "Traffic Police",
        "Public Health",
        "Revenue Department",
        "Municipal Administration",
        "Urban Development",
        "Roads & Buildings",
        "Other",
      ],
    },
    employeeId: {
      type: String,
      required: [true, "Employee ID is required"],
      unique: true,
      uppercase: true,
    },
    permissions: {
      type: [String],
      default: ["read_complaints", "update_complaints"],
      enum: [
        "read_complaints",
        "update_complaints",
        "delete_complaints",
        "manage_citizens",
        "manage_admins",
        "view_analytics",
        "system_settings",
        "bulk_operations",
        "export_data",
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    avatar: String,
    lastLogin: Date,
    loginHistory: [
      {
        timestamp: { type: Date, default: Date.now },
        ipAddress: String,
        userAgent: String,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Index for faster queries
AdminSchema.index({ email: 1 });
AdminSchema.index({ phone: 1 });
AdminSchema.index({ employeeId: 1 });
AdminSchema.index({ department: 1 });
AdminSchema.index({ role: 1 });
AdminSchema.index({ isActive: 1 });
AdminSchema.index({ createdAt: -1 });

// Hash password before saving
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
AdminSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Transform output
AdminSchema.methods.toJSON = function () {
  const admin = this.toObject();
  delete admin.password;
  return admin;
};

// Limit login history to last 50 entries
AdminSchema.pre("save", function (next) {
  if (this.loginHistory && this.loginHistory.length > 50) {
    this.loginHistory = this.loginHistory.slice(-50);
  }
  next();
});

export default mongoose.models.Admin ||
  mongoose.model<IAdmin>("Admin", AdminSchema);
