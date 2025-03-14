import { toAbsoluteUrl } from "src/app/_ezs/utils/assetPath";

function UnauthorizedPage(props) {
  return (
    <div className="relative w-full h-full">
      <img
        src={toAbsoluteUrl("images/bg1.jpg")}
        alt="Not have access"
        className="object-cover w-full h-full"
      />
      <div className="absolute w-full max-w-2xl px-5 md:px-0 top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4">
        <div className="flex flex-col items-center justify-center px-5 pt-12 pb-10 bg-white rounded shadow-lg md:pt-20 md:px-10">
          <div className="mb-3 text-xl font-bold text-center md:text-2xl font-inter">
            Không có quyền truy cập!
          </div>
          <div className="text-center text-gray-600 md:font-semibold md:w-10/12">
            Bạn không có quyền để truy cập chức năng này. Vui lòng liên hệ quản
            trị viên cấp quyền truy cập.
          </div>
          <div className="max-w-[150px] md:max-w-[300px]">
            <img
              className="w-full"
              src={toAbsoluteUrl("images/membership.png")}
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UnauthorizedPage;
