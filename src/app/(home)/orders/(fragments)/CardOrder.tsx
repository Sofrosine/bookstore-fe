import Button from "@/components/Button";
import dayjs from "dayjs";
import { FC } from "react";
import CardBook from "../../home/(fragments)/CardBook";

type Props = {
  order: Order;
  onCancel: () => void;
};

const CardOrder: FC<Props> = ({ order, onCancel }) => {
  return (
    <div className="col-span-12 border border-grey-2 rounded-lg overflow-hidden bg-white p-4">
      <div className="grid grid-cols-12 items-center">
        <div className="col-span-12 lg:col-span-5">
          <CardBook book={order?.book} />
        </div>
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-2 mt-4 lg:ml-4">
          <p className="text-subtitle-3">Order ID: {order?.id}</p>
          <p className="text-subtitle-3">
            Created at: {dayjs(order?.created_at).format("DD MMMM YYYY HH:mm")}
          </p>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={() => onCancel && onCancel()}
          className="py-2 bg-error mt-8 hover:bg-error"
        >
          Cancel Order
        </Button>
      </div>
    </div>
  );
};

export default CardOrder;
