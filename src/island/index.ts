import { FeatureCollection, Geometry } from "geojson";
import { Jawa } from "./jawa";
import { Sumatera } from "./sumatera";
import { Kalimantan } from "./kalimantan";
import { Bali } from "./bali";
import { Sulawesi } from "./sulawesi";
import { Maluku } from "./maluku";
import { Nusa } from "./nusa";
import { NusaTenggara } from "./nusaTenggara";
import { Papua } from "./papua-only";
import { PapuaBarat } from "./papua-barat";

export const island: FeatureCollection<Geometry> | any = {
  type: "FeatureCollection",
  features: [
    Sumatera,
    Jawa,
    Kalimantan,
    Bali,
    Nusa,
    NusaTenggara,
    Sulawesi,
    Maluku,
    Papua,
    PapuaBarat,
  ],
};
