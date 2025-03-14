import { useAuth } from "../core/Auth";
import { formatArray } from "../utils/formatArray";

const slugify = (str) => {
  const a =
    "àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;";
  const b =
    "aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------";
  const p = new RegExp(a.split("").join("|"), "g");
  return str
    .toString()
    .toLowerCase()
    .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, "a")
    .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, "e")
    .replace(/i|í|ì|ỉ|ĩ|ị/gi, "i")
    .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, "o")
    .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, "u")
    .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, "y")
    .replace(/đ/gi, "d")
    .replace(/\s+/g, "-")
    .replace(p, (c) => b.charAt(a.indexOf(c)))
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .split("-")
    .join("_");
};

const hasRolesAuth = (data) => {
  let newHasRoles = [];
  if (data && data?.groups) {
    newHasRoles = data.groups.map((x) => ({
      ...x,
      name: x.group,
      children: x.rights
        ? x.rights.map((r) => ({
            ...r,
            name: r.name,
            children:
              r?.subs ||
              (r?.reports?.groups &&
                r?.reports?.groups.map((s) => ({
                  ...s,
                  children: s?.items
                    ? s?.items.map((o) => ({
                        ...o,
                        name: slugify(s.group + " " + o.text),
                      }))
                    : null,
                }))) ||
              null,
          }))
        : [],
    }));
  }
  return { hasRoles: newHasRoles };
};

const getHasRole = (Roles, CrStocks) => {
  let hasRight = Roles?.hasRight || false;
  let StockRoles = Roles?.stocksList
    ? Roles?.stocksList.map((x) => ({ ...x, label: x.Title, value: x.ID }))
    : [];

  if (hasRight && !Roles.IsAllStock) {
    hasRight = StockRoles.some((x) => x.ID === CrStocks.ID);
  }
  return {
    hasRight,
    StockRoles,
    StockRolesAll: Roles?.IsAllStock
      ? [{ label: "Hệ thống", value: 0 }, ...StockRoles]
      : StockRoles,
    IsStocks: Roles?.IsAllStock || false,
  };
};

export const useRoles = (nameRoles) => {
  const isMultiple = Array.isArray(nameRoles);
  const { RightTree, CrStocks } = useAuth();
  let result = {};

  const { hasRoles } = hasRolesAuth(RightTree);

  if (!isMultiple) {
    const hasRolesItem = formatArray.findNodeByName(hasRoles, nameRoles);
    if (hasRolesItem) {
      result[nameRoles] = { ...getHasRole(hasRolesItem, CrStocks) };
    } else {
      result[nameRoles] = { hasRight: false, StockRoles: [] };
    }
  } else {
    for (let key of nameRoles) {
      const hasRolesItem = formatArray.findNodeByName(hasRoles, key);
      if (hasRolesItem) {
        result[key] = { ...getHasRole(hasRolesItem, CrStocks) };
      } else {
        result[key] = {
          hasRight: false,
          StockRoles: [],
        };
      }
    }
  }
  return result;
};
