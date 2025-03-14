import { useState, useEffect, createContext, useContext } from "react";
import { LayoutSplashScreen } from "./EzsSplashScreen";
import axios from "axios";

const AuthContext = createContext();

const useAuth = () => {
  return useContext(AuthContext);
};

if (import.meta.env.DEV) {
  window.top.Info = {
    User: {
      ID: 1,
      FullName: "Admin System",
    },
    Stocks: [
      {
        Title: "Quản lý cơ sở",
        ID: 778,
        ParentID: 0,
      },
      {
        Title: "Cser Hà Nội",
        ID: 11424,
        ParentID: 778,
      },
      {
        Title: "Cser Hồ Chí Minh",
        ID: 11425,
        ParentID: 778,
      },
    ],
    rightTree: {
      groups: [
        {
          group: "Báo cáo",
          rights: [
            {
              IsAllStock: true,
              hasRight: true,
              name: "report",
              reports: {
                groups: [
                  {
                    group: "Báo cáo ngày",
                    items: [
                      {
                        stocks: "",
                        text: "Tổng quan",
                        hasRight: true,
                        stocksList: [
                          {
                            Title: "Cser Hà Nội",
                            ID: 11409,
                          },
                          {
                            Title: "Cser Hồ Chí Minh",
                            ID: 11410,
                            ParentID: 778,
                          },
                        ],
                        IsAllStock: false,
                      },
                      {
                        stocks: "",
                        text: "Khách hàng",
                      },
                    ],
                  },
                ],
              },
              stocksList: [
                {
                  Title: "Cser Hà Nội",
                  ID: 11424,
                },
                {
                  Title: "Cser Hồ Chí Minh",
                  ID: 11425,
                },
              ],
            },
          ],
        },
      ],
    },
    CrStockID: 11424,
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBdXRoMlR5cGUiOiJVc2VyRW50IiwiSUQiOiIxIiwiVG9rZW5JZCI6IjEwNjEzMzEwNjg2OSIsIm5iZiI6MTczMzgxMzgxNCwiZXhwIjoxODIwMjEzODE0LCJpYXQiOjE3MzM4MTM4MTR9.u4yPENaKs7pw7y2J0CFDVo4JnmzzgldUjIvp3QN_CXE",
  };
}

const getInfoLocalStorage = () => {
  return new Promise(function (resolve) {
    function getInfo() {
      if (window.Info) {
        resolve({
          Auth: window.Info,
        });
      } else {
        setTimeout(() => {
          getInfo();
        }, 50);
      }
    }
    getInfo();
  });
};

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [CrStocks, setCrStocks] = useState(null);
  const [Stocks, setStocks] = useState(null);
  const [RightTree, setRightTree] = useState(null);
  const [GlobalConfig, setGlobalConfig] = useState(null);

  const saveAuth = ({ CrStockID, token, User, rightTree, ...values }) => {
    let newStocks = values.Stocks
      ? values.Stocks.filter((x) => x.ParentID !== 0).map((x) => ({
          ...x,
          label: x.Title,
          value: x.ID,
        }))
      : [];
    let index = newStocks.findIndex((x) => x.ID === CrStockID);
    setAuth(User);
    setAccessToken(token);
    //setStocks(newStocks);
    setRightTree(rightTree);

    if (index > -1) {
      setCrStocks(newStocks[index]);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        accessToken,
        CrStocks,
        Stocks,
        setStocks,
        RightTree,
        saveAuth,
        GlobalConfig,
        setGlobalConfig,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const AuthInit = ({ children }) => {
  const { saveAuth, setGlobalConfig, setStocks } = useAuth();
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  useEffect(() => {
    
    getInfoLocalStorage().then(({ Auth }) => {
      saveAuth(Auth);
    });

    axios
      .get(
        (import.meta.env.MODE === "development"
          ? import.meta.env.VITE_HOST
          : window.location.origin) +
          "/brand/global/global.json?" +
          new Date().getTime()
      )
      .then(({ data }) => {
        if (data) {
          setGlobalConfig(data);
        }
      });

    axios
      .get(
        (import.meta.env.MODE === "development"
          ? import.meta.env.VITE_HOST
          : window.location.origin) + "/api/v3/web?cmd=getStock"
      )
      .then(({ data }) => {
        if (data?.data?.all) {
          setShowSplashScreen(false);
          setStocks(
            data?.data?.all
              .filter((x) => x.ParentID > 0)
              .map((x) => ({
                ...x,
                label: x.Title,
                value: x.ID,
              }))
          );
        }
      });
    // eslint-disable-next-line
  }, []);

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>;
};

export { AuthProvider, AuthInit, useAuth };
