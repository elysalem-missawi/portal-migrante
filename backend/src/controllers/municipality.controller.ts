import { Request, Response } from "express";
import mongoose from "mongoose";
import Municipality from "../models/municipality.model";
import { municipalitiesData } from "../data/municipalities.data";

type LocalMunicipality = (typeof municipalitiesData)[number] & { _id: string };

const isMongoReady = (): boolean => mongoose.connection.readyState === 1;

const localMunicipalities = municipalitiesData.map((item) => ({
  _id: item.slug,
  ...item,
})) as LocalMunicipality[];

function filterLocalMunicipalities(
  territory?: string,
  q?: string
): LocalMunicipality[] {
  const query = q?.trim().toLowerCase();

  return localMunicipalities
    .filter((item) => item.status === "active")
    .filter((item) =>
      territory && ["alava", "bizkaia", "gipuzkoa"].includes(territory)
        ? item.territory === territory
        : true
    )
    .filter((item) => {
      if (!query) {
        return true;
      }

      return [
        item.name,
        item.municipio,
        item.comarca,
        item.address,
        item.email,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export const getMunicipalities = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const territory = req.query.territory as string | undefined;
    const q = req.query.q as string | undefined;

    if (!isMongoReady()) {
      res.status(200).json(filterLocalMunicipalities(territory, q));
      return;
    }

    const filter: any = { status: "active" };

    if (territory && ["alava", "bizkaia", "gipuzkoa"].includes(territory)) {
      filter.territory = territory;
    }

    if (q && q.trim()) {
      filter.$or = [
        { name: { $regex: q.trim(), $options: "i" } },
        { municipio: { $regex: q.trim(), $options: "i" } },
        { comarca: { $regex: q.trim(), $options: "i" } },
        { address: { $regex: q.trim(), $options: "i" } },
        { email: { $regex: q.trim(), $options: "i" } },
      ];
    }

    const data = await Municipality.find(filter).sort({ name: 1 });

    res.status(200).json(data);
  } catch (error: any) {
    const territory = req.query.territory as string | undefined;
    const q = req.query.q as string | undefined;
    res.status(200).json(filterLocalMunicipalities(territory, q));
  }
};

export const getMunicipalityDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const value = req.params.idOrSlug;

    if (!isMongoReady()) {
      const localItem = localMunicipalities.find(
        (item) => item.slug === value || item._id === value
      );

      if (!localItem) {
        res.status(404).json({ message: "Municipality not found" });
        return;
      }

      res.status(200).json(localItem);
      return;
    }

    const filter = mongoose.Types.ObjectId.isValid(value)
      ? { _id: value, status: "active" }
      : { slug: value, status: "active" };

    const item = await Municipality.findOne(filter);

    if (!item) {
      res.status(404).json({ message: "Municipality not found" });
      return;
    }

    res.status(200).json(item);
  } catch (error: any) {
    const value = req.params.idOrSlug;
    const localItem = localMunicipalities.find(
      (item) => item.slug === value || item._id === value
    );

    if (!localItem) {
      res.status(404).json({ message: "Municipality not found" });
      return;
    }

    res.status(200).json(localItem);
  }
};
