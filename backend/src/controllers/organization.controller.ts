// src/controllers/organization.controller.ts
import { Request, Response } from "express";
import Organization from "../models/organization.model";

export const createOrganization = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const organization = await Organization.create(req.body);
    res.status(201).json(organization);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to create organization",
      error: error.message,
    });
  }
};

export const getOrganizations = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const organizations = await Organization.find()
      .populate("createdByUserId", "fullName email role")
      .sort({ createdAt: -1 });

    res.status(200).json(organizations);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch organizations",
      error: error.message,
    });
  }
};

export const getOrganizationById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const organization = await Organization.findById(req.params.id).populate(
      "createdByUserId",
      "fullName email role"
    );

    if (!organization) {
      res.status(404).json({ message: "Organization not found" });
      return;
    }

    res.status(200).json(organization);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch organization",
      error: error.message,
    });
  }
};

export const updateOrganization = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const organization = await Organization.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("createdByUserId", "fullName email role");

    if (!organization) {
      res.status(404).json({ message: "Organization not found" });
      return;
    }

    res.status(200).json(organization);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to update organization",
      error: error.message,
    });
  }
};

export const deleteOrganization = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const organization = await Organization.findByIdAndDelete(req.params.id);

    if (!organization) {
      res.status(404).json({ message: "Organization not found" });
      return;
    }

    res.status(200).json({ message: "Organization deleted successfully" });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to delete organization",
      error: error.message,
    });
  }
};