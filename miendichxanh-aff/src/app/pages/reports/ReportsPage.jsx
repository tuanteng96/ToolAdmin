import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { RoleAccess } from "src/app/_ezs/components/RoleAccess";
import { useRoles } from "src/app/_ezs/hooks/useRoles";
import SuspensedView from "src/app/routing/SuspensedView";

const ReportPreviewPage = lazy(() => import("./pages/ReportPreview"));

function ReportsPage(props) {
  const { report, bao_cao_ngay_tong_quan } = useRoles([
    "bao_cao_ngay_tong_quan",
    "report",
  ]);
  
  return (
    <>
      <Routes>
        <Route
          element={
            <RoleAccess
              roles={
                bao_cao_ngay_tong_quan?.hasRight || (report?.hasRight && report?.IsStocks)
              }
            />
          }
        >
          <Route
            index
            element={
              <SuspensedView>
                <ReportPreviewPage />
              </SuspensedView>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default ReportsPage;
