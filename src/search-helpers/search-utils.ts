import { productType } from "@/types";

const removeDup = (items: productType[]): productType[] => {
  return items.reduce((unique: productType[], o) => {
    if (!unique.some((obj) => obj.url === o.url)) {
      unique.push(o);
    }
    return unique;
  }, []);
};

const validateProds = (items: productType[]): productType[] => {
  const unique = removeDup(items);

  return unique;
};

export { validateProds };
