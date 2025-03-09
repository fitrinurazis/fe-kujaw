import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TransactionTable from "../../components/transactions/TransactionTable";
import { fetchTransactions } from "../../store/slices/transactionSlice";
import LoadingState from "../../components/common/LoadingState";

export default function Transactions() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.transactions);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const Transactions = items;

  return (
    <div className="container p-4 mx-auto transition-colors duration-200">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 transition-colors duration-200 dark:text-white">
          Transaksi
        </h1>
      </div>

      {loading ? (
        <div className="p-8 text-center transition-colors duration-200 bg-white rounded-lg shadow dark:bg-gray-800 dark:shadow-gray-900/10">
          <LoadingState message="Memuat data transaksi..." />
        </div>
      ) : (
        <div className="overflow-hidden transition-colors duration-200 bg-white rounded-lg shadow dark:bg-gray-800 dark:shadow-gray-900/10">
          <TransactionTable transactions={Transactions} />
        </div>
      )}
    </div>
  );
}
