import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type OrganizationMemberRole =
  | "member"
  | "volunteer"
  | "partner_manager"
  | "board_member"
  | "secretary"
  | "treasurer"
  | "project_manager"
  | "president"
  | "organization_admin";

export interface IOrganizationMember extends Document {
  userId: Types.ObjectId;
  organizationId: Types.ObjectId;
  role: OrganizationMemberRole;
  permissions: string[];
  status: "invited" | "active" | "suspended" | "left";
  joinedAt?: Date;
  invitedByUserId?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const organizationMemberSchema = new Schema<IOrganizationMember>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: [
        "member",
        "volunteer",
        "partner_manager",
        "board_member",
        "secretary",
        "treasurer",
        "project_manager",
        "president",
        "organization_admin",
      ],
      default: "member",
      required: true,
    },
    permissions: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["invited", "active", "suspended", "left"],
      default: "invited",
      required: true,
    },
    joinedAt: { type: Date },
    invitedByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

organizationMemberSchema.index(
  { userId: 1, organizationId: 1 },
  { unique: true }
);
organizationMemberSchema.index({ organizationId: 1, status: 1, role: 1 });

const OrganizationMember: Model<IOrganizationMember> =
  mongoose.model<IOrganizationMember>(
    "OrganizationMember",
    organizationMemberSchema
  );

export default OrganizationMember;
