// src/controllers/services.controller.ts
import { Request, Response } from "express";
import Service from "../models/service.model";

export const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to create service",
      error: error.message,
    });
  }
};

export const getServices = async (_req: Request, res: Response): Promise<void> => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.status(200).json(services);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch services",
      error: error.message,
    });
  }
};

export const getServiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404).json({ message: "Service not found" });
      return;
    }

    res.status(200).json(service);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch service",
      error: error.message,
    });
  }
};

export const updateService = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      res.status(404).json({ message: "Service not found" });
      return;
    }

    res.status(200).json(service);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to update service",
      error: error.message,
    });
  }
};

export const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      res.status(404).json({ message: "Service not found" });
      return;
    }

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to delete service",
      error: error.message,
    });
  }
};