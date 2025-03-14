export const formatString = {
  getLastFirst: (text) => {
    if (!text) return;
    const arrText = text.split(" ");
    if (arrText.length > 1) {
      return arrText[0].charAt(0) + arrText[arrText.length - 1].charAt(0);
    }
    return arrText[0].charAt(0);
  },
  formatVND: (price) => {
    if (!price || price === 0) {
      return "0";
    } else {
      return price.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    }
  },
  formatVNDPositive: (price) => {
    if (!price || price === 0) {
      return "0";
    } else {
      return Math.abs(price)
        .toFixed(0)
        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    }
  },
  formatValueVoucher: (price) => {
    if (!price || price === 0) {
      return "0";
    } else if (Math.abs(price) <= 100) {
      return `${price}%`;
    } else {
      return Math.abs(price)
        .toFixed(0)
        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    }
  },
  fixedContentDomain: (content) => {
    if (!content) return "";
    return content.replace(
      /src="\//g,
      'src="' +
        (!process.env.NODE_ENV || process.env.NODE_ENV === "development"
          ? process.env.REACT_APP_API_URL
          : "") +
        "/"
    );
  },
  convertViToEnKey: (str, toUpperCase = true) => {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư

    str = str.replace(/\W+/g, " ");
    str = str.replace(/\s/g, "_");

    return toUpperCase ? str.toUpperCase() : str;
  },
  replaceAll: (str, map) => {
    for (let key in map) {
      str = str.replaceAll(key, map[key]);
    }
    return str;
  },
};
