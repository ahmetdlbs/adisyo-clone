import type { FeatureGroup } from "../model/feature-group";

export const INITIAL_FEATURE_GROUPS: readonly FeatureGroup[] = [
  {
    id: "1",
    name: "Pişirme",
    selectionType: "single",
    useRecipeProduct: false,
    isRequired: true,
    options: [
      { id: "1-1", name: "Az pişmiş", price: 0, isDefault: false },
      { id: "1-2", name: "Orta", price: 0, isDefault: true },
      { id: "1-3", name: "Çok pişmiş", price: 0, isDefault: false },
    ],
  },
  {
    id: "2",
    name: "Ekstralar",
    selectionType: "multiple",
    useRecipeProduct: false,
    isRequired: false,
    options: [
      { id: "2-1", name: "Ekstra peynir", price: 15, isDefault: false },
      { id: "2-2", name: "Acı sos", price: 5, isDefault: false },
      { id: "2-3", name: "Ekstra sos", price: 10, isDefault: false },
    ],
  },
];
